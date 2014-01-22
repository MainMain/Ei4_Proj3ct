 // includes
var oPersonnage		= require('../model/Object/Personnage');
var oUtilisateur	= require('../model/Object/Utilisateur');
var oCarte			= require('../model/object/Carte');
var oPersonnage_BD	= require('../persistance/Personnage_BD');
var oUtilisateur_BD	= require('../persistance/Utilisateur_BD');

var oItem_Manager        = require('./Item_Manager');
var oCase_Manager        = require('./Case_Manager');
var oUtilisateur_Manager = require('./Utilisateur_Manager');

//inclusion des règles
var GameRules	= require('../model/GameRules');

this.listePersonnages;

function Personnage_Manager(){}


/////////////////////////////////////////// EN RAPPORT AVEC L'INITIALISATION DU JOUEUR //////////////////////////////////
Personnage_Manager.Load = function()
{
	var context = this;
	this.listePersonnages = new Array();

	oUtilisateur_BD.GetUsersId(function(tabId)
	{
		var idUser;
		for(var i in tabId)
		{
			idUser = tabId[i];
			oPersonnage_BD.GetPersonnageByIdUser(idUser, function(id, reponse)
			{
				if (reponse == -1)
				{
					console.log(" /!\ PERSONNAGE_MANAGER : Load() : Erreur -1");
					context.listePersonnages[id] = null;
				}
				else if (reponse == -2)
				{
					console.log("/!\  PERSONNAGE_MANAGER : Load() : Erreur -2");
					context.listePersonnages[id] = null;
				}
				else
				{
					console.log("PERSONNAGE_MANAGER : Load() : Chargement en mémoire du personnage [id="+reponse.id);
					context.listePersonnages[id] = reponse;
				}
			});
		}
	});            	
},

Personnage_Manager.LoadUser = function(idUser)
{
	var context = this;
	oPersonnage_BD.GetPersonnageByIdUser(idUser, function(id, reponse)
	{
		if (reponse == -1 || reponse == -2)
		{
			context.listePersonnages[id] = null;
		}
		else
		{
			context.listePersonnages[id] = reponse;
		}
	});     	
},

Personnage_Manager.SetCompetence = function(idUser, competence)
{				
	/*** - CALCUL SUR LES MULTI POINTS - ***/
	if(competence == "brute")
	{
		this.listePersonnages[idUser].setptSanteMax(140);
		this.listePersonnages[idUser].setptDeplacementMax(15);
		this.listePersonnages[idUser].setptActionMax(20);
		
		this.listePersonnages[idUser].setmultiPtsAttaque(2);
		this.listePersonnages[idUser].setmultiPtsDefense(2);
		this.listePersonnages[idUser].setmultiProbaCache(0.5);
		this.listePersonnages[idUser].setmultiProbaFouille(1);
		
		this.listePersonnages[idUser].setgoulesMax(2);
	}
	else if(competence == "explorateur")
	{
		this.listePersonnages[idUser].setptSanteMax(100);
		this.listePersonnages[idUser].setptDeplacementMax(25);
		this.listePersonnages[idUser].setptActionMax(20);
		
		this.listePersonnages[idUser].setmultiPtsAttaque(1);
		this.listePersonnages[idUser].setmultiPtsDefense(0.3);
		this.listePersonnages[idUser].setmultiProbaCache(1);
		this.listePersonnages[idUser].setmultiProbaFouille(3);
		
		this.listePersonnages[idUser].setgoulesMax(5);
	}
	else if(competence == "chercheur")
	{
		this.listePersonnages[idUser].setptSanteMax(100);
		this.listePersonnages[idUser].setptDeplacementMax(15);
		this.listePersonnages[idUser].setptActionMax(30);
		
		this.listePersonnages[idUser].setmultiPtsAttaque(0.5);
		this.listePersonnages[idUser].setmultiPtsDefense(1.5);
		this.listePersonnages[idUser].setmultiProbaCache(3);
		this.listePersonnages[idUser].setmultiProbaFouille(0.5);
		
		this.listePersonnages[idUser].setgoulesMax(3);
	}
	this.listePersonnages[idUser].setCompetence(competence);
	
	oPersonnage_BD.SetPersonnage(this.listePersonnages[idUser], function(reponse)
	{
		if (reponse == -1)
		{
			console.log("/!\ PERSONNAGE_MANAGER : SetCompetence() : WARNING : erreur ecriture du perso de " + idUser);
		}
		else
		{
			console.log("PERSONNAGE_MANAGER : SetCompetence() : MAJ du perso de " + idUser + " OK !");
		}
	});
	
},

