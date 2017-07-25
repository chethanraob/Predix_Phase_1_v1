
/*Title : Core file containing all the functions in our application
Created : June 28, 2017 2:00 PM
Author : Shilpa
This code creates a document detailing all the functions of our application.
Revisions :
Version : 
Date :7/8/2017
Author :Ankita
Changes :

Improved the conclusion section
Added references*/


var buildingName ;          
var dataJson=[];

var array = [];
var vectorLayer;
var map21;
var map31;
var overlay;
var selectedCustomer = [], selectedAgency = [], selectedState = [], selectedUtility = [], selectedData = [], selectedContract = [],
    selectedSolar = [], selectedEmgen = [], selectedBattery = [], selectedCogen = [], selectedFuel = [], selectedStage = [], selectedStage3 = [],
    selectedEnergy = [], selectedRenewable = [];

	
/* var globalUtility = [];
var globalAgency = [];
var globalState = [];
var globalData = [];
var globalContract = [];
var globalSolar = [];
var globalEmgen = [];
var globalBattery = [];
var globalCogen = [];
var globalFuel = [];
var globalStage = [];
var globalStage3 = [];
var globalEnergy = [];
var globalRenewable = [];
var globalCustomer = [];
var globalchartdata = []
 */





//     makeRequest('POST', '/DataTableFiltered/' + selectedAgency +'/' +selectedBuilding, function (err, data) {
//             console.log("success");
//             console.log(data)

//             drawTable(data)
//             createMarkers(data)
//         });

// };




function drawTable(data) {
    data = JSON.parse(JSON.parse(data).data);
    var nameMapping = {
        Facility_Name: "Facility Name",
        Building_Name: "Building Name",
        Agency: "Agency",
        Total_Mu_Sigma_Score: "Score",
    };

    var keys = d3.keys(nameMapping);

    var table = d3.select("#table_building");
    table.selectAll("*").remove();

    // var ths = theads.selectAll('th').data(keys).enter().append("th").text(function(d) {
    //     return nameMapping[d];
    // });

    var tbodies = table.append("tbody");
    var rows = tbodies.selectAll("tr").data(data);
    rows = rows.enter().append("tr");

    var dataCells = rows.selectAll("td")
        .data(function (d) {
            var values = d3.keys(nameMapping).map(function (key) {
                return d[key];
            });
            return values;
        });
    dataCells.enter().append("td").text(function (d, i) {
        return d;
    });
                rows.on("click", function(d) {
                                buildingName = d.Building_Name
                                //window.location.href = "/#/overview"
                                window.location.assign("/#/buildinginf")
                                buildingInf()
                                });
};

function drawTable_State(data) {
    data = JSON.parse(JSON.parse(data).data);
    var nameMapping = {
        Facility_Name: "Facility Name",
        Building_Name: "Building Name",
        Agency: "Agency",
        Total_Mu_Sigma_Score: "Score",
    };

    var keys = d3.keys(nameMapping);

    var table = d3.select("#table_building_State");
    table.selectAll("*").remove();

    // var ths = theads.selectAll('th').data(keys).enter().append("th").text(function(d) {
    //     return nameMapping[d];
    // });

    var tbodies = table.append("tbody");
    var rows = tbodies.selectAll("tr").data(data);
    rows = rows.enter().append("tr");

    var dataCells = rows.selectAll("td")
        .data(function (d) {
            var values = d3.keys(nameMapping).map(function (key) {
                return d[key];
            });
            return values;
        });
    dataCells.enter().append("td").text(function (d, i) {
        return d;
    });
                rows.on("click", function(d) {
                                buildingName = d.Building_Name
                                //window.location.href = "/#/overview"
                                window.location.assign("/#/buildinginf")
                                buildingInf()
                                });
};


function makeRequest(type, fullUrl, callback) {
    var request = new XMLHttpRequest();
    console.log(request)
    request.open(type, fullUrl, true);
    request.setRequestHeader('Content-type', 'application/json');
    request.onreadystatechange = function () {
        if (request.readyState > 3) {
            if (request.status === 200) {
                callback(null, request.response);
            } else {
                callback(request.response, null);
            }
        }
    };
    request.send();
}







function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {

            seen[item] = 1;
            out.push({
                "key": item,
                "val": item
            });
        }
    }
    console.log("items")
    console.log(out)
    return out;
}








function firstfunction() {

    data = [{ "Grade": "D", "Description": "Records containing Name of the Building, Location, Agency", "No. of records": "15,039" },
    { "Grade": "C", "Description": "Records containing annual energy consumption,Energy Intensity,sq. ft.", "No. of records": "5678" },
    { "Grade": "B", "Description": "Records containing First Fuel Score, Grade C or D or C+D info", "No. of records": "5678" },
    { "Grade": "A", "Description": "Records containing Potential ECM Data + Grade B/C/D or the mixture of other 3 grades", "No. of records": "5678" }]
    document.getElementById("table1").tableData = data
    document.getElementById("table1").filterable = false
}
Array.prototype.unique = function()
{
	var n = {},r=[];
	for(var i = 0; i < this.length; i++) 
	{
		if (!n[this[i]]) 
		{
			n[this[i]] = true; 
			r.push(this[i]); 
		}
	}
	return r;
}


function drawChartLeftTop(filterData,opportunitiesData,stateNamesData)
{
	var numStates=57;
	filterData = JSON.parse(JSON.parse(filterData).data)
	var filteredStateNames = ['StateNames'];
	for(j=0;j<filterData.length;j++)
	{
		filteredStateNames.push(filterData[j].State_Name);	
	}
	
	filteredStateNames = filteredStateNames.unique();
	
	var filteredOpportunities=['Opportunities'] ;
	if(filteredStateNames.includes("All"))
	{
		filteredOpportunities=opportunitiesData;
		filteredStateNames=stateNamesData;
	}
	else
	{
	numStates = filteredStateNames.length-1;
	
	for(i=1;i<=numStates;i++)
	{
			filteredOpportunities.push(opportunitiesData[stateNamesData.indexOf(filteredStateNames[i])]);
	}
	}
	console.log(numStates)
	var innerChartHeight = numStates*21;
	console.log(innerChartHeight)
	if(innerChartHeight<400)
	{innerChartHeight = 400;}
console.log(innerChartHeight)
	document.getElementById("chartlefttop").style.height = innerChartHeight.toString()+"px";
	  var chart = c3.generate({
                bindto: "#chartlefttop",
                data: {
                    x: 'StateNames',
                    columns: [
                        filteredStateNames,
                        filteredOpportunities

                    ],
                    //url: '/chartData',
                    type: 'bar',
                    labels: true
                },
                padding: {
                    bottom: 10,
                    left: 70
                },
                axis: {

                    x: {
                        type: 'category',
                        label: {
                            text: 'State Names',
                            position: 'outer-middle'
                        }
                    },
                    y: {
                        label: {
                            text: 'Opportunities',
                            position: 'outer-center'
                        }
                    },
                    rotated: true
                },
                point: {
                    show: true
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //dth: 100 // this makes bar width 100px
                },
                legend:
                { show: false }
            });
}

