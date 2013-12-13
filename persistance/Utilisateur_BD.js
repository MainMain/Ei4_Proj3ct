// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
var oPresonnage = require(Personnage_BD);

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
	
},


/**
 * Ajoute un Utilisateur dans la base de donnée
 * 
 * @method Inscription
 */
 
 Utilisateur_BD.Inscription = function(pseudoU,emailU,passU){
 
 
	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	var NewUser = new Utilisateurmodel();
	
	var query = Utilisateurmodel.find({pseudo : pseudoU});
	query.limit(1);
	query.exec(function (err,quser){
		if (err) { throw err; }
		
		var user = quser[0];
		
	if (user.pseudo != pseudoU && user.email != emailU){
			NewUser.pseudo = pseudoU;
			NewUser.pass = passU;
			NewUser.email = emailU;
			
			NewUser.save(function (err) {
				if (err) { throw err; }
				console.log('tu es dans la base maintenant Motherfuker !');
			
			});
		}
	});
	
	var PersonnageModel = mongoose.model('Personnage');
	var NewPerso = new PersonnageModel();
	
	NewPerso = oPersonnage_BD.Creation();
	NewUser.personnage = NewPerso._Id;
	
		
		

	
	
		
 },

 
 module.exports = Utilisateur_BD;



