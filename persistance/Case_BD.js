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
 
Case_BD.Creation = function(id, nom, description, probaObjet, probaCache, nbrGoules, listeItem, callSetCase) {
	var CaseModel = mongoose.model('Case');
	var newCase = new CaseModel();

	newCase.id 			= id;
	newCase.nom 		= nom;
	newCase.description = description;
	newCase.probaObjet 	= probaObjet;
	newCase.probaCache 	= probaCache;
	newCase.nbrGoules 	= nbrGoules;
	newCase.listeItem 	= listeItem;

	newCase.save(function(err) {
		if (err) {
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw err;
			EventLog.log("CASE_BD : Creation() : ERREUR ");
		}
		EventLog.log("CASE_BD : Creation de case réussie : " + newCase.nom);
		callSetCase(newCase.id);
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

Case_BD.supprimerCases = function(callback)
{
	EventLog.log("CASE_BD : Vidage table case... ");
	var CaseModel = mongoose.model('Case');

	CaseModel.remove({ }, function()
		{
			callback();
		}).exec();

	//callback();
}
/**
 * CREE UNE LISTE DE CASE
 * 
 * @method Initialiser
 */
Case_BD.Initialiser = function(callBack) 
{	
	console.log("INIT");
	var creation = false;
	var context = this;
	var nbrCasesEnr = 0;
	// test si la table case est vide
	this.GetCasesId(function(tabId)
	{
		// si table vide
		if(tabId.length == 0)
		{
			creation = true;
			
			// lecture dans le fichier
			EventLog.log("CASE_BD : Chargement des cases fichier -> base de données");
			
			// ouerture du fichier en lecture
			var file = fs.readFileSync('./persistance/caseListe.txt', "utf8");
			
			// récupération des tabLignes dans un tableau
			var tabLignes = file.split("\n");
			
			// on supprime la premiere ligne 
			tabLignes.splice(0, 1);
			
			// on récupère le nombre de lignes
			var nbLines = tabLignes.length;
			
			// on récupère le dernier id de case pour savoir quand rappeller le callback
			var lastIdCase = tabLignes[tabLignes.length-1].split("-")[0];

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
						
						var id			= infosCase[0];
						var nom			= infosCase[1];
						var description	= infosCase[2];
						var probaObjet	= infosCase[3];
						var probaCache	= infosCase[4];
						var nbrGoules	= infosCase[5];
						
						// création de la liste des items
						var listeItems = new Array();
						for (var i = 6; i < infosCase.length-1; i++)
						{
							listeItems.push(oItem_BD.GetItemById(infosCase[i]));	
						}
						
						context.Creation(id, nom, description, probaObjet, probaCache, nbrGoules, listeItems, function(idEnregistre)
							// callback recu a chaque enregistrement
							{
								// si toutes les cases on été enregistrés, on repart dans le manager
								// (= si la ligne suivante est une ligne vide)
								if(idEnregistre == lastIdCase)
								{
									EventLog.log("CALLBACK nvlles cases crées ! ");
									callBack(creation);
								}
							});
						
					} // fin if(infosCase[0])
				} // fin if(tabLignes != "")
			} // fin for(var i in tabLignes)
		} // fin if(tabId.length == 0)
		else
		{
			EventLog.log("CALLBACK pas nvlles cases ! ");
			callBack(creation);
		}
		
	});
},
module.exports = Case_BD;