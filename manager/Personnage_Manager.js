 // includes
var oPersonnage		= require('../model/Object/Personnage');
var oUtilisateur	= require('../model/Object/Utilisateur');
var oCarte			= require('../model/object/Carte');
var oPersonnage_BD	= require('../persistance/Personnage_BD');
var oUtilisateur_BD	= require('../persistance/Utilisateur_BD');

var oItem_Manager        = require('./Item_Manager');
var oCase_Manager        = require('./Case_Manager');
var oUtilisateur_Manager = require('./Utilisateur_Manager');

this.listePersonnages;

this.coutFouilleRapide;
this.coutAttaqueEnnemi;
this.coutAttaqueGoule;
this.coutInterceptionGoule;
this.coutChgtMode;
this.coutChgtMode_def;

function Personnage_Manager(){}

Personnage_Manager.Load = function()
{
	var context = this;
	this.listePersonnages = new Array();
	
	this.coutFouilleRapide = 4;
	this.coutAttaqueEnnemi = 7;
	this.coutAttaqueGoule = 3;
	this.coutInterceptionGoule = 2;
	this.coutChgtMode = 2;
	this.coutChgtMode_def = 1;
	oUtilisateur_BD.GetUsersId(function(tabId)
	{
		var idUser;
		for(var i in tabId)
		{
			idUser = tabId[i];
			oPersonnage_BD.GetPersonnageByIdUser(idUser, function(id, reponse)
			{
				if (reponse == -1)
				{
					context.listePersonnages[id] = null;
				}
				else if (reponse == -2)
				{
					context.listePersonnages[id] = null;
				}
				else
				{
					context.listePersonnages[id] = reponse;
				}
			});
		}
	});            	
},

Personnage_Manager.LoadUser = function(idUser)
{
	var context = this;
	oPersonnage_BD.GetPersonnageByIdUser(idUser, function(reponse)
	{
		if (reponse == -1 || reponse == -2)
		{
			context.listePersonnages[idUser] = null;
		}
		else
		{
			context.listePersonnages[idUser] = reponse;
		}
	});     	
},

Personnage_Manager.SetCompetence = function(idUser, competence)
{				
	/*** - CALCUL SUR LES MULTI POINTS - ***/
	if(competence == "brute")
	{
		this.listePersonnages[idUser].setptSanteMax(140);
		this.listePersonnages[idUser].setptDeplacementMax(15);
		this.listePersonnages[idUser].setptActionMax(20);
		
		this.listePersonnages[idUser].setmultiPtsAttaque(2);
		this.listePersonnages[idUser].setmultiPtsDefense(2);
		this.listePersonnages[idUser].setmultiProbaCache(0.5);
		this.listePersonnages[idUser].setmultiProbaFouille(1);
		
		this.listePersonnages[idUser].setgoulesMax(2);
	}
	else if(competence == "explorateur")
	{
		this.listePersonnages[idUser].setptSanteMax(100);
		this.listePersonnages[idUser].setptDeplacementMax(25);
		this.listePersonnages[idUser].setptActionMax(20);
		
		this.listePersonnages[idUser].setmultiPtsAttaque(1);
		this.listePersonnages[idUser].setmultiPtsDefense(0.3);
		this.listePersonnages[idUser].setmultiProbaCache(1);
		this.listePersonnages[idUser].setmultiProbaFouille(3);
		
		this.listePersonnages[idUser].setgoulesMax(5);
	}
	else if(competence == "chercheur")
	{
		this.listePersonnages[idUser].setptSanteMax(100);
		this.listePersonnages[idUser].setptDeplacementMax(15);
		this.listePersonnages[idUser].setptActionMax(30);
		
		this.listePersonnages[idUser].setmultiPtsAttaque(0.5);
		this.listePersonnages[idUser].setmultiPtsDefense(1.5);
		this.listePersonnages[idUser].setmultiProbaCache(3);
		this.listePersonnages[idUser].setmultiProbaFouille(0.5);
		
		this.listePersonnages[idUser].setgoulesMax(3);
	}
	this.listePersonnages[idUser].setcompetence(competence);
},

Personnage_Manager.Deplacement = function (idUser, move, nbrGoules)
{
	// deplace le personnage
	var reponse = this.listePersonnages[idUser].deplacement(move, nbrGoules);
	
	console.log("PMANAGER : Réponse déplacement pour id " + idUser + " : " + reponse);
	
	return reponse;
},

Personnage_Manager.AjouterItemAuSac = function (idUser, item)
{
	return this.listePersonnages[idUser].ajouterAuSac(item);
},

Personnage_Manager.SupprimerDuSac = function (idUser, item)
{
	return this.listePersonnages[idUser].supprimerDuSac(item);
},

Personnage_Manager.SEquiper = function (idUser, currentItem)
{
	return this.listePersonnages[idUser].sEquiper(currentItem);
},

Personnage_Manager.SeDesequiper = function (idUser, item)
{
	return this.listePersonnages[idUser].seDesequiper(item);
},

