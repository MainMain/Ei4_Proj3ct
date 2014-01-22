// includes
var oCase = require('../model/Object/Case');
var oCase_BD = require('../persistance/Case_BD');
var oCarte = require('../model/object/Carte');
var oCase_BD = require('../persistance/Case_BD');

var oPersonnage_Manager  = require('./Personnage_Manager');
var oItem_Manager        = require('./Item_Manager');
var oUtilisateur_Manager = require('./Utilisateur_Manager');

this.listeCases;
this.idZoneSure1;
this.idZoneSure2;
	
function Case_Manager(){}

Case_Manager.Load = function()
{
	var idCases = new Array();
	
	var context = this;
	
	this.listeCases = new Array();
	
	this.idZoneSure1 = 0;
	this.idZoneSure2 = 5;
	
	idCases = oCase_BD.GetCasesId();
	for(var i in idCases)
	{
		var id = idCases[i]
		oCase_BD.GetCaseById(id, function(idCase, reponse)
		{
			if(reponse == -1 || reponse == -2)
			{
				console.log("Erreur Case : " + idCase);
			}
			else
			{
				context.listeCases[idCase] = reponse;
			}
		});
	}
},

/************************* ECRITURE *******************************/
Case_Manager.AjouterItem = function(idCase, item)
{
	// ajoute de l'objet case
	this.listeCases[idCase].ajouterItem(item);
},

Case_Manager.SupprimerItem = function(idCase, item)
{
	// suprime de l'objet case
	this.listeCases[idCase].supprimerItem(item);
},

Case_Manager.AttaqueGoule = function(idCase)
{
	// détermine si on tue une ou deux goules
	var proba = Math.floor(Math.random() * 100);
	var goulesTues;
	
	if (proba > 85) 
	{
		this.listeCases[idCase].AttaqueGoule(2);
		goulesTues = 2;
	}
	else
	{
		this.listeCases[idCase].AttaqueGoule(1);
		goulesTues = 1;
	}
	
	return goulesTues;
},


/************************* LECTURE *******************************/
Case_Manager.GetCopieCase = function(idCase)
{
	console.log("CASE_MANAGER : copie case : " + this.listeCases[idCase].id + " - " + this.listeCases[idCase].nom);
	return this.listeCases[idCase];
},

Case_Manager.ExistItem = function(idCase, item)
{
	return this.listeCases[idCase].existItemInSalle(item);
},

Case_Manager.AttaqueDeGoules = function(idCase)
{
	// attaque des goules
	var degatsGoules = Math.floor(Math.random() * 4 + 1);
	var nbrGoulesAttaquantes = Math.floor(Math.random() * this.listeCases[idCase].getNbrGoules());
	var total = degatsGoules * nbrGoulesAttaquantes;
	console.log("CASE_MAN : degats goules  " + degatsGoules + " - nb attaques : " + nbrGoulesAttaquantes + " - total : " +total);
	
	// action raté ou non
	var chance = Math.floor(Math.random()  * 10);
	chance -= nbrGoulesAttaquantes * 0.3;
	var actionOk;
	if (chance >= 5) actionOk = false;
	else actionOk = true;
	
	if (this.listeCases[idCase].getNbrGoules() == 0) actionOk = true;
	
	 var a = {
			"degats"	: total,
			"nbrGoulesA" : nbrGoulesAttaquantes,
			"actionOk" 	: actionOk,
		};
	return a;
},

Case_Manager.Fouille = function(idCase, probaObjetPerso)
{
	var proba = Math.floor(Math.random() * 100);
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
	
	console.log("CASE_MANAGER : DecouverteEnnemi() : proba = " + proba + " - probaDecouverte  => brut = " + probaDecouverte + " - net = " + probaDecouverte2);
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
		return this.idZoneSure1;
	}
	return this.idZoneSure2;
},

Case_Manager.GetIdZoneSureEnnemi = function(numEquipe)
{
	if(numEquipe == 1)
	{
		return this.idZoneSure2;
	}
	return this.idZoneSure1;
},

Case_Manager.GetTestZoneSure = function(idCase, numEquipe)
{
	console.log("CASE_MANAGER : GetTestZoneSure()/ numEquipe = " + numEquipe + " id case destination : " + this.listeCases[idCase].id + "id zone sure 2 = " + this.idZoneSure2);
	if ( 
			(numEquipe == 1 && idCase == this.idZoneSure2) ||
			(numEquipe == 2 && idCase == this.idZoneSure1))
		return true;
	else
		return false;	
},

Case_Manager.Save = function()
{
	for(var idCase in this.listeCases)
	{
		oCase_BD.SetCase(this.listeCases[idCase], function(reponse)
		{
		
		});
	}
}

module.exports = Case_Manager;