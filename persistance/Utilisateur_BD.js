// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
var oPersonnageDB = require('../Persistance/Personnage_BD');
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
 * retourn -1 si l'utilisateur n'est pas trouvé
 * retourn le nouvel utilisateur si tout est ok
 * @method SetUtilisateur
 */
 
Utilisateur_BD.SetUtilisateur = function(utilisateurToSave,callbackSetUtilisateur) {
	var Utilisateurmodel = mongoose.model('Utilisateur'); 
	Utilisateurmodel.find({_id : utilisateurToSave.id},function (err, NewUser)
	{
		if (err)
		{
			throw (err);
		}
		
		if (typeof NewUser[0] === "undefined")
		{
			callbackSetUtilisateur(-1);	
		}
		else
		{
			NewUser[0].pseudo = utilisateurToSave.pseudo;
			NewUser[0].email = utilisateurToSave.email;
			NewUser[0].personnage = utilisateurToSave.idPersonnage;
			NewUser[0].nbrMeurtres = utilisateurToSave.nbrMeurtres;
			NewUser[0].nbrMeurtresCumule = utilisateurToSave.nbrMeurtresCumule;
			NewUser[0].nbrFoisTue = utilisateurToSave.nbrFoisTue;
			NewUser[0].nbrFoisTueCumule = utilisateurToSave.nbrFoisTueCumule;
			NewUser[0].numEquipe = utilisateurToSave.numEquipe;
			
			NewUser[0].save(function (err)
					{
						if (err)
						{
							throw err;
						}
						console.log('Mis a jour de l\'utilisateur!');
						
						callbackSetUtilisateur(new oUtilisateur(
							NewUser._id,NewUser.pseudo,NewUser.email,NewUser.pass,
							NewUser.nbrMeurtres,NewUser.nbrMeurtresCumule,
							NewUser.nbrFoisTue,NewUser.nbrFoisTueCumule,
							NewUser.numEquipe,NewUser.personnage));
					});
			
		}
		
		
	});
},

/**
 * RENVOIE UN UTILISATEUR AVEC SON ID PASSE EN PARAMETRE
 * retourn un utilisateur si ok
 * retourn -1 l'utilisateur n'est pas trouvé
 * @method GetUtilisateur
 */
Utilisateur_BD.GetUtilisateur = function(idUtilisateur,callbackGetUtilisateur) {
	
	var Utilisateurmodel = mongoose.model('Utilisateur');
		
	Utilisateurmodel.find({_id : idUtilisateur},function (err, NewUser)
	{
		if (err)  
		{
			throw err;
		}
		
		if (typeof NewUser[0] === "undefined")
		{
			console.log("Get Utilisateur : undefined");
			callbackGetUtilisateur(-1);	
		}
		else
		{
			console.log("Appelle du callBack avec un utilisateur")
			callbackGetUtilisateur( new oUtilisateur(
				NewUser[0]._id,NewUser[0].pseudo,NewUser[0].email,
				NewUser[0].nbrMeurtres,NewUser[0].nbrMeurtresCumule,
				NewUser[0].nbrFoisTue,NewUser[0].nbrFoisTueCumule,
				NewUser[0].numEquipe,NewUser[0].personnage));
		}
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
 
Utilisateur_BD.Inscription = function(pseudoU, passU, emailU, req, res, callbackInscription)
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
				callbackInscription(sauvegarde, req, res);
			}
			else
			{		
				var PersonnageModel = mongoose.model('Personnage');
				var NewPerso = new PersonnageModel();
				
				NewPerso = oPersonnageDB.Creation(80,20,15,30,4,"voleur");
				
				console.log('BASE DE DONNEES : ID du perso cree ' + NewPerso._id);
				NewUser.personnage = NewPerso._id;
				
				NewUser.save(function (err)
				{
					if (err)
					{
						throw err;
					}
					console.log('BASE DE DONNEES : Utilisateur inscrit dans la base !');
						
					callbackInscription(1, req, res);
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
 
 Utilisateur_BD.Connexion = function (pseudoU, passU, req, res, callbackConnexion)
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
			callbackConnexion(-1, req, res);
		}
		else if(user[0].pass != passU)
		{
			callbackConnexion(-1, req, res);
		}
		else
		{
			console.log("USER_BD : id de l'user = " + user[0].id);
			callbackConnexion(user[0].id, req, res);
		}
	});
},
 
Utilisateur_BD.test = function()
{
	console.log("COUCOU");
},
 

 
 module.exports = Utilisateur_BD;