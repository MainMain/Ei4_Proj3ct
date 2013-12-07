// includes
var oCase = require('../model/object/Case');
var oItem_BD = require('../persistance/Item_BD');
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
	var array1 = [oItem_BD.GetItemById(1), oItem_BD.GetItemById(2),
		oItem_BD.GetItemById(3), oItem_BD.GetItemById(4), oItem_BD.GetItemById(14), oItem_BD.GetItemById(15), oItem_BD.GetItemById(16)];
	var array2 = [oItem_BD.GetItemById(5), oItem_BD.GetItemById(6), 
		oItem_BD.GetItemById(7), oItem_BD.GetItemById(8)];
	var array3 = [oItem_BD.GetItemById(9), oItem_BD.GetItemById(10), 
		oItem_BD.GetItemById(11), oItem_BD.GetItemById(12)];
	var array4 = [oItem_BD.GetItemById(10), oItem_BD.GetItemById(11),
		oItem_BD.GetItemById(12), oItem_BD.GetItemById(13)];
	var case1 = new oCase(0, "E11", "Une mini salle", 20, 50, 40, array1);
	var case2 = new oCase(1, "E12", "Une petite salle", 24, 54, 20, array2);
	var case3 = new oCase(2, "E13", "Une moyenne salle", 47, 50, 32, array3);
	var case4 = new oCase(3, "E14", "Une grande salle", 47, 45, 40, array2);
	var case5 = new oCase(4, "E15", "Une géante salle", 0, 21, 100, array2);
	var case6 = new oCase(5, "E16", "Une salle sale", 75, 12, 4, null);
	var case7 = new oCase(6, "E17", "Une salle sale", 75, 12, 4, null);
	var case8 = new oCase(7, "E18", "Une salle sale", 75, 12, 4, null);
	var case9 = new oCase(8, "E19", "Une salle sale", 75, 12, 4, null);
	var case10 = new oCase(9, "E20", "Une salle sale", 75, 12, 4, null);
	var case11 = new oCase(10, "E21", "Une salle sale", 75, 12, 4, null);
	
	this.listeCases = new Array(case1, case2, case3, case4, case5, case6, case7, case8, case9, case10, case11);
},

/*
 * RENVOI LA CASE SUIVANT L'ID PASSE EN PARAMATRE
 * return : case
 * erreur : null
 */
Case_BD.GetCaseById = function(idCase)
{
	if (idCase < 12)
		return this.listeCases[idCase];
	else
		return null;
},


/**
 * ACTUALISE LA CASE EN COURS.  DOIT ÊTRE DÉCLENCHÉE QUAND LE SERVEUR RELÈVE UN
 * ... ... CHANGEMENT FAITE PAR UN AUTRE JOUEUR
 * 
 * @method ActualiserCase
 */
Case_BD.ActualiserCase = function(idCase) {
	// chercher infos dans la BD
},


/**
 * UPDATE EN BD LA CASE EN COURS. DOIT ÊTRE DÉCLENCHÉE QUAND LE SERVEUR RELÈVE UN
 * ... ... CHANGEMENT FAITE PAR LE JOUEUR EN COURS
 * 
 * @method UpdateCase
 */
Case_BD.UpdateCase = function(idCase) {
	// écrire infos dans la BD
},



/*  *** TRASH ***
 * 
 *
 * AJOUTER UN ITEM A UNE CASE
 *
Case_BD.AjouterItem = function(id_case, item)
{
	this.listeCases[id_case].ajouterItem(id_item);
	UpdateSalle(id_case);
},

/*
 * SUPPRIME UN ITEM D'UNE CASE
 *
Case_BD.SupprObjet = function(id_case, item)
{
	this.listeCases[id_case].supprimerItem(item);
	UpdateSalle(id_case);
},

*/


module.exports = Case_BD;