function secondfunction() {
	var opportunitiesData = ['Opportunities'];
    var stateNamesData = ['StateNames'];
    // dropDownnames= ["aaa","bbb"]
    // document.getElementById("agencyName").items = dropDownnames
	 document.getElementById('mid-table-loader').style.opacity='0';
	document.getElementById('agency-state-name-content').style.opacity='1'; 
	var globalUtility = [];
var globalAgency = [];
var globalState = [];
var globalData = [];
var globalContract = [];
var globalSolar = [];
var globalEmgen = [];
var globalBattery = [];
var globalCogen = [];
var globalFuel = [];
var globalStage = [];
var globalStage3 = [];
var globalEnergy = [];
var globalRenewable = [];
var globalCustomer = [];
var globalchartdata = []

   




    document.getElementById("applyButton").addEventListener("click", confirmFilters);
    document.getElementById("agencyName").items = dropdownitems;
    document.getElementById("agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    document.getElementById("stateName").items = dropdownitems_2;
    document.getElementById("state").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    document.getElementById("utilityName").items = dropdownitems_3;
    document.getElementById("utility").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "A" }, { "key": "3", "val": "B" }, { "key": "4", "val": "C" }, { "key": "5", "val": "D" }]
    // document.getElementById("dataGrade").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalData.push(dropDownnames[i].val)
    //         }
    // document.getElementById("data").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "ESPC" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "UESC" }]
    // document.getElementById("contractingValue").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalContract.push(dropDownnames[i].val)
    //         }
    // document.getElementById("contract").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "NO" }, { "key": "3", "val": "YES" }]
    // document.getElementById("currentCustomer").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalCustomer.push(dropDownnames[i].val)
    //         }
    // document.getElementById("customer").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("solarFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalSolar.push(dropDownnames[i].val)
    //         }
    // document.getElementById("solar").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("batteryFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalBattery.push(dropDownnames[i].val)
    //         }
    // document.getElementById("battery").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("cogenFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalCogen.push(dropDownnames[i].val)
    //         }
    // document.getElementById("cogen").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("emgenFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalEmgen.push(dropDownnames[i].val)
    //         }
    // document.getElementById("emgen").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
    // document.getElementById("fuelcellFlag").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalFuel.push(dropDownnames[i].val)
    //         }
    // document.getElementById("fuelcell").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    // document.getElementById("stageemissionName").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalStage.push(dropDownnames[i].val)
    //         }
    // document.getElementById("stageemission").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }]
    // document.getElementById("stage3emissionName").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalStage3.push(dropDownnames[i].val)
    //         }
    // document.getElementById("stage3").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
    // document.getElementById("energyIntensity").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalEnergy.push(dropDownnames[i].val)
    //         }
    // document.getElementById("energy").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    // dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }]
    // document.getElementById("renewableEnergy").items = dropDownnames
    // for (i = 1; i < dropDownnames.length; i++) {
    //             globalRenewable.push(dropDownnames[i].val)
    //         }
    // document.getElementById("renewable").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    var dropdownitems = [];
    var dropdownitems_2 = [];
    var dropdownitems_3 = [];



    function filterdrop() {
        console.log("changed filter value");


        var agency = document.getElementById("agencyName").items
        selectedAgency = []
        for (i = 0; i < agency.length; i++) {
            if (agency[i].checked != undefined && agency[i].checked != false) {
                if (agency[0].checked == true) {
                    selectedAgency = globalAgency;
                    agency[i].checked = true
                }
                else {
                    selectedAgency.push(agency[i].val);
                }
            }
        }
        var state = document.getElementById("stateName").items
        selectedState = []
        for (i = 0; i < state.length; i++) {
            if (state[i].checked != undefined && state[i].checked != false) {
                if (state[0].checked == true) {
                    selectedState = globalState;
                    state[i].checked = true
                }
                else {
                    selectedState.push(state[i].val);
                }

            }

        }
        var utility = document.getElementById("utilityName").items
        selectedUtility = []
        for (i = 0; i < utility.length; i++) {
            if (utility[i].checked != undefined && utility[i].checked != false) {
                if (utility[0].checked == true) {
                    selectedUtility = globalUtility;
                    utility[i].checked = true
                }
                else {
                    selectedUtility.push(utility[i].val);
                }

            }

        }


        var dataGrade = document.getElementById("dataGrade").items
        selectedData = []
        for (i = 0; i < dataGrade.length; i++) {
            if (dataGrade[i].checked != undefined && dataGrade[i].checked != false) {
                if (dataGrade[0].checked == true) {
                    selectedData = globalData;
                    dataGrade[i].checked = true
                } else {
                    selectedData.push(dataGrade[i].val);
                }
            }

        }
        console.log(selectedData);

        var contract = document.getElementById("contractingValue").items
        selectedContract = []
        for (i = 0; i < contract.length; i++) {
            if (contract[i].checked != undefined && contract[i].checked != false) {
                if (contract[0].checked == true) {
                    selectedContract = globalContract;
                    contract[i].checked = true
                } else {
                    selectedContract.push(contract[i].val);
                }
            }
        }
        var customer = document.getElementById("currentCustomer").items
        selectedCustomer = []
        for (i = 0; i < customer.length; i++) {
            if (customer[i].checked != undefined && customer[i].checked != false) {
                if (customer[0].checked == true) {
                    selectedCustomer = globalCustomer;
                    customer[i].checked = true
                } else {
                    selectedCustomer.push(customer[i].val);
                }
            }
        }
        var solar = document.getElementById("solarFlag").items
        selectedSolar = []
        for (i = 0; i < solar.length; i++) {
            if (solar[i].checked != undefined && solar[i].checked != false) {
                if (solar[0].checked == true) {
                    selectedSolar = globalSolar;
                    solar[i].checked = true
                } else {
                    selectedSolar.push(solar[i].val);
                }
            }

        }
        var emgen = document.getElementById("emgenFlag").items
        selectedEmgen = []
        for (i = 0; i < emgen.length; i++) {
            if (emgen[i].checked != undefined && emgen[i].checked != false) {
                if (emgen[0].checked == true) {
                    selectedEmgen = globalEmgen;
                    emgen[i].checked = true
                } else {
                    selectedEmgen.push(emgen[i].val);
                }
            }
        }
        var battery = document.getElementById("batteryFlag").items
        selectedBattery = []
        for (i = 0; i < battery.length; i++) {
            if (battery[i].checked != undefined && battery[i].checked != false) {
                if (battery[0].checked == true) {
                    selectedBattery = globalBattery;
                    battery[i].checked = true
                } else {
                    selectedBattery.push(solar[i].val);
                }
            }

        }
        var cogen = document.getElementById("cogenFlag").items
        selectedCogen = []
        for (i = 0; i < cogen.length; i++) {
            if (cogen[i].checked != undefined && cogen[i].checked != false) {
                if (cogen[0].checked == true) {
                    selectedCogen = globalCogen;
                    cogen[i].checked = true
                } else {
                    selectedCogen.push(cogen[i].val);

                }

            }
        }
        var fuelcell = document.getElementById("fuelcellFlag").items
        selectedFuel = []

        for (i = 0; i < fuelcell.length; i++) {
            if (fuelcell[i].checked != undefined && fuelcell[i].checked != false) {
                if (fuelcell[0].checked == true) {
                    selectedFuel = globalFuel;
                    fuelcell[i].checked = true
                } else {
                    selectedFuel.push(fuelcell[i].val);

                }
            }
        }
        var stageemission = document.getElementById("stageemissionName").items
        selectedStage = []
        for (i = 0; i < stageemission.length; i++) {
            if (stageemission[i].checked != undefined && stageemission[i].checked != false) {
                if (battery[0].checked == true) {
                    selectedStage = globalStage;
                    stageemission[i].checked = true
                } else {
                    selectedStage.push(stageemission[i].val);

                }
            }
        }
        var stage3 = document.getElementById("stage3emissionName").items
        selectedStage3 = []
        for (i = 0; i < stage3.length; i++) {
            if (stage3[i].checked != undefined && stage3[i].checked != false) {
                if (stage3[0].checked == true) {
                    selectedStage3 = globalStage3;
                    stage3[i].checked = true
                } else {
                    selectedStage3.push(stage3[i].val);
                }
            }

        }
        var energy = document.getElementById("energyIntensity").items
        selectedEnergy = []
        for (i = 0; i < energy.length; i++) {
            if (energy[i].checked != undefined && energy[i].checked != false) {
                if (energy[0].checked == true) {
                    selectedEnergy = globalEnergy;
                    energy[i].checked = true
                } else {
                    selectedEnergy.push(energy[i].val);
                }
            }
        }
        var renewable = document.getElementById("renewableEnergy").items
        selectedRenewable = []
        for (i = 0; i < renewable.length; i++) {
            if (renewable[i].checked != undefined && renewable[i].checked != false) {
                if (renewable[0].checked == true) {
                    selectedRenewable = globalRenewable;
                    renewable[i].checked = true
                } else {
                    selectedRenewable.push(renewable[i].val);
                }
            }
        }
        console.log(selectedRenewable);
        console.log(selectedContract);


    }


