// inclusion des règles
var GameRules	= require('../model/GameRules');

var oScore= require('../model/Object/Score');

var oUtilisateur_Manager = require('../manager/Utilisateur_Manager');

// persistance
var oScore_BD = require('../persistance/Score_BD');
var oUtilisateur_BD = require('../persistance/Utilisateur_BD');

Score_Manager.listeScores;
Score_Manager.idSessionEnCours;

function Score_Manager(){}

Score_Manager.Load = function (idSession)
{
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
			//for(var jSess = 1; jSess <= context.idSessionEnCours; jSess++)
			//{
			console.log("SC_MANAGER :ENR DU SCORE DE " + tabId[i] + " de SESS "+context.idSessionEnCours);
			// ... le sauvegarder en BD
			oScore_BD.SetScore(context.listeScores[tabId[i]][context.idSessionEnCours],  function(reponse)
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
			//}
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
			console.log("------> SC_MANAGER : nvlle session : creation score : idUser = " + tabId[i]);
			// il crée un score avec l'id de ma nouvelle session
			oScore_BD.Creation(tabId[i], idSession);
		}
	});
},

Score_Manager.nouveauJoueur = function(idUser, idSession)
{
	console.log("SC_MANAGER : nouveauJoueur() - idSession = " + idSession );
	if (idSession == -1) return;
	
	var context = this;
	// ajout en BD
	oScore_BD.Creation(idUser, idSession, function()
	{
		console.log("SC_MANAGER : creation() - idSession = " + idSession );
		// puis on le charge en mémoire
		oScore_BD.GetScoreByIdUser(idUser, function(score)
		{
			console.log("SC_MANAGER : getScoreById() - idSession = " + idSession );
			if (score == -1)
			{
				console.log("/!\ WARNING : SC_MANAGER : erreur lecture du score de " + idScore);
			}
			else
			{
				var iduser =  score.idUser;
				var idsession =  score.idSession;
						
				// enregistrement du score
				context.listeScores[iduser] = {};
				context.listeScores[iduser][idsession] = score;
				console.log("SC_MANAGER :Chargement en mémoire du nouveau score pour le nouveau joueur : " + iduser+"<->"+idsession+"<->"+score.id);
			}
		});
	});
},

Score_Manager.compabiliserMeurtre = function(idBourreau, idVictime)
{
	console.log("SCORE_MANAGER : ComptabiliserMeurtre idB =  " + idBourreau+"<-> idV = "+idVictime);
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
	console.log("------------------------------------- COMPTABILISE GOULE ");
	this.listeScores[idUser][this.idSessionEnCours].ajoutGouleTue(nbr);
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
			if(this.listeScores[i][this.idSessionEnCours])
			{
				myArray.push(this.listeScores[i][this.idSessionEnCours]);
				myArray[j].pseudo = oUtilisateur_Manager.getPseudo(i);
				j++;
			}
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