/////////////////////////////////////////// EN RAPPORT AVEC LES MESSAGES DU JOUEUR //////////////////////////////////
Personnage_Manager.AddMessage = function(idUser, msg)
{
	console.log("PERSONNAGE_MANAGER : AddMessage() : Ajout du message " + msg);
	this.listePersonnages[idUser].ajouterMessage(msg + "\n");
},

Personnage_Manager.EffacerMessages = function(idUser)
{
	console.log("PERSONNAGE_MANAGER : EffacerMessages() : Effacement de la liste des messages");
},






/////////////////////////////////////////// EN RAPPORT AVEC LES ATTAQUES DU JOUEUR //////////////////////////////////
Personnage_Manager.Attaquer = function(idUser, idUserEnnemi)
{	
	// recuperation des personnages
	var persoUser = this.listePersonnages[idUser];
	var persoEnn = this.listePersonnages[idUserEnnemi];
	
	// logins
	var loginUser = oUtilisateur_Manager.GetPseudo(idUser);
	var loginEnn = oUtilisateur_Manager.GetPseudo(idUserEnnemi);
	
	// détermination des valeurs d'attaque
	var attA = persoUser.getValeurAttaque();
	var attB = persoEnn.getValeurAttaque();
	
	// diminution ptAction
	persoUser.diminuerPointAction(GameRules.coutPA_AttaqueEnnemi());
	
	// degats infligés
	var degatsInfligesParA = persoEnn.subirDegats(attA);
	var degatsInfligesParB = 0;
	
	// si l'ennemi est encore vivant, il riposte
	if (this.listePersonnages[idUserEnnemi].ptSante > 0)
	{
		degatsInfligesParB = persoUser.subirDegats(attB);
	}
	
	// vérifie s'il y a des morts
	if (persoUser.estMort()) this.TuerJoueur(idUser, loginEnn);
	if (persoEnn.estMort()) this.TuerJoueur(idUserEnnemi, loginUser);
	
	// création de données de retour
	var a = { "degatsRecus"	: degatsInfligesParB, "degatsInfliges" : degatsInfligesParA};
	
	// ajout du message
	this.AddMessage(idUserEnnemi, "Attaqué par un ennemi ! Degats subis : " + degatsInfligesParA + " - degats infligés en riposte : " + degatsInfligesParB);
	
	// log
	console.log("PERSONNAGE_MANAGER : Attaquer() : degatsInfliges : " + degatsInfligesParA + " <-> degatsRecus : " + degatsInfligesParB);
	
	return a;
},

Personnage_Manager.AttaquerGoule = function(idUser)
{
	this.listePersonnages[idUser].diminuerPointAction(GameRules.coutPA_AttaqueGoule());
},

Personnage_Manager.subirDegats = function (idUser, degats)
{
	console.log("PERSONNAGE_MANAGER : Subir Dégats() : pts de santé restants : " + this.listePersonnages[idUser].getPtSante());
	return this.listePersonnages[idUser].subirDegats(degats);
},


/////////////////////////////////////////// EN RAPPORT AVEC LES ACTIONS DU JOUEUR //////////////////////////////////
Personnage_Manager.Deplacement = function (idUser, move)
{
	var nbrGoules = oCase_Manager.GetNombreGoules(Personnage_Manager.GetIdSalleEnCours(idUser));
	var a = Personnage_Manager.GetNbrAlliesEnemisDansSalle(idUser);
	var numEquipe = oUtilisateur_Manager.GetNumEquipe(idUser);
	var idZoneSureEnnemi = oCase_Manager.GetIdZoneSureEnnemi(numEquipe);
	
	nbrGoules -= a.nbrAllies;
	
	// deplace le personnage
	var reponse = this.listePersonnages[idUser].deplacement(move, nbrGoules, idZoneSureEnnemi);
	
	console.log("PERSONNAGE_MANAGER : Réponse déplacement pour id " + idUser + " : " + reponse);
	
	if(reponse > -1)
	{
		return oCase_Manager.GetCopieCase(reponse);
	}
	
	return reponse;
},

