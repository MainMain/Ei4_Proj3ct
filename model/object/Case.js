/**
 * Modélisation d'une case
 * 
 * @class case
 */
var Case = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Case.id = 1;
	Case.nom = "Aucun";
	Case.probaObjet = 0;
	Case.probaCache = 0;
	Case.objetsAuSol = 0;
	Case.nbrGoules = 0;

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	Personnage.build = function(id, name, probaObjet, probaCache, objetsAuSol,
			nbrGoules) {
		this.id = id;
		this.name = name;
		this.probaObjet = probaObjet;
		this.probaCache = probaCache;
		this.objetsAuSol = objetsAuSol;
		this.nbrGoules = nbrGoules;

		return new Personnage(name);
	};

	// --- METHODES DE CLASSE ---

	// --- METHODES D'INSTANCE
	Personnage.prototype = {

	};

	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Case;
}());

module.exports = Case;