/*     $(document).ready(function () { */

         dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "A" }, { "key": "3", "val": "B" }, { "key": "4", "val": "C" }, { "key": "5", "val": "D" }]
            document.getElementById("dataGrade").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalData.push(dropDownnames[i].val)
            }
            document.getElementById("data").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "ESPC" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "UESC" }]
            document.getElementById("contractingValue").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalContract.push(dropDownnames[i].val)
            }
            document.getElementById("contract").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "NO" }, { "key": "3", "val": "YES" }]
            document.getElementById("currentCustomer").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalCustomer.push(dropDownnames[i].val)
            }
            document.getElementById("customer").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("solarFlag").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalSolar.push(dropDownnames[i].val)
            }
            document.getElementById("solar").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("batteryFlag").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalBattery.push(dropDownnames[i].val)
            }
            document.getElementById("battery").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("cogenFlag").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalCogen.push(dropDownnames[i].val)
            }
            document.getElementById("cogen").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("emgenFlag").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalEmgen.push(dropDownnames[i].val)
            }
            document.getElementById("emgen").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("fuelcellFlag").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalFuel.push(dropDownnames[i].val)
            }
            document.getElementById("fuelcell").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
            document.getElementById("stageemissionName").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalStage.push(dropDownnames[i].val)
            }
            document.getElementById("stageemission").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }]
            document.getElementById("stage3emissionName").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalStage3.push(dropDownnames[i].val)
            }
            document.getElementById("stage3").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
            document.getElementById("energyIntensity").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalEnergy.push(dropDownnames[i].val)
            }
            document.getElementById("energy").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }]
            document.getElementById("renewableEnergy").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalRenewable.push(dropDownnames[i].val)
            }
            document.getElementById("renewable").addEventListener("px-dropdown-checkbox-changed", filterdrop);


			
			function onMouseMove(browserEvent) {
	overlay.setPosition(undefined);
    content = document.getElementById('popup-content');
    var coordinate = browserEvent.coordinate;
    var pixel = map21.getPixelFromCoordinate(coordinate);
	/*         var el = document.getElementById('name');
			el.innerHTML = ''; */
    map21.forEachFeatureAtPixel(pixel, function (feature) {
        console.log("hello")
        console.log(feature.getGeometry().A[0])

        content.innerHTML = '<p>You clicked here:</p><code>' + feature.getGeometry().A[0] +
            '</code>';
        overlay.setPosition(coordinate);
    });
	    var pixel = map21.getPixelFromCoordinate(coordinate);
	/*         var el = document.getElementById('name');
			el.innerHTML = ''; */
	
	
}


        console.log("in it");

		function confirmFilters() {
	
	
    var request = new XMLHttpRequest();
    var datapointsUrl = "/DataTableFiltered";
    request.open('POST', datapointsUrl, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function (response) {
        if (request.status >= 200 && request.status < 400) {
			 document.getElementById('mid-table-loader').style.opacity='0';
			document.getElementById('agency-state-name-content').style.opacity='1';  
            console.log("success");
            console.log(request.response);
            
			getdropdowns(request.response);
            drawTable(request.response);
            createMarkers(request.response);
			drawChartLeftTop(request.response,opportunitiesData,stateNamesData);

        } else {
            console.log("failure on status code");
        }


    };
    request.onerror = function () {
        console.log("failure after success code");
    };

    if (selectedAgency == "") {
        selectedAgency = globalAgency
    }

    if (selectedState == "") {
        selectedState = globalState
    }
    if (selectedUtility == "") {
        selectedUtility = globalUtility
    }
    if (selectedCustomer == "") {
        selectedCustomer = globalCustomer
    }

    if (selectedSolar == "") {
        selectedSolar = globalSolar
    }
    if (selectedStage == "") {
        selectedStage = globalStage
    }
    if (selectedStage3 == "") {
        selectedStage3 = globalStage3
    }

    if (selectedRenewable == "") {
        selectedRenewable = globalRenewable
    }
    if (selectedBattery == "") {
        selectedBattery = globalBattery
    }
    if (selectedFuel == "") {
        selectedFuel = globalFuel
    }

    if (selectedEmgen == "") {
        selectedEmgen = globalEmgen
    }
    if (selectedCogen == "") {
        selectedCogen = globalCogen
    }
    if (selectedContract == "") {
        selectedContract = globalContract
    }

    if (selectedData == "") {
        selectedData = globalData
    }
    if (selectedEnergy == "") {
        selectedEnergy = globalEnergy
    }




    var requestData = {
        "agency": selectedAgency, "state": selectedState, "utility": selectedUtility,
        "customer": selectedCustomer, "contract": selectedContract, "battery": selectedBattery, "emgen": selectedEmgen,
        "cogen": selectedCogen, "fuelcell": selectedFuel, "renewable": selectedRenewable, "solar": selectedSolar,
        "stage": selectedStage, "stage3": selectedStage3, "data": selectedData, "energy": selectedEnergy
    };
	document.getElementById('mid-table-loader').style.opacity='1';
	document.getElementById('agency-state-name-content').style.opacity='0.2';  
    request.send(JSON.stringify(requestData));
};

function getdropdowns(data)
{
	data = JSON.parse(JSON.parse(data).data);
	var dropdownitems = [];
	var dropdownitems_2 = [];
	for (i = 0; i < data.length; i++) {
                dropdownitems.push(data[i].Facility_Name)
                dropdownitems_2.push(data[i].Building_Name)
            }

            dropdownitems = uniq_fast(dropdownitems)
            dropdownitems_2 = uniq_fast(dropdownitems_2)

            console.log(dropdownitems)
            document.getElementById("facilityName").items = dropdownitems;
            document.getElementById("buildingName").items = dropdownitems_2;
			/*  document.getElementById("facilityName_State").items = dropdownitems;
            document.getElementById("buildingName_State").items = dropdownitems_2; */

document.getElementById("noOppurtunity").innerHTML  = 	data.length;		
}

function createMarkers(data) {
    //data = JSON.parse(data)
	var colorsused = ["#4286f4","#f441eb","#f4414f","#41aff4","#49f441","#ebf441","#f4a041","#d0f441","#ff0080","#ff0000","#808080","#bd6769","#bdef69","#d18bfe","#10176f","#660000","#4286f4","#f441eb","#f4414f","#41aff4","#49f441","#ebf441","#f4a041","#d0f441","#ff0080","#ff0000","#808080","#bd6769","#bdef69"]
    var lngfirst;
    var latfirst;
    var array = [];
    data = JSON.parse(JSON.parse(data).data); 
	
    lngfirst = -85.41;
    latfirst = 38.82;
    latlong = data;
    console.log(latlong)
	
	for (var i = 0; i < data.length; i++)
	{
		
	if (parseInt(data[i].Longitude)&& parseInt(data[i].Latitude)){
			lngfirst = data[i].Longitude
			latfirst = data[i].Latitude
				break;
			}
			else{
			lngfirst = -85.41;
				latfirst = -85.41;
			}
	}	
			
    for (var i = 0; i < data.length; i++) {
			
			
		

        if (parseInt(data[i].Longitude)) {

            lng = parseInt(data[i].Longitude)
            lat = parseInt(data[i].Latitude)


            var x = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
            });
			
			for (var j = 0; j < globalAgency.length; j++){
			bla = colorsused[j]	
			if(data[i].Agency== globalAgency[j]) {
            x.setStyle(new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    color: bla,
					scale: '0.4',
                    crossOrigin: 'anonymous',
                    src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
                }))
            }));
		
			}
			
			
			}
			array.push(x)
			}
            

        }
    
    console.log(lng)
    console.log(array)


    var vectorSource = new ol.source.Vector({
        features: array
    });
    vectorLayer.getSource().clear()
    vectorLayer.setSource(vectorSource)
	/*       vectorLayer = new ol.layer.Vector({
			source: vectorSource
		  }); */

    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
            url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
            crossOrigin: ''
        })
    });

    console.log(lngfirst)
    console.log(latfirst)
    lngfirst = parseFloat(lngfirst)
    latfirst = parseFloat(latfirst)
    console.log(lngfirst)
    console.log(latfirst)
	/* lngfirst = lngfirst.toPrecision(2);
	latfirst = latfirst.toPrecision(2); */
    console.log(lngfirst)
    console.log(latfirst)
    lngfirst = parseFloat(lngfirst)
    latfirst = parseFloat(latfirst)
    View = map21.getView()
    console.log(View)
    View.setCenter(ol.proj.transform([lngfirst, latfirst], 'EPSG:4326', 'EPSG:3857'))
    View.setZoom(5)

}

        makeRequest('GET', '/DataTable', function (err, data) {
            console.log("success");
            console.log(data)
            result_data = JSON.parse(data)
            result_data = JSON.parse(result_data.data)
            drawTable(data)

            // for (i = 0; i < result_data.length; i++) {
            //     dropdownitems.push(result_data[i].Facility_Name)
            //     dropdownitems_2.push(result_data[i].Building_Name)
            // }

            // dropdownitems = uniq_fast(dropdownitems)
            // dropdownitems_2 = uniq_fast(dropdownitems_2)

            // console.log(dropdownitems)
            // document.getElementById("facilityName").items = dropdownitems;
            // document.getElementById("buildingName").items = dropdownitems_2;





        }
        );





        makeRequest('GET', '/chartTable', function (err, data) {
            console.log("success");
            console.log(data)
            result_data = JSON.parse(data)
            console.log(result_data)
            result_data = JSON.parse(result_data.data)
            console.log(result_data)
			globalchartdata = result_data;

            for (i = 0; i < result_data.length; i++) {
                stateNamesData.push(result_data[i].State_Name)
                opportunitiesData.push(parseInt(result_data[i].Opportunities))
            }
            console.log(stateNamesData)
            console.log(opportunitiesData)
			/*dropdownitems=uniq_fast(dropdownitems) 
			dropdownitems_2=uniq_fast(dropdownitems_2)
		    
			console.log(dropdownitems)
			document.getElementById("facilityName").items=dropdownitems; 
			document.getElementById("buildingName").items=dropdownitems_2; 
			 */
            //var s1tateNamesData=["StateNames","a","b","c"]
            //var o1pportunitiesData=["Opportunities",10,20,15]
            var chart = c3.generate({
                bindto: "#chartlefttop",
                data: {
                    x: 'StateNames',
                    columns: [
                        stateNamesData,
                        opportunitiesData

                    ],
                    //url: '/chartData',
                    type: 'bar',
                    labels: true
                },
                padding: {
                    bottom: 10,
                    left: 70
                },
                axis: {

                    x: {
                        type: 'category',
                        label: {
                            text: 'State Names',
                            position: 'outer-middle'
                        }
                    },
                    y: {
                        label: {
                            text: 'Opportunities',
                            position: 'outer-center'
                        }
                    },
                    rotated: true
                },
                point: {
                    show: true
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //dth: 100 // this makes bar width 100px
                },
                legend:
                { show: false }
            });

        });


        makeRequest('GET', '/AllData', function (err, data) {
            console.log("success");
            console.log(data)
            result_data = JSON.parse(data)
            result_data = JSON.parse(result_data.data)
            console.log(result_data)
            dropdownitems = ['All'];
            dropdownitems_2 = ['All'];
            dropdownitems_3 = ['All'];
            for (i = 0; i < result_data.length; i++) {
                dropdownitems.push(result_data[i].Agency)



                dropdownitems_2.push(result_data[i].State_Name)


                dropdownitems_3.push(result_data[i].Utility_Partner)


            }
            dropdownitems = uniq_fast(dropdownitems)

            for (i = 1; i < dropdownitems.length; i++) {
                globalAgency.push(dropdownitems[i].val)
            }


            dropdownitems_2 = uniq_fast(dropdownitems_2)

            for (i = 1; i < dropdownitems_2.length; i++) {
                globalState.push(dropdownitems_2[i].val)
            }


            dropdownitems_3 = uniq_fast(dropdownitems_3)
            for (i = 1; i < dropdownitems_3.length; i++) {
                globalUtility.push(dropdownitems_3[i].val)
            }

            console.log(dropdownitems)
            document.getElementById("agencyName").items = dropdownitems;
            document.getElementById("agency").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            document.getElementById("stateName").items = dropdownitems_2;
            document.getElementById("state").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            document.getElementById("utilityName").items = dropdownitems_3;
            document.getElementById("utility").addEventListener("px-dropdown-checkbox-changed", filterdrop);
           

        }
        );
        // makeRequest('GET', '/DataTable', function(err, data) {
        //     console.log("success");
        //                 console.log(data)
        //                 result_data=JSON.parse(data)
        //                 result_data=JSON.parse(result_data.data)
        //                 drawTable(data)
        //   }
        // );









        var rome = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([-80.41, 28.82]))
        });

        var london = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([-85.41, 38.82]))
        });

		/*       var madrid = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat([-3.683333, 40.4]))
		  }); */

        rome.setStyle(new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                color: '#8959A8',
				scale: '0.4',
                crossOrigin: 'anonymous',
                src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
            }))
        }));

        london.setStyle(new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                color: '#4271AE',
				scale: '0.4',
                crossOrigin: 'anonymous',
                src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
            }))
        }));

		/*       madrid.setStyle(new ol.style.Style({
				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ /*({
color: [113, 140, 0],
crossOrigin: 'anonymous',
src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
}))
})); */


        var vectorSource = new ol.source.Vector({
            features: [rome, london]
        });

        vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        var rasterLayer = new ol.layer.Tile({
            source: new ol.source.TileJSON({
                url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
                crossOrigin: ''
            })
        });






        container = document.getElementById('popup')

        overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));

        map21 = new ol.Map({
            layers: [rasterLayer, vectorLayer],
            overlays: [overlay],
            target: document.getElementById('map2'),
            view: new ol.View({
                center: ol.proj.fromLonLat([-70.41, 18.82]),
                zoom: 3
            })
        });

        map21.on('pointermove', onMouseMove);

        closer = document.getElementById('popup-closer')

        closer.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };


        makeRequest('GET', '/LongLat', function (err, data) {
            console.log("success");
            console.log(data)



            var data = data
            createMarkers(data)
        }
        );








 /*    }); */




}