Personnage_Manager.Utiliser = function (idUser, item)
{
	return this.listePersonnages[idUser].utiliser(item);
},

//DiminuerSante
Personnage_Manager.subirDegats = function (idUser, degats)
{
	return this.listePersonnages[idUser].subirDegats(degats);
},

Personnage_Manager.ChangementMode = function(idUser, mode)
{
	return this.listePersonnages[idUser].changerMode(mode);
},

Personnage_Manager.FouilleRapide = function(idUser)
{
	this.listePersonnages[idUser].diminuerPointAction(this.coutFouilleRapide);
},

Personnage_Manager.AddMessage = function(idUser, msg)
{
	console.log("PERSONNAGE_MANAGER : Ajout du message " + msg);
	this.listePersonnages[idUser].ajouterMessage(msg);
},

Personnage_Manager.EffacerMessages = function(idUser)
{
	console.log("PERSONNAGE_MANAGER : Effacement de la liste des messages");
},

Personnage_Manager.Attaquer = function(idUser, idUserEnnemi)
{
	var degatsRecus;
	var degatsInfliges;
	
	// diminution ptAction
	this.listePersonnages[idUser].Attaquer(this.coutAttaqueEnnemi);
	
	degatsInfliges = this.listePersonnages[idUser].GetPtsAttaque() - this.listePersonnages[idUserEnnemi].GetPtsDefense();
	degatsRecus = this.listePersonnages[idUserEnnemi].GetPtsAttaque() - this.listePersonnages[idUser].GetPtsDefense();
	
	this.subirDegats(idUser, degatsRecus);
	this.subirDegats(idUserEnnemi, degatsInfliges);
	
	this.AddMessage(idUserEnnemi, "Attaqué par un ennemi ! Degats subis : " + degatsInfliges + " - degats infligés en riposte : " + degatsRecus);
	
	return { "degatsRecus"	: degatsRecus, "degatsInflges" : degatsInfliges};
},

Personnage_Manager.AttaquerGoule = function(idUser)
{
	this.listePersonnages[idUser].diminuerPointAction(this.coutAttaqueGoule);
},

Personnage_Manager.Decouvert = function(idUser)
{
	console.log("PERSONNAGE_MANAGER : Le perso " + idUser + " a été découvert !" );
	
	this.listePersonnages[idUser].changerMode(0);
	this.addMessage("Vous avez été découvert ! Votre planque est foutue !");
},

Personnage_Manager.MisKo = function(idUser, meurtrier)
{
	this.AddMessage(idUser, "Vous avez été mis KO par " + meurtrier + " ! Vous avez été ramené dans votre zone sure, mais vous avez perdu tout vos objets.");
},

SeRetablir = function(idUser)
{
	console.log("SERVEUR : SeRetablir()");
	
	this.listePersonnages[idUser].setptSante(20);
},

Personnage_Manager.goZoneSure = function(idUser)
{
	this.listePersonnages[idUser].goCase(Case_Manager.getZoneSure(oUtilisateur_Manager.GetNumEquipe(idUser)));
},

Personnage_Manager.InitialiserMode = function(idUser)
{
	this.listePersonnages[idUser].initialiserMode(0);
},

Personnage_Manager.Mourir = function(idUser)
{

},

Personnage_Manager.ChercherEnnemi = function(idUser)
{
	var nbrEnnemiDecouvert = 0;
	for(var i in this.listePersonnages)
	{
		if( Personnage_Manager.MemeSalle(idUser, i) && !oUtilisateur_Manager.MemeEquipe(idUser, i) && this.listePersonnages[i].GetMode() == 2)
		{
			if(oCase_Manager.DecouverteEnnemi(Personnage_Manager.GetIdSalleEnCours(idUser), Personnage_Manager.GetMultiFouille(idUser), Personnage_Manager.GetMultiCache(i)))
			{
				ennemiDecouvert += 1;
				Personnage_Manager.Decouvert(i);
			}
		}
	}
	return nbrEnnemiDecouvert;
},

Personnage_Manager.MemeSalle = function(idUser1, idUser2)
{
	return Personnage_Manager.GetIdSalleEnCours(idUser1) == Personnage_Manager.GetIdSalleEnCours(idUser2);
},

/***************** LECTURE *****************/
Personnage_Manager.GetCopiePerso = function(idUser)
{
	return this.listePersonnages[idUser];
},

Personnage_Manager.GetNbrAlliesEnemisDansSalle = function(idUser)
{
	var a = { "nbrAllies"	: -1, "nbrEnnemis" : 0}
	for(var i in this.listePersonnages)
	{
		if(this.listePersonnages[idUser].getIdSalleEnCours() == this.listePersonnages[i].getIdSalleEnCours() && this.listePersonnages[i].GetMode() != 2)
		{
			if(oUtilisateur_Manager.GetNumEquipe(idUser) == oUtilisateur_Manager.GetNumEquipe(i))
			{
				a.nbrAllies += 1;
			}
			else
			{
				a.nbrEnnemis += 1;
			}
		}
	}
	return a;
},

