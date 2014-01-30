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
this.listeIdIntervalleFouille;
this.callbackFinFouille;

function Personnage_Manager(){}


/////////////////////////////////////////// EN RAPPORT AVEC L'INITIALISATION DU JOUEUR //////////////////////////////////
Personnage_Manager.Load = function(callbackFinFouille)
{
	var context = this;
	this.listePersonnages = new Array();
	this.listeIdIntervalleFouille = new Array();
	this.callbackFinFouille = callbackFinFouille;
	
	oUtilisateur_BD.GetUsersId(function(tabId)
	{
		var idUser;
		for(var i in tabId)
		{
			idUser = tabId[i];
			oPersonnage_BD.GetPersonnageByIdUser(idUser,  function(id,  reponse)
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
					//console.log("PERSONNAGE_MANAGER : Load() : Chargement en mémoire du personnage [id="+reponse.id);
					context.listePersonnages[id] = reponse;
					/*** TEST ***/
					context.listePersonnages[id].setptSanteMax(30);
					context.listePersonnages[id].setptDeplacementMax(1000);
					context.listePersonnages[id].setptActionMax(1000);
					
					// si le perso était en fouille, on le remet en oisif (car on n'a pas la durée du compteur de fouille)
					if (context.listePersonnages[id].mode == 1)context.listePersonnages[id].mode = 0;
				}
			});
		}
	});            	
}, 

Personnage_Manager.LoadUser = function(idUser)
{
	var context = this;
	oPersonnage_BD.GetPersonnageByIdUser(idUser,  function(id,  reponse)
	{
		if (reponse == -1 || reponse == -2)
		{
			context.listePersonnages[id] = null;
		}
		else
		{
			context.listePersonnages[id] = reponse;
			/*** TEST ***/
			context.listePersonnages[id].setptSanteMax(30);
			context.listePersonnages[id].setptDeplacementMax(1000);
			context.listePersonnages[id].setptActionMax(1000);
		}
	});     	
}, 

Personnage_Manager.SetCompetence = function(idUser,  competence)
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
	
	oPersonnage_BD.SetPersonnage(this.listePersonnages[idUser],  function(reponse)
	{
		if (reponse == -1)
		{
			console.log("/!\ PERSONNAGE_MANAGER : SetCompetence() : WARNING : erreur ecriture du perso de " + idUser);
		}
		else
		{
			//console.log("PERSONNAGE_MANAGER : SetCompetence() : MAJ du perso de " + idUser + " OK !");
		}
	});
	
}, 

/////////////////////////////////////////// EN RAPPORT AVEC LES MESSAGES DU JOUEUR //////////////////////////////////
Personnage_Manager.AddMessage = function(idUser,  msg)
{
	//console.log("PERSONNAGE_MANAGER : AddMessage() : Ajout du message " + msg);
	this.listePersonnages[idUser].ajouterMessage(msg + "\n");
}, 

Personnage_Manager.EffacerMessages = function(idUser)
{
	console.log("PERSONNAGE_MANAGER : EffacerMessages() : Effacement de la liste des messages");
}, 

Personnage_Manager.acquitterMsg = function(idUser)
{
	this.listePersonnages[idUser].acquitterMsg();
},




