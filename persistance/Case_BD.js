// includes
var oCase = require('../model/object/Case');
var oItem_BD = require('../persistance/Item_BD'); // devra disparaitre a terme...

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


// **** EXEMPLE CREATION CASE ****

// var array1 = [oItem_BD.GetItemById(1), oItem_BD.GetItemById(2),
// oItem_BD.GetItemById(3), oItem_BD.GetItemById(4), oItem_BD.GetItemById(14), oItem_BD.GetItemById(15), oItem_BD.GetItemById(16)];
// var case1 = new oCase(0, "E11", "Une mini salle", 20, 50, 40, array1);

// ******************************************************



/**
 * ENVOIE UNE CASE POUR METTRE A JOUR CES PROPRIETES
 * 
 * @method SetCase
 */
Case_BD.SetCase = function(caseToSave) {
	// envoi une case à rajouter (ou modifier si son id existe déja)
	
	// ! une case contient une liste d'item, des objets qu'il faudrat créer
	// voir constructeur dans Item_BD
},


/**
 * RENVOI UNE CASE AVEC SON ID PASSE EN PARAMETRE
 * 
 * @method GetCase
 */
Case_BD.GetCase = function(idCase) {
	
},













//***************************************** TO TRASH SOON *****************************
//--- ATTRIBUTS DE CLASSE ---
Case_BD.listeCases;



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
	/*
	 * 		this.id = id;
		this.nom = nom;
		this.description = description;
		this.probaObjet = probaObjet;
		this.probaCache = probaCache;
		this.nbrGoules = nbrGoules;
		this.listeItem = listeItem;
		this.pathImg = pathImg;
		*/
	var case1 = new oCase(0, "E11", "Une mini salle", 20, 50, 1, array1,"public/map/0-0.png");
	var case2 = new oCase(1, "E12", "Une petite salle", 24, 54, 2, array2,"public/map/2-0.png");
	var case3 = new oCase(2, "E13", "Une moyenne salle", 47, 50, 3, array3,"public/map/0-1.png");
	var case4 = new oCase(3, "E14", "Une grande salle", 47, 45, 4, array2,"public/map/1-1.png");
	var case5 = new oCase(4, "E15", "Une géante salle", 0, 21, 5, array2,"public/map/2-1.png");
	var case6 = new oCase(5, "E16", "Une salle sale", 75, 12, 2, array1,"public/map/0-2.png");
	var case7 = new oCase(6, "E17", "Une salle sale", 75, 12, 3, array1,"public/map/1-2.png");
	var case8 = new oCase(7, "E18", "Une salle sale", 75, 12, 6, array1,"public/map/2-2.png");
	var case9 = new oCase(8, "E19", "Une salle sale", 75, 12, 1, array1,"public/map/0-4.png");
	/*var case10 = new oCase(9, "E20", "Une salle sale", 75, 12, 4, array1);
	var case11 = new oCase(10, "E21", "Une salle sale", 75, 12, 4, array1);*/
	
	this.listeCases = new Array(case1, case2, case3, case4, case5, case6, case7, case8, case9);// case10, case11);
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