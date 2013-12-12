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
database.UtilisateurModel;




// --- METHODES DE CLASSE ---

/**
 * Initialisation de la Base de donnée
 * 
 * @method Initialiser
 */
database.Initialiser = function() {
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/DevV1', function(err) {
	if (err) { throw err; }
	});

	var UtilisateurSchema = new mongoose.Schema({
		pseudo : String,
		pass : String,
		email : String,
	});
	
	UtilisateurModel = mongoose.model('Utilisateur',UtilisateurSchema);

},






module.exports = database;

