// inclusion des règles
var GameRules	= require('../model/GameRules');

var oScore= require('../model/object/Score');

var oUtilisateur_Manager = require('../manager/Utilisateur_Manager');

// persistance
var oScore_BD = require('../persistance/Score_BD');
var oUtilisateur_BD = require('../persistance/Utilisateur_BD');

Score_Manager.listeScores;
Score_Manager.idSessionEnCours;

function Score_Manager(){}

Score_Manager.Load = function (idSession)
{
	EventLog.log("SCMANAGER : Chargement avec l'id session =  " + idSession);
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
					EventLog.log("/!\ WARNING : SCMANAGER : erreur lecture du score de " + idScore);
				} 
				else 
				{
					var iduser = score.idUser;
					var idsession = score.idSession;

					// enregistrement du score
					//EventLog.log("-> " + context.listeScores[iduser]);
					if (typeof context.listeScores[iduser] === "undefined")
					{
						context.listeScores[iduser] = new Array();
					}
					context.listeScores[iduser][idsession] = score;
					//EventLog.log("-> " + iduser + "<->" + idsession + "<->" + score.id);
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
			//EventLog.log("SCMANAGER :   ---  " + context.idSessionEnCours);
			// pour chaque session
			//for(var jSess = 1; jSess <= context.idSessionEnCours; jSess++)
			//{
			EventLog.log("SC_MANAGER :ENR DU SCORE DE " + tabId[i] + " de SESS "+context.idSessionEnCours);
			// ... le sauvegarder en BD
			oScore_BD.SetScore(context.listeScores[tabId[i]][context.idSessionEnCours],  function(reponse)
			{
				if (reponse == -1)
				{
					EventLog.log("/!\ WARNING : SCMANAGER : erreur ecriture du score de " + idScore);
				}
				else
				{
					EventLog.log("SC_MANAGER :ENR DU SCORE DE " + tabId[i] + " de SESS "+jSess+" OK !");
				}
			});
		}
	});
},

Score_Manager.nouvelleSession = function(idSession)
{
	// modifie l'id de session de jeu
	this.idSessionEnCours = idSession;
	this.listeScores = new Array();
	var maListe = this.listeScores;
	
	// créé les scores en BD pour chaque utilisateur
	oUtilisateur_BD.GetUsersId(function(tabId)
	{
		for(var i in tabId)
		{
			var idUser = tabId[i];
			EventLog.log("------> SC_MANAGER : nvlle session : creation score : idUser = " + idUser);
			// il crée un score avec l'id de ma nouvelle session
			oScore_BD.Creation(idUser, idSession, function(idScore)
			{
				oScore_BD.GetScoreByIdUser(idUser, function(score)
				{
					// chargement des scores en mémoire
					EventLog.log("SC_MANAGER : nouvelleSession() - idSession = " + idSession );
					if (score == -1)
					{
						EventLog.log("/!\ WARNING : SC_MANAGER : erreur lecture du score de " + score.id);
					}
					else
					{
						// enregistrement du score
						maListe[idUser] = new Array();
						maListe[idUser][idSession] = score;
						EventLog.log("SC_MANAGER : Chargement en mémoire du nouveau score pour le nouveau joueur : " + idUser + "<->" + idSession + "<->" + idScore);
					}
				});		
			});
			
		}
	});
},

Score_Manager.nouveauJoueur = function(idUser, idSession)
{
	EventLog.log("SC_MANAGER : nouveauJoueur() - idUser = " + idUser );
	EventLog.log("SC_MANAGER : nouveauJoueur() - idSession = " + idSession );
	if (idSession == -1) return;
	
	var context = this;
	// ajout en BD
	oScore_BD.Creation(idUser, idSession, function()
	{
		EventLog.log("SC_MANAGER : creation() - idSession = " + idSession );
		// puis on le charge en mémoire
		oScore_BD.GetScoreByIdUser(idUser, function(score)
		{
			EventLog.log("SC_MANAGER : getScoreById() - idSession = " + idSession );
			if (score == -1)
			{
				EventLog.log("/!\ WARNING : SC_MANAGER : erreur lecture du score de " + score.id);
			}
			else
			{
				// enregistrement du score
				context.listeScores[idUser] = {};
				context.listeScores[idUser][idSession] = score;
				EventLog.log("SC_MANAGER : Chargement en mémoire du nouveau score pour le nouveau joueur : " + idUser+"<->"+idSession+"<->"+score.id);
			}
		});
	});
},

Score_Manager.compabiliserMeurtre = function(idBourreau, idVictime)
{
	EventLog.log("SCORE_MANAGER : ComptabiliserMeurtre idB =  " + idBourreau+"<-> idV = "+idVictime);
	if (idBourreau == -1)
	{
		this.listeScores[idVictime][this.idSessionEnCours].ajoutTueParGoule();
	}
	else
	{
		this.listeScores[idBourreau][this.idSessionEnCours].ajoutMeurtre(idVictime);
		this.listeScores[idVictime] [this.idSessionEnCours].ajoutTueParJoueur(idBourreau);	
	}
},

Score_Manager.compabiliserDepotODD = function(idUser, valeurODD)
{
	this.listeScores[idUser][this.idSessionEnCours].depotODD(valeurODD);
},

Score_Manager.compabiliserGouleTue = function(idUser, nbr)
{
	EventLog.log("------------------------------------- COMPTABILISE GOULE ");
	this.listeScores[idUser][this.idSessionEnCours].ajoutGouleTue(nbr);
},

Score_Manager.deleteUser = function(idUser)
{
	if(this.listeScores[idUser])
	{
		delete this.listeScores[idUser];
	}
},

Score_Manager.getScoreCurrentSession = function(param)
{
	if(this.idSessionEnCours != -1)
	{
		var myArray = new Array();
		var j = 0;
		var sortFunction;
		for(var i in this.listeScores)
		{
			EventLog.log("idUser : " + i);
			/*
			if(this.listeScores[i][this.idSessionEnCours])
			{
				myArray.push(this.listeScores[i][this.idSessionEnCours]);
				myArray[j].pseudo = oUtilisateur_Manager.getPseudo(i);
				j++;
			}
			*/
		}
		switch(param)
		{
			case 0:
				sortFunction = sortByName;
				break;
			case 1:
				sortFunction = sortByNbrMeurtres;
				break;
			case 2:
				sortFunction = sortByNbrMorts;
				break;
			case 3:
				sortFunction = sortByNbrGoules;
				break;
			case 4:
				sortFunction = sortByScoreMeurtre;
				break;
			case 5:
				sortFunction = sortByScoreODD;
				break;
			default:
				sortFunction = sortByName;
				break;
		}
		myArray.sort(sortFunction);
		return myArray;
	}
	return null;
},

sortByName = function(a, b)
{
	var nameA=a.pseudo.toLowerCase();
	var nameB=b.pseudo.toLowerCase();

	if (nameA < nameB) //sort string ascending
	{
		return -1;
	}
	if (nameA > nameB)
	{
		return 1;
	}
	return 0;
},

sortByNbrMeurtres = function(a, b)
{
	return a.nbrMeurtres - b.nbrMeurtres;
},

sortByNbrMorts = function(a, b)
{
	return a.nbrFoisTue - b.nbrFoisTue;
},

sortByNbrGoules = function(a, b)
{
	return a.nbrGoulesTues - b.nbrGoulesTues;
},

sortByScoreMeurtre = function(a, b)
{
	return a.scoreByMeutre - b.scoreByMeutre;
},

sortByScoreODD = function(a, b)
{
	return a.scoreByODD - b.scoreByODD;
},

module.exports = Score_Manager;
