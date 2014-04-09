// includes
var oUtilisateur = require('../model/object/Utilisateur');
var oUtilisateur_BD = require('../persistance/Utilisateur_BD');


var EventLog    = require('../model/EventLog');

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
					EventLog.error("/!\ UTILISATEUR_MANAGER : Erreur ecriture pour l'id user " + id);
					context.listeUtilisateurs[id] = null;
				}
				else
				{
					//EventLog.log("UTILISATEUR_MANAGER : user loaded : " + id);
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
			EventLog.error("/!\ UTILISATEUR_MANAGER : Erreur ecriture pour l'id user " + IdReponse);
			context.listeUtilisateurs[IdReponse] = null;
		}
		else
		{
			EventLog.log("IdReponse = " + IdReponse);
			EventLog.log("userReponse = " + userReponse);
			context.listeUtilisateurs[IdReponse] = userReponse;
			
		}
	});
},


/*
 * FONCTIONS D'ECRITURE
 */
Utilisateur_Manager.SetNumEquipe = function(idUser, numEquipe, idSession)
{
	this.listeUtilisateurs[idUser].setNumEquipe(numEquipe);
	this.listeUtilisateurs[idUser].setIdSession(idSession);
	
	oUtilisateur_BD.SetUtilisateur(this.listeUtilisateurs[idUser], function(reponse){});
},

/*
 * FONCTIONS DE LECTURE
 */
 
Utilisateur_Manager.getIdSession = function(idUser)
{
	if(this.listeUtilisateurs[idUser])
	{
		return this.listeUtilisateurs[idUser].getIdSession();
	}
	return -1;
},

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
	try 
	{
		return this.listeUtilisateurs[idUser].getNumEquipe();
	}
	catch(err)
	{
		EventLog.error("/!\ ERREUR ! UTILISATEUR_MANAGER : GetNumEquipe : " + err);
		return -1;
	}
},

Utilisateur_Manager.getPseudo = function(idUser)
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
		EventLog.log(this.listeUtilisateurs[i].getIdPersonnage() + " == " + idPersonnage);
		if(this.listeUtilisateurs[i].getIdPersonnage() == idPersonnage)
		{
			return i;
		}
	}
	return -1;
},

Utilisateur_Manager.getUsers = function()
{
	var users = new Array();
	for(var i in this.listeUtilisateurs)
	{
		users.push(this.listeUtilisateurs[i].getUser());
	}
	return users;
},

Utilisateur_Manager.getUser = function(idUser)
{
	if(this.listeUtilisateurs[idUser])
	{
		return this.listeUtilisateurs[idUser].getUser();
	}
	else
	{
		return -1;
	}
},

Utilisateur_Manager.deleteUser = function(idUser)
{
	var context = this;
	oUtilisateur_BD.deleteUser(idUser, function(reponse)
	{
		if(reponse == 1)
		{
			delete context.listeUtilisateurs[idUser];
		}
	});
},

Utilisateur_Manager.Save = function()
{
	var context = this;
	for(var idUser in this.listeUtilisateurs)
	{
		oUtilisateur_BD.SetUtilisateur(this.listeUtilisateurs[idUser], function(reponse)
		{
			if (reponse == -1)
			{
				EventLog.error("/!\ UTILISATEUR_MANAGER : erreur ecriture de l'user " + idUser);
			}
			else
			{
				EventLog.log("UTILISATEUR_MANAGER : MAJ de l'user ["+reponse.id +";"+context.listeUtilisateurs[reponse.id].pseudo+"] OK !");
			}
		});
	}
},

Utilisateur_Manager.confirmerCompte = function(idInscription, callbackConfirmerCompte)
{
	console.log("DEBUG : idInscription = " + idInscription);
	var context = this;
	// recherche de l'idUser
	oUtilisateur_BD.GetUtilisateurByIdInscription(idInscription, function(reponse, idUser)
	{
		// si aucun user est trouvé
		if (reponse < 0)
		{
			callbackConfirmerCompte(-1);
			return;
		} 

		// compte déja confirmé
		if (context.listeUtilisateurs[idUser].getCompteConfirme() == true)
		{
			callbackConfirmerCompte(-2);
			return;
		}
		// modifie l'état de l'objet en mémoire
		context.listeUtilisateurs[idUser].confirmerCompte();
	
		// enregistre en BD -> Evite de reconfirmer si le serveur crash avant la prochaine save globale
		oUtilisateur_BD.SetUtilisateur(context.listeUtilisateurs[idUser], function(reponse)
		{
			if (reponse == -1)
			{
				EventLog.error("/!\ UTILISATEUR_MANAGER : erreur ecriture de l'user pour la confirmation du compte !" + idUser);
				callbackConfirmerCompte(-3);
			}
			else
			{
				EventLog.log("UTILISATEUR_MANAGER : MAJ de l'user " + idUser + " en BD OK : Compte confirmé !");
				callbackConfirmerCompte(1);
			}
		});
	});
},

Utilisateur_Manager.getIdPersonnage = function(idUser)
{
	if(this.listeUtilisateurs[idUser])
	{
		return this.listeUtilisateurs[idUser].getIdPersonnage();
	}
	else
	{
		return -1;
	}
},

module.exports = Utilisateur_Manager;
