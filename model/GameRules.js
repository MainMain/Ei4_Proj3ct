//  Singleton
function GameRules() {
	if (false === (this instanceof GameRules)) {
		return new GameRules();
	}
};

//********** ID DES ZONES SURES **********
GameRules.idZoneSure_1 = function() 						{ return 1; },
GameRules.idZoneSure_2 = function() 						{ return 14; },


//********** COUT EN PA **********
GameRules.coutPA_FouilleRapide = function() 				{ return 4; },
GameRules.coutPA_AttaqueEnnemi = function() 				{ return 5; },
GameRules.coutPA_AttaqueGoule = function()					{ return 3; },
// cout en PA à chaque fois qu'une goule fait rater une attaque
GameRules.coutPA_InterceptionGoule = function() 			{ return 2; },
GameRules.coutPA_ChgtMode = function() 						{ return 2; },
GameRules.coutPA_ChgtMode_def = function() 					{ return 1; },


//********** FONCTION DE COMBAT **********
// défini la probabilité de faire plus ou moins de dégat en attaque
GameRules.combat_variance_PtsAttaque = function() 			{ return (Math.floor((Math.random() * (12-8) + 8) / 10));}, // résultat entre 1.2 et 0.8
GameRules.combat_variance_PtsDefense = function() 			{ return (Math.floor((Math.random() * (12-8) + 8 )/ 10));},
//défini combien de dégats supplémentaires seront infligé si la proba d'au dessus réussi
GameRules.combat_pourcent_UpAttaque = function() 			{ return 20; }, 
GameRules.combat_pourcent_UpDefense = function() 			{ return 20; },
GameRules.combat_ptsAttaque_base_brute = function() 		{ return 6; }, 
GameRules.combat_ptsAttaque_base_explo = function() 		{ return 2; },
GameRules.combat_ptsAttaque_base_chercheur = function() 	{ return 4; },
GameRules.combat_ptsDefense_base = function() 				{ return 0; },
GameRules.combat_proba_perdreItem = function() 				{ return (Math.floor(Math.random() * 100) <= 80) ? true : false ; },


// ********** CONFIGURATION DES GOULES **********
//minimun de goules qui spawn dans chaque case par jour
GameRules.goules_RespawnMin = function() 					{ return 2; }, 
//maximun de goules qui spawn dans chaque case par jour
GameRules.goules_RespawnMax = function() 					{ return 10;}, 
// calcul un nbr aléatoire de nombre de goule
GameRules.goules_nbrNouvellesGoules = function()			{ return (Math.floor(Math.random() * (10-2) + 2 ));},
//minimun de pts d'attaque par goules
GameRules.goules_PtsAttaqueMin = function() 				{ return 3; },
//maximun de pts d'attaque par goules
GameRules.goules_PtsAttaqueMax = function() 				{ return 8; }, 
// donne un nombre de dégat de goules aléatoire
GameRules.goules_GetPtsAttaque = function() 				{ return (Math.floor(Math.random() * (8-3) + 3 )); },
//Proba que une goule fasse rater l'action
GameRules.goules_proba_Interception = function() 			{ return (Math.floor(Math.random() * 100) <= 35) ? true : false ; }, 
// Proba de tuer deux goules au lieu d'une seule
GameRules.goules_proba_TuerDeuxGoules = function() 			{ return (Math.floor(Math.random() * 100) <= 20) ? true : false ; }, 

// ********** AUTRES **********
// différence max de nombre de joueurs entre les équipes
GameRules.jeu_diffMaxEntreEquipes = function() 				{ return 4; }, 
// temps de fouilles
GameRules.jeu_duree_fouille = function() 					{ return 1000 * 5/*60 * 60*/ ; }, // 1 heure
// Gain de score quand meurtre
GameRules.jeu_score_gain_meurtre = function() 				{ return 3; }, 
// Perte score quand tué
GameRules.jeu_score_perte_tue = function() 					{ return 1; }, 
// en dessous de 10 pt de faim, le malus = ptFaim / ce nombre
GameRules.faim_malus = function()							{ return 10; },
// multiplicateur minimal de malus
GameRules.faim_malus_max = function()						{ return 0.3; },
// export
module.exports = GameRules;