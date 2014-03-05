var mongoose = require('mongoose');
var oItem = require('../persistance/Item_BD');

var EventLog    = require('./EventLog');
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
		pseudo				: String,
		pass				: String,
		email 				: String,
		personnage 			: String,
		numEquipe			: Number,
		idSession			: Number,
	});
	UtilisateurModel = mongoose.model('Utilisateur',UtilisateurSchema);		//creation de la classe utilisateur 
	
	
	/***** CREATION DU SCHEMA "PERSONNAGE" ****/
	var PersonnageSchema = new mongoose.Schema({
		ptSante 			: Number,
		ptSanteMax			: Number,
		ptAction 			: Number,
		ptActionMax 		: Number,
		ptDeplacement 		: Number,
		ptDeplacementMax 	: Number,
		ptFaim 				: Number,
		ptFaimMax 			: Number,
		poidsMax 			: Number,
		gouleLimite 		: Number,
		competence 			: String,
		idSalleEnCours 		: String,
		mode 				: Number,
		multiPtsAttaque 	: Number,
		multiPtsDefense 	: Number,
		multiProbaCache 	: Number,
		multiProbaFouille 	: Number,
		idArmeEquipee 		: Number,
		idArmureEquipee 	: Number,
		sacADos 			: Array,
		dernierMvt 			: String,
		listeMsgAtt 		: Array,
		nbrNvMsg			: Number,
	});
	PersonnageModel = mongoose.model('Personnage',PersonnageSchema); 	
	
	
	/***** CREATION DU SCHEMA "ITEM" ****/
	var ItemSchema = new mongoose.Schema({
		idItem 		: Number,
		nom    		: String,
		description : String,
		poids   	: Number,
		type   		: Number,
		valeur 		: Number,
		imageName	: String,
	});
	ItemModel = mongoose.model('Item',ItemSchema);
	
	
	/***** CREATION DU SCHEMA "CASE" ****/
	var CaseSchema = new mongoose.Schema({
		id : String,
		nom : String,
		description : String,
		probaObjet : Number,
		probaCache : Number,
		nbrGoules : Number,
		listeItem : Array,
		pathImg : String,
	});
	CaseModel = mongoose.model('Case',CaseSchema); 
	
	
	/***** CREATION DU SCHEMA "SESSION" ****/
	var SessionSchema = new mongoose.Schema({
		id 			: Number,
		dateDebut 	: Date,
		dateFin 	: Date,
	});

	SessionModel = mongoose.model('Session',SessionSchema); 
	
	
	/***** CREATION DU SCHEMA "SCORE" ****/
	var ScoreSchema = new mongoose.Schema({
		idUser 			: String,
		idSession		: Number,
		scoreODD		: Number,
		scoreByODD 		: Number,
		scoreByMeutre 	: Number,
		nbrFoisTue 		: Number,
		nbrMeurtres 	: Number,
		nbrGoulesTues 	: Number,
		listeVictimes	: Array,
		listeBourreaux	: Array,
	});
	ScoreModel = mongoose.model('Score',ScoreSchema); 
	
	EventLog.log("SERVEUR : Initialisation Database OK !");
},

module.exports = database;
