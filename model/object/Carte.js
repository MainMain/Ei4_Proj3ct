/**
 * Modélisation d'une carte
 * 
 * @class Carte
 */
function Carte() {
	if (false === (this instanceof Carte)) {
		return new Carte();
	}
};

// --- ATTRIBUTS DE CLASSE ---
Carte.matrice; // matrice des id de cases
//Carte.listeCases;
Carte.largeur;
Carte.hauteur;

// --- ENUMERATIONS DE CLASSE ---
Carte.DIRECTIONS = [ 'NORD', 'SUD', 'EST', 'OUEST' ];

// --- METHODES DE CLASSE ---

/**
 * Récupère la matrice à partir de la BDD
 * 
 * @method Initialiser
 */
Carte.Initialiser = function(largeur, hauteur) {
	console.log("CARTE : Initialisation carte");
	// récupérer la matrice de la BD
	this.matrice = [];
	for (var i = 0; i < largeur; i++) {
		this.matrice[i] = [];
		for (var j = 0; j < hauteur; j++) {
			this.matrice[i][j] = (i * 4 + j);
		}
	}
	;
	console.log("CARTE : Initialisation liste cases");
	// listeCases = new Array(largeur * hauteur);
},

Carte.ActualiserSalle = function(idSalle) {
	// chercher infos dans la BD
},

/**
 * Actualise la salle en cours Doit être déclenchée quand le serveur relève un
 * ... ... changement faite par un autre joueur
 * 
 * @method ActualiserSalle
 */
Carte.ActualiserSalle = function(idSalle) {
	// chercher infos dans la BD
},

/**
 * Actualise la salle en cours Doit être déclenchée quand le serveur relève un
 * ... ... changement faite par le joueur en cours
 * 
 * @method UpdateSalle
 */
Carte.UpdateSalle = function(idSalle) {
	// écrire infos dans la BD
},

/**
 * RENVOI L'ID DE LA CASE D'UNE COORDONNEE DONNEE
 * 
 * @method GetIdSalleByCoord
 */
Carte.GetIdSalleByCoord = function(x, y) {
	try {
		console.log("CARTE : DEBUG GetIdSalleByCoord : x = " + x + " y = " + y
				+ " id = " + this.matrice[x][y]);
		return this.matrice[x][y];
	} catch (err) {
		console.log("CARTE : DEBUG GetIdSalleByCoord : x = " + x + " y = " + y
				+ " id = NULL ");
		return -1;
	}
},

/**
 * Renvoi de les coordonnées de l'id de la salle
 * 
 * @method GetIdSalleByCoord
 */
Carte.GetCoordSalleById = function(idSalle) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (this.matrice[i][j] == idSalle) {
				var tuple = {
					x : i,
					y : j
				};
				return tuple;
			}
		}
	}
	return null;
},

/**
 * Renvoi de l'id de la case d'une coordonnée donnée
 * 
 * @method GetIdSalleSuivante
 */
Carte.GetIdSalleSuivante = function(idSalleEnCours, direction) {
	// Vérification de la direction demandée
	if (typeof direction !== 'string'
			&& Carte.DIRECTIONS.indexOf(direction.toUpperCase()) === -1) {
		throw 'Direction argument invalid!';
	}
	var tuple = this.GetCoordSalleById(idSalleEnCours);
	console.log("CARTE : DEBUG GetIdSalleSuivante : x = " + tuple.x + " y = "
			+ tuple.y + " direction = " + direction);
	if (direction.toUpperCase() == 'NORD') {
		return this.GetIdSalleByCoord((tuple.x), tuple.y - 1);
	} else if (direction.toUpperCase() == 'SUD') {
		return this.GetIdSalleByCoord(tuple.x, tuple.y + 1);
	} else if (direction.toUpperCase() == 'EST') {
		return this.GetIdSalleByCoord(tuple.x - 1, tuple.y);
	} else if (direction.toUpperCase() == 'OUEST') {
		return this.GetIdSalleByCoord(tuple.x + 1, tuple.y);
	}
	console.log("## WARNING ## CARTE :: return -1 (Carte.js)");
	return -1;
};

module.exports = Carte;

/*
 * matrice = new Array(3); for (i = 1; i <= 3; i++) { this.matrice[i] = new
 * Array(); }
 */
/*
 * var matrice = []; for(var i=0; i<4; i++) { matrice[i] = new Array(3); } for
 * (i = 0; i < 4; i++) { for (j = 0; j < 3; j++) { this.matrice[i][j] = (i * 4 +
 * j); } ; } ;
 */