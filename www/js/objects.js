function createVendor(id, siteVendorID, name) {
	var vendor = new Object();
	vendor.id = (typeof id!=="undefined"?id:"");
	vendor.siteVendorID = (typeof siteVendorID!=="undefined"?siteVendorID:-1);
	vendor.name = (typeof name!=="undefined"?name:"Please Enter Name");
	return vendor;
}

function createFoodItem(id, vendorID, siteID, name, calories, fatCalories, fat, satFat, transFat, cholesterol, sodium, carbohydrates, fiber, sugars, protein) {
	var foodItem = new Object();
	foodItem.id = (typeof id!=="undefined"?id:"");
	foodItem.vendorID = (typeof vendorID!=="undefined"?vendorID:"");
	foodItem.siteID = (typeof siteID!=="undefined"?siteID:-1);
	foodItem.name = (typeof name!=="undefined"?name:"Please Enter Name");
	foodItem.calories = (typeof calories!=="undefined"?calories:0);
	foodItem.fatCalories = (typeof fatCalories!=="undefined"?fatCalories:0);
	foodItem.fat = (typeof fat!=="undefined"?fat:0);
	foodItem.satFat = (typeof satFat!=="undefined"?satFat:0);
	foodItem.transFat = (typeof transFat!=="undefined"?transFat:0);
	foodItem.cholesterol = (typeof cholesterol!=="undefined"?cholesterol:0);
	foodItem.sodium = (typeof sodium!=="undefined"?sodium:0);
	foodItem.carbohydrates = (typeof carbohydrates!=="undefined"?carbohydrates:0);
	foodItem.fiber = (typeof fiber!=="undefined"?fiber:0);
	foodItem.sugars = (typeof sugars!=="undefined"?sugars:0);
	foodItem.protein = (typeof protein!=="undefined"?protein:0);
	return foodItem;
}

function createFoodEntry(id, day, foodID, quantity) {
	var fe = new Object();
	fe.id = (typeof id!=="undefined"?id:-1);
	fe.day = (typeof day!=="undefined"?day:new Date().toISOString().slice(0, 19).replace('T', ' '));
	fe.foodID = (typeof foodID!=="undefined"?foodID:-1);
	fe.quantity = (typeof quantity!=="undefined"?quantity:1);
	return fe;
}

function createEntryPoints(id, foodEntryID, equationID, equationPoints) {
	var ep = new Object();
	ep.id = (typeof id!=="undefined"?id:"");
	ep.foodEntryID = (typeof day!=="undefined"?foodEntryID:-1);
	ep.equationID = (typeof equationID!=="undefined"?equationID:-1);
	ep.equationPoints = (typeof equationPoints!=="undefined"?equationPoints:0);
	return ep;
}

function createEquation(id, active, equation, equationItems) {
	var e = new Object();
	e.id = (typeof id!=="undefined"?id:"");
	e.active = (typeof active!=="undefined"?active:"N");
	e.equation = (typeof equation!=="undefined"?equation:"");
	e.equationItems = (typeof equationItems!=="undefined"?equationItems:buildEquationItems(e.equation));
	return e;
}

function undefinedCheck(z) {
	for(var i in z) {
		console.log("z:"+i+" "+z[i])
		if(typeof  z[i] === "undefined") z[i] = "";
	}
	return z;
}

function dateCheck(date) {
	if(typeof date === "undefined" || date == null)
		return false;
	if(date.length == 19 && date.split(" ").length == 2) {
		var dateParts = date.split(" ");
		if(dateParts[1].split(":").length != 3)
			return false;
		 date = dateParts[0];
	}
	if(date.length == 10) {
		var errorFound = false;
		var dateParts = date.split("-");
		var year = parseInt(dateParts[0]);
		var month = parseInt(dateParts[1]);
		var day = parseInt(dateParts[2]);
		if(year < 1000 || year > 3000) errorFound = true;
		if(month < 1 || month > 12) errorFound = true;
		if(day < 1 || month > 31) errorFound = true;
		return !errorFound;
	}
	return false;
}

function buildEquationItems(equation) {
	var equationItems = "";
	var lEQ = equation.toLowerCase();
	for(var i = 0; i < equationNutrition.length; i++) {
		var check = lEQ.indexOf(equationNutrition[i].toLowerCase());
		if(check>-1) {
			lEQ = lEQ.replace(equationNutrition[i].toLowerCase(), "");
			equationItems += (equationItems==""?"":";")+equationNutrition[i];
		}
	}
	return equationItems;
}

var equationNutrition = ['fatCal', 'satFat', 'transFat', 'cal', 'fat', 'chol', 'sodium', 'carb', 'fiber', 'sugar', 'protein'];
var staticMonthsAbbr = ["Jan","Feb","March","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
var staticDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];