Personnage_Manager.ramasser = function(idUser, item)
{
	var idSalle = this.GetIdSalleEnCours(idUser);
	var resultatGoules;
	var degatSubis;
	var reponseRamassage;
	
	var reponseServeur = {"degatSubis" : 0, "reponseRamassage" : 1, "poidsSac" : 0, "nbrGoulesA" : 0};
	
	//Si item existe
	if(item)
	{
		//Si item existe dans la case
		if(oCase_Manager.ExistItem(idSalle, item))
		{
			//Si PAS place dans sac
			if(!this.testPoidsOk(idUser, item))
			{
				reponseServeur.reponseRamassage = -1;
				return reponseServeur;
			}
			
			//Calcul des dégats de goules et nombre de goules attaquantes
			resultatGoules = oCase_Manager.AttaqueDeGoules(idSalle);
			
			reponseServeur.degatSubits	= this.subirDegats(idUser, resultatGoules["degats"]);
			reponseServeur.nbrGoulesA	= resultatGoules.nbrGoulesA;
			
			//Si action pas ok à cause des goules
			if(!resultatGoules.actionOk)
			{
				reponseServeur.reponseRamassage = -5;
				return reponseServeur;
			}
			
			//Sinon on ajoute l'item au sac et on le supprime de la salle
			this.AjouterItemAuSac(idUser, item);
			oCase_Manager.SupprimerItem(idSalle, item);
			
			//Nouveau poids du sac
			reponseServeur.poidsSac = this.GetPoidsSac(idUser);
			
			return reponseServeur;
		}
		else
		{
			reponseServeur.reponseRamassage = -2;
			return reponseServeur;
		}
	}
	else
	{
		reponseServeur.reponseRamassage = -4;
		return reponseServeur;
	}
},

Personnage_Manager.deposer = function(idUser, item)
{
	//o_____O
	var o_____O = this.GetIdSalleEnCours(idUser);
	
	//o_____O
	if(this.IsItemEquipee(idUser, item))
	{
		return -3;
	}
	
	//o_____O
	if(!this.ExistItemInSac(idUser, item))
	{
		return -2;
	}
	
	//o_____O
	oCase_Manager.AjouterItem(o_____O, item);
	
	//o_____O
	this.SupprimerDuSac(idUser, item);
	
	//o_____O + o_____O = o__________O
	return this.GetPoidsSac(idUser);
},

Personnage_Manager.AjouterItemAuSac = function (idUser, item)
{
	return this.listePersonnages[idUser].ajouterAuSac(item);
},

Personnage_Manager.SupprimerDuSac = function (idUser, item)
{
	return this.listePersonnages[idUser].supprimerDuSac(item);
},


Personnage_Manager.ChercherEnnemi = function(idUser)
{
	var nbrEnnemiDecouvert = 0;
	for(var i in this.listePersonnages)
	{
		if( Personnage_Manager.MemeSalle(idUser, i) && !oUtilisateur_Manager.MemeEquipe(idUser, i) && this.listePersonnages[i].GetMode() == 2)
		{
			if(oCase_Manager.DecouverteEnnemi(Personnage_Manager.GetIdSalleEnCours(idUser), Personnage_Manager.GetMultiFouille(idUser), Personnage_Manager.GetMultiCache(i)))
			{
				nbrEnnemiDecouvert += 1;
				Personnage_Manager.Decouvert(i);
			}
		}
	}
	return nbrEnnemiDecouvert;
},

Personnage_Manager.Decouvert = function(idUser)
{
	console.log("PERSONNAGE_MANAGER : Le perso " + idUser + " a été découvert !" );
	
	this.listePersonnages[idUser].changerMode(0);
	this.AddMessage(idUser, "Vous avez été découvert ! Votre planque est foutue !");
},

