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
	this.largeur = largeur;
	this.hauteur = hauteur;
	
	console.log("CARTE : Initialisation carte");
	this.matrice=new Array(hauteur);
	for (i=0; i <hauteur; i++)
	{
		this.matrice[i]=new Array(largeur);
	}
	this.matrice[0]=([-1,-	1,		-1,	-1,	-1]);
	this.matrice[1]=([-1, 	0,		-1,  1,	-1]);
	this.matrice[2]=([-1, 	'1_a', 	 2,	 4,	-1]);
	this.matrice[3]=([-1, 	'1_b', 	 6,	 7,	-1]);
	this.matrice[4]=([-1,	-1,		-1,	-1,	-1]);
	
	 /*this.matrice[0]=([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);

	 this.matrice[1]=([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,31,-1,-1,-1,-1,-1,-1,-1]);
	
	 this.matrice[2]=([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,30,-1,-1,-1,-1,-1,-1,-1]);
	
	 this.matrice[3]=([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,27,29,-1,-1,-1,-1,-1,-1]);
	 
	 this.matrice[4]=([-1,-1,-1,-1,-1,-1,-1,-1,-1,48,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1,35,-1]);
	
	 this.matrice[5]=([-1,-1,-1,-1,-1,-1,-1,26, 0,47, 0, 0, 0, 0, 0, 0,49, 0,50,32,33, 0, 0, 0, 0,34,-1]);
	
	 this.matrice[6]=([-1,-1,-1,-1,25, 0, 0,24,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1]);
	
	 this.matrice[7]=([-1,-1,-1,-1,-1,-1,-1, 0,-1, 0,-1,17,15,-1,-1,14,-1,-1, 5, 4,-1, 3,-1,57,-1, 0,-1]);
	
	 this.matrice[8]=([-1,-1,-1,-1,-1,-1,-1, 0,-1, 0,-1,18,16,13, 0,54, 0, 7, 0, 6, 0,55, 2, 1,-1, 0,-1]);
	
	 this.matrice[9]=([-1,-1,-1,-1,-1,-1,-1, 0,-1, 0,-1,-1,-1,12,-1,11,-1, 8,-1,10,-1, 9,-1,-1,-1, 0,-1]);
	
	this.matrice[10]=([-1,-1,-1,-1,-1,-1,-1, 0,-1, 0,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1, 0,-1]);
	
	this.matrice[11]=([-1,-1,-1,-1,-1,-1,-1, 0,-1, 0,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1, 0,-1]);
	
	this.matrice[12]=([-1,-1,51,-1,23,58,-1, 0,-1,46,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,36,-1]);
	
	this.matrice[13]=([-1,-1, 0,-1, 0,-1,-1, 0,-1, 0,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1, 0,-1]);

	this.matrice[14]=([-1,22,52 ,0,56, 0, 0,19, 0,45, 0, 0, 0,44,43, 0,42,41, 0, 0, 0,40,39,38, 0,37,-1]);

	this.matrice[15]=([-1,-1,21,-1,-1,-1,-1,20,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);

	this.matrice[16]=([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);*/
	
	console.log("MATRICE : " + this.matrice);
	
	//console.log("CARTE : " + this.matrice);
	
	// récupérer la matrice de la BD
	/*this.matrice = [];
	for (var i = 0; i < largeur; i++) {
		this.matrice[i] = [];
		for (var j = 0; j < hauteur; j++) {
			this.matrice[i][j] = (i * 4 + j);
		}
	}
	;*/
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
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			if (this.matrice[i][j] == idSalle) {
				var tuple = {
					x : i,
					y : j
				};
				console.log("CARTE : GetCoordSalleById : ");
				console.log(tuple);
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
	var i=1;
	if (direction.toUpperCase() == 'NORD') {
		while(this.GetIdSalleByCoord(tuple.x -i, tuple.y)==0)
		{
			i++;
		}
		return this.GetIdSalleByCoord(tuple.x -1, tuple.y);
	} else if (direction.toUpperCase() == 'SUD') {
		while(this.GetIdSalleByCoord(tuple.x +i, tuple.y)==0)
		{
			i++;
		}
		return this.GetIdSalleByCoord(tuple.x + 1, tuple.y);
	} else if (direction.toUpperCase() == 'EST') {
		while(this.GetIdSalleByCoord(tuple.x, tuple.y+i)==0)
		{
			i++;
		}
		return this.GetIdSalleByCoord(tuple.x, tuple.y + 1);
	} else if (direction.toUpperCase() == 'OUEST') {
		while(this.GetIdSalleByCoord(tuple.x, tuple.y-i)==0)
		{
			i++;
		}
		return this.GetIdSalleByCoord(tuple.x, tuple.y - 1);
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