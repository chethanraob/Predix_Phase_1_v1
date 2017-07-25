var array = [];



function firstfunction(){
	
	data_1="38,600"
	gola1_data= "Total Records"+" ~" + data_1
	data_2="6,400"
	gola2_data= "Constellation Customers"+" ~"+ data_2
	
	document.getElementById("circle1").innerHTML = gola1_data
	document.getElementById("circle2").innerHTML = gola2_data

     data=[{"Grade":"D","Description":"Records containing Name of the Building, Location, Agency","No. of records":"15,039"},
	{"Grade":"C","Description":"Records containing annual energy consumption,Energy Intensity,sq. ft.","No. of records":"5678"},
	{"Grade":"B","Description":"Records containing First Fuel Score, Grade C or D or C+D info","No. of records":"5678"},
	{"Grade":"A","Description":"Records containing Potential ECM Data + Grade B/C/D or the mixture of other 3 grades","No. of records":"5678"}]
    document.getElementById("table1").tableData=data
	document.getElementById("table1").filterable=false
	
}

function secondfunction(){
	dropDownnames= ["aaa","bbb"]
	document.getElementById("agencyName").items = dropDownnames
	dropDownnames= ["All","A","B","C","D"]
	document.getElementById("dataGrade").items = dropDownnames
	dropDownnames= ["All","ESPC","NA","UESC"]
	document.getElementById("contractingValue").items = dropDownnames
	dropDownnames= [{"key":"1","val":"All"},{"key":"2","val":"NO"},{"key":"3","val":"YES"}]
	document.getElementById("currentCustomer").items = dropDownnames
	dropDownnames= ["All","0","1"]
	document.getElementById("solarFlag").items = dropDownnames
	dropDownnames= ["All","0","1"]
	document.getElementById("batteryFlag").items = dropDownnames
	dropDownnames= ["All","0","1"]
	document.getElementById("cogenFlag").items = dropDownnames
	dropDownnames= ["All","0","1"]
	document.getElementById("emgenFlag").items = dropDownnames
	dropDownnames= ["All","0","1"]
	document.getElementById("fuelcellFlag").items = dropDownnames
	dropDownnames= ["All","Green","NA","Red","Yellow"]
	document.getElementById("stageemissionName").items = dropDownnames
	dropDownnames= ["All","Green","NA","Red"]
	document.getElementById("stage3emissionName").items = dropDownnames
	dropDownnames= ["All","Green","NA","Red","Yellow"]
	document.getElementById("energyIntensity").items = dropDownnames
	dropDownnames= ["All","Green","NA","Red"]
	document.getElementById("renewableEnergy").items = dropDownnames
	
	
	document.getElementById("agency_1").addEventListener("px-dropdown-checkbox-changed", getmap);
	
	function getmap(){
		console.log("changed filter value")
		var data = [{"Longitude":"12.5","Latitude":"41.9"},{"Longitude":"-0.12755", "Latitude":"51.507222"},{"Longitude":"-3.683333", "Latitude":"40.4"}]; 
		createMarkers(data)
	}

	
	var dropdownitems=[];
	var dropdownitems_2=[];
	var dropdownitems_3=[];
	
	function makeRequest(type, fullUrl, callback) {
	var request = new XMLHttpRequest();
	console.log(request)
	request.open(type, fullUrl, true);
	request.setRequestHeader('Content-type', 'application/json');
	request.onreadystatechange = function () {
    if(request.readyState > 3) {
      if(request.status === 200){
        callback(null, request.response);
      } else {
        callback(request.response, null);
      }
    }
	};
	request.send();
	}


	$(document).ready(function(){ 
 
 
	console.log("in it");
 	makeRequest('GET', '/AllData', function(err, data) {
    console.log("success");
	console.log(data)
	result_data=JSON.parse(data)
	result_data=JSON.parse(result_data.data)
	console.log(result_data)
	 for(i=0;i<result_data.length;i++)
	{
		dropdownitems.push(result_data[i].Agency)
		dropdownitems_2.push(result_data[i].State_Name)
		dropdownitems_3.push(result_data[i].Utility_Partner)
		
		}
		 dropdownitems=uniq_fast(dropdownitems) 
		dropdownitems_2=uniq_fast(dropdownitems_2)
		 dropdownitems_3=uniq_fast(dropdownitems_3)
	console.log(dropdownitems)
	document.getElementById("agencyName").items=dropdownitems; 
	document.getElementById("stateName").items=dropdownitems_2; 
	document.getElementById("utilityName").items=dropdownitems_3; 

	}
	); 
 
 
	 makeRequest('GET', '/DataTable', function(err, data) {
		console.log("success");
		console.log(data)
		result_data=JSON.parse(data)
		result_data=JSON.parse(result_data.data)
		console.log(result_data)
		

	  }
	 ); 
 
/*  Map codes */

    
 
makeRequest('GET', '/DataTable', function(err, data) {
    console.log("success");
                console.log(data)
                result_data=JSON.parse(data)
                result_data=JSON.parse(result_data.data)
                drawTable(data)
  }
); 
 
 
 var rome = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([12.5, 41.9]))
      });

      var london = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-0.12755, 51.507222]))
      });

      var madrid = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-3.683333, 40.4]))
      });

      rome.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          color: '#8959A8',
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
        }))
      }));

      london.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          color: '#4271AE',
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
        }))
      }));

      madrid.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          color: [113, 140, 0],
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
        }))
      }));


      var vectorSource = new ol.source.Vector({
        features: [rome, london, madrid]
      });

      var vectorLayer = new ol.layer.Vector({
        source: vectorSource
      });

      var rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
          url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
          crossOrigin: ''
        })
      });

      var map2 = new ol.Map({
        layers: [rasterLayer, vectorLayer],
        target: document.getElementById('map2'),
        view: new ol.View({
          center: ol.proj.fromLonLat([37.41, 8.82]),
          zoom: 3
        })
      });
	  
	  
	  
	  
	   var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([37.41, 8.82]),
          zoom: 4
        })
      });
 

 
 
 
 
});


