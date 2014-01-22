// includes
var oCase = require('../model/Object/Case');
var oCase_BD = require('../persistance/Case_BD');
var oCarte = require('../model/object/Carte');
var oCase_BD = require('../persistance/Case_BD');

var oPersonnage_Manager  = require('./Personnage_Manager');
var oItem_Manager        = require('./Item_Manager');
var oUtilisateur_Manager = require('./Utilisateur_Manager');

//inclusion des règles
var GameRules	= require('../model/GameRules');

this.listeCases;
//GameRules.idZoneSure_1();
//GameRules.idZoneSure_2();
	
function Case_Manager(){}

Case_Manager.Load = function()
{
	// creation des listes
	var idCases = new Array();
	this.listeCases = new Array();
	
	// pr le callback
	var context = this;
	
	// récupération des clés
	idCases = oCase_BD.GetCasesId();
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
				console.log("Erreur Case : " + idCase);
			}
			// enregistrement effectif
			else
			{
				console.log("CASE_MANAGER : Load() : Chargement en mémoire de la case [id="+reponse.id+";nom="+reponse.nom+"]");
				context.listeCases[idCase] = reponse;
			}
		});
	}
},

/*
 * FONCTIONS D'ECRITURE
 */
Case_Manager.AjouterItem = function(idCase, item)
{
	// ajoute de l'objet case
	this.listeCases[idCase].ajouterItem(item);
	console.log("CASE_MANAGER : AjouterItem() : Ajout de l'item [id="+item.id+";nom="+item.nom+"] a la case [id="+idCase);
},

Case_Manager.SupprimerItem = function(idCase, item)
{
	// suprime de l'objet case
	this.listeCases[idCase].supprimerItem(item);
	console.log("CASE_MANAGER : SupprimerItem() : Suppression de l'item [id="+item.id+";nom="+item.nom+"] a la case [id="+idCase);
},

Case_Manager.AttaqueGoule = function(idCase)
{
	// détermine si on tue une ou deux goules
	if (GameRules.goules_proba_TuerDeuxGoules()) 
	{
		console.log("CASE_MANAGER : AttaquerGoule() : Suppression de deux goules de la case [id="+idCase);
		// suppression de 2 goules de la case
		this.listeCases[idCase].AttaqueGoule(2);
		return 2;
	}
	else
	{
		console.log("CASE_MANAGER : AttaquerGoule() : Suppression de une goules de la case [id="+idCase);
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
	console.log("+++++++++++++++++" + idCase);
	console.log("CASE_MANAGER : GetCopieCase() : " + this.listeCases[idCase].id + " - " + this.listeCases[idCase].nom);
	return this.listeCases[idCase];
},

Case_Manager.ExistItem = function(idCase, item)
{
	return this.listeCases[idCase].existItemInSalle(item);
},

Case_Manager.AttaqueDeGoules = function(idCase)
{
	// génère la puissance des goules
	var degatsGoules = GameRules.goules_GetPtsAttaque();
	// calcul le nombre de goules attaquantes
	var nbrGoulesAttaquantes = Math.floor(Math.random() * this.listeCases[idCase].getNbrGoules());
	// total des dégats infligés
	var total = degatsGoules * nbrGoulesAttaquantes;
	
	
	// action raté ou non
	var actionOk;
	// s'il y a interception, action ratée
	if (GameRules.goules_proba_Interception()) actionOk = false;
	else actionOk = true;
	
	// si le nombre de goule est de zéro, l'action est automatiquement ok
	if (this.listeCases[idCase].getNbrGoules() == 0) actionOk = true;
	
	// return les données
	var a = {
			"degats"	: total,
			"nbrGoulesA" : nbrGoulesAttaquantes,
			"actionOk" 	: actionOk,
		};
		console.log("CASE_MANAGER : AttaqueDeGoules () : degats goules  " + degatsGoules + " - nb attaques : " + nbrGoulesAttaquantes + " - total : " +total + " action ok ? " + actionOk);
	return a;
},

Case_Manager.Fouille = function(idCase, probaObjetPerso)
{
	// génère un ombre entre 1 et 100
	var proba = Math.floor(Math.random() * 100);
	// multiplie la proba de trouver un objet avec le multiplicateur du personnage
	var probaObjetCase = this.listeCases[idCase].probaObjet * probaObjetPerso;

	console.log("CASE_MANAGER : Fouille() : proba = " + proba + " - probaObjetCase  => brut = " + this.listeCases[idCase].probaObjet + " - net = " + probaObjetCase);
	if (proba < probaObjetCase) return true;
	else return false;
},

Case_Manager.DecouverteEnnemi = function(idCase, probaObjetPerso, probaCacheEnn)
{
	console.log("CASE_MANAGER : DecouverteEnnemi() : proba " + this.listeCases[idCase].probaObjet + " - multi :" + probaObjetPerso);
	
	var proba = Math.floor(Math.random() * 100);
	var probaDecouverte = this.listeCases[idCase].probaObjet * probaObjetPerso;
	var probaDecouverte2 = probaDecouverte / probaCacheEnn;
	
	console.log("CASE_MANAGER : DecouverteEnnemi() : proba cache = " + proba + " - probaDecouverte  => brut = " + probaDecouverte + " - net = " + probaDecouverte2);
	if (proba < probaDecouverte) return true;
	else return false;
},

Case_Manager.GetNombreGoules = function(idCase)
{
	return this.listeCases[idCase].getNbrGoules();
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
		return GameRules.idZoneSure_2();
	}
	return GameRules.idZoneSure_1();
},

Case_Manager.GetTestZoneSure = function(idCase, numEquipe)
{
	console.log("CASE_MANAGER : GetTestZoneSure() : numEquipe = " + numEquipe + " id case destination : " + idCase);
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
		console.log("CASE_MANAGER : Save() : Sauvegarde de la case [id="+idCase);
		oCase_BD.SetCase(this.listeCases[idCase], function(reponse)
		{
			console.log("Enregistrement de case ok !");
		});
	}
},

module.exports = Case_Manager;