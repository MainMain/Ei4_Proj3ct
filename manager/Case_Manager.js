// includes
var oCase 		= require('../model/object/Case');
var oCase_BD 	= require('../persistance/Case_BD');
var oCarte 		= require('../model/object/Carte');
var oCase_BD 	= require('../persistance/Case_BD');

var oItem_Manager        = require('./Item_Manager');

//inclusion des règles
var GameRules	= require('../model/GameRules');

this.listeCases;
	
function Case_Manager(){}

Case_Manager.Load = function()
{
	var context = this;
	oCase_BD.Initialiser(function()
	{
		// creation des listes
		var idCases = new Array();
		context.listeCases = new Array();
	
		// récupération des clés
		idCases = oCase_BD.GetCasesId(function(idCases)
		{
			EventLog.log(">> CASE_MANAGER : Load : nbr d'id de case : " + idCases.length);
			// pour chaque case
			for(var i in idCases)
			{
				var id = idCases[i];
			
				// charge la case en mémoire par rapport à son id
				oCase_BD.GetCaseById(id, function(idCase, reponse)
				{
					// gestion des erreurs
					if(reponse == -1 || reponse == -2)
					{
						EventLog.error("Erreur Case : " + idCase);
					}
					// enregistrement effectif
					else
					{
						EventLog.log("CASE_MANAGER : Load() : Chargement en mémoire de la case [id="+reponse.id+";nom="+reponse.nom+"]");
						context.listeCases[idCase] = reponse;
					}
				});
			}
		});
	});
},

/*
 * FONCTIONS D'ECRITURE
 */
Case_Manager.AjouterItem = function(idCase, item)
{
	// ajoute de l'objet case
	EventLog.log("CASE_MANAGER : AjouterItem() : Ajout de l'item [id="+item.id+";nom="+item.nom+"] a la case [id="+idCase);
	this.listeCases[idCase].ajouterItem(item);
	
},

Case_Manager.SupprimerItem = function(idCase, item)
{
	// suprime de l'objet case
	this.listeCases[idCase].supprimerItem(item);
	EventLog.log("CASE_MANAGER : SupprimerItem() : Suppression de l'item [id="+item.id+";nom="+item.nom+"] a la case [id="+idCase);
},

Case_Manager.RemplirCases = function()
{
	// =>rempli aléatoirement les cases d'items
	
	var nbrItems;
	// pour chaque case
	for (curCase in this.listeCases)
	{
		// génére le nombre d'item pour cette case
		nbrItems = (Math.floor(Math.random() * (5-0) + 0 ));
		
		// récupération et ajout d'items
		for (var i = 0; i < nbrItems; i++)
		{
			var item = oItem_Manager.GetItemAleatoire();
			this.listeCases[curCase].ajouterItem(item);
		}
	}
},

Case_Manager.AttaqueGoule = function(idCase)
{
	// détermine si on tue une ou deux goules
	if (GameRules.goules_proba_TuerDeuxGoules()) 
	{
		EventLog.log("CASE_MANAGER : AttaquerGoule() : Suppression de deux goules de la case [id="+idCase);
		// suppression de 2 goules de la case
		this.listeCases[idCase].AttaqueGoule(2);
		return 2;
	}
	else
	{
		EventLog.log("CASE_MANAGER : AttaquerGoule() : Suppression de une goules de la case [id="+idCase);
		// suppression de 1 goule de la case
		this.listeCases[idCase].AttaqueGoule(1);
		return 1;
	}
	
},


/*
 * FONCTIONS DE LECTURE
 */
Case_Manager.GetCopieCase = function(idCase)
{
	//EventLog.log("CASE_MANAGER : GetCopieCase() : " + this.listeCases[idCase].id + " - " + this.listeCases[idCase].nom);
	//EventLog.log(this.listeCases);
	return this.listeCases[idCase];
},

Case_Manager.ExistItem = function(idCase, item)
{
	return this.listeCases[idCase].existItemInSalle(item);
},

Case_Manager.AttaqueDeGoules = function(idCase, nbrAllies)
{
	var a = {
		"degats"	: 0,
		"nbrGoulesA" : 0,
		"actionOk" 	: true,
	};
	
	EventLog.log(">> CASE_MANAGER : AttaqueDeGoules() : " + idCase);
	// si pas de goules, on quitte 
	try
	{
		if (this.listeCases[idCase].getNbrGoules() <= 0) return a;
	
	
	// calcul le nombre de goules attaquantes
	var nbrGoulesAttaquantes = Math.floor(Math.random() * this.listeCases[idCase].getNbrGoules());
	
	// soustraction du nombre de goules par le nombre d'alliés
	nbrGoulesAttaquantes -= parseInt(nbrAllies);
	
	// si aucune goule n'attaque, on quitte
	if (nbrGoulesAttaquantes <= 0) return a;
	
	// génère la puissance des goules
	var degatsGoules = GameRules.goules_GetPtsAttaque();
	
	// total des dégats infligés
	var total = degatsGoules * nbrGoulesAttaquantes;
	
	// action raté ou non
	var actionOk;
	
	// s'il y a interception, action ratée
	if (GameRules.goules_proba_Interception()) actionOk = false;
	else actionOk = true;

	
	// return les données
	a = {
			"degats"	: total,
			"nbrGoulesA" : nbrGoulesAttaquantes,
			"actionOk" 	: actionOk,
		};
		EventLog.log("CASE_MANAGER : AttaqueDeGoules () : degats goules  " + degatsGoules + " - nb attaques : " + nbrGoulesAttaquantes + " - total : " +total + " action ok ? " + actionOk);
	
	}
	catch(err)
	{
		EventLog.error("/!\ >>> ERREUR : CASE_MANAGER : AttaqueDeGoules : " + err);
	}
	return a;
},

