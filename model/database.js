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

	/***** CREATION DU SCHEMA "UTILISATEUR" ****/
	var UtilisateurSchema = new mongoose.Schema({		//creation de la structure d'un utilisateur
		pseudo : String,
		pass : String,
		email : String,
		personnage : String,
		nbrMeurtres : Number,
		nbrMeurtresCumule : Number,
		nbrFoisTue : Number,
		nbrFoisTueCumule : Number,
		numEquipe : Number,
	});
	UtilisateurModel = mongoose.model('Utilisateur',UtilisateurSchema);		//creation de la classe utilisateur 
	
	/***** CREATION DU SCHEMA "PERSONNAGE" ****/
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
	
	
	

	
	/***** CREATION DU SCHEMA "CASE" ****/
	var CaseSchema = new mongoose.Schema({
		nom : String,
		description : String,
		probaObjet : Number,
		probaCache : Number,
		itemsAuSol : Array,
		nbrGoules : Number,
	});
	CaseModel = mongoose.model('Case',CaseSchema); 
	

	PersonnageModel = mongoose.model('Personnage',PersonnageSchema); 

/***** CREATION DU SCHEMA "ITEM" ****/
	var ItemSchema = new mongoose.Schema({
		nom = String,
		description = String,
		poids = Number,
		type = Number,
		valeur = Number,
		imageName = String,
	});
	
	ItemModel = mongoose.model('Item',ItemSchema);
	
	var ItemBaseSchema = new mongoose.Schema({
		nom = String,
		description = String,
		poids = Number,
		type = Number,
		valeur = Number,
		imageName = String,
		indice = Number,
	});
	
	ItemBaseModel = mongoose.model('item',	ItemBaseSchema);

	
	console.log("Initialisation Database");
},






module.exports = database;

