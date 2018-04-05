var WebSqlStore = function(successCallback, errorCallback) {

    this.initializeDatabase = function(successCallback, errorCallback) {
        var self = this;
        this.db = window.openDatabase("PointsTrackerDB", "1.0", "Points Tracker DB", 200000);
        this.db.transaction(
            function(tx) {
                self.createTables(tx);
            },
            function(error) {
                console.log('Transaction error: ' + error);
                if (errorCallback) errorCallback();
            },
            function() {
                console.log('Transaction success');
                if (successCallback) successCallback();
            }
        )
    }

	this.createTables = function(tx) {
		//Ex. round((cal+ (4 * sugar) + (9 * satFat) - (3.2 * protein))/33))
		//tx.executeSql('DROP TABLE IF EXISTS foodEntry');
		var sql = "CREATE TABLE IF NOT EXISTS vendors ( " +
				"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"dateAdded DATE, " +
				"siteVendorID INTEGER, " +
				"name VARCHAR(255))";
		tx.executeSql(sql, null,
        		function() {
					console.log('Create vendors Success');
				},
        		function(tx, error) {
					alert('Create vendors Error: ' + error.message);
				});
		
		sql = "CREATE TABLE IF NOT EXISTS foodItems ( " +
				"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"vendorID INTEGER, " +
				"siteID INTEGER, " +
				"name VARCHAR(255), " +
				"categoryID INTEGER, " +
				"calories DECIMAL(10,4), " +
				"fatCalories DECIMAL(10,4), " +
				"fat DECIMAL(10,4), " +
				"satFat DECIMAL(10,4), " +
				"transFat DECIMAL(10,4), " +
				"cholesterol DECIMAL(10,4), " +
				"sodium DECIMAL(10,4), " +
				"carbohydrates DECIMAL(10,4), " +
				"fiber DECIMAL(10,4), " +
				"sugars DECIMAL(10,4), " +
				"protein DECIMAL(10,4))";
		tx.executeSql(sql, null,
        		function() {
					console.log('Create foodItems Success');
				},
        		function(tx, error) {
					alert('Create foodItems Error: ' + error.message);
				});
		
		sql = "CREATE TABLE IF NOT EXISTS equations ( " +
				"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"active VARCHAR(1), " +
				"equation VARCHAR(255), " +
				"equationItems VARCHAR(255))";
		tx.executeSql(sql, null,
        		function() {
					console.log('Create equations Success');
				},
        		function(tx, error) {
					alert('Create equations Error: ' + error.message);
				});
		
		sql = "CREATE TABLE IF NOT EXISTS foodEntry ( " +
				"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"dateAdded DATE, " +
				"quantity DECIMAL(10,4), " +
				"foodID INTEGER)";
		tx.executeSql(sql, null,
        		function() {
					console.log('Create foodEntry Success');
				},
        		function(tx, error) {
					alert('Create foodEntry Error: ' + error.message);
				});
		
		sql = "CREATE TABLE IF NOT EXISTS entryPoints ( " +
				"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"foodEntryID INTEGER, " +
				"equationID INTEGER, " +
				"equationPoints DECIMAL(10,4))";
		tx.executeSql(sql, null,
        		function() {
					console.log('Create entryPoints Success');
				},
        		function(tx, error) {
					alert('Create entryPoints Error: ' + error.message);
				});
		
		sql = "CREATE TABLE IF NOT EXISTS categories ( " +
				"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"dateAdded DATE, " +
				"name VARCHAR(255))";
		tx.executeSql(sql, null,
        		function() {
					console.log('Create entryPoints Success');
				},
        		function(tx, error) {
					alert('Create entryPoints Error: ' + error.message);
				});
	}

	this.insertFoodItem = function(f) {
		f = undefinedCheck(f);
		this.db.transaction(
			function(tx) {
				var sql = "";
				var vendorID = f.vendorID;
				if(vendorID<0 && f.vendorName != null && f.vendorName.trim() != "") {
					if(f.siteVendorID === "undefined") f.siteVendorID = null;
					if(f.vendorName === "undefined") f.vendorName = null;
					sql = "INSERT INTO vendors " +
							"(siteVendorID, name) " +
							"VALUES (?, ?)";
					tx.executeSql(sql, [f.siteVendorID, f.vendorName],
							function() {
								console.log('INSERT vendor Success:' + f.vendorName);
							},
							function(tx, error) {
								alert('INSERT vendor Error: ' + error.message);
							});
				}
				sql = "INSERT INTO foodItems " +
						"(vendorID, siteID, name, calories, fatCalories, fat, satFat, transFat, cholesterol, sodium, carbohydrates, fiber, sugars, protein) " +
						"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      
				tx.executeSql(sql, [f.vendorID, f.siteID, f.name, f.calories, f.fatCalories, f.fat, f.satFat, f.transFat, f.cholesterol, f.sodium, f.carbohydrates, f.fiber, f.sugars, f.protein],
					function() {
						console.log('INSERT foodItem Success:' + f.name);
					},
					function(tx, error) {
						alert('INSERT foodItem Error: ' + error.message);
					});
			},
        	function(error) {
            	alert("Transaction foodItem Error: " + error.message);
        	}
		);
	}

    this.findFoodByName = function(searchKey, callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT f.id, f.vendorID, f.siteID, f.name, f.calories, f.fatCalories, f.fat, f.satFat, f.transFat, f.cholesterol, f.sodium, f.carbohydrates, f.fiber, f.sugars, f.protein " +
                    "FROM foodItems f " +
                    "WHERE f.name LIKE ? " +
                    "ORDER BY f.name";
                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        foods = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        foods[i] = results.rows.item(i);
                    }
                    callback(foods);
                });
            },
            function(error) {
                alert("Transaction FoodName Error: " + error.message);
            }
        );
    }

    this.findFoodById = function(id, callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT f.id, f.vendorID, v.name, f.siteID, f.siteVendorID, f.name, f.calories, f.fatCalories, f.fat, f.satFat, f.transFat, f.cholesterol, f.sodium, f.carbohydrates, f.fiber, f.sugars, f.protein " +
                    "FROM foodItems f " +
                    "LEFT JOIN vendors v ON f.vendorID = v.id " +
                    "WHERE f.id=:id";
                tx.executeSql(sql, [id], function(tx, results) {
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alert("Transaction FoodID Error: " + error.message);
            }
        );
    };
    
    this.findVendorByExactName = function(name, callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT v.id, v.siteVendorID, v.name, COUNT(f.id) " +
                    "FROM vendors v " +
                    "LEFT JOIN foodItems f ON f.vendorID = v.id " +
                    "WHERE v.name = ? " +
                    "ORDER BY v.name";
                tx.executeSql(sql, [name], function(tx, results) {
                	console.log(results);
					callback(results.rows.length === 1 ? results.rows.item(0) : null);
				});
            },
            function(error) {
                alert("Transaction VendorExactName Error: " + error.message);
            }
        );
    }
    
    this.findVendorByName = function(searchKey, callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT v.id, v.siteVendorID, v.name " +
                    "FROM vendors v " +
                    "WHERE v.name LIKE ? " +
                    "ORDER BY v.name";
                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        vendors = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        vendors[i] = results.rows.item(i);
                    }
                    callback(vendors);
                });
            },
            function(error) {
                alert("Transaction VendorName Error: " + error.message);
            }
        );
    }
    
    this.insertVendor = function(v) {
    	v = undefinedCheck(v);
		if(v.name == null || v.name.trim() == "") return;
		this.db.transaction(
			function(tx) {
				var sql = "INSERT INTO vendors " +
						"(siteVendorID, name) " +
						"VALUES (?, ?)";
				tx.executeSql(sql, [v.siteVendorID, v.name],
						function() {
							console.log('INSERT vendor Success:' + v.name);
						},
						function(tx, error) {
							alert('INSERT vendor Error: ' + error.message);
						});
			},
			function(error) {
                alert("Transaction VendorName Error: " + error.message);
            }
		);
    }
    
    this.getEquations = function(callback) {
    	this.db.transaction(
			function(tx) {
				var sql = "SELECT e.id, e.active, e.equation, e.equationItems " +
						"FROM equations e " +
	                    "ORDER BY e.id";
				tx.executeSql(sql, null, function(tx, results) {
					var len = results.rows.length,
						equations = [],
						i = 0;
					for (; i < len; i = i + 1) {
						equations[i] = results.rows.item(i);
					}
					callback(equations);
				});
            },
            function(error) {
                alert("Transaction Equations Error: " + error.message);
            }
    	);
    }
    
    this.getEquation = function(callback) {
    	this.db.transaction(
			function(tx) {
				var sql = "SELECT e.id, e.equation, e.equationItems " +
						"FROM equations e " +
						"WHERE e.active = 'Y' "
	                    "ORDER BY e.id";
				tx.executeSql(sql, null, function(tx, results) {
					callback(results.rows.length === 1 ? results.rows.item(0) : null);
				});
            },
            function(error) {
                alert("Transaction Equation Error: " + error.message);
            }
    	);
    }
    
    this.activateEquation = function(id) {
    	try {
    		id = parseInt(id);
    	} catch(err) {
    		alert('Issue Activating Equation: '+id);
    		return;
    	}
    	this.db.transaction(
			function(tx) {
				var sql = "UPDATE equations SET active='Y' WHERE id=?";
				tx.executeSql(sql, [id],
					function() {
	                    console.log('UPDATE Activated Equation Success');
	                },
	                function(tx, error) {
	                    alert('UPDATE Activated Equation Error: ' + error.message);
	                })
            },
            function(error) {
                alert("Transaction Activated Equation Error: " + error.message);
            }
    	);
    }
    
    this.deactivateEquations = function() {
    	this.db.transaction(
			function(tx) {
				var sql = "UPDATE equations SET active='N'";
				tx.executeSql(sql, null,
					function() {
	                    console.log('UPDATE Equations Deactivated Success');
	                },
	                function(tx, error) {
	                    alert('UPDATE Equations Deactivated Error: ' + error.message);
	                })
            },
            function(error) {
                alert("Transaction Equations Deactivated Error: " + error.message);
            }
    	);
    }
    
    this.removeEquation = function(id) {
    	try {
    		id = parseInt(id);
    	} catch(err) {
    		alert('Issue Removing Equation: '+id);
    		return;
    	}
    	this.db.transaction(
			function(tx) {
				var sql = "DELETE FROM equations WHERE id=?";
				tx.executeSql(sql, [id],
					function() {
	                    console.log('DELETED Equation '+id+' Success');
	                },
	                function(tx, error) {
	                    alert('DELETED Equation Error: ' + error.message);
	                })
            },
            function(error) {
                alert("Transaction Equations Deactivated Error: " + error.message);
            }
    	);
    }
    
    this.insertEquation = function(e) {
    	e = undefinedCheck(e);
    	console.log(e.equation);
		if(e.equation == null || e.equation.trim() == "") return;
		this.db.transaction(
			function(tx) {
				var sql = "INSERT INTO equations " +
						"(active, equation, equationItems) " +
						"VALUES (?, ?, ?)";
				if(e.active != "Y") e.active = "N";
				tx.executeSql(sql, [e.active, e.equation, e.equationItems],
					function() {
						console.log('INSERT equation Success:' + e.name);
					},
					function(tx, error) {
						alert('INSERT equation Error: ' + error.message);
					});
			},
			function(error) {
                alert("Transaction Equation Error: " + error.message);
            }
		);
    }
    
    this.getFoodEntries = function(date, callback) {
    	this.db.transaction(
			function(tx) {
				var sql = "SELECT fe.id, fe.foodID, fe.quantity, f.name, ep.equationPoints, v.name AS vendorName " +
	                    "FROM foodEntry fe, foodItems f " +
	                    "LEFT JOIN entryPoints ep f ON ep.foodEntryID = fe.id " +
	                    "LEFT JOIN vendors v ON f.vendorID = v.id " +
	                    "WHERE fe.foodID = f.id fe.dateAdded = ? " +
	                    "ORDER BY fe.dateAdded";
				tx.executeSql(sql, null, function(tx, results) {
					var len = results.rows.length,
						foodEntries = [],
						i = 0;
					for (; i < len; i = i + 1) {
						foodEntries[i] = results.rows.item(i);
					}
					callback(foodEntries);
				});
            },
            function(error) {
                alert("Transaction FoodLog Error: " + error.message);
            }
    	);
    }

    this.initializeDatabase(successCallback, errorCallback);
}