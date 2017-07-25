/*******************************************************
The predix-seed Express web application includes these features:
  * routes to mock data files to demonstrate the UI
  * passport-predix-oauth for authentication, and a sample secure route
  * a proxy module for calling Predix services such as asset and time series
*******************************************************/
var pg = require('pg');
var conString = "postgres://u0dsmfjq18ssacm5:7a4r9mj3ztg93jh1d241cx12t@db-bf62b7ca-ab44-4b4a-a274-01683668f10f.c7uxaqxgfov3.us-west-2.rds.amazonaws.com:5432/postgres";


var express = require('express');
var jsonServer = require('json-server'); // used for mock api responses
var path = require('path');
var cookieParser = require('cookie-parser'); // used for session cookie
var bodyParser = require('body-parser');
var passport;  // only used if you have configured properties for UAA
// simple in-memory session is used here. use connect-redis for production!!
var session = require('express-session');
var proxy = require('./proxy'); // used when requesting data from real services.
// get config settings from local file or VCAPS env var in the cloud
var config = require('./predix-config');
// configure passport for authentication with UAA
var passportConfig = require('./passport-config');
var nullTreatment = "('NA')";

// if running locally, we need to set up the proxy from local config file:
var node_env = process.env.node_env || 'development';
if (node_env === 'development') {
	var devConfig = require('./localConfig.json')[node_env];
	proxy.setServiceConfig(config.buildVcapObjectFromLocalConfig(devConfig));
	proxy.setUaaConfig(devConfig);
}

var windServiceURL = devConfig ? devConfig.windServiceURL : process.env.windServiceURL;

console.log('************' + node_env + '******************');

var uaaIsConfigured = config.clientId &&
	config.uaaURL &&
	config.uaaURL.indexOf('https') === 0 &&
	config.base64ClientCredential;
if (uaaIsConfigured) {
	passport = passportConfig.configurePassportStrategy(config);
}

/**********************************************************************
       SETTING UP EXRESS SERVER
***********************************************************************/
var app = express();

app.set('trust proxy', 1);
app.use(cookieParser('predixsample'));
// Initializing default session store
// *** Use this in-memory session store for development only. Use redis for prod. **
app.use(session({
	secret: 'predixsample',
	name: 'cookie_name',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));

if (uaaIsConfigured) {
	app.use(passport.initialize());
	// Also use passport.session() middleware, to support persistent login sessions (recommended).
	app.use(passport.session());
}

//Initializing application modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(process.env.VCAP_APP_PORT || 5000, function () {
	console.log('Server started on port: ' + server.address().port);
});

/*******************************************************
SET UP MOCK API ROUTES
*******************************************************/
// Import route modules
var viewServiceRoutes = require('./view-service-routes.js')();
var assetRoutes = require('./predix-asset-routes.js')();
var timeSeriesRoutes = require('./time-series-routes.js')();

// add mock API routes.  (Remove these before deploying to production.)
app.use('/api/view-service', jsonServer.router(viewServiceRoutes));
app.use('/api/predix-asset', jsonServer.router(assetRoutes));
app.use('/api/time-series', jsonServer.router(timeSeriesRoutes));

/****************************************************************************
	SET UP EXPRESS ROUTES
*****************************************************************************/

