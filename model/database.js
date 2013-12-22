var mongoose = require('mongoose');

/**
 * Modélisation d'une base de donnée
 * 
 * @class database
 */
function database() {
	if (false === (this instanceof database)) {
		return new database();
	}
};

// --- ATTRIBUTS DE CLASSE ---





// --- METHODES DE CLASSE ---

/**
 * Initialisation de la Base de donnée
 * 
 * @method Initialiser
 */
database.Initialiser = function() {
	mongoose.connect('mongodb://localhost/DevV1', function(err) {
	if (err) { throw err; }
	});

	var UtilisateurSchema = new mongoose.Schema({		//creation de la structure d'un utilisateur
		pseudo : String,
		pass : String,
		email : String,
		presonnage : String,
		nbrMeurtres : Number,
		nbrMeurtresCumule : Number,
		nbrFoisTue : Number,
		nbrFoisTueCumule : Number,
		numEquipe : Number,
	});
	
	UtilisateurModel = mongoose.model('Utilisateur',UtilisateurSchema);		//creation de la classe utilisateur 
	
	var PersonnageSchema = new mongoose.Schema({
		ptSante : Number,
		ptSanteMax : Number,
		ptAction : Number,
		ptActionMax : Number,
		ptDeplacement : Number,
		ptDeplacementMax : Number,
		poidsMax : Number,
		gouleLimite : Number,
		competence : String,
		idSalleEnCours : String,
		idArmeEquipee : String,
		idArmureEquipee : String,
		sacADos : Array,
	
	});
	
	PersonnageModel = mongoose.model('Personnage',PersonnageSchema); 	
	
	console.log("Initialisation Database");
},






module.exports = database;