/////////////////////////////////////////// EN RAPPORT AVEC LES ATTAQUES DU JOUEUR //////////////////////////////////
Personnage_Manager.Attaquer = function(idUser,  idUserEnnemi)
{
	// recuperation des personnages
	var persoUser = this.listePersonnages[idUser];
	var persoEnn = this.listePersonnages[idUserEnnemi];
	
	// logins
	var loginUser = oUtilisateur_Manager.GetPseudo(idUser);
	var loginEnn = oUtilisateur_Manager.GetPseudo(idUserEnnemi);
	
	var degatsInfligesParA;
	var degatsInfligesParB;
	
	var idSalle = this.GetIdSalleEnCours(idUser);
	
	// création de données de retour
	var reponseServeur = {"reponseAttaque" : 0,  "degatsRecus" : 0,  "degatsInfliges" : 0,  "degatSubisParGoules" : 0,  "nbrGoules" : 0};
	
	var resultatGoules;
	
	var attA = this.listePersonnages[idUser].getValeurAttaque();
	var attB = this.listePersonnages[idUserEnnemi].getValeurAttaque();
	
	// si c'est une tentative d'attaquer un allié (requete http trafiquée)
	if (oUtilisateur_Manager.GetNumEquipe(idUser) == oUtilisateur_Manager.GetNumEquipe(idUserEnnemi))
	{
		console.log("/!\ -> PIRATAGE D'UNE REQUETE -> ATTAQUE DE " + persoUser + " VERS " + persoEnn + " ALORS QUE MEME EQUIPE !");
		reponseServeur.reponseAttaque = 0;
		return reponseServeur;
	}
	
	// Si plus de pts d'actions
	if(!this.TestPtActions(idUser,  "attaqueEnnemi"))
	{
		reponseServeur.reponseAttaque = -10;
	}
	else
	{
		if(!this.MemeSalle(idUser,  idUserEnnemi))
		{
			reponseServeur.reponseAttaque = -1;
		}
		else
		{
			// infliger les dégats de goules 
			resultatGoules 						= oCase_Manager.AttaqueDeGoules(idSalle, this.GetNbrAllies(idUser));
			reponseServeur.nbrGoules			= resultatGoules.nbrGoulesA;
			reponseServeur.degatSubisParGoules 	= this.subirDegats(idUser,  resultatGoules.degats);
			
			// si le joueur a été tué...
			if (this.estMort(idUser))
			{
				this.TuerJoueur(idUser, "Z");
				reponseServeur.reponseAttaque = 0;
				return reponseServeur;
			}
			
			//Si action pas ok à cause des goules
			if(!resultatGoules.actionOk)
			{
				reponseServeur.reponseAttaque = -5;
			}
			else
			{
				// diminution ptAction
				this.listePersonnages[idUser].diminuerPointAction(GameRules.coutPA_AttaqueEnnemi());

				// remettre en mode 'oisif'
				this.InitialiserMode(idUser);
				
				// degats infligés a l'ennemi
				reponseServeur.degatsInfliges = this.listePersonnages[idUserEnnemi].subirDegats(attA);
				
				// si l'ennemi est encore vivant,  il riposte
				if (!this.estMort(idUserEnnemi))
				{
					reponseServeur.degatsRecus = this.listePersonnages[idUser].subirDegats(attB);
				}
				
				// ajout du message
				this.AddMessage(idUserEnnemi,  "Attaqué par un ennemi ! Degats subis : " + reponseServeur.degatsInfliges + " - degats infligés en riposte : " + reponseServeur.degatsRecus);
				
				// vérifie s'il y a des morts
				if (persoUser.estMort()) this.TuerJoueur(idUser,  loginEnn);
				if (persoEnn.estMort()) this.TuerJoueur(idUserEnnemi,  loginUser);

				reponseServeur.reponseAttaque = 1;

				console.log("PERSONNAGE_MANAGER : Attaquer() : degatsInfliges : " + reponseServeur.degatsInfliges
						+ " <-> degatsRecus : " + reponseServeur.degatsRecus 
						+ "  +  degatsGoules : " + reponseServeur.degatSubisParGoules );
				
			}
		}
	}
	
	return reponseServeur;
}, 



Personnage_Manager.AttaquerGoule = function(idUser)
{
	this.listePersonnages[idUser].diminuerPointAction(GameRules.coutPA_AttaqueGoule());
	
	// si le joueur a été tué...
	if (this.estMort(idUser))
	{
		this.TuerJoueur(idUser, "Z");
	}
}, 

Personnage_Manager.subirDegats = function (idUser,  degats)
{
	console.log("PERSONNAGE_MANAGER : Subir Dégats() : pts de santé restants : " + this.listePersonnages[idUser].getPtSante());
	return this.listePersonnages[idUser].subirDegats(degats);
}, 


/////////////////////////////////////////// EN RAPPORT AVEC LES ACTIONS DU JOUEUR //////////////////////////////////
Personnage_Manager.Deplacement = function (idUser,  move)
{
	var nbrGoules = oCase_Manager.GetNombreGoules(this.GetIdSalleEnCours(idUser));
	var a = this.GetNbrAlliesEnemisDansSalle(idUser);
	var numEquipe = oUtilisateur_Manager.GetNumEquipe(idUser);
	var idZoneSureEnnemi = oCase_Manager.GetIdZoneSureEnnemi(numEquipe);
	
	// chaque allié diminue de 1 le nombre de goules
	nbrGoules -= a.nbrAllies;
	
	// deplace le personnage
	var reponse = this.listePersonnages[idUser].deplacement(move,  nbrGoules,  idZoneSureEnnemi);
	
	console.log("PERSONNAGE_MANAGER : Réponse déplacement pour id " + idUser + " : " + reponse);
	
	if(reponse > -1)
	{
		// initialisation mode
		this.InitialiserMode(idUser);
		return oCase_Manager.GetCopieCase(reponse);
	}
	
	return reponse;
}, 