Personnage_Manager.equiper = function (idUser, id_item)
{
	var item = oItem_Manager.GetItem(id_item);
	if(item)
	{
		return this.listePersonnages[idUser].equiper(item);
	}
	else
	{
		return 0;
	}
},

Personnage_Manager.desequiper = function (idUser, id_item)
{
	var item = oItem_Manager.GetItem(id_item);
	if(item)
	{
		return this.listePersonnages[idUser].desequiper(item);
	}
	else
	{
		return 0;
	}
},

Personnage_Manager.Utiliser = function (idUser, item)
{
	return this.listePersonnages[idUser].utiliser(item);
},

Personnage_Manager.InitialiserMode = function(idUser)
{
	this.listePersonnages[idUser].initialiserMode();
},

Personnage_Manager.ChangementMode = function(idUser, mode)
{
	return this.listePersonnages[idUser].changerMode(mode);
},

Personnage_Manager.fouilleRapide = function(idUser)
{
	//this.listePersonnages[idUser].diminuerPointAction(GameRules.coutPA_FouilleRapide());
	
	var resultatGoules;
	var degatSubis;
	var reponseRamassage;
	var reponseServeur = {"degatSubis" : 0, "codeRetour" : 1, 
		"itemDecouvert" : null, "nbrGoulesA" : 0, "itemDansSac" : 0, 
		"nbrEnnemisDecouverts" : 0};
	var codeRetour = 0;
	var itemDecouvert;
	var nbrEnnDecouverts = 0;
	
	// tests pts actions
    if(oPersonnage_Manager.TestPtActions(idUser, "fouilleRapide"))
	{
		reponseServeur.codeRetour = - 10;
    	return reponseServeur;
    }
			
	// Calcul des dégats de goules et nombre de goules attaquantes
	resultatGoules = oCase_Manager.AttaqueDeGoules(idSalle);
	
	reponseServeur.degatSubis = this.subirDegats(idUser, resultatGoules["degats"]);
	reponseServeur.nbrGoulesA = resultatGoules.nbrGoulesA;
	
	//Si action pas ok à cause des goules
	if(!resultatGoules.actionOk)
	{
		reponseServeur.codeRetour = -5;
		// diminution pt actions
		this.PerteActionParGoules(idUser);
		return reponseServeur;
	}
	// diminution des pts d'action
	
	
	// id case du perso
	var idCase = this.listePersonnages[idUser].getIdSalleEnCours();
	// multi du perso
	var multiFouille = this.listePersonnages[idUser].getMultiFouille();
	
	// calcul de decouverte d'un item
	if (oCase_Manager.Fouille(idCase, multiFouille))
	{
		reponseServeur.codeRetour = 1;
		// création d'un item
		itemDecouvert = oItem_Manager.GetItemAleatoire();
		reponseServeur.itemDecouvert = itemDecouvert;
		
		// essai d'ajout au sac (calcul de poids)
		if (this.listePersonnages[idUser].getPoidsSac() - itemDecouvert.poids > 0)
		{
			this.AjouterItemAuSac(idUser, itemDecouvert);
			reponseServeur.itemDansSac = true;
		}
		else
		{
			oCase_Manager.AjouterItem(idCase, itemDecouvert);
			reponseServeur.itemDansSac = false;
		}
		return reponseServeur;
	}
	else
	{
		reponseServeur.codeRetour = -1;
	   	return reponseServeur;
	}
},








/////////////////////////////////////////// EN RAPPORT AVEC LA MORT DU JOUEUR //////////////////////////////////
Personnage_Manager.MisKo = function(idUser, meurtrier)
{
	
},