function buildingInfCircles()
{
                dataJson = [{"id":"circle12ghg","cx":100,"label":"Stage 1&2 GHG Emissions"},{"id":"circle3ghg","cx":300,"label":"Stage 3 GHG Emissions"},{"id":"circlereduction","cx":500,"label":"Reduction in Energy Intensity"},{"id":"circleusage","cx":700,"label":"Usage of Renewable Energy"}]
                var svg_container = d3.select("#circles_bottomright")
                                                                                                                .append("svg")
                                                                                                                .style("width","100%")
                                                                                                                .attr("viewBox","0 0 800 200")
                                                                                                                .attr("perserveAspectRatio","xMinYMid");
                var circles = svg_container.selectAll("circle")
                         .data(dataJson)
                          .enter()
                         .append("circle");
                var circle_attributes = circles.attr("cx",function(d){return d.cx;})
                                               .attr("id",function(d){return d.id;})
                                               .attr("cy",60)
                                                .attr("r",40);
                var text = svg_container.selectAll("text")
                       .data(dataJson)
                        .enter()
                        .append("text");
                var textLabels = text.attr("x", function(d) { return d.cx-70; })
                                                                                                .attr("y", 120)
                 .text( function (d) { return d.label; });
}

function buildingInf(){
                console.log(buildingName)
                                                //window.location.href = "/#/overview"
                                d3.select("#moreinfolink").on("click",function(){window.location.assign("/#/buildingmoreinfo");})
                var facilityScore = ['Score on selected facility'];
                var flagArray=[];
                var batteryColor = "grey",coGenColor = "grey",emGenColor = "grey",fuelCellColor ="grey",solarColor="grey";
                var aName=" ",fName=" ",bName=" ",sName=" ",pReason=" ",sReason=" ";
                var maxScoreArray=['Maximum Score on selected category'];
                $(document).ready(function(){
                                //document.location.assign("/#/overview")
                                                // '/DataTableFiltered/'+selectedAgency
                makeRequest('GET', '/buildingInfMaxScores', function(err, data) {
                                console.log("success");
                                console.log(data)
                                result_data=JSON.parse(data)
                                result_data=JSON.parse(result_data.data)
                                console.log(result_data)
                                maxScoreArray.push(result_data[0].score1)
                                maxScoreArray.push(result_data[0].score2)
                                maxScoreArray.push(result_data[0].score3)
                                maxScoreArray.push(result_data[0].score4)
                makeRequest('GET', '/buildingInf/'+buildingName, function(err, data) {
    console.log("success");
                console.log(data)
                result_data=JSON.parse(data)
                result_data=JSON.parse(result_data.data)
                console.log(result_data)
                
                facilityScore.push(result_data[0].Total_Mu_Sigma_Score)
                facilityScore.push(result_data[0].PTA_Score)
                facilityScore.push(result_data[0].Energy_Profile_Score)
                facilityScore.push(result_data[0].Potential_DE_Score)
                
                flagArray.push(result_data[0].Stage_1_2_GHG_emissions)
                flagArray.push(result_data[0].Stage_3_GHG_emissions)
                flagArray.push(result_data[0].Reduction_in_Energy_Intensity)
                flagArray.push(result_data[0].Usage_of_renewable_energy)
                
				 for(i=0;i<4;i++)
                                {
                                                //dataJson[i].flag=flagArray[i];
												if (flagArray[i]==null) {flagArray[i] = "grey"}
                                }
				 d3.select("#circle12ghg").attr("fill",flagArray[0])
				  d3.select("#circle3ghg").attr("fill",flagArray[1])
				   d3.select("#circlereduction").attr("fill",flagArray[2])
				    d3.select("#circleusage").attr("fill",flagArray[3])
								
                if(result_data[0].Battery_Flag==0) {batteryColor = "red"} else if(result_data[0].Battery_Flag==1) {batteryColor = "green"}
                if(result_data[0].Cogen_Flag==0) {coGenColor = "red"} else if(result_data[0].Cogen_Flag==1) {coGenColor = "green"}
                if(result_data[0].Emgen_Flag==0) {emGenColor = "red"} else if(result_data[0].Emgen_Flag==1) {emGenColor = "green"}
                if(result_data[0].Fuelcell_Flag==0) {fuelCellColor = "red"} else if(result_data[0].Fuelcell_Flag==1) {fuelCellColor = "green"}
                if(result_data[0].Solar_Flag==0) {solarColor = "red"} else if(result_data[0].Solar_Flag==1) {solarColor = "green"}
                
                aName=result_data[0].Agency
                fName=result_data[0].Facility_Name
                bName=result_data[0].Building_Name
                sName=result_data[0].State_Name
                
                pReason=result_data[0].Reason_Code_1
                sReason=result_data[0].Reason_Code_2
                
                document.getElementById("batteryflag").style.color = batteryColor
                document.getElementById("cogenflag").style.color = coGenColor
                document.getElementById("emgenflag").style.color = emGenColor
                document.getElementById("fuelcellflag").style.color = fuelCellColor
                document.getElementById("solarflag").style.color = solarColor
                
                document.getElementById("agency-name").innerHTML = aName
                document.getElementById("facility-name").innerHTML = fName
                document.getElementById("building-name").innerHTML = bName
                document.getElementById("state-name").innerHTML = sName
                
                document.getElementById("ptrc").innerHTML = pReason
                document.getElementById("strc").innerHTML = sReason
                
				d3.select("#moreinfolink").on("click",function(){window.location.assign("/#/buildingmoreinfo");})
				
				
				var chart = c3.generate({
                                bindto:"#bar-chart-buildinfo",
                                padding:{bottom:10},
                                data: {
                                x:'x',
        columns: [
                                                ['x',"Total score(max:800)","PTA score(max:100)","Energy profile score(max:400)","DE score(max:100)"],
            //['Maximum score on selected category', 430, 200, 400, 300],
            //['Score on selected facility', 400, 100, 340, 250]
                                                maxScoreArray,
                                                facilityScore
                                                ],             
                                                type: 'bar',
                                                labels: true
                                },
                                bar: {
        width: {
            ratio: 0.3
        }
    },
                axis:{
                                x:{type:'category',
                                                },
                                y:{show:false}
                }
                });

                //var dataJson = [{"cx":100,"flag":"grey","label":"Stage 1&2 GHG Emissions"},{"cx":300,"flag":"grey","label":"Stage 3 GHG Emissions"},{"cx":500,"flag":"grey","label":"Reduction in Energy Intensity"},{"cx":700,"flag":"grey","label":"Usage of Renewable Energy"}]
               
});
});
});
}




