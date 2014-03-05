/**
 * Modélisation d'un score
 * 
 * @class Score
 */

//inclusion des règles
var GameRules	= require('../../model/GameRules');
var EventLog    = require('../EventLog');

var Score = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Score.id;
	Score.idUser;
	Score.idSession;
	Score.nbrMeurtres;
	Score.nbrFoisTue;
	Score.scoreByMeutre;
	Score.scoreByODD;
	Score.nbrGoulesTues;
	Score.listeVictimes;
	Score.listeBourreaux;

	// --- METHODES DE CLASSE ---
	Score.build = function() {return new Score();};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Score(id, idUser, idSession, nbrMeurtres, nbrFoisTue, scoreByMeutre, scoreByODD, nbrGoulesTues,
			listeVictimes, listeBourreaux) {
		// --- Attributs d'instance
		this.id				= id;
		this.idUser			= idUser;
		this.idSession		= idSession;
		this.nbrMeurtres	= nbrMeurtres;
		this.nbrFoisTue		= nbrFoisTue;
		this.scoreByMeutre	= scoreByMeutre;
		this.scoreByODD		= scoreByODD;
		this.nbrGoulesTues	= nbrGoulesTues;
		this.listeVictimes	= listeVictimes;
		this.listeBourreaux	= listeBourreaux;
	}

	// --- METHODES D'INSTANCE
	Score.prototype = 
	{
		ajoutMeurtre : function(pseudoVictime) {
			this.nbrMeurtres 			+= 1;
			this.scoreByMeutre 			+= GameRules.jeu_score_gain_meurtre();
			this.listeVictimes.push(pseudoVictime);
		},

	
		ajoutTueParJoueur : function(pseudoBourreau) {
			this.nbrFoisTue 			+= 1;
			this.scoreByMeutre 			-= GameRules.jeu_score_perte_tue();
			this.listeBourreaux.push(pseudoBourreau);
		},
		
		ajoutTueParGoule : function() {
			this.nbrFoisTue 			+= 1;
			this.scoreByMeutre 			-= GameRules.jeu_score_perte_tue();
			this.listeBourreaux.push("une goule");
		},
		
		depotODD : function(valeurODD) {
			this.scoreByODD += valeurODD;
			this.scoreByODDCumule += valeurODD;
		},
		
		ajoutGouleTue : function(nbr)
		{
			this.nbrGoulesTues += nbr;
		}

	};
	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Score;
}());

module.exports = Score;