Personnage_Manager.TuerJoueur = function(idTue, loginTueur)
{
	// log
	console.log("PERSONNAGE_MANAGER : Mourir() : mort du personnage " + oUtilisateur_Manager.GetPseudo(idTue)+ " par : " + loginTueur);
	
	// recupère le perso tue
	var currentPerso = this.listePersonnages[idTue];
	
	// ajout du message 
	this.AddMessage(idTue, "Vous avez été mis KO par " + loginTueur + " ! Vous avez été ramené dans votre zone sure, mais vous avez perdu tout vos objets.");
	
	// mettre son inventaire dans la case
	for (var i = 0; i < currentPerso.GetSac().length; i++)
	{
		// transfert de l'item en cours dans la case
		oCase_Manager.AjouterItem(currentPerso.getIdSalleEnCours(), currentPerso.GetSac()[i]);
	}
	
	// vider son inventaire
	currentPerso.viderInventaire();
},

SeRetablir = function(idUser)
{
	console.log("SERVEUR : SeRetablir()");
	
	// ajout de points de santé
	this.listePersonnages[idUser].setPtsSante(20);
	
	// go a la zone sure
	this.listePersonnages[idUser].setIdCase(Case_Manager.getZoneSure(oUtilisateur_Manager.GetNumEquipe(idUser)));
},




/*
 * FONCTIONS DE LECTURE
 */
 
Personnage_Manager.testPoidsOk = function(idUser, item)
{
	return this.listePersonnages[idUser].testPoidsOk(item);
},

Personnage_Manager.estMort = function(idUser)
{
	return (this.listePersonnages[idUser].getPtSante() <= 0);
},

Personnage_Manager.MemeSalle = function(idUser1, idUser2)
{
	return Personnage_Manager.GetIdSalleEnCours(idUser1) == Personnage_Manager.GetIdSalleEnCours(idUser2);
},

Personnage_Manager.GetCopiePerso = function(idUser)
{
	return this.listePersonnages[idUser];
},

Personnage_Manager.GetNbrAlliesEnemisDansSalle = function(idUser)
{
	var a = { "nbrAllies"	: -1, "nbrEnnemis" : 0};
	for(var i in this.listePersonnages)
	{
		if(this.listePersonnages[idUser].getIdSalleEnCours() == this.listePersonnages[i].getIdSalleEnCours())
		{
			if(oUtilisateur_Manager.GetNumEquipe(idUser) == oUtilisateur_Manager.GetNumEquipe(i))
			{
				a.nbrAllies += 1;
			}
			else if(this.listePersonnages[i].GetMode() != 2)
			{
				a.nbrEnnemis += 1;
			}
		}
	}
	return a;
},

Personnage_Manager.GetAlliesEnnemisDansSalle = function(idUser)
{
	var a = { "Allies"	: new Array(), "Ennemis" : new Array()};
	for(var i in this.listePersonnages)
	{
		if(this.listePersonnages[idUser].getIdSalleEnCours() == this.listePersonnages[i].getIdSalleEnCours())
		{
			if(oUtilisateur_Manager.GetNumEquipe(idUser) == oUtilisateur_Manager.GetNumEquipe(i))
			{
				a.Allies.push(i);
			}
			else if(this.listePersonnages[i].GetMode() != 2)
			{
				a.Ennemis.push(i);
			}
		}
	}
	return a;
},

Personnage_Manager.GetPersonnagesDansSalle = function(idCase)
{
	var a = new Array();
	for(var i in this.listePersonnages)
	{
		if(this.listePersonnages[i].getIdSalleEnCours() == idCase)
		{
			a.push(i);
		}
	}
	return a;
},

Personnage_Manager.GetAlliesEnnemisDansSalleToDisplay = function(idUser)
{
	var a = { "Allies"	: new Array(), "Ennemis" : new Array()};
	for(var i in this.listePersonnages)
	{
		if(this.listePersonnages[idUser].getIdSalleEnCours() == this.listePersonnages[i].getIdSalleEnCours())
		{
			if(oUtilisateur_Manager.GetNumEquipe(idUser) == oUtilisateur_Manager.GetNumEquipe(i))
			{
				if(i != idUser)
				{
					a.Allies.push(Personnage_Manager.getPersonnageToDisplay(i));
				}
			}
			else
			{
				a.Ennemis.push(Personnage_Manager.getPersonnageToDisplay(i));
			}
		}
	}
	return a;
},

Personnage_Manager.IsItemEquipee = function(idUser, item)
{
	console.log("id item = " + item.id + " nom item = " + item.nom);
	return this.listePersonnages[idUser].isItemEquipee(item);
},