Personnage_Manager.GetAlliesEnnemisDansSalle = function(idUser)
{
	var a = { "Allies"	: new Array(), "Ennemis" : new Array()}
	for(var i in this.listePersonnages)
	{
		if(this.listePersonnages[idUser].getIdSalleEnCours() == this.listePersonnages[i].getIdSalleEnCours())
		{
			if(oUtilisateur_Manager.GetNumEquipe(idUser) == oUtilisateur_Manager.GetNumEquipe(i))
			{
				a.Allies.push(i);
			}
			else
			{
				a.Ennemis.push(i);
			}
		}
	}
	return a;
},

Personnage_Manager.GetAlliesEnnemisDansSalleToDisplay = function(idUser)
{
	var a = { "Allies"	: new Array(), "Ennemis" : new Array()}
	for(var i in this.listePersonnages)
	{
		if(this.listePersonnages[idUser].getIdSalleEnCours() == this.listePersonnages[i].getIdSalleEnCours())
		{
			if(oUtilisateur_Manager.GetNumEquipe(idUser) == oUtilisateur_Manager.GetNumEquipe(i))
			{
				a.Allies.push(Personnage_Manager.getPersonnageToDisplay(i));
			}
			else
			{
				a.Ennemis.push(Personnage_Manager.getPersonnageToDisplay(i));
			}
		}
	}
	return a;
},

Personnage_Manager.IsItemEquipee = function(idUser, item)
{
	console.log("id item = " + item.id + " nom item = " + item.nom);
	return this.listePersonnages[idUser].isItemEquipee(item);
},

Personnage_Manager.TestDeplacementPossible = function(idUser, nbrGoules, direction)
{
	console.log("PM : TEST DEPLACEMENT POSSIBLE");
	
	return this.listePersonnages[idUser].testDeplacement(nbrGoules, direction);
},

Personnage_Manager.GetMultiFouille = function(idUser)
{
	return this.listePersonnages[idUser].GetMultiFouille();
},

Personnage_Manager.GetMultiCache = function(idUser)
{
	return this.listePersonnages[idUser].GetMultiCache();
},

Personnage_Manager.GetMode = function(idUser)
{
	return this.listePersonnages[idUser].GetMode();
},

Personnage_Manager.GetPoidsSac = function(idUser)
{
	return this.listePersonnages[idUser].getPoidsSac();
},

Personnage_Manager.ExistItemInSac = function(idUser, item)
{
	return this.listePersonnages[idUser].existItemInSac(item);
},

Personnage_Manager.PerteActionParGoules = function(idUser)
{
	this.listePersonnage[idUser].diminuerPointAction(this.coutInterceptionGoule);
},

Personnage_Manager.TestPtActions = function(idUser, typeAction)
{
	var ptActions = this.listePersonnages[idUser].getPtActions();
	if (typeAction == "fouilleRapide" && ptActions - this.coutFouilleRapide < 0) return true;
	else if (typeAction == "attaqueGoule" && ptActions - this.coutAttaqueGoule < 0) return true;
	else if (typeAction == "attaqueEnnemi" && ptActions - this.coutAttaqueEnnemi < 0) return true;
	else if (typeAction == "chgtMode" && ptActions - this.coutChgtMode < 0) return true;
	else if (typeAction == "coutChgtMode_def" && ptActions - this.coutChgtMode_def < 0) return true;
	else return false;
},

Personnage_Manager.getPersonnageToDisplay = function(idUser)
{
	var comPoidsSac = this.listePersonnages[idUser].getPoidsSac() / this.listePersonnages[idUser].getPoidsMax() * 100;
		
	console.log("PM : approximation poids sac : " + comPoidsSac +" %");
	var perso = new oPersonnage(
			idUser, 									this.listePersonnages[idUser].getPtSante(),		this.listePersonnages[idUser].getPtSanteMax(),
			-1,											-1 												-1,
			-1,											-1, 											-1,
			this.listePersonnages[idUser].getCompetence,-1, 											this.listePersonnages[idUser].GetMode(),
			-1,  										-1,  											-1,
			-1,											this.listePersonnages[idUser].getArmeEquipe(),	this.listePersonnages[idUser].getArmureEquipe(),
			comPoidsSac,								-1,												-1);
	return perso;
},

Personnage_Manager.GetIdSalleEnCours = function(idUser)
{
	return this.listePersonnages[idUser].getIdSalleEnCours();
},

Personnage_Manager.GetIdNextSalle = function(idUser, direction)
{
	return oCarte.GetIdSalleSuivante(this.listePersonnages[idUser].getIdSalleEnCours(), direction);
},

Personnage_Manager.Save = function()
{
	for(var idUser in this.listePersonnages)
	{
		oPersonnage_BD.SetPersonnage(this.listePersonnages[idUser], function(reponse)
		{
			if (reponse == -1)
			{
				console.log("!!!!! WARNING : PMANAGER : erreur ecriture du perso de " + idUser);
			}
			else
			{
				console.log("UMANAGER : MAJ du perso de " + idUser + " OK !");
			}
		});
	}
}

module.exports = Personnage_Manager;