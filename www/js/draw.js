/****** INIT ******/ 
function initApp() {
	app.currentLogDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    app.store.getEquation(function(e) {
    	app.equation = e;
    	if(typeof app.equation!=="undefined" && app.equation!=null) {
    		app.equation.equationItemsArray = (typeof app.equation.equationItems !== "undefined" && app.equation.equationItems != null?app.equation.equationItems.split(";"):new Array(0));
    	}
        if(typeof e !== "undefined" && e != null) {
        	$('#foodLink, #fitnessLink, #weightLink').show();
        	drawLogs();
        } else {
        	$('#foodLink, #fitnessLink, #weightLink').hide();
        	drawOptions();
        }
    });
}
function getEquationItemsArray() {
	if(typeof app.equation!=="undefined" && app.equation!=null && typeof app.equation.equationItemsArray!=="undefined" && app.equation.equationItemsArray!=null) {
		return app.equation.equationItemsArray;
	}
	return Array(0);
}

/****** OPTIONS ******/
function drawOptions() {
	app.currentPage = "options";
	$('div.main').load("templates/options.html", function() {
		drawEquations();
	});
}
// Options Functions
function drawEquations() {
	app.store.getEquations(function(equations) {
		if(equations!=null && equations.length>0) {
			$('#equations').empty();
			for(var i=0; i<equations.length; i++) {
				$('#equations').append('<li>'+(equations[i].active=="Y"?'<span class="green">(Active)</span> ':'<a href="#" onclick="makeActive('+equations[i].id+'); return false"><span class="red">(Inactive)</span></a> ')+'<span class="white">'+equations[i].id+":</span> "+equations[i].equation+" <a href=\"#\" onclick=\"removeEquation("+equations[i].id+")\">[Remove]</a></li>");
			}
		} else {
			$('#equations').empty().append('<li><span class="red">Please enter an equation below.</span></li>');
		}
	});
}
function addEquation() {
	var equation = $('#newEquation').val();
	if(typeof equation === "undefined" || equation.trim() == "") alert("Please enter an equation!");
	app.store.deactivateEquations();
	var equation = createEquation(-1, "Y", equation);
	app.store.insertEquation(equation);
	app.equation = equation;
	if(typeof app.equation!=="undefined" && app.equation!= null) {
		app.equation.equationItemsArray = (typeof app.equation.equationItems !== "undefined" && app.equation.equationItems != null?app.equation.equationItems.split(";"):new Array(0));
	}
	$('#foodLink, #fitnessLink, #weightLink').show();
	drawEquations();
}
function removeEquation(id) {
	var c = confirm("Are you sure you want to remove equation #"+id+"?");
	if(c == true) {
		app.store.removeEquation(id);
		app.store.getEquation(function(e) {
        	app.equation = e;
	        if(typeof e !== "undefined" && e != null) {
	        	$('#foodLink, #fitnessLink, #weightLink').show();
	        } else {
	        	$('#foodLink, #fitnessLink, #weightLink').hide();
	        	drawOptions();
	        }
        });
		drawEquations();
	}
}
function makeActive(id) {
	app.store.deactivateEquations();
	app.store.activateEquation(id);
	$('#foodLink, #fitnessLink, #weightLink').show();
	drawEquations();
}

/****** LOG ******/
function drawLogs() {
	app.currentPage = "logs";
	$('div.main').load("templates/logs.html", function() {
		drawFoodLogs();
	});
}
function drawFoodLogs(date) {
	try {
		if(!dateCheck(date))
			date = new Date().toISOString().slice(0, 19).replace('T', ' ');
	} catch(err) {
		date = new Date().toISOString().slice(0, 19).replace('T', ' ');
	}
	app.currentLogDate = date;
	var dateObj = new Date(date);
	var prevDate = new Date(date);
	prevDate.setDate(prevDate.getDate()-1);
	var nextDate = new Date(date);
	nextDate.setDate(nextDate.getDate()+1);
	
	$('h2.dateFormat').html('<a href="#" onclick="drawFoodLogs(\''+prevDate.toISOString().slice(0, 19).replace('T', ' ')+'\'); return false;">[Prev]</a> '+staticDays[dateObj.getDay()]+" "+staticMonthsAbbr[dateObj.getMonth()]+" "+dateObj.getDate()+", "+dateObj.getFullYear()+' <a href="#" onclick="drawFoodLogs(\''+nextDate.toISOString().slice(0, 19).replace('T', ' ')+'\'); return false;">[Next]</a>');
}

/****** FOOD ENTRY ******/
function drawFoodEntry() {
	app.currentPage = "addFood";
	$('div.main').load("templates/addFood.html", function() {
		drawFoodForm();
	});
}
function drawFoodForm() {
	var appEquation = getEquationItemsArray(); 
	for(var i=0; i<appEquation.length; i++) {
		$('#'+appEquation[i]+"LI").addClass('show');
	}
}
function addFoodEntry() {
	var foodItem = createFoodItem(-1, vendorID, siteID, name, calories, fatCalories, fat, satFat, transFat, cholesterol, sodium, carbohydrates, fiber, sugars, protein);
}