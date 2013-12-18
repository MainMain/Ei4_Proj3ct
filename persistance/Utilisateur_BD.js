// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
var oPersonnageDB = require('./Personnage_BD');
var oUtilisateur = require('../model/object/Utilisateur');




/**
 * UTILISATEUR : COMMUNICATION SERVEUR <-> BD
 * 
 * @class Utilisateur_BD
 */
function Utilisateur_BD() {
	if (false === (this instanceof Utilisateur_BD)) {
		return new Utilisateur_BD();
	}
};

/**
 * ENVOI UN UTILISATEUR POUR METTRE A JOUR CES PROPRIETES
 * 
 * @method SetUtilisateur
 */
Utilisateur_BD.SetUtilisateur = function(utilisateurToSave) {
	
},

/**
 * RENVOIE UN UTILISATEUR AVEC SON ID PASSE EN PARAMETRE
 * 
 * @method GetUtilisateur
 */
Utilisateur_BD.GetUtilisateur = function(idUtilisateur) {
	
	var Utilisateurmodel = mongoose.model('Utilisateur'); 
	var queryU = Utilisateurmodel.find({_id : idUtilisateur});
	
	queryU.exec(function (err, NewUser) {
	if (err)  throw err;
	
	return oUtilisateur(
		NewUser._id,NewUser.pseudo,NewUser.email,NewUser.pass,
		NewUser.nbrMeurtres,NewUser.nbrMeurtresCumule,
		NewUser.nbrFoisTue,NewUser.nbrFoisTueCumule,
		NewUser.numEquipe,NewUser.personnage);
	});
	


},

/**
 * AJOUTE UN UTILISATEUR DANS LA BASE DE DONNEES
 * Renvoi le user si inscription ok
 * Renvoi 0 si erreur
 * Renvoi -1 si pseudo deja pris
 * Renvoi -2 si email deja pris
 * @method Inscription
 */

 
Utilisateur_BD.Inscription = function(pseudoU,emailU,passU, callbackInscription)
{
 	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	
	var userExiste = true;
	var mailExiste = true;
	
	var sauvegarde = 0;
	
	var NewUser = new Utilisateurmodel();
	
	NewUser.pseudo = pseudoU;
	NewUser.pass = passU;
	NewUser.email = emailU;
	NewUser.nbrMeurtres = 0;
	NewUser.nbrMeurtresCumule = 0;
	NewUser.nbrFoisTue = 0;
	NewUser.nbrFoisTueCumule = 0;
	NewUser.numEquipe = 0;
	
	Utilisateurmodel.find({pseudo: pseudoU}, function (err, testuseru)
	{
		if (err)
		{
			throw err;
		}		

		if(typeof testuseru[0] === "undefined")
		{
			userExiste = false;
		}
		else
		{
			userExiste = true;
		}
		
		Utilisateurmodel.find({email: emailU}, function (err, testusere)
		{
			if (err)
			{
				throw err;
			}
			
			if(typeof testusere[0] === "undefined")
			{
				mailExiste = false;
			}
			else
			{
				mailExiste = true;
			}
			
			if (userExiste)
			{
				sauvegarde = -1;
			}
			
			if(mailExiste)
			{
				sauvegarde = -2;
			}
			
			if(sauvegarde == -1 || sauvegarde == -2)
			{
				callbackInscription(sauvegarde);
			}
			else
			{
				NewUser.save(function (err)
				{
					if (err)
					{
						throw err;
					}
					console.log('Tu es dans la base maintenant !');
		
					var PersonnageModel = mongoose.model('Personnage');
					var NewPerso = new PersonnageModel();
					
					NewPerso = oPersonnageDB.Creation(0,0,0,0,0,"");
					console.log(NewPerso._id);
					NewUser.presonnage = NewPerso._id;
		
					NewUser.save(function (err)
					{
						if (err)
						{
							throw err;
						}
						console.log('Fini boy <3 !');
						
						callbackInscription(new oUtilisateur(
							NewUser._id,NewUser.pseudo,NewUser.email,NewUser.pass,
							NewUser.nbrMeurtres,NewUser.nbrMeurtresCumule,
							NewUser.nbrFoisTue,NewUser.nbrFoisTueCumule,
							NewUser.numEquipe,NewUser.personnage));
					});
				});
			}
		});
	});
},
 
 /**
 *	Renvoi 1 si le pseudo n'existe pas, 2 si le mot de passe ne coresspond pas au pseudo et 0 si tout est en règle 
 * Renvoi 1 si conexion ok
 * Renvoi 0 si erreur
 * Renvoi -1 si le password ne corespond pas
 * @method Connexion
 */
 
 Utilisateur_BD.Connexion = function (pseudoU, passU, callbackConnexion)
 {
	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	
	var NewUser = new Utilisateurmodel();
	
	Utilisateurmodel.find({pseudo : pseudoU}, function(err, user)
	{
		if (err)
		{
			throw err;
		}
		
		if(typeof user[0] === "undefined")
		{
			callbackConnexion(-1);
		}
		else if(user[0].pass != passU)
		{
			callbackConnexion(-1);
		}
		else
		{
			callbackConnexion(1);
		}
	});
},
 
 
 

 
 module.exports = Utilisateur_BD;