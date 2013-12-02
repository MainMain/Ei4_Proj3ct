/**
 * Modélisation d'une case
 * 
 * @class case
 */
var Case = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Case.id;
	Case.nom;
	Case.description;
	Case.probaObjet;
	Case.probaCache;
	Case.objetsAuSol;
	Case.nbrGoules;

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	Case.build = function(id, name, probaObjet, probaCache, objetsAuSol,nbrGoules) {
		return new  Case(id, name, probaObjet, probaCache, objetsAuSol,nbrGoules);
	};

	// --- METHODES DE CLASSE ---
	function Case(id, name, probaObjet, probaCache, objetsAuSol,nbrGoules) {
		this.id = id;
		this.nom = name;
		this.probaObjet = probaObjet;
		this.probaCache = probaCache;
		this.objetsAuSol = objetsAuSol;
		this.nbrGoules = nbrGoules;
	}
	
	// --- METHODES D'INSTANCE
	Case.prototype = {

	};

	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Case;
}());

module.exports = Case;