Personnage_Manager.ramasserDeposer = function(idUser,  type,  item)
{
	var o_____O = this.GetIdSalleEnCours(idUser);
	
	var resultatGoules;
	
	var reponseServeur = {"reponseAction" : 0,  "degatSubis" : 0,  "nbrGoulesA" : 0};
	
	//Si item existe
	if(item)
	{
		if(type == "RAMASSER")
		{
			//Si item pas existe dans la case -> return 
			if(! oCase_Manager.ExistItem(o_____O,  item))
			{
				reponseServeur.reponseAction = -2;
				return reponseServeur;
			}
			
			// si c'est un ODD dans la zone sure -> return 
			if (item.type == 3 && ( o_____O == GameRules.idZoneSure_1() ||  o_____O == GameRules.idZoneSure_2()) )
			{
				reponseServeur.reponseAction = -6;
				return reponseServeur;
			}
			
			//Si PAS place dans sac -> return 
			if(!this.testPoidsOk(idUser,  item))
			{
				reponseServeur.reponseAction = -1;
				return reponseServeur;
			}
			
			//Calcul des dégats de goules et nombre de goules attaquantes
			resultatGoules = oCase_Manager.AttaqueDeGoules(o_____O, this.GetNbrAllies(idUser));
			
			reponseServeur.degatSubis	= this.subirDegats(idUser,  resultatGoules["degats"]);
			reponseServeur.nbrGoulesA	= resultatGoules.nbrGoulesA;
			
			// si le joueur a été tué...
			if (this.estMort(idUser))
			{
				this.TuerJoueur(idUser, "Z");
				reponseServeur.reponseAction  = 0;
				return reponseServeur;
			}
			
			//Si action pas ok à cause des goules -> return 
			if(!resultatGoules.actionOk) 
			{
				reponseServeur.reponseAction = -5;
				return reponseServeur;
			}
			
			// Si tout est ok, on ajoute l'item au sac et on le supprime de la salle
			this.AjouterItemAuSac(idUser,  item);
			oCase_Manager.SupprimerItem(o_____O,  item);
			
			reponseServeur.reponseAction = this.GetPoidsSac(idUser);
			return reponseServeur;
		}
		else if (type == "DEPOSER")
		{			
			if(this.IsItemEquipee(idUser,  item))
			{
				reponseServeur.reponseAction = -3;
				return reponseServeur;
				
			}
			if(!this.ExistItemInSac(idUser,  item))
			{
				reponseServeur.reponseAction = -2;
				return reponseServeur;
			}
			// ajout a la case
			oCase_Manager.AjouterItem(o_____O,  item);
			
			// supprimer du sac
			this.SupprimerDuSac(idUser,  item);
			
			// ajout du score si c'est le dépot d'un odd en zone sure
			
			
			
			reponseServeur.reponseAction = this.GetPoidsSac(idUser);
			return reponseServeur;
		}
	}
	else
	{
		reponseServeur.reponseAction = -4;
		return reponseServeur;
	}
	return reponseServeur;
}, 

Personnage_Manager.deposer = function(idUser,  item)
{
}, 

Personnage_Manager.AjouterItemAuSac = function (idUser,  item)
{
	return this.listePersonnages[idUser].ajouterAuSac(item);
}, 

Personnage_Manager.SupprimerDuSac = function (idUser,  item)
{
	return this.listePersonnages[idUser].supprimerDuSac(item);
}, 


Personnage_Manager.ChercherEnnemi = function(idUser)
{
	var nbrEnnemiDecouvert = 0;
	for(var i in this.listePersonnages)
	{
		if( this.MemeSalle(idUser,  i) && !oUtilisateur_Manager.MemeEquipe(idUser,  i) && this.listePersonnages[i].GetMode() == 2)
		{
			if(oCase_Manager.DecouverteEnnemi(this.GetIdSalleEnCours(idUser),  this.GetMultiFouille(idUser),  this.GetMultiCache(i)))
			{
				nbrEnnemiDecouvert += 1;
				this.Decouvert(i);
			}
		}
	}
	return nbrEnnemiDecouvert;
}, 

