// includes
var oCase = require('../model/object/Case');

/**
 * MODELISATION DE LA BD CONTENANT TOUTES LES CASES
 * 
 * @class Case_BD
 */
function Case_BD() {
	if (false === (this instanceof Case_BD)) {
		return new Case_BD();
	}
};

//--- ATTRIBUTS DE CLASSE ---
Case_BD.listeCases;

/**
 * CREE UNE LISTE DE CASE
 * 
 * @method Initialiser
 */
Case_BD.Initialiser = function() {
	console.log("CASE_BD : initialisation liste cases");
	var case1 = new oCase(1, "E11", "Une mini salle", 20, 50, 40);
	var case2 = new oCase(2, "E12", "Une petite salle", 24, 54, 20);
	var case3 = new oCase(3, "E13", "Une moyenne salle", 47, 50, 32);
	var case4 = new oCase(4, "E14", "Une grande salle", 47, 45, 40);
	var case5 = new oCase(5, "E15", "Une géante salle", 0, 21, 100);
	var case6 = new oCase(6, "E16", "Une salle sale", 75, 12, 4);
	var case7 = new oCase(6, "E17", "Une salle sale", 75, 12, 4);
	var case8 = new oCase(6, "E18", "Une salle sale", 75, 12, 4);
	var case9 = new oCase(6, "E19", "Une salle sale", 75, 12, 4);
	var case10 = new oCase(6, "E20", "Une salle sale", 75, 12, 4);
	var case11 = new oCase(6, "E21", "Une salle sale", 75, 12, 4);
	
	var arr = ["this is the first element", "this is the second element"];
	console.log(arr[0]);              // prints "this is the first element"
	console.log(arr[1]);              // prints "this is the second element"
	
	
	this.listeCases = new Array(case1, case2, case3, case4, case5, case6, case7, case8, case9, case10, case11);
},

Case_BD.GetCaseById = function(idCase)
{
	if (idCase < 12)
		return this.listeCases[idCase];
	else
		return null;
},


module.exports = Case_BD;