// includes
var oCase = require('../model/object/Case');
var oItem_BD = require('../persistance/Item_BD'); // devra disparaitre a
// terme...
var mongoose = require('mongoose');
var oDatabase = require('../model/database');
/**
 * CASE : COMMUNICATION SERVEUR <-> BD
 * 
 * @class Case_BD
 */
function Case_BD() {
	if (false === (this instanceof Case_BD)) {
		return new Case_BD();
	}
};


/**
 * ENVOIE UNE CASE POUR METTRE A JOUR CES PROPRIETES
 * 
 * @method SetCase
 */

/*
 * CREATION D'UNE NOUVELLE CASE DANS LA BD
 * 
 * @method Creation
 */
Case_BD.Creation = function(caseToSave, callSetCase) {
	var CaseModel = mongoose.model('Case');
	var newCase = new CaseModel();

	newCase.id = caseToSave.id;
	newCase.nom = caseToSave.nom;
	newCase.description = caseToSave.description;
	newCase.probaObjet = caseToSave.probaObjet;
	newCase.probaCache = caseToSave.probaCache;
	newCase.nbrGoules = caseToSave.nbrGoules;
	newCase.listeItem = caseToSave.listeItem;
	newCase.pathImg = caseToSave.pathImg;

	newCase.save(function(err) {
		if (err) {
			throw err;
			console.log("CASE_BD : Creation() : ERREUR ");
		}

		console.log('CASE_BD : Creation de case réussie !');

	});
},

/**
 * RENVOI UNE CASE AVEC SON ID PASSE EN PARAMETRE
 * 
 * @method GetCaseById
 */
Case_BD.GetCaseById = function(idCase, callbackGetCase) {
	var caseModel = mongoose.model('Case');
	console.log("CASE_BD : GetCaseById: id case demandé : " + idCase);
	
	var query = caseModel.find(null);
	query.where('id', idCase);
	query.exec(function (err, currentCase) {
		
		if (err) {throw err;}
		
		if (typeof currentCase[0] === "undefined") {
			console.log("Get Case : undefined");
			callbackGetCase(-1);
			
		} else {
			// case récupérée
			var caseRecup = new oCase(currentCase[0]._id,
					currentCase[0].id, 			currentCase[0].nom,
					currentCase[0].description, currentCase[0].probaObjet,
					currentCase[0].probaCache,	currentCase[0].nbrGoules,
					currentCase[0].listeItem, 	currentCase[0].pathImg);

			// log
			console.log("CASE_BD : GetCase() : CALLBACK");

			// renvoi de la case
			callbackGetCase(caseRecup);
		}
	});
},

// ***************************************** TO TRASH SOON
// *****************************
// --- ATTRIBUTS DE CLASSE ---
//Case_BD.listeCases;

/*
 * RENVOI LA CASE SUIVANT L'ID PASSE EN PARAMATRE return : case erreur : null
 */
/*Case_BD.GetCaseById = function(idCase) {
	if (idCase < 12)
		return this.listeCases[idCase];
	else
		return null;
},*/

/**
 * CREE UNE LISTE DE CASE
 * 
 * @method Initialiser
 */
Case_BD.Initialiser = function() {
	// vide la BD
	
	
	//
	console.log("CASE_BD : ajout des cases dans la BD");
	var array1 = [ oItem_BD.GetItemById(100), oItem_BD.GetItemById(200),
			oItem_BD.GetItemById(300), oItem_BD.GetItemById(401),
			oItem_BD.GetItemById(502), oItem_BD.GetItemById(503) ];
	var array2 = [ oItem_BD.GetItemById(102), oItem_BD.GetItemById(201),
			oItem_BD.GetItemById(303), oItem_BD.GetItemById(601) ];
	var array3 = [ oItem_BD.GetItemById(101), oItem_BD.GetItemById(203),
			oItem_BD.GetItemById(402), oItem_BD.GetItemById(603) ];
	var array4 = [ oItem_BD.GetItemById(103), oItem_BD.GetItemById(202),
			oItem_BD.GetItemById(403), oItem_BD.GetItemById(601) ];
	
	/*
	 * this.id = id; this.nom = nom; this.description = description;
	 * this.probaObjet = probaObjet; this.probaCache = probaCache;
	 * this.nbrGoules = nbrGoules; this.listeItem = listeItem; this.pathImg =
	 * pathImg;
	 */
	 
	var case1 = new oCase(0, 0, "E11", "Une mini salle", 20, 50, 1, array1,
			"public/map/0-0.png");
	var case2 = new oCase(0, 1, "E12", "Une petite salle", 24, 54, 2, array2,
			"public/map/2-0.png");
	var case3 = new oCase(0, 2, "E13", "Une moyenne salle", 47, 50, 3, array3,
			"public/map/0-1.png");
	var case4 = new oCase(0, 3, "E14", "Une grande salle", 47, 45, 4, array2,
			"public/map/1-1.png");
	var case5 = new oCase(0, 4, "E15", "Une géante salle", 0, 21, 5, array2,
			"public/map/2-1.png");
	var case6 = new oCase(0, 5, "E16", "Une salle sale", 75, 12, 2, array1,
			"public/map/0-2.png");
	var case7 = new oCase(0, 6, "E17", "Une salle sale", 75, 12, 3, array1,
			"public/map/1-2.png");
	var case8 = new oCase(0, 7, "E18", "Une salle sale", 75, 12, 6, array1,
			"public/map/2-2.png");
	var case9 = new oCase(0, 8, "E19", "Une salle sale", 75, 12, 1, array1,
			"public/map/0-4.png");
/*
	var caseModel = mongoose.model('Case');
	caseModel.remove(true, function(err) {
		if (err) {
			throw err;
		}
		console.log('Cases supprimés !');
	});
	this.Creation(case1);
	this.Creation(case2);
	this.Creation(case3);
	this.Creation(case4);
	this.Creation(case5);
	this.Creation(case6);
	this.Creation(case7);
	this.Creation(case8);
	this.Creation(case9);
	*/
	// this.listeCases = new Array(case1, case2, case3, case4, case5, case6,
	// case7, case8, case9);// case10, case11);
},

Case_BD.GetCasesId = function() {
	var tabId = new Array();
	/*for ( var i in this.listeCases) {
		tabId[i] = this.listeCases[i].id;
	}*/
	for(var i = 0; i<9; i++) tabId[i] = i; 

	return tabId;
},

/*******************************************************************************
 * *** TRASH
 * 
 * 
 * AJOUTER UN ITEM A UNE CASE
 * 
 * Case_BD.AjouterItem = function(id_case, item) {
 * this.listeCases[id_case].ajouterItem(id_item); UpdateSalle(id_case); }, /*
 * SUPPRIME UN ITEM D'UNE CASE
 * 
 * Case_BD.SupprObjet = function(id_case, item) {
 * this.listeCases[id_case].supprimerItem(item); UpdateSalle(id_case); },
 * 
 */


// ///// traitement de la liste des items
// récupèration de la liste des id d'items
/*
 * var listeIdItems = caseRecup.listeItems; caseRecup.listeItems =
 * new Array(); for (var i = 0; i < listeIdItems.length; i++) {
 * caseRecup.listeItems.push(oItem_BD.GetItemById(listeIdItems[i]));
 * console.log("CASE_BD : GetCaseById : item chargé : " +
 * caseRecup.listeItems[i].nom); }
 */
module.exports = Case_BD;