function drawTable(data) {
                data = JSON.parse(JSON.parse(data).data);
                var nameMapping = {
                                Building_Name: "Building Name"
							,
                                
    };
    var keys = d3.keys(nameMapping);
    
                var table = d3.select("#table_building");
                table.selectAll("*").remove();
                
    var theads = table.append("thead");
    var ths = theads.selectAll('th').data(keys).enter().append("th").text(function(d) {
        return nameMapping[d];
    });

    var tbodies = table.append("tbody");
    var rows = tbodies.selectAll("tr").data(data);
                rows = rows.enter().append("tr");
                
    var dataCells = rows.selectAll("td")
        .data(function(d) {
            var values = d3.keys(nameMapping).map(function(key) {
                return d[key];
            });
            return values;
        });
        dataCells.enter().append("td").text(function(d, i) {
        return d;
    });
 
 
}

	function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
			   
               seen[item] = 1;
               out.push({"key":item,
			              "val":item});
         }
    }
	console.log("items")
	console.log(out)
    return out;
	}



	function createMarkers(data) {
	//data = JSON.parse(data)
   
		var lng = [];
		var lat = [];
		var array = [];
		latlong=data;
		console.log(latlong)
		for(var i=0;i<data.length;i++){
		
		 lng.push(data[i].Longitude)
		 lat.push(data[i].Latitude)
		
		
		var x =  new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
         });
	  
	    x.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          color: '#8959A8',
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
        }))
      }));
	  
	 array.push(x)
      
      }
	console.log(lng)
	console.log(array)
	
	
	   var vectorSource = new ol.source.Vector({
        features: [array]
      });

      var vectorLayer = new ol.layer.Vector({
        source: vectorSource
      });

      var rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
          url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
          crossOrigin: ''
        })
      });

      var map2 = new ol.Map({
        layers: [rasterLayer, vectorLayer],
        target: document.getElementById('map2'),
        view: new ol.View({
          center: ol.proj.fromLonLat([37.41, 8.82]),
          zoom: 3
        })
      });
	   }
  

      


   

}






	
			