Personnage_Manager.Decouvert = function(idUser)
{
	console.log("PERSONNAGE_MANAGER : Le perso " + idUser + " a été découvert !" );
	
	this.listePersonnages[idUser].changerMode(0);
	this.AddMessage(idUser,  "Vous avez été découvert ! Votre planque est foutue !");
}, 

Personnage_Manager.equiper = function (idUser,  id_item)
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

Personnage_Manager.desequiper = function (idUser,  id_item)
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

Personnage_Manager.Utiliser = function (idUser,  id_item)
{
	var item = oItem_Manager.GetItem(id_item);
	return this.listePersonnages[idUser].utiliser(item);
}, 

Personnage_Manager.InitialiserMode = function(idUser)
{
	//si en mode fouille, stopper le boucle de fouille
	this.stopperFouille(idUser);
	
	// remettre le mode à zéro
	this.listePersonnages[idUser].initialiserMode();
	
}, 

Personnage_Manager.ChangementMode = function(idUser,  mode)
{
	var reponseServeur = {"reponseChangement" : 0,  "degatsSubis" : 0,  "nbrGoules" : 0};
	var resultatGoules;
	var idCase = this.GetIdSalleEnCours(idUser);
	
	if(this.GetMode(idUser) == mode)
	{
		reponseServeur.reponseChangement = -4;
	}
	else
	{
		// si c'est pr le mode déf
		if(mode == 3)
		{
			// check si assez de pts d'actions
			if(!this.TestPtActions(idUser,  "chgtMode_def"))
			{
				reponseServeur.reponseChangement = -10;
			}
			else
			{
				// initialiser le mode
				this.InitialiserMode(idUser);
				
				// chgt de mode effectif
				this.listePersonnages[idUser].changerMode(mode);
				reponseServeur.reponseChangement = 1;
			}
		}
		// si c'est pour un autre mode
		else
		{
			// check si assez de pts d'action
			if(!this.TestPtActions(idUser,  "chgtMode"))
			{
				reponseServeur.reponseChangement = -10;
			}

			// impact des goules
			resultatGoules 				= oCase_Manager.AttaqueDeGoules(idSalle, this.GetNbrAllies(idUser));
			reponseServeur.degatsSubis	= this.subirDegats(idUser,  resultatGoules["degats"]);
			reponseServeur.nbrGoules	= resultatGoules.nbrGoulesA;

			// si le joueur a été tué...
			if (this.estMort(idUser))
			{
				this.TuerJoueur(idUser, "Z");
				reponseServeur.reponseChangement = 0;
				return reponseServeur;
			}
			
			// check si l'action est réussie
			if(!resultatGoules.actionOk)
			{
				reponseServeur.reponseChangement = -5;
			}
			else
			{
				// initialiser le mode
				this.InitialiserMode(idUser);
				
				 // chgt de mdoe effectif
				this.listePersonnages[idUser].changerMode(mode);
				
				// si c'est une fouille, on lance le compteur
				if(mode == 1)
				{
					// lancement de la boucle périodique
					var self = this;
					this.listeIdIntervalleFouille[idUser] = setInterval( function() 
					{
						// appel a la fonction de fouille
						self.fouille1Hr(idUser);
					}, GameRules.jeu_duree_fouille());	
					//console.log(this.listeIdIntervalleFouille[idUser]);
				}
				
				// réponse
				reponseServeur.reponseChangement = 1;
			}
		}
	}
	return reponseServeur;
}, 

Personnage_Manager.stopperFouille = function(idUser)
{
	//console.log("PERSONNAGE_MANAGER : Arret du mode fouille pour le perso " + oUtilisateur_Manager.GetPseudo(idUser));
	//fin du compteur
	try
	{
		//console.log(this.listeIdIntervalleFouille[idUser]);
		clearTimeout(this.listeIdIntervalleFouille[idUser]);
	}
	catch(Err){}
},