if (!uaaIsConfigured) { // no restrictions
	app.use(express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../public')));
} else {
	//login route redirect to predix uaa login page
	app.get('/login', passport.authenticate('predix', { 'scope': '' }), function (req, res) {
		// The request will be redirected to Predix for authentication, so this
		// function will not be called.
	});

	// access real Predix services using this route.
	// the proxy will add UAA token and Predix Zone ID.
	app.use('/predix-api',
		passport.authenticate('main', {
			noredirect: true
		}),
		proxy.router);

	//callback route redirects to secure route after login
	app.get('/callback', passport.authenticate('predix', {
		failureRedirect: '/'
	}), function (req, res) {
		console.log('Redirecting to secure route...');
		res.redirect('/');
	});

	// example of calling a custom microservice.
	if (windServiceURL && windServiceURL.indexOf('https') === 0) {
		app.get('/windy/*', passport.authenticate('main', { noredirect: true }),
			// if calling a secure microservice, you can use this middleware to add a client token.
			// proxy.addClientTokenMiddleware,
			proxy.customProxyMiddleware('/windy', windServiceURL)
		);
	}

	//Use this route to make the entire app secure.  This forces login for any path in the entire app.
	app.use('/', passport.authenticate('main', {
		noredirect: false //Don't redirect a user to the authentication page, just show an error
	}),
		express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../public'))
	);

	//Or you can follow this pattern to create secure routes,
	// if only some portions of the app are secure.
	app.get('/secure', passport.authenticate('main', {
		noredirect: true //Don't redirect a user to the authentication page, just show an error
	}), function (req, res) {
		console.log('Accessing the secure route');
		// modify this to send a secure.html file if desired.
		res.send('<h2>This is a sample secure route.</h2>');
	});

}

//added function for data connctn
app.get('/AllData', function (req, res) {
	console.log('Here')
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var query = client.query('SELECT CASE WHEN "Agency" IS NULL THEN ' + nullTreatment + ' ELSE "Agency" end as "Agency" ,CASE WHEN "State_Name" IS NULL THEN ' + nullTreatment + ' ELSE "State_Name" end as "State_Name",CASE WHEN "Utility_Partner" IS NULL THEN ' + nullTreatment + ' ELSE "Utility_Partner" end as "Utility_Partner" FROM "FedEff"."Data_Directory_v10_Predix_07242017" GROUP BY "Agency","State_Name","Utility_Partner" ORDER BY "Agency","State_Name","Utility_Partner" ASC', function (err, result) {
			console.log(query);
			var response;

			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});
// app.get('/summaryTable', function (req, res) {
// 	console.log('Here')
// 	var client = new pg.Client(conString);
// 	client.connect(function (err, client, done) {
// 		if (err) {
// 			return console.error('error fetching client from pool', err);
// 		}
// 		var query = client.query('SELECT "Agency",COUNT(*) as "No. Of Records" FROM "FedEff"."Data_Directory_v10_Predix_07242017" GROUP BY "Agency" ORDER BY "Agency"',  function (err, result) {
// 		console.log(query);
// 			var response;

// 			if (err) {
// 				return console.error('error running query', err);
// 			}
// 			console.log(result)
// 			res.send({
// 				data: JSON.stringify(result.rows)
// 			});
// 		});
// 		query.on('end', function () {
// 			client.end();
// 			res.end();
// 		});
// 	});
// });


app.get('/buildingInfMaxScores', function (req, res) {
	console.log('buildingInfScore')
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query(' SELECT MAX("Total_Mu_Sigma_Score") AS "score1",MAX("PTA_Score") AS "score2",MAX("Energy_Profile_Score") AS "score3",MAX("Potential_DE_Score") AS "score4" FROM "FedEff"."Data_Directory_v10_Predix_07242017" ', function (err, result) {

			var response;

			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});
app.get('/scorecard', function (req, res) {
	console.log('scoreinfo')
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var query = client.query('SELECT CASE WHEN "Agency" IS NULL THEN ' + nullTreatment + ' ELSE "Agency" end as "Agency", COUNT(*) AS "Count" , AVG("Total_Mu_Sigma_Score") AS "Total_Score" FROM "FedEff"."Data_Directory_v10_Predix_07242017" GROUP BY "Agency" ORDER BY "Total_Score" DESC;', function (err, result) {

			var response;

			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});

app.post('/DataTableFiltered', function (req, res) {
	// : selectedCustomer :selectedState :selectedUtility :selectedData :selectedContract :selectedSolar :selectedEmgen :selectedBattery :selectedCogen :selectedFuel :selectedStage :selectedStage3 :selectedEnergy :selectedRenewable', function (req, res) {
	// var array=[];
	console.log('hi filtered');
	var agency = req.body.agency;
	var state = req.body.state;
	var utility = req.body.utility;
	var data = req.body.data;
	var customer = req.body.customer;
	var contract = req.body.contract;
	var solar = req.body.solar;
	var emgen = req.body.emgen;
	var battery = req.body.battery;
	var cogen = req.body.cogen;
	var fuel = req.body.fuelcell;
	var stage = req.body.stage;
	var stage3 = req.body.stage3;
	var energy = req.body.energy;
	var renewable = req.body.renewable;
	var agencyOutput;
	var stateOutput;
	var utilityOutput;
	var customerOutput;
	var stageOutput;
	var stage3Output;
	var renewableOutput;
	var energyOutput;
	var fuelOutput;
	var dataOutput;
	var contractOutput;
	var cogenOutput;
	var batteryOutput;
	var solarOutput;
	var emgenOutput;
	console.log(agency);
	console.log(state);
	console.log('m inside filters');
	agency = agency.toString();
	agency = agency.split(',');
	for (x in agency) {
		agency[x] = '\'' + agency[x] + '\'';
	}
	agencyOutput = "(" + agency.join(',') + ")";




	console.log(state);

	console.log('m inside filters');
	state = state.toString();
	state = state.split(',');
	for (x in state) {
		state[x] = '\'' + state[x] + '\'';
	}
	stateOutput = "(" + state.join(',') + ")";
	utility = utility.toString();
	utility = utility.split(',');
	for (x in utility) {
		utility[x] = '\'' + utility[x] + '\'';
	}
	utilityOutput = "(" + utility.join(',') + ")";
	stage = stage.toString();
	stage = stage.split(',');
	for (x in stage) {
		stage[x] = '\'' + stage[x] + '\'';
	}
	stageOutput = "(" + stage.join(',') + ")";
	stage3 = stage3.toString();
	stage3 = stage3.split(',');
	for (x in stage3) {
		stage3[x] = '\'' + stage3[x] + '\'';
	}
	stage3Output = "(" + stage3.join(',') + ")";
	customer = customer.toString();
	customer = customer.split(',');
	for (x in customer) {
		customer[x] = '\'' + customer[x] + '\'';
	}
	customerOutput = "(" + customer.join(',') + ")";
	fuel = fuel.toString();
	fuel = fuel.split(',');
	for (x in fuel) {
		fuel[x] = '\'' + fuel[x] + '\'';
	}
	fuelOutput = "(" + fuel.join(',') + ")";
	energy = energy.toString();
	energy = energy.split(',');
	for (x in energy) {
		energy[x] = '\'' + energy[x] + '\'';
	}
	energyOutput = "(" + energy.join(',') + ")";
	renewable = renewable.toString();
	renewable = renewable.split(',');
	for (x in renewable) {
		renewable[x] = '\'' + renewable[x] + '\'';
	}
	renewableOutput = "(" + renewable.join(',') + ")";
	data = data.toString();
	data = data.split(',');
	for (x in data) {
		data[x] = '\'' + data[x] + '\'';
	}
	dataOutput = "(" + data.join(',') + ")";
	contract = contract.toString();
	contract = contract.split(',');
	for (x in contract) {
		contract[x] = '\'' + contract[x] + '\'';
	}
	contractOutput = "(" + contract.join(',') + ")";
	cogen = cogen.toString();
	cogen = cogen.split(',');
	for (x in cogen) {
		cogen[x] = '\'' + cogen[x] + '\'';
	}
	cogenOutput = "(" + cogen.join(',') + ")";
	battery = battery.toString();
	battery = battery.split(',');
	for (x in battery) {
		battery[x] = '\'' + battery[x] + '\'';
	}
	batteryOutput = "(" + battery.join(',') + ")";
	solar = solar.toString();
	solar = solar.split(',');
	for (x in solar) {
		solar[x] = '\'' + solar[x] + '\'';
	}
	solarOutput = "(" + solar.join(',') + ")";
	emgen = emgen.toString();
	emgen = emgen.split(',');
	for (x in emgen) {
		emgen[x] = '\'' + emgen[x] + '\'';
	}
	emgenOutput = "(" + emgen.join(',') + ")";
	//customer = customer.toString();
	console.log(stateOutput);
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var query = client.query(' SELECT CASE WHEN "Facility_Name" IS NULL THEN ' + nullTreatment + ' ELSE "Facility_Name" end as "Facility_Name",CASE WHEN "Building_Name" IS NULL THEN ' + nullTreatment + ' ELSE "Building_Name" end as "Building_Name",CASE WHEN "Agency" IS NULL THEN ' + nullTreatment + ' ELSE "Agency" end as "Agency","Total_Mu_Sigma_Score","Latitude","Longitude" FROM "FedEff"."Data_Directory_v10_Predix_07242017" WHERE "Agency" IN' + agencyOutput + 'AND "State_Name" IN' + stateOutput + 'AND "Utility_Partner" IN' + utilityOutput + 'AND "Current_Customer" IN' + customerOutput + 'AND "Stage_1_2_GHG_emissions" IN' + stageOutput + 'AND "Stage_3_GHG_emissions" IN' + stage3Output + 'AND "Usage_of_renewable_energy" IN' + renewableOutput + 'AND "Fuelcell_Flag" IN' + fuelOutput + 'AND "Battery_Flag" IN' + batteryOutput + 'AND "Solar_Flag" IN' + solarOutput + 'AND "Cogen_Flag" IN' + cogenOutput + 'AND "Emgen_Flag" IN' + emgenOutput + 'AND "Data_Grade" IN' + dataOutput + 'AND "Reduction_in_Energy_Intensity" IN' + energyOutput + 'AND "Possible_Contracting_Vehicle" IN' + contractOutput + 'ORDER BY "Total_Mu_Sigma_Score" DESC', function (err, result) {
			console.log(query);
			var response;

			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});


app.get('/buildingInf/:buildingName', function (req, res) {
	console.log('buildingInf')
	var buildingName = req.params.buildingName;
	var buildingNameString = '\'' + buildingName.toString() + '\''
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query(' SELECT "Agency","Facility_Name","Building_Name","State_Name","Total_Mu_Sigma_Score","PTA_Score","Energy_Profile_Score","Potential_DE_Score","Stage_1_2_GHG_emissions","Stage_3_GHG_emissions","Reduction_in_Energy_Intensity","Usage_of_renewable_energy","Reason_Code_1","Reason_Code_2","Battery_Flag","Cogen_Flag","Emgen_Flag","Fuelcell_Flag","Solar_Flag" FROM "FedEff"."Data_Directory_v10_Predix_07242017" WHERE "Building_Name" = ' + buildingNameString, function (err, result) {

			var response;

			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});

app.get('/DataTable', function (req, res) {
	console.log('Here')
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var query = client.query(' SELECT CASE WHEN "Facility_Name" IS NULL THEN ' + nullTreatment + ' ELSE "Facility_Name" end as "Facility_Name",CASE WHEN "Building_Name" IS NULL THEN ' + nullTreatment + ' ELSE "Building_Name" end as "Building_Name",CASE WHEN "Agency" IS NULL THEN ' + nullTreatment + ' ELSE "Agency" end as "Agency","Total_Mu_Sigma_Score"  FROM "FedEff"."Data_Directory_v10_Predix_07242017"  ORDER BY "Total_Mu_Sigma_Score" LIMIT 1000;', function (err, result) {
			var response;
			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});

app.get('/chartTable', function (req, res) {
	console.log('Here')
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var query = client.query(' SELECT "State_Name",COUNT(*) as "Opportunities" FROM "FedEff"."Data_Directory_v10_Predix_07242017" GROUP BY "State_Name" ORDER BY "State_Name"', function (err, result) {
			var response;
			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});

app.get('/chartTable_Agency', function (req, res) {
	console.log('Here')
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var query = client.query(' SELECT "Agency",COUNT(*) as "Opportunities" FROM "FedEff"."Data_Directory_v10_Predix_07242017" GROUP BY "Agency" ORDER BY "Agency"', function (err, result) {
			var response;
			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});

app.get('/LongLat', function (req, res) {
	console.log('Here')
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var query = client.query(' SELECT "Latitude","Longitude","Agency" FROM "FedEff"."Data_Directory_v10_Predix_07242017" LIMIT 2000;', function (err, result) {
			var response;
			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});


app.get('/regulation', function (req, res) {
	console.log('Here')
	var client = new pg.Client(conString);
	client.connect(function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var query = client.query(' SELECT "State","Name" FROM "FedEff"."Laws_Policies_by_State_v2"  ;', function (err, result) {
			var response;
			if (err) {
				return console.error('error running query', err);
			}
			console.log(result)
			res.send({
				data: JSON.stringify(result.rows)
			});
		});
		query.on('end', function () {
			client.end();
			res.end();
		});
	});
});

//logout route
app.get('/logout', function (req, res) {
	req.session.destroy();
	req.logout();
	passportConfig.reset(); //reset auth tokens
	res.redirect(config.uaaURL + '/logout?redirect=' + config.appURL);
});

app.get('/favicon.ico', function (req, res) {
	res.send('favicon.ico');
});

// Sample route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
//currently not being used as we are using passport-oauth2-middleware to check if
//token has expired
/*
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
*/

////// error handlers //////
// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
	console.error(err.stack);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler - prints stacktrace
if (node_env === 'development') {
	app.use(function (err, req, res, next) {
		if (!res.headersSent) {
			res.status(err.status || 500);
			res.send({
				message: err.message,
				error: err
			});
		}
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: {}
		});
	}
});

module.exports = app;
