// inclusion des règles
var GameRules	= require('../model/GameRules');

var oScore= require('../model/Object/Score');

// persistance
var oScore_BD = require('../persistance/Score_BD');
var oUtilisateur_BD = require('../persistance/Utilisateur_BD');

Score_Manager.listeScores;
Score_Manager.idSessionEnCours;

function Score_Manager(){}

Score_Manager.Load = function (idSession) {
	console.log("SCMANAGER : Chargement avec l'id session =  " + idSession);
    // initialise la liste

    // récupère id des scores
	
    var score;
    var context = this;
    this.idSessionEnCours = idSession;
    this.listeScores = new Array();

        // pour chaque id de score....
        oScore_BD.GetIds(function (listeId) 
        {
            // pour chaque id de score
            for (var i = 0; i < listeId.length; i++) 
            {
                // essayer de charger son score de session
                oScore_BD.GetScoreById(listeId[i], function (idScore, score) 
                {
                    if (score == -1)
                    {
                        console.log("/!\ WARNING : SCMANAGER : erreur lecture du score de " + idScore);
                    } 
                    else 
                    {
                        var iduser = score.idUser;
                        var idsession = score.idSession;

                        // enregistrement du score
                        //console.log("-> " + context.listeScores[iduser]);
                        if (typeof context.listeScores[iduser] === "undefined")
                        {
                        	context.listeScores[iduser] = new Array();
                        }
                        context.listeScores[iduser][idsession] = score;
                        //console.log("-> " + iduser + "<->" + idsession + "<->" + score.id);
                    }
                });
            }
        });
},

Score_Manager.Save = function()
{

	var context = this;
	// pour chaque user
	oUtilisateur_BD.GetUsersId(function(tabId)
	{
		for(var i = 0; i < tabId.length; i++)
		{
			//console.log("SCMANAGER :   ---  " + context.idSessionEnCours);
			// pour chaque session
			for(var jSess = 1; jSess <= context.idSessionEnCours; jSess++)
			{
				console.log("SC_MANAGER :ENR DU SCORE DE " + tabId[i] + " de SESS "+jSess);
				// ... le sauvegarder en BD
				oScore_BD.SetScore(context.listeScores[tabId[i]][jSess],  function(reponse)
				{
					if (reponse == -1)
					{
						console.log("/!\ WARNING : SCMANAGER : erreur ecriture du score de " + idScore);
					}
					else
					{
						console.log("SC_MANAGER :ENR DU SCORE DE " + tabId[i] + " de SESS "+jSess+" OK !");
					}
				});
			}
		}
	});
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
			console.log("------> CREATION SCORE : idUser = " + tabId[i]);
			// il crée un score avec l'id de ma nouvelle session
			oScore_BD.Creation(tabId[i], idSession);
		}
	});
},

Score_Manager.nouveauJoueur = function(idUser, idSession)
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
				console.log("SC_MANAGER : Creation socre pour le nouveau joueur : " + oUtilisateur_Manager.GetPseudo(iduser)+"<->"+idsession+"<->"+score.id);
			}
		});
	});
},

Score_Manager.compabiliserMeurtre = function(idBourreau, idVictime)
{
	console.log("SCORE_MANAGER : ComptabiliserMeurtre idB =  " + idBourreau+"<-> idV = "+idVictime);
	if (idBourreau == -1)
	{
		this.listeScores[idVictime][idSessionEnCours].ajoutTueParGoule();
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