Personnage_Manager.fouille1Hr = function(idUser)
{
	console.log("PERSONNAGE_MANAGER : Fin d'une fouille d'une heure pour le perso " + oUtilisateur_Manager.GetPseudo(idUser));
	
	// calcul de decouverte d'un item
	var idCase 			= this.GetIdSalleEnCours(idUser);
	var multiFouille 	= this.listePersonnages[idUser].getMultiFouille();
	var itemDecouvert 	= oCase_Manager.Fouille(idCase,  multiFouille);
	
	var msg = "";
	// si un objet a été découvert
	if (itemDecouvert)
	{
		msg += "Vous avez découvert un item : " + itemDecouvert.nom;
		// essai d'ajout au sac (calcul de poids)
		if ((this.listePersonnages[idUser].getPoidsSac() + parseInt(itemDecouvert.poids)) > this.listePersonnages[idUser].getPoidsMax())
		{
			oCase_Manager.AjouterItem(idCase,  itemDecouvert);
			msg += " Faute de place,  l'item à été déposé dans la salle";
		}
		else
		{
			this.AjouterItemAuSac(idUser,  itemDecouvert);
			msg += " L'item à été ajouté à votre sac.";
			
		}
	}
	else
	{
		msg += "Malheureusement,  la fouille n'a pas été fructueuse...";	
	}
	this.AddMessage(idUser,  msg);
	
	// actualiser IHMs
	this.callbackFinFouille(idUser);
}, 