Case_Manager.Fouille = function(idCase, probaObjetPerso)
{
	var newItem;
	// génère un ombre entre 1 et 100
	var proba = Math.floor(Math.random() * 100);
	// multiplie la proba de trouver un objet avec le multiplicateur du personnage
	var probaObjetCase = this.listeCases[idCase].probaObjet * probaObjetPerso;

	EventLog.log("CASE_MANAGER : Fouille() : proba = " + proba + " - probaObjetCase  => brut = " + this.listeCases[idCase].probaObjet + " - net = " + probaObjetCase);
	if (proba < probaObjetCase)
	{
		// création d'un item
		newItem = oItem_Manager.GetItemAleatoire();
		EventLog.log("CASE_MANAGER : Fouille() : Nouvel objet decouvert ! : "+ newItem.nom);
	}
	return newItem;
},

Case_Manager.DecouverteEnnemi = function(idCase, probaObjetPerso, probaCacheEnn)
{
	EventLog.log("CASE_MANAGER : DecouverteEnnemi() : proba " + this.listeCases[idCase].probaObjet + " - multi :" + probaObjetPerso);
	
	var proba = Math.floor(Math.random() * 100);
	var probaDecouverte = this.listeCases[idCase].probaObjet * probaObjetPerso;
	var probaDecouverte2 = probaDecouverte / probaCacheEnn;
	
	EventLog.log("CASE_MANAGER : DecouverteEnnemi() : proba cache = " + proba + " - probaDecouverte  => brut = " + probaDecouverte + " - net = " + probaDecouverte2);
	if (proba < probaDecouverte) return true;
	else return false;
},

Case_Manager.nouvelleJournee = function()
{
	// ajout de goules
	for(var idCase in this.listeCases)
	{
		if (!((idCase == GameRules.idZoneSure_1()) || (idCase == GameRules.idZoneSure_2())))
		{
			// calcul du nombre de goules a ajouter
			var nbrGoules = GameRules.goules_nbrNouvellesGoules();
		
			// log
			EventLog.log("CASE_MANAGER : case " + idCase + " : ajout de " + nbrGoules + " goules !");
		
			// ajout
			this.listeCases[idCase].nbrGoules += nbrGoules;
		}
	}
},
Case_Manager.GetNombreGoules = function(idCase)
{
	EventLog.log(">> CASE_MANAGER : GetNombreGoules - idCase = " + idCase);
	try
	{
		return this.listeCases[idCase].getNbrGoules();
	}
	catch(err)
	{
		EventLog.error("/!\ >>> ERREUR : CASE_MANAGER : GetNombreGoules : " + err);
		return -1;
	}
},

Case_Manager.getZoneSure = function(numEquipe)
{
	if(numEquipe == 1)
	{
		return GameRules.idZoneSure_1();
	}
	return GameRules.idZoneSure_2();
},

Case_Manager.GetIdZoneSureEnnemi = function(numEquipe)
{
	if(numEquipe == 1)
	{
		var tab = [GameRules.idZoneSure_2(), GameRules.idZoneSure_3()] ;
		return tab;
	}
	else if ((numEquipe == 1))
	{
		var tab = [GameRules.idZoneSure_1(), GameRules.idZoneSure_3()] ;
		return tab;
	}
	else
	{
		var tab = [GameRules.idZoneSure_1(), GameRules.idZoneSure_2()] ;
		return tab;
	}
},

Case_Manager.GetTestZoneSure = function(idCase, numEquipe)
{
	EventLog.log("CASE_MANAGER : GetTestZoneSure() : numEquipe = " + numEquipe + " id case destination : " + idCase);
	if ( 
			(numEquipe == 1 && idCase == GameRules.idZoneSure_2()) ||
			(numEquipe == 2 && idCase == GameRules.idZoneSure_1()))
		return true;
	else
		return false;	
},

Case_Manager.Save = function()
{
	
	for(var idCase in this.listeCases)
	{
		//EventLog.log("CASE_MANAGER : Save() : Sauvegarde de la case [id="+idCase);
		oCase_BD.SetCase(this.listeCases[idCase], function(reponse)
		{
			//EventLog.log("Enregistrement de case ok !");
		});
	}
},

module.exports = Case_Manager;