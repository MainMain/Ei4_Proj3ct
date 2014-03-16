// includes
var fs = require('fs');
var oCase = require('../model/object/Case');
var oItem_BD = require('../persistance/Item_BD'); // devra disparaitre a
// terme...
var mongoose = require('mongoose');
var oDatabase = require('../model/database');
var EventLog    = require('../model/EventLog');

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

Case_BD.GetCasesId = function(callback)
{
	var Casemodel = mongoose.model('Case'); 				
	var tabId = new Array();
	
	Casemodel.find({}, function(err, users)
	{
		if(err)
		{
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw err;
		}
		for(var i in users)
		{
			tabId[i] = users[i].id;
		}
		callback(tabId);
	});
},

/**
 * ENVOIE UNE CASE POUR METTRE A JOUR CES PROPRIETES
 * 
 * @method SetCase
 */
Case_BD.SetCase = function(caseToSave, callSetCase) 
{
	var CaseModel = mongoose.model('Case');
	var newCase = new CaseModel();

	//EventLog.log(caseToSave);
	CaseModel.find({_id: caseToSave.idmongo}, function (err, cCase) 
	{
		if (err) 
		{
			EventLog.log("CASE_BD : SetCase() : erreur ! ");
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw err;
		}
		if (typeof cCase[0] === "undefined") 
		{
			EventLog.log("CASEBD : SeCase() : undefined ! ");
			callbackSetPersonnage(-1);
		} 
		else 
		{
			CaseModel.update({_id: caseToSave.idmongo},
			{
				id		 	: caseToSave.id,
				nom 		: caseToSave.nom,
				description : caseToSave.description,
				probaObjet	: caseToSave.probaObjet,
				probaCache 	: caseToSave.probaCache,
				nbrGoules 	: caseToSave.nbrGoules,
				listeItem 	: caseToSave.listeItem,
				pathImg		: caseToSave.pathImg,
			},
			function (err) 
			{
				if (err) 
				{
					EventLog.error(err);
					// enlève l'exception pour empecher que le serveur plante //throw err;
				}
				EventLog.log("CASE_BD : Mis à jour de la case : [" + caseToSave.id +"-"+caseToSave.nom+"]");
				callbackSetPersonnage(1);
			}
		);
		}
	});	
},

/**
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
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw err;
			EventLog.log("CASE_BD : Creation() : ERREUR ");
		}
		EventLog.log("CASE_BD : Creation de case réussie ! " + newCase.nom);

	});
},

/**
 * RENVOI UNE CASE AVEC SON ID PASSE EN PARAMETRE
 * 
 * @method GetCaseById
 */
Case_BD.GetCaseById = function(idCase, callbackGetCase) 
{
	var caseModel = mongoose.model('Case');
	
	var query = caseModel.find(null);
	query.where('id', idCase);
	query.exec(function (err, currentCase) 
	{
		
		if (err) {EventLog.error(err)}; // enlève l'exception pour empecher que le serveur plante //throw err;}
		
		if (typeof currentCase[0] === "undefined")
		{
			EventLog.log("Get Case : undefined");
			callbackGetCase(idCase, -1);
		}
		else
		{
			// case récupérée
			var caseRecup = new oCase(currentCase[0]._id,
					currentCase[0].id, 			currentCase[0].nom,
					currentCase[0].description, currentCase[0].probaObjet,
					currentCase[0].probaCache,	currentCase[0].nbrGoules,
					currentCase[0].listeItem, 	currentCase[0].pathImg);

			// log
			//EventLog.log("CASE_BD : Chargement de la case : [" + currentCase[0].id +"-"+currentCase[0].nom+"]");

			// renvoi de la case
			callbackGetCase(idCase, caseRecup);
		}
	});
},

/**
 * CREE UNE LISTE DE CASE
 * 
 * @method Initialiser
 */
Case_BD.Initialiser = function(callBack) 
{	
	var creation = false;
	// test si la table case est vide
	this.GetCasesId(function(tabId)
	{
		// si table vide
		if(tabId.length == 0)
		{
			creation = true;
			
			// lecture dans le fichier
			EventLog.log("CASE_BD : Chargement des cases fichier -> base de données");
			
			// récupère le model de Item
			CaseModel = mongoose.model('Case');

			// ouerture du fichier en lecture
			var file = fs.readFileSync('./persistance/caseListe.txt', "utf8");
			
			// récupération des tabLignes dans un tableau
			var tabLignes = file.split("\n");
			
			// on supprime la premiere ligne 
			tabLignes.splice(0, 1);
			
			// pour chaque ligne
			for(var i in tabLignes)
			{
				// si elle est différente d'une chaine vide
				if(tabLignes != "")
				{
					// récupérations des infosCase
					var infosCase = tabLignes[i].split("-");
					
					if(infosCase[0])
					{
						var newCase = new CaseModel();
						
						newCase.id			= infosCase[0];
						newCase.nom			= infosCase[1];
						newCase.description	= infosCase[2];
						newCase.probaObjet	= infosCase[3];
						newCase.probaCache	= infosCase[4];
						newCase.nbrGoules	= infosCase[5];
						
						// création de la liste des items
						var listeItems = new Array();
						for (var i = 6; i < infosCase.length; i++)
						{
							listeItems.push(oItem_BD.GetItemById(infosCase[7]));
						}
						newCase.listeItem	= listeItems;
						
						newCase.save();
						
						EventLog.log("CASE_BD : Creation de la case [" + newCase.nom + "] en BD");
					} // fin if(infosCase[0])
				} // fin if(tabLignes != "")
			} // fin for(var i in tabLignes)
		} // fin if(tabId.length == 0)
		EventLog.log("CALLBACK ! ");
		callBack(creation);
	});
},
module.exports = Case_BD;