Personnage_Manager.TestDeplacementPossible = function(idUser, nbrGoules, direction)
{
	console.log("PM : TEST DEPLACEMENT POSSIBLE");
	
	return this.listePersonnages[idUser].testDeplacement(nbrGoules, direction);
},

Personnage_Manager.GetMultiFouille = function(idUser)
{
	return this.listePersonnages[idUser].GetMultiFouille();
},

Personnage_Manager.GetMultiCache = function(idUser)
{
	return this.listePersonnages[idUser].GetMultiCache();
},

Personnage_Manager.GetMode = function(idUser)
{
	return this.listePersonnages[idUser].GetMode();
},

Personnage_Manager.GetPoidsSac = function(idUser)
{
	return this.listePersonnages[idUser].getPoidsSac();
},

Personnage_Manager.ExistItemInSac = function(idUser, item)
{
	return this.listePersonnages[idUser].existItemInSac(item);
},

Personnage_Manager.PerteActionParGoules = function(idUser)
{
	this.listePersonnages[idUser].diminuerPointAction(GameRules.coutPA_InterceptionGoule());
},

Personnage_Manager.TestPtActions = function(idUser, typeAction)
{
	var ptActions = this.listePersonnages[idUser].getPtActions();
	
	var ok = false;
	
	console.log("PMANGER : ptActions :  " + ptActions);
	console.log("PMANGER : typeAction : " + typeAction);
	
	if(ptActions == 0)
	{
		ok = true;
	}
	switch(typeAction)
	{
		case "fouilleRapide":
			if(ptActions - GameRules.coutPA_FouilleRapide() < 0) ok = true;
			break;
		case "attaqueGoule":
			if(ptActions - GameRules.coutPA_AttaqueGoule() < 0) ok = true;
			break;
		case "attaqueEnnemi":
			if(ptActions - GameRules.coutPA_AttaqueEnnemi() < 0)ok = true;
			break;
		case "chgtMode":
			if(ptActions - GameRules.coutPA_ChgtMode() < 0) ok = true;
			break;
		case "chgtMode_def":
			if(ptActions - GameRules.coutPA_ChgtMode_def() < 0) ok = true;
			break;
		default:
			ok = true;
			break;
	}
	return ok;
},

Personnage_Manager.getPersonnageToDisplay = function(idUser)
{
	var comPoidsSac = this.listePersonnages[idUser].getPoidsSac() / this.listePersonnages[idUser].getPoidsMax() * 100;
		
	console.log("PM : approximation poids sac : " + comPoidsSac +" %");
	var perso = new oPersonnage(
			this.listePersonnages[idUser].getIdPerso(), 									this.listePersonnages[idUser].getPtSante(),		this.listePersonnages[idUser].getPtSanteMax(),
			-1,											-1, 												-1,
			-1,											-1, 											-1,
			this.listePersonnages[idUser].getCompetence(),-1, 											this.listePersonnages[idUser].GetMode(),
			-1,  										-1,  											-1,
			-1,											this.listePersonnages[idUser].getArmeEquipee(),	this.listePersonnages[idUser].getArmureEquipee(),
			comPoidsSac,								-1,												-1);
	return perso;
},

Personnage_Manager.GetIdSalleEnCours = function(idUser)
{
	return this.listePersonnages[idUser].getIdSalleEnCours();
},

Personnage_Manager.GetIdNextSalle = function(idUser, direction)
{
	return oCarte.GetIdSalleSuivante(this.listePersonnages[idUser].getIdSalleEnCours(), direction);
},

Personnage_Manager.Save = function()
{
	for(var idUser in this.listePersonnages)
	{
		oPersonnage_BD.SetPersonnage(this.listePersonnages[idUser], function(reponse)
		{
			if (reponse == -1)
			{
				console.log("!!!!! WARNING : PMANAGER : erreur ecriture du perso de " + idUser);
			}
			else
			{
				console.log("UMANAGER : MAJ du perso de " + idUser + " OK !");
			}
		});
	}
},

module.exports = Personnage_Manager;