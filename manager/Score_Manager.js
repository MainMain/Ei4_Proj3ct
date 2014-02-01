// inclusion des règles
var GameRules	= require('../model/GameRules');

var oScore= require('../model/Object/Score');

// persistance
var oScore_BD = require('../persistance/Score_BD');
var oUtilisateur_BD = require('../persistance/Utilisateur_BD');

this.listeScores;
this.idSessionEnCours;

function Score_Manager(){}

Score_Manager.Load = function()
{
	
	// initialise la liste
	
	
	// récupère id des scores
	var score;
	var context = this;
	this.listeScores = {};
	
	oScore_BD.GetIds(function(listeId)
	{
		// pour chaque id de score
		for (var i = 0; i < listeId.length; i++)
		{
			// essayer de charger son score de session
			oScore_BD.GetScoreById(listeId[i], function(idScore, score)
			{
				if (score == -1)
				{
					console.log("/!\ WARNING : SCMANAGER : erreur lecture du score de " + idScore);
				}
				else
				{
					var iduser =  score.idUser;
					var idsession =  score.idSession;
					
					// enregistrement du score
					context.listeScores[iduser] = {};
					context.listeScores[iduser][idsession] = score;
					console.log("-> " + iduser+"<->"+idsession+"<->"+score.id);
				}
			});
		}
	});
},

Score_Manager.Save = function()
{
	// pour chaque score...
	for(var idScore in this.listeScores)
	{
		// ... le sauvegarder en BD
		oScore_BD.SetScore(this.listeScores[idScore],  function(reponse)
		{
			if (reponse == -1)
			{
				console.log("/!\ WARNING : SCMANAGER : erreur ecriture du score de " + idScore);
			}
			else
			{
				console.log("SCMANAGER : MAJ du SCORE de " + idScore + " OK !");
			}
		});
	}
},

Score_Manager.nouvelleSession = function(idSession)
{
	// modifie l'id de session de jeu
	this.idSessionEnCours = idSession;
	
	// créé les scores en BD pour chaque utilisateur
	oUtilisateur_BD.GetUsersId(function(tabId)
	{
		var idUser;
		for(var i in tabId)
		{
			idUser = tabId[i];
			// il crée un score avec l'id de ma nouvelle session
			oScore_BD.Creation(i, idSession);
		}
	});
},

Score_Manager.nouveauJoueur = function(idUser)
{
	// ajout en BD
	oScore_BD.Creation(idUser, idSession, function()
	{
		// puis on le charge en mémoire
		oScore_BD.GetScoreById(idUser, function(idScore, score)
		{
			if (score == -1)
			{
				console.log("/!\ WARNING : SCMANAGER : erreur lecture du score de " + idScore);
			}
			else
			{
				var iduser =  score.idUser;
				var idsession =  score.idSession;
						
				// enregistrement du score
				context.listeScores[iduser] = {};
				context.listeScores[iduser][idsession] = score;
				console.log("-> " + iduser+"<->"+idsession+"<->"+score.id);
			}
		});
	});
},

Score_Manager.compabiliserMeurtre = function(idBourreau, idVictime)
{
	if (idBourreau == "Z")
	{
		this.listeScores[idBourreau][idSessionEnCours].ajoutTueParGoule();
	}
	else if (idBourreau == "N")
	{
		this.listeScores[idBourreau][idSessionEnCours].ajoutTueParGoule();
	}
	else
	{
		this.listeScores[idBourreau][idSessionEnCours].ajoutMeurtre(idVictime);
		this.listeScores[idVictime] [idSessionEnCours].ajoutTueParJoueur(idBourreau);	
	}
},

Score_Manager.compabiliserDepotODD = function(idUser, valeurODD)
{
	this.listeScores[idUser][idSessionEnCours].depotODD(valeurODD);
},

Score_Manager.compabiliserGouleTue = function(idUser, nbr)
{
	this.listeScores[idUser][idSessionEnCours].ajoutGouleTue(nbr);
},

module.exports = Score_Manager;