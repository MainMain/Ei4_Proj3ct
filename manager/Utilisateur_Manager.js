// includes
var oUtilisateur = require('../model/Object/Utilisateur');
var oUtilisateur_BD = require('../persistance/Utilisateur_BD');

//managers
var oSession_Manager  	 = require('./Session_Manager');

//inclusion des règles
var GameRules	= require('../model/GameRules');

// --- ATTRIBUTS DE CLASSE ---
Utilisateur_Manager.listeUtilisateurs;

function Utilisateur_Manager(){}

// --- METHODES D'INSTANCE



Utilisateur_Manager.Load = function()
{
	var context = Utilisateur_Manager;
	
	Utilisateur_Manager.listeUtilisateurs = new Array();
	oUtilisateur_BD.GetUsersId(function(tabId)
	{
		var idUser;
		for(var i in tabId)
		{
			idUser = tabId[i];
			oUtilisateur_BD.GetUtilisateur(idUser, function(id, reponse)
			{
				if(reponse == -1 || reponse == -2)
				{
					console.log("/!\ UTILISATEUR_MANAGER : Erreur ecriture pour l'id user " + id);
					context.listeUtilisateurs[id] = null;
				}
				else
				{
					//console.log("UTILISATEUR_MANAGER : user loaded : " + id);
					context.listeUtilisateurs[id] = reponse;
				}
			});
		}
	});
},

Utilisateur_Manager.LoadUser = function(idUser)
{
	var context = this;
	oUtilisateur_BD.GetUtilisateur(idUser, function(IdReponse, userReponse)
	{
		if(userReponse == -1 || userReponse == -2)
		{
			console.log("/!\ UTILISATEUR_MANAGER : Erreur ecriture pour l'id user " + IdReponse);
			context.listeUtilisateurs[IdReponse] = null;
		}
		else
		{
			console.log("IdReponse = " + IdReponse);
			console.log("userReponse = " + userReponse);
			context.listeUtilisateurs[IdReponse] = userReponse;
			
		}
	});
},


/*
 * FONCTIONS D'ECRITURE
 */
Utilisateur_Manager.SetNumEquipe = function(idUser, numEquipe, idSession)
{
	this.listeUtilisateurs[idUser].numEquipe = numEquipe;
	this.listeUtilisateurs[idUser].idSession = idSession;
	
	oUtilisateur_BD.SetUtilisateur(this.listeUtilisateurs[idUser], function(reponse)
	{
		if (reponse == -1)
		{
			console.log("/!\ UTILISATEUR_MANAGER : erreur ecriture ");
		}
		else
		{
			console.log("UTILISATEUR_MANAGER : MAJ du numéro d'équipe pour l'id " + idUser + " OK!");
		}
	});
},

/*
 * FONCTIONS DE LECTURE
 */
Utilisateur_Manager.exist = function(idUser)
{
	if(this.listeUtilisateurs[idUser])
	{
		return true;
	}
	return false;
},

Utilisateur_Manager.GetNumEquipe = function(idUser)
{
	return this.listeUtilisateurs[idUser].getNumEquipe();
},

Utilisateur_Manager.GetPseudo = function(idUser)
{
	return this.listeUtilisateurs[idUser].getPseudo();
},

Utilisateur_Manager.GetIdPersonnage = function(idUser)
{
	return this.listeUtilisateurs[idUser].getIdPersonnage();
},

Utilisateur_Manager.MemeEquipe = function(idUser1, idUser2)
{
	return Utilisateur_Manager.GetNumEquipe(idUser1) == Utilisateur_Manager.GetNumEquipe(idUser2);
},

Utilisateur_Manager.findIdUser = function(idPersonnage)
{
	for(var i in this.listeUtilisateurs)
	{
		console.log(this.listeUtilisateurs[i].getIdPersonnage() + " == " + idPersonnage);
		if(this.listeUtilisateurs[i].getIdPersonnage() == idPersonnage)
		{
			return i;
		}
	}
	return -1;
},

Utilisateur_Manager.Save = function()
{
	for(var idUser in this.listeUtilisateurs)
	{
		oUtilisateur_BD.SetUtilisateur(this.listeUtilisateurs[idUser], function(reponse)
		{
			if (reponse == -1)
			{
				console.log("/!\ UTILISATEUR_MANAGER : erreur ecriture de l'user " + idUser);
			}
			else
			{
				//console.log("UTILISATEUR_MANAGER : MAJ de l'user " + idUser + " OK !");
			}
		});
	}
},

module.exports = Utilisateur_Manager;