function statefunction() {
	
	console.log('great')
	
	var opportunitiesData = ['Opportunities']
    var stateNamesData = ['StateNames']
	var globalUtility = [];
var globalAgency = [];
var globalState = [];
var globalData = [];
var globalContract = [];
var globalSolar = [];
var globalEmgen = [];
var globalBattery = [];
var globalCogen = [];
var globalFuel = [];
var globalStage = [];
var globalStage3 = [];
var globalEnergy = [];
var globalRenewable = [];
var globalCustomer = [];
var globalchartdata = []

function onMouseMove_State(browserEvent) {
	overlay.setPosition(undefined);
    content = document.getElementById('popup-content');
    var coordinate = browserEvent.coordinate;
    var pixel = map31.getPixelFromCoordinate(coordinate);
	/*         var el = document.getElementById('name');
			el.innerHTML = ''; */
    map31.forEachFeatureAtPixel(pixel, function (feature) {
        console.log("hello")
        console.log(feature.getGeometry().A[0])

        content.innerHTML = '<p>You clicked here:</p><code>' + feature.getGeometry().A[0] +
            '</code>';
        overlay.setPosition(coordinate);
    });
	/*         var el = document.getElementById('name');
			el.innerHTML = ''; */
	
	
}

function confirmFilters_State() {
	
	
    var request = new XMLHttpRequest();
    var datapointsUrl = "/DataTableFiltered";
    request.open('POST', datapointsUrl, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function (response) {
        if (request.status >= 200 && request.status < 400) {
			document.getElementById('mid-table-loader').style.opacity='0';
			document.getElementById('agency-state-name-content').style.opacity='1'; 
            console.log("success");
            console.log(request.response);
            
			getdropdowns_State(request.response);
            drawTable_State(request.response);
            createMarkers(request.response);

        } else {
            console.log("failure on status code");
        }


    };
    request.onerror = function () {
        console.log("failure after success code");
    };

    if (selectedAgency == "") {
        selectedAgency = globalAgency
    }

    if (selectedState == "") {
        selectedState = globalState
    }
    if (selectedUtility == "") {
        selectedUtility = globalUtility
    }
    if (selectedCustomer == "") {
        selectedCustomer = globalCustomer
    }

    if (selectedSolar == "") {
        selectedSolar = globalSolar
    }
    if (selectedStage == "") {
        selectedStage = globalStage
    }
    if (selectedStage3 == "") {
        selectedStage3 = globalStage3
    }

    if (selectedRenewable == "") {
        selectedRenewable = globalRenewable
    }
    if (selectedBattery == "") {
        selectedBattery = globalBattery
    }
    if (selectedFuel == "") {
        selectedFuel = globalFuel
    }

    if (selectedEmgen == "") {
        selectedEmgen = globalEmgen
    }
    if (selectedCogen == "") {
        selectedCogen = globalCogen
    }
    if (selectedContract == "") {
        selectedContract = globalContract
    }

    if (selectedData == "") {
        selectedData = globalData
    }
    if (selectedEnergy == "") {
        selectedEnergy = globalEnergy
    }




    var requestData = {
        "agency": selectedAgency, "state": selectedState, "utility": selectedUtility,
        "customer": selectedCustomer, "contract": selectedContract, "battery": selectedBattery, "emgen": selectedEmgen,
        "cogen": selectedCogen, "fuelcell": selectedFuel, "renewable": selectedRenewable, "solar": selectedSolar,
        "stage": selectedStage, "stage3": selectedStage3, "data": selectedData, "energy": selectedEnergy
    };
		document.getElementById('mid-table-loader').style.opacity='1';
		document.getElementById('agency-state-name-content').style.opacity='0.2';  
    request.send(JSON.stringify(requestData));
};  




function getdropdowns_State(data)
{
	data = JSON.parse(JSON.parse(data).data);
	var dropdownitems = [];
	var dropdownitems_2 = [];
	for (i = 0; i < data.length; i++) {
                dropdownitems.push(data[i].Facility_Name)
                dropdownitems_2.push(data[i].Building_Name)
            }

            dropdownitems = uniq_fast(dropdownitems)
            dropdownitems_2 = uniq_fast(dropdownitems_2)

            console.log(dropdownitems)
         /*    document.getElementById("facilityName").items = dropdownitems;
            document.getElementById("buildingName").items = dropdownitems_2; */
			 document.getElementById("facilityName_State").items = dropdownitems;
            document.getElementById("buildingName_State").items = dropdownitems_2;

/* document.getElementById("noOppurtunity").innerHTML  = 	data.length; */		
}


function createMarkers(data) {
    //data = JSON.parse(data)
	var colorsused = ["#4286f4","#f441eb","#f4414f","#41aff4","#49f441","#ebf441","#f4a041","#d0f441","#ff0080","#ff0000","#808080","#bd6769","#bdef69","#d18bfe","#10176f","#660000","#4286f4","#f441eb","#f4414f","#41aff4","#49f441","#ebf441","#f4a041","#d0f441","#ff0080","#ff0000","#808080","#bd6769","#bdef69"]
    var lngfirst;
    var latfirst;
    var array = [];
    data = JSON.parse(JSON.parse(data).data); 
	
    lngfirst = -85.41;
    latfirst = 38.82;
    latlong = data;
    console.log(latlong)
	
	for (var i = 0; i < data.length; i++)
	{
		
	if (parseInt(data[i].Longitude)&& parseInt(data[i].Latitude)){
			lngfirst = data[i].Longitude
			latfirst = data[i].Latitude
				break;
			}
			else{
			lngfirst = -85.41;
				latfirst = -85.41;
			}
	}	
			
    for (var i = 0; i < data.length; i++) {
			
			
		

        if (parseInt(data[i].Longitude)) {

            lng = parseInt(data[i].Longitude)
            lat = parseInt(data[i].Latitude)


            var x = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
            });
			
			for (var j = 0; j < globalAgency.length; j++){
			bla = colorsused[j]	
			if(data[i].Agency== globalAgency[j]) {
            x.setStyle(new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    color: bla,
					scale: '0.4',
                    crossOrigin: 'anonymous',
                    src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
                }))
            }));
		
			}
			
			
			}
			array.push(x)
			}
            

        }
    
    console.log(lng)
    console.log(array)


    var vectorSource = new ol.source.Vector({
        features: array
    });
    vectorLayer.getSource().clear()
    vectorLayer.setSource(vectorSource)
	/*       vectorLayer = new ol.layer.Vector({
			source: vectorSource
		  }); */

    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
            url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
            crossOrigin: ''
        })
    });

    console.log(lngfirst)
    console.log(latfirst)
    lngfirst = parseFloat(lngfirst)
    latfirst = parseFloat(latfirst)
    console.log(lngfirst)
    console.log(latfirst)
	/* lngfirst = lngfirst.toPrecision(2);
	latfirst = latfirst.toPrecision(2); */
    console.log(lngfirst)
    console.log(latfirst)
    lngfirst = parseFloat(lngfirst)
    latfirst = parseFloat(latfirst)
    View = map31.getView()
    console.log(View)
    View.setCenter(ol.proj.transform([lngfirst, latfirst], 'EPSG:4326', 'EPSG:3857'))
    View.setZoom(5)

}


    document.getElementById("applyButton_State").addEventListener("click", confirmFilters_State);

    document.getElementById("agency_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
   
    document.getElementById("state_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);

    document.getElementById("utility_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    
	
	
	 dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "A" }, { "key": "3", "val": "B" }, { "key": "4", "val": "C" }, { "key": "5", "val": "D" }]
            document.getElementById("dataGrade_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalData.push(dropDownnames[i].val)
            }
            document.getElementById("dataState_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "ESPC" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "UESC" }]
            document.getElementById("contractingValue_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalContract.push(dropDownnames[i].val)
            }
            document.getElementById("contract_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "NO" }, { "key": "3", "val": "YES" }]
            document.getElementById("currentCustomer_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalCustomer.push(dropDownnames[i].val)
            }
            document.getElementById("customer_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("solarFlag_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalSolar.push(dropDownnames[i].val)
            }
            document.getElementById("solar_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("batteryFlag_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalBattery.push(dropDownnames[i].val)
            }
            document.getElementById("battery_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("cogenFlag_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalCogen.push(dropDownnames[i].val)
            }
            document.getElementById("cogen_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("emgenFlag_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalEmgen.push(dropDownnames[i].val)
            }
            document.getElementById("emgen_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "0" }, { "key": "3", "val": "1" }]
            document.getElementById("fuelcellFlag_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalFuel.push(dropDownnames[i].val)
            }
            document.getElementById("fuelcell_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
            document.getElementById("stageemissionName_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalStage.push(dropDownnames[i].val)
            }
            document.getElementById("stageemission_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }]
            document.getElementById("stage3emissionName_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalStage3.push(dropDownnames[i].val)
            }
            document.getElementById("stage3_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }, { "key": "5", "val": "Yellow" }]
            document.getElementById("energyIntensity_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalEnergy.push(dropDownnames[i].val)
            }
            document.getElementById("energy_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            dropDownnames = [{ "key": "1", "val": "All" }, { "key": "2", "val": "Green" }, { "key": "3", "val": "NA" }, { "key": "4", "val": "Red" }]
            document.getElementById("renewableEnergy_State").items = dropDownnames
            for (i = 1; i < dropDownnames.length; i++) {
                globalRenewable.push(dropDownnames[i].val)
            }
            document.getElementById("renewable_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
    var dropdownitems = [];
    var dropdownitems_2 = [];
    var dropdownitems_3 = [];


    function filterdrop() {
        console.log("changed filter value");


        var agency = document.getElementById("agencyName_State").items
		selectedAgency = []
        for (i = 0; i < agency.length; i++) {
            if (agency[i].checked != undefined && agency[i].checked != false) {
				if  (agency[0].checked == true){
					selectedAgency = globalAgency;
					agency[i].checked = true
				}
				else{
                selectedAgency.push(agency[i].val);
				}
            }
        }


        var state = document.getElementById("stateName_State").items
		selectedState = []
        for (i = 0; i < state.length; i++) {
            if (state[i].checked != undefined && state[i].checked != false) {
				if (state[0].checked == true){
					selectedState = globalState;
					state[i].checked = true
				}
				else{
                selectedState.push(state[i].val);
				}

            }

        }


        var dataGrade = document.getElementById("dataGrade_State").items
		selectedData = []
        for (i = 0; i < dataGrade.length; i++) {
            if (dataGrade[i].checked != undefined && dataGrade[i].checked != false) {
                selectedData.push(dataGrade[i].val);

            }

        }
        console.log(selectedData);
		
        var contract = document.getElementById("contractingValue_State").items
		selectedContract = []
        for (i = 0; i < contract.length; i++) {
            if (contract[i].checked != undefined && contract[i].checked != false) {
                selectedContract.push(contract[i].val);

            }
        }
        var customer = document.getElementById("currentCustomer_State").items
		selectedCustomer = []
        for (i = 0; i < customer.length; i++) {
            if (customer[i].checked != undefined && customer[i].checked != false) {
                selectedCustomer.push(customer[i].val);

            }
        }
        var solar = document.getElementById("solarFlag_State").items
		selectedSolar = []
        for (i = 0; i < solar.length; i++) {
            if (solar[i].checked != undefined && solar[i].checked != false) {
                selectedSolar.push(solar[i].val);

            }

        }
        var emgen = document.getElementById("emgenFlag_State").items
		selectedEmgen = []
        for (i = 0; i < emgen.length; i++) {
            if (emgen[i].checked != undefined && emgen[i].checked != false) {
                selectedEmgen.push(emgen[i].val);

            }

        }
        var battery = document.getElementById("batteryFlag_State").items
		selectedBattery = []
        for (i = 0; i < battery.length; i++) {
            if (battery[i].checked != undefined && battery[i].checked != false) {
                selectedBattery.push(battery[i].val);

            }

        }
        var cogen = document.getElementById("cogenFlag_State").items
		selectedCogen = []
        for (i = 0; i < cogen.length; i++) {
            if (cogen[i].checked != undefined && cogen[i].checked != false) {
                selectedCogen.push(cogen[i].val);

            }

        }
        var fuelcell = document.getElementById("fuelcellFlag_State").items
		selectedFuel = []

        for (i = 0; i < fuelcell.length; i++) {
            if (fuelcell[i].checked != undefined && fuelcell[i].checked != false) {
                selectedFuel.push(fuelcell[i].val);

            }

        }
        var stageemission = document.getElementById("stageemissionName_State").items
		selectedStage = []
        for (i = 0; i < stageemission.length; i++) {
            if (stageemission[i].checked != undefined && stageemission[i].checked != false) {
                selectedStage.push(stageemission[i].val);

            }

        }
        var stage3 = document.getElementById("stage3emissionName_State").items
		selectedStage3 = []
        for (i = 0; i < stage3.length; i++) {
            if (stage3[i].checked != undefined && stage3[i].checked != false) {
                selectedStage3.push(stage3[i].val);

            }

        }
        var energy = document.getElementById("energyIntensity_State").items
		selectedEnergy = []
        for (i = 0; i < energy.length; i++) {
            if (energy[i].checked != undefined && energy[i].checked != false) {
                selectedEnergy.push(energy[i].val);

            }
        }
        var renewable = document.getElementById("renewableEnergy_State").items
		selectedRenewable = []
        for (i = 0; i < renewable.length; i++) {
            if (renewable[i].checked != undefined && renewable[i].checked != false) {
                selectedRenewable.push(renewable[i].val);

            }
        }
        console.log(selectedRenewable);
        console.log(selectedContract);


    }
	console.log('here');

	 console.log('in it');

	 
	 	
		  makeRequest('GET', '/DataTable', function (err, data) {
            console.log("success");
            console.log(data)
            result_data = JSON.parse(data)
            result_data = JSON.parse(result_data.data)
            drawTable_State(data)

            for (i = 0; i < result_data.length; i++) {
                dropdownitems.push(result_data[i].Facility_Name)
                dropdownitems_2.push(result_data[i].Building_Name)
            }

            dropdownitems = uniq_fast(dropdownitems)
            dropdownitems_2 = uniq_fast(dropdownitems_2)

            console.log(dropdownitems)
            document.getElementById("facilityName_State").items = dropdownitems;
            document.getElementById("buildingName_State").items = dropdownitems_2;





        }
        );
		
		
		
		   makeRequest('GET', '/AllData', function (err, data) {
            console.log("success");
            console.log(data)
            result_data = JSON.parse(data)
            result_data = JSON.parse(result_data.data)
            console.log(result_data)
			dropdownitems = ['All'];
			dropdownitems_2 = ['All'];
			dropdownitems_3 = ['All'];
            for (i = 0; i < result_data.length; i++) {
                dropdownitems.push(result_data[i].Agency)
				
				
				
                dropdownitems_2.push(result_data[i].State_Name)
				
				
                dropdownitems_3.push(result_data[i].Utility_Partner)
				

            }
            dropdownitems = uniq_fast(dropdownitems)
			
			for (i = 1; i < dropdownitems.length; i++) {
			globalAgency.push(dropdownitems[i].val)
			}
			
			
            dropdownitems_2 = uniq_fast(dropdownitems_2)
			
			for (i = 1; i < dropdownitems_2.length; i++) {
			globalState.push(dropdownitems_2[i].val)
			}
		
			
            dropdownitems_3 = uniq_fast(dropdownitems_3)
		
			for (i = 1; i < dropdownitems_3.length; i++) {
			globalUtility.push(dropdownitems_3[i].val)
			}
			
            console.log(dropdownitems)
            document.getElementById("agencyName_State").items = dropdownitems;
            document.getElementById("agency_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            document.getElementById("stateName_State").items = dropdownitems_2;
            document.getElementById("state_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
            document.getElementById("utilityName_State").items = dropdownitems_3;
            document.getElementById("utility_State").addEventListener("px-dropdown-checkbox-changed", filterdrop);
			
			

        }
        );
		
		 makeRequest('GET', '/chartTable_Agency', function (err, data) {
            console.log("success");
            console.log(data)
            result_data = JSON.parse(data)
            console.log(result_data)
            result_data = JSON.parse(result_data.data)
            console.log(result_data)
			globalchartdata = result_data;

            for (i = 0; i < result_data.length; i++) {
                stateNamesData.push(result_data[i].Agency)
                opportunitiesData.push(parseInt(result_data[i].Opportunities))
            }
            console.log(stateNamesData)
            console.log(opportunitiesData)
			/*dropdownitems=uniq_fast(dropdownitems) 
			dropdownitems_2=uniq_fast(dropdownitems_2)
		    
			console.log(dropdownitems)
			document.getElementById("facilityName").items=dropdownitems; 
			document.getElementById("buildingName").items=dropdownitems_2; 
			 */
            //var s1tateNamesData=["StateNames","a","b","c"]
            //var o1pportunitiesData=["Opportunities",10,20,15]
            var chart = c3.generate({
                bindto: "#chartlefttop_agency",
                data: {
                    x: 'StateNames',
                    columns: [
                        stateNamesData,
                        opportunitiesData

                    ],
                    //url: '/chartData',
                    type: 'bar',
                    labels: true
                },
                padding: {
                    bottom: 10,
                    left: 70
                },
                axis: {

                    x: {
                        type: 'category',
                        label: {
                            text: 'State Names',
                            position: 'outer-middle'
                        }
                    },
                    y: {
                        label: {
                            text: 'Opportunities',
                            position: 'outer-center'
                        }
                    },
                    rotated: true
                },
                point: {
                    show: true
                },
                bar: {
                    width: {
                        ratio: 0.8 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //dth: 100 // this makes bar width 100px
                },
                legend:
                { show: false }
            });

        });
		
		
		 var rome = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([-80.41, 28.82]))
        });

        var london = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([-85.41, 38.82]))
        });

		/*       var madrid = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat([-3.683333, 40.4]))
		  }); */

        rome.setStyle(new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                color: '#8959A8',
                crossOrigin: 'anonymous',
				scale: '0.6',
                src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
            }))
        }));

        london.setStyle(new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                color: '#4271AE',
                crossOrigin: 'anonymous',
				scale: '0.6',
                src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
            }))
        }));

		/*       madrid.setStyle(new ol.style.Style({
				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ /*({
color: [113, 140, 0],
crossOrigin: 'anonymous',
src: 'https://openlayers.org/en/v4.2.0/examples/data/dot.png'
}))
})); */


        var vectorSource = new ol.source.Vector({
            features: [rome, london]
        });

        vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        var rasterLayer = new ol.layer.Tile({
            source: new ol.source.TileJSON({
                url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
                crossOrigin: ''
            })
        });






        container = document.getElementById('popup_State')

        overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));

        map31 = new ol.Map({
            layers: [rasterLayer, vectorLayer],
            overlays: [overlay],
            target: document.getElementById('map3'),
            view: new ol.View({
                center: ol.proj.fromLonLat([-70.41, 18.82]),
                zoom: 3
            })
        });

        map31.on('pointermove', onMouseMove_State);

        closer = document.getElementById('popup-closer_State')

        closer.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };


        makeRequest('GET', '/LongLat', function (err, data) {
            console.log("success");
            console.log(data)
            


            var data = data
            createMarkers(data)
        }
        );

		
		
		
		
	
makeRequest('GET', '/regulation', function (err, data) {
console.log("success");
console.log(data)
// var data = data;
// createMarkers(data)
drawTable_policy(data)
}
);






 
 
 
 function drawTable_policy(data) {
    data = JSON.parse(JSON.parse(data).data);
    var nameMapping = {
        State: "State",
        Name: "Policy Link",
      
        
    };

    var keys = d3.keys(nameMapping);

    var table = d3.select("#table_policy");
    table.selectAll("*").remove();

    // var ths = theads.selectAll('th').data(keys).enter().append("th").text(function(d) {
    //     return nameMapping[d];
    // });

    var tbodies = table.append("tbody");
    var rows = tbodies.selectAll("tr").data(data);
    rows = rows.enter().append("tr");

    var dataCells = rows.selectAll("td")
        .data(function (d) {
            var values = d3.keys(nameMapping).map(function (key) {
                return d[key];
            });
            return values;
        });
    dataCells.enter().append("td").text(function (d, i) {
        return d;
    });
};
 
} 

function agencyOvrview() {
                
                var opportunitiesData = ['Opportunities'];
    var stateNamesData = ['StateNames'];
                
    makeRequest('GET', '/scorecard', function (err, data) {
        result_data = JSON.parse(data)
        result_data = JSON.parse(result_data.data)
        drawTable_avgScoreCard(result_data);
    });
    
    function drawTable_avgScoreCard(data) {
        //data = JSON.parse(JSON.parse(data).data);
        console.log(data);
        var nameMapping = {
            Agency: "Agency",
            Total_Score: "Score",
            Count: "Count Of Facilities"
        };
        var keys = d3.keys(nameMapping);
        var table = d3.select("#agency_avgscore");
        table.selectAll("*").remove();
        var tbodies = table.append("tbody");
        var rows = tbodies.selectAll("tr").data(data);
        rows = rows.enter().append("tr");

        var dataCells = rows.selectAll("td")
            .data(function (d) {
               var values = d3.keys(nameMapping).map(function (key) {
                    return d[key];
                });
                return values;
            });
        dataCells.enter().append("td").text(function (d, i) {
            return d;
        });
    };
                
                makeRequest('GET', '/chartTable_Agency', function (err, data) {
            console.log("success");
            console.log(data)
            result_data = JSON.parse(data)
            console.log(result_data)
            result_data = JSON.parse(result_data.data)
            console.log(result_data)
                                                globalchartdata = result_data;

            for (i = 0; i < result_data.length; i++) {
                stateNamesData.push(result_data[i].Agency)
                opportunitiesData.push(parseInt(result_data[i].Opportunities))
            }
            console.log(stateNamesData)
            console.log(opportunitiesData)
                                                /*dropdownitems=uniq_fast(dropdownitems) 
                                                dropdownitems_2=uniq_fast(dropdownitems_2)
                                    
                                                console.log(dropdownitems)
                                                document.getElementById("facilityName").items=dropdownitems; 
                                                document.getElementById("buildingName").items=dropdownitems_2; 
                                                 */
            //var s1tateNamesData=["StateNames","a","b","c"]
            //var o1pportunitiesData=["Opportunities",10,20,15]
            var chart = c3.generate({
                bindto: "#chartlefttop_agencyoverview",
                data: {
                    x: 'StateNames',
                    columns: [
                        stateNamesData,
                        opportunitiesData

                    ],
                    //url: '/chartData',
                    type: 'bar',
                    labels: true
                },
                padding: {
                    bottom: 10,
                    left: 70
                },
                axis: {

                    x: {
                        type: 'category',
                        label: {
                            text: 'State Names',
                            position: 'outer-middle'
                        }
                    },
                    y: {
                        label: {
                            text: 'Opportunities',
                            position: 'outer-center'
                        }
                    },
                    rotated: true
                },
                point: {
                    show: true
                },
                bar: {
                    width: {
                        ratio: 0.8 // this makes bar width 50% of length between ticks
                    }
                                                                                
                    // or
                    //dth: 100 // this makes bar width 100px
                },
                legend:
                { show: false }
            });

        });
                

}