Personnage_Manager.fouilleRapide = function(idUser)
{
	//this.listePersonnages[idUser].diminuerPointAction(GameRules.coutPA_FouilleRapide());
	
	var resultatGoules;
	var degatSubis;
	var reponseRamassage;
	var reponseServeur = {"degatSubis" : 0,  "codeRetour" : 1,  
		"itemDecouvert" : null,  "nbrGoulesA" : 0,  "itemDansSac" : 0,  
		"nbrEnnemisDecouverts" : 0};
	var codeRetour = 0;
	var itemDecouvert;
	var nbrEnnDecouverts = 0;
	var idSalle = this.GetIdSalleEnCours(idUser);;
		
	// tests pts actions
    if(!this.TestPtActions(idUser,  "fouilleRapide"))
	{
		reponseServeur.codeRetour = - 10;
    	return reponseServeur;
    }
			
	// Calcul des dégats de goules et nombre de goules attaquantes
	resultatGoules = oCase_Manager.AttaqueDeGoules(idSalle, this.GetNbrAllies(idUser));
	
	// remplissage de la structure de réponse
	reponseServeur.degatSubis = this.subirDegats(idUser,  resultatGoules["degats"]);
	reponseServeur.nbrGoulesA = resultatGoules.nbrGoulesA;
	
	// si le joueur a été tué...
	if (this.estMort(idUser))
	{
		this.TuerJoueur(idUser, "Z");
		reponseServeur.codeRetour = 0;
		return reponseServeur;
	}
	
	//Si action pas ok à cause des goules
	if(!resultatGoules.actionOk)
	{
		reponseServeur.codeRetour = -5;
		// diminution pt actions
		this.PerteActionParGoules(idUser);
		return reponseServeur;
	}
	// diminution des pts d'action
	this.listePersonnages[idUser].diminuerPointAction(GameRules.coutPA_FouilleRapide());
	
	// id case du perso
	var idCase = this.GetIdSalleEnCours(idUser);
	// multi du perso
	var multiFouille = this.listePersonnages[idUser].getMultiFouille();
	
	// calcul de decouverte d'un item
	itemDecouvert = oCase_Manager.Fouille(idCase,  multiFouille);
	
	// si un objet a été découvert
	if (itemDecouvert)
	{
		reponseServeur.codeRetour = 1;
		reponseServeur.itemDecouvert = itemDecouvert;
		
		if ((this.listePersonnages[idUser].getPoidsSac() + parseInt(itemDecouvert.poids)) > this.listePersonnages[idUser].getPoidsMax())
		{
			console.log("-----------> add case");
			oCase_Manager.AjouterItem(idCase,  itemDecouvert);
			reponseServeur.itemDansSac = false;
		}
		else
		{
			console.log("-----------> add sac");
			this.AjouterItemAuSac(idUser,  itemDecouvert);
			reponseServeur.itemDansSac = true;
			
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
Personnage_Manager.MisKo = function(idUser,  meurtrier)
{
	
}, 

Personnage_Manager.TuerJoueur = function(idTue,  loginTueur)
{
	// log
	console.log("PERSONNAGE_MANAGER : Mourir() : mort du personnage " + oUtilisateur_Manager.GetPseudo(idTue)+ " par : " + loginTueur);
	
	// recupère le perso tue
	var currentPerso = this.listePersonnages[idTue];
	
	// ajout du message 
	//this.AddMessage(idTue,  "Vous avez été mis KO par " + loginTueur + " ! Vous avez été ramené dans votre zone sure,  mais vous avez perdu tout vos objets.");
	
	// ajout du login du tueur afin que l'on puisse informer l'utilisateur de son meurtrier
	this.AddMessage(idTue,  loginTueur);
	
	// mettre son inventaire dans la case
	for (var i = 0; i < currentPerso.GetSac().length; i++)
	{
		if (GameRules.combat_proba_perdreItem())
		{
			// transfert de l'item en cours dans la case
			oCase_Manager.AjouterItem(currentPerso.getIdSalleEnCours(),  currentPerso.GetSac()[i]);
			
			// l'enlever de son inventaire
			currentPerso.supprimerDuSac(currentPerso.GetSac()[i]);
		}
	}
	//currentPerso.viderInventaire();
}, 

Personnage_Manager.SeRetablir = function(idUser)
{
	console.log("SERVEUR : SeRetablir()");
	
	// ajout de points de santé
	this.listePersonnages[idUser].setPtsSante(20);
	
	// go a la zone sure
	this.listePersonnages[idUser].setIdCase(oCase_Manager.getZoneSure(oUtilisateur_Manager.GetNumEquipe(idUser)));
}, 




/*
 * FONCTIONS DE LECTURE
 */
 
Personnage_Manager.testPoidsOk = function(idUser,  item)
{
	return this.listePersonnages[idUser].testPoidsOk(item);
}, 

Personnage_Manager.estMort = function(idUser)
{
	return (this.listePersonnages[idUser].getPtSante() <= 0);
}, 

Personnage_Manager.MemeSalle = function(idUser1,  idUser2)
{
	return this.GetIdSalleEnCours(idUser1) == this.GetIdSalleEnCours(idUser2);
}, 

Personnage_Manager.GetCopiePerso = function(idUser)
{
	return this.listePersonnages[idUser];
}, 

Personnage_Manager.GetNbrAllies = function(idUser)
{
	var res = this.GetNbrAlliesEnemisDansSalle(idUser);
	console.log("---------------------> " + res.nbrAllies);
	return res.nbrAllies;
}, 

Personnage_Manager.GetNbrAlliesEnemisDansSalle = function(idUser)
{
	var a = { "nbrAllies"	: -1,  "nbrEnnemis" : 0};
	for(var i in this.listePersonnages)
	{
		if(this.GetIdSalleEnCours(idUser) == this.listePersonnages[i].getIdSalleEnCours())
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
	var a = { "Allies"	: new Array(),  "Ennemis" : new Array()};
	for(var i in this.listePersonnages)
	{
		if(this.GetIdSalleEnCours(idUser) == this.listePersonnages[i].getIdSalleEnCours())
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
	var a = { "Allies"	: new Array(),  "Ennemis" : new Array()};
	for(var i in this.listePersonnages)
	{
		if(this.GetIdSalleEnCours(idUser) == this.listePersonnages[i].getIdSalleEnCours())
		{
			if(oUtilisateur_Manager.GetNumEquipe(idUser) == oUtilisateur_Manager.GetNumEquipe(i))
			{
				if(i != idUser)
				{
					a.Allies.push(this.getPersonnageToDisplay(i));
				}
			}
			else
			{
				a.Ennemis.push(this.getPersonnageToDisplay(i));
			}
		}
	}
	return a;
}, 

Personnage_Manager.IsItemEquipee = function(idUser,  item)
{
	console.log("id item = " + item.id + " nom item = " + item.nom);
	return this.listePersonnages[idUser].isItemEquipee(item);
}, 

Personnage_Manager.TestDeplacementPossible = function(idUser,  nbrGoules,  direction)
{
	console.log("PM : TEST DEPLACEMENT POSSIBLE");
	
	return this.listePersonnages[idUser].testDeplacement(nbrGoules,  direction);
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

Personnage_Manager.ExistItemInSac = function(idUser,  item)
{
	return this.listePersonnages[idUser].existItemInSac(item);
}, 

Personnage_Manager.PerteActionParGoules = function(idUser)
{
	this.listePersonnages[idUser].diminuerPointAction(GameRules.coutPA_InterceptionGoule());
}, 

Personnage_Manager.TestPtActions = function(idUser,  typeAction)
{
	var ptActions = this.listePersonnages[idUser].getPtActions();
	
	var ok = true;
	
	console.log("PMANGER : ptActions :  " + ptActions);
	console.log("PMANGER : typeAction : " + typeAction);
	
	if(ptActions == 0)
	{
		ok = false;
	}
	switch(typeAction)
	{
		case "fouilleRapide":
			if(ptActions - GameRules.coutPA_FouilleRapide() < 0) ok = false;
			break;
		case "attaqueGoule":
			if(ptActions - GameRules.coutPA_AttaqueGoule() < 0) ok = false;
			break;
		case "attaqueEnnemi":
			if(ptActions - GameRules.coutPA_AttaqueEnnemi() < 0)ok = false;
			break;
		case "chgtMode":
			if(ptActions - GameRules.coutPA_ChgtMode() < 0) ok = false;
			break;
		case "chgtMode_def":
			if(ptActions - GameRules.coutPA_ChgtMode_def() < 0) ok = false;
			break;
		default:
			ok = false;
			break;
	}
	return ok;
}, 

Personnage_Manager.getPersonnageToDisplay = function(idUser, allie)
{
	var comPoidsSac = this.listePersonnages[idUser].getPoidsSac() / this.listePersonnages[idUser].getPoidsMax() * 100;
	var id 			= this.listePersonnages[idUser].getIdPerso();
	var ptSante 	= this.listePersonnages[idUser].getPtSante();
	var ptSanteMax 	= this.listePersonnages[idUser].getPtSanteMax();
	var comp 		= this.listePersonnages[idUser].getCompetence();
	var mode 		= this.listePersonnages[idUser].GetMode();
	var arme 		= this.listePersonnages[idUser].getArmeEquipee();
	var armure 		= this.listePersonnages[idUser].getArmureEquipee();
	var pseudo		= oUtilisateur_Manager.GetPseudo(idUser);
	if (allie == false) pseudo = -1;
	
	var perso = new oPersonnage(
			id, 	ptSante, 		ptSanteMax, 	-1, 			-1, 
			-1, 	-1, 			-1, 			-1,				comp, 
			-1, 	mode, 			-1, 			-1, 			-1,
			-1, 	arme, 			armure, 		comPoidsSac, 	-1, 
			pseudo);
	return perso;
}, 

Personnage_Manager.GetIdSalleEnCours = function(idUser)
{
	return this.listePersonnages[idUser].getIdSalleEnCours();
}, 

Personnage_Manager.GetIdNextSalle = function(idUser,  direction)
{
	return oCarte.GetIdSalleSuivante(this.GetIdSalleEnCours(idUser),  direction);
}, 

Personnage_Manager.Save = function()
{
	for(var idUser in this.listePersonnages)
	{
		oPersonnage_BD.SetPersonnage(this.listePersonnages[idUser],  function(reponse)
		{
			if (reponse == -1)
			{
				console.log("!!!!! WARNING : PMANAGER : erreur ecriture du perso de " + idUser);
			}
			else
			{
				//console.log("UMANAGER : MAJ du perso de " + idUser + " OK !");
			}
		});
	}
}, 
Personnage_Manager.nouvelleJournee = function()
{
	var idCase;
	var resultatGoules;
	var nbrGoules;
	var degatSubisParGoules;
	
	for(var idUser in this.listePersonnages)
	{
		// regain de pts de vie
		this.listePersonnages[idUser].nvlleJournee();
		
		idCase = this.listePersonnages[idUser].getIdSalleEnCours();
		
		// si le perso n'est pas caché -> attaque de la nuit
		if (this.listePersonnages[idUser].mode != 2 
				&& !( idCase == GameRules.idZoneSure_1() || idCase == GameRules.idZoneSure_2()))
		{
			// infliger les dégats de goules 
			resultatGoules 			= oCase_Manager.AttaqueDeGoules(idCase, this.GetNbrAllies(idUser));
			nbrGoules				= resultatGoules.nbrGoulesA;
			degatSubisParGoules 	= this.subirDegats(idUser,  resultatGoules.degats);
		
			this.listePersonnages[idUser].ajouterMessage("Vous avez été attaqué durant l'attaque de la nuit ! "
				+"Vous avez subi un total de " + degatSubisParGoules + " pts de dégâts infligés par " 
				+ nbrGoules + " zombies ! ");
		
			// si le joueur a été tué...
			if (this.estMort(idUser))
			{
				this.TuerJoueur(idUser, "N");
			}
		}
	}
},

module.exports = Personnage_Manager;