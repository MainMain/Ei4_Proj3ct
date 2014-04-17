// inclusion des règles
var GameRules	= require('../model/GameRules');

var oScore= require('../model/object/Score');

var oUtilisateur_Manager = require('../manager/Utilisateur_Manager');

var EventLog    = require('../model/EventLog');

// persistance
var oScore_BD = require('../persistance/Score_BD');
var oUtilisateur_BD = require('../persistance/Utilisateur_BD');

Score_Manager.listeScores;
Score_Manager.idSessionEnCours;

function Score_Manager(){}

Score_Manager.Load = function (idSession)
{
	EventLog.log("SCORE_MANAGER : Initialisation avec l'id session =  " + idSession);
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
					EventLog.error("/!\ WARNING : SCMANAGER : erreur lecture du score de " + idScore);
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
					if (context.listeScores[iduser][idsession]) EventLog.error("Doublon au chargement du score de " + oUtilisateur_Manager.getPseudo(iduser) + " pour la session : " + idsession );
					context.listeScores[iduser][idsession] = score;
					EventLog.log("SCORE_MANAGER : Load() : Chargement en mémoire du score de " + oUtilisateur_Manager.getPseudo(iduser) + " pour la session : " + idsession );
				}
			});
		}
	});
},

Score_Manager.Save = function()
{
	var context = this;
	var currentScore;
	// pour chaque user...
	oUtilisateur_BD.GetUsersId(function(tabId)
	{
		for(var i = 0; i < tabId.length; i++)
		{
			//EventLog.log("SCMANAGER :   ---  " + context.idSessionEnCours);
			// pour chaque session
			//for(var jSess = 1; jSess <= context.idSessionEnCours; jSess++)
			//{
			
			// ... sauvegarder son score de la session en cours en BD
			try 
			{ 
				currentScore = context.listeScores[tabId[i]][context.idSessionEnCours]; 
		
				if (! (typeof currentScore === "undefined"))
				{
					oScore_BD.SetScore(currentScore,  function(reponse)
					{
						if (reponse == -1)
						{
							EventLog.error("/!\\ WARNING : SCMANAGER : erreur ecriture du score de " + idScore);
						}
						else
						{
							EventLog.log("SCORE_MANAGER : MAJ du score de " + oUtilisateur_Manager.getPseudo(tabId[i]) + " pour la session "+context.idSessionEnCours+" OK !");
						}
					});
				}
			}
			catch(err) { EventLog.error("SCORE_MANAGER : Save() : " + err + " (utilisateur sans score)"); }
		}
	});
},

Score_Manager.nouvelleSession = function(idSession)
{
	// modifie l'id de session de jeu
	this.idSessionEnCours = idSession;
	//this.listeScores = new Array();
	//var maListe = this.listeScores;
	
	/*
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
						EventLog.error("/!\\ WARNING : SC_MANAGER : erreur lecture du score de " + score.id);
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
	});*/
},

Score_Manager.createScore = function(idUser, equipe, callback)
{
	var context = this;
	// il crée un score avec l'id de ma nouvelle session
	oScore_BD.Creation(idUser, this.idSessionEnCours, equipe, function(idScore)
	{
		// on le récupère
		oScore_BD.GetScoreById(idScore, function(idScore, score)
		{
			// chargement des scores en mémoire
			EventLog.log("SC_MANAGER : createScore() - idUser = " + idUser + " idSession = " + context.idSessionEnCours);
			if (score == -1)
			{
				EventLog.error("/!\\ WARNING : SC_MANAGER : erreur lecture du score de " + score.id);
			}
			else
			{
				// enregistrement du score
				context.listeScores[idUser] = new Array();
				context.listeScores[idUser][context.idSessionEnCours] = score;
				
				EventLog.log("SC_MANAGER : Chargement en mémoire du nouveau score pour le nouveau joueur : " + idUser + "<->" + context.idSessionEnCours);
				EventLog.log(score);
				callback();
			}
		});		
	});
	
	
},
/*
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
				EventLog.error("/!\\ WARNING : SC_MANAGER : erreur lecture du score de " + score.id);
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
*/
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
	EventLog.log("SCORE_MANAGER : comptabilisation de " + nbr + "  goule(s) tuée(s) pour le joueur " + idUser);
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


Score_Manager.getBilanScoreSession = function(idUser, idSession)
{
	console.log("SCORE_MANAGER : GetBilanScoreSession pour session = " + idSession);
	
	var currentScore, scoreTotal;
	var struct = 
	{
		"scoreAGI_odd"		: 0,
		"scoreINNO_odd" 	: 0,
		"scoreQSF_odd"  	: 0,
		"scoreAGI_meurtre"	: 0,
		"scoreINNO_meurtre" : 0,
		"scoreQSF_meurtre"  : 0,
		"scoreAGI"			: 0,
		"scoreINNO" 		: 0,
		"scoreQSF"  		: 0,
		"nbrAGI"			: 0,
		"nbrINNO"			: 0,
		"nbrQSF"			: 0,
		"nbrTotal"			: 0,
		"scoreODD"  		: 0,
		"nbrMeurtres"		: 0,
		"nbrFoisTue"		: 0,
		"scoreMeurtre"  	: 0,
		"nbrGoulesTues"  	: 0,
		"sortByNbrMorts"  	: 0,
		"total"				: 0,
		"AGI_meurtres"		: 0,
		"AGI_tués"			: 0,
		"AGI_zombies"		: 0,
		"INNO_meurtres"		: 0,
		"INNO_tués"			: 0,
		"INNO_zombies"		: 0,
		"QSF_meurtres"		: 0,
		"QSF_tués"			: 0,
		"QSF_zombies"		: 0,
		"lastSession"		: 0,
		"nbrAGI_sessionEnCours"		: 0,
		"nbrINNO_sessionEnCours"	: 0,
		"nbrQSF_sessionEnCours"		: 0,
		"lastIdSession"		: idSession
	};
	
	for(var currentIdUser in this.listeScores)
	{
		//console.log(">>>> currentIduser = " + currentIdUser);
		for(var currentIdSession in this.listeScores[currentIdUser])
		{
			currentScore = this.listeScores[currentIdUser][currentIdSession];
			
			
			//console.log(currentIdUser + " - " + currentIdSession +" :");
			//console.log(currentScore);
			//console.log(">>>> currentIdSession = " + currentIdSession);
			//console.log(">>>> id score = " + this.listeScores[currentIdUser][currentIdSession].id);
			if (!(typeof currentScore === "undefined"))
			{
				//console.log(">>>>>>>>> id session = " + idSession);
				if (currentScore.idSession == idSession)
				{
					struct["nbrTotal"] += 1;
					if (currentScore.idUser == idUser)
					{
						console.log("SCORE_MANAGER : getBilanScoreSession()  user trouvé !");
						struct["scoreODD"]		= currentScore.scoreByODD ;
						struct["nbrMeurtres"]	= currentScore.nbrMeurtres ;
						struct["nbrFoisTue"]	= currentScore.nbrFoisTue ;
						struct["scoreMeurtre"]	= currentScore.scoreByMeutre ;
						struct["nbrGoulesTues"]	= currentScore.nbrGoulesTues ;
						struct["total"] = currentScore.scoreByODD + currentScore.scoreByMeutre;
					}
					scoreTotal = currentScore.scoreByMeutre + currentScore.scoreByODD;
					
					if (currentScore.numEquipe == 1)
					{
						struct["scoreAGI"] 			+= scoreTotal;
						struct["scoreAGI_odd"] 		+= currentScore.scoreByODD;
						struct["scoreAGI_meurtre"] 	+= currentScore.scoreByMeutre;
						struct["nbrAGI"]			+= 1;
						struct["AGI_meurtres"] 		+= currentScore.nbrMeurtres;
						struct["AGI_tués"] 			+= currentScore.nbrFoisTue;
						struct["AGI_zombies"]		+= currentScore.nbrGoulesTues ;
					}
					else if (currentScore.numEquipe == 2)
					{
						struct["scoreINNO"] 		+= scoreTotal;
						struct["scoreINNO_odd"] 	+= currentScore.scoreByODD;
						struct["scoreINNO_meurtre"] += currentScore.scoreByMeutre;
						struct["nbrINNO"]			+= 1;
						struct["INNO_meurtres"] 	+= currentScore.nbrMeurtres;
						struct["INNO_tués"] 		+= currentScore.nbrFoisTue;
						struct["INNO_zombies"]		+= currentScore.nbrGoulesTues;
					}
					else if (currentScore.numEquipe == 3)
					{
						struct["scoreQSF"] 			+= scoreTotal;
						struct["scoreQSF_odd"] 		+= currentScore.scoreByODD;
						struct["scoreQSF_meurtre"] 	+= currentScore.scoreByMeutre;
						struct["nbrQSF"]			+= 1;
						struct["QSF_meurtres"] 		+= currentScore.nbrMeurtres;
						struct["QSF_tués"] 			+= currentScore.nbrFoisTue;
						struct["QSF_zombies"]		+= currentScore.nbrGoulesTues;
					}
				} // fin if idSession = sessionEnCours
				else if (currentScore.idSession == this.idSessionEnCours)
				{
					if (currentScore.numEquipe == 1)
					{
						struct["nbrAGI_sessionEnCours"]		+= 1;
					}
					else if (currentScore.numEquipe == 2)
					{
						struct["nbrINNO_sessionEnCours"]	+= 1;
					}
					else if (currentScore.numEquipe == 3)
					{
						struct["nbrQSF_sessionEnCours"]		+= 1;
					}
				}
			} // fin if pas undef
		} // fin for
	} // fin for
	//console.log(struct);
	
	console.log("FIN SCORE");
	return struct;
},



module.exports = Score_Manager;
