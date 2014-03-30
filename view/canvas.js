/**
 * DECLARATION DES VARIABLES GLOBALES
 * 
		/*var mouseTarget; // the display object currently under the mouse, or being dragged
		var dragStarted; // indicates whether we are currently in a drag operation
		var offset;
 * 
 */



// Variables pour le canvas
var canvas, stage, _CANVAS_LARGEUR, _CANVAS_HAUTEUR;

// Variables pour les images
var background, backgroundPreload, map, person, imgPerso;

// Variables pour ne pas afficher les object sur context
var _ECRAN_ATTAQUE_NUIT = false;
var _ECRAN_MORT			= false
// Variables pour les sélections
var _SELECTED_ITEM_CASE = -1;
var _SELECTED_ITEM_PERSO = -1;
var _SELECTED_ITEM_PERSOType = -1;
var _SELECTED_ITEM_EQUIP = -1;
var _SELECTED_PERSO = -1;

// Variables pour les barres
var _BARRES_HEIGHT = 11;
var _BARRES_WIDTH = 200;
var _BARRES_CONTOUR_COULEUR = createjs.Graphics.getRGB(150,150,150);
var _BARRES_PADDING = 2;
var _BARRES_FRAMES_STROKE = 2;

// Variables pour le  perso
var _PERSO_PROBA_CACHE=1;
var _PERSO_PROBA_FOUILLE=1;
var _PERSO_LAST_PTS_VIE = 0;

//Liste des messages du personnage ( ! global ) 
var _listeMessages;

//Variables pour la coloration des messages de retour
var _boolColorAction=false;
var _colorLabelAction;

// Variables pour la navigation entre les pages items/persos/messages
var _PAGE_ITEM_PERSO=0;
var _PAGE_ITEM_PERSO_DEAD=0;
var _PAGE_ITEM_CASE=0;
var _PAGE_PERSO_ENN=0;
var _PAGE_PERSO_ALLIES=0;
var _PAGE_MESSAGES=0;

// Variables pour l'affichage des items équipés une fois

//var pressBtnEquipArme=true;
//var pressBtnEquipArmure=true;

// Variables correspondant aux flèches des pages
var Btn_PAGE_ITEM_PERSORight, Btn_PAGE_ITEM_PERSOLeft, Btn_PAGE_ITEM_CASERight, Btn_PAGE_ITEM_CASELeft, Btn_PAGE_ITEM_PERSO_DEADRight, Btn_PAGE_ITEM_PERSO_DEADLeft;

//******************************************
//*  Réglages mise en forme (partie Design)*
//******************************************

 var _CONTENEUR_BARRES_INITIALISES = false;
// Police des labels du Plateau de jeu
var _POLICE_TOOLTIP	="12px Frail";
var _POLICE_LABEL	="15px Frail";
var _POLICE_MESSAGES="13px Frail";
var _POLICE_TITRE_1	= "20px Frail"; //"30px BadGrunge";
var _POLICE_TITRE_2	= "15px Frail"; //"23px BadGrunge";

// label.lineHeight
var _LineHeight = 15;
// label.textBaseline
var _TextBaseline = "top";

// Couleurs des labels
var _COULEUR_LABELS = "#fff";
var _COULEUR_TITRE = "#cccccc";
var _COULEUR_TITRE_2 = "#dddddd";
var _COULEUR_LABELSBonus = "#008000";

// Police du label de la page de mort
var _POLICE_MORT="20px Frail";
var _COULEUR_LABELS_MORT="#FFFFFF";
var _COULEUR_LABELS_HEURE_MORT="#000000";

// Pour centrer les flèches de la map
var _centrageBpMap = 50;

// Espacement entre les items
var _spaceItem = 32;
var _spacePerso = 64;

// Espacement entre les boutons
var _espaceBoutonX=160;
var _espaceBoutonY=60;

// Espacement entre les labels
var _EspaceLabelX = 265;
var _EspaceLabelY = 20;
var ESPACE_BARRES_Y = 25;

// Placement label Arme
var _labelArmeX = 750;
var _labelArmeY = 5;

// Placement label Armure
var _labelArmureX = _labelArmeX + 180;
//var _labelArmureY = _labelArmeY + _EspaceLabelY+10;
var _labelArmureY = _labelArmeY;

// Placement label ItemPerso
var _labelItemPersoX = _labelArmeX;
var _labelItemPersoY = _labelArmureY 	+ _EspaceLabelY + 15;

//------------------- Zone 1 : 1/2 barres perso -----------------------------------------------------

// Placement label Points de vie
var _labelPtsVX = 200;
var _labelPtsVY = _labelArmeY;

// Placement label Points de faim
var _labelPtsFX = _labelPtsVX;
var _labelPtsFY = _labelPtsVY + _EspaceLabelY;

// Placement label Points d'Attaque
var _labelPtsAtqX = _labelPtsVX;
var _labelPtsAtqY = _labelPtsFY + _EspaceLabelY;

// Placement label Points de Défense
var _labelPtsDefX = _labelPtsAtqX +_EspaceLabelX;
var _labelPtsDefY = _labelPtsAtqY;

//------------------ Zone 2 : 2/2 barres perso -------------------------------------------------------

// Placement label Points d'action
var _labelPtsAX = _labelPtsVX + _EspaceLabelX;
var _labelPtsAY = _labelPtsVY;

// Placement label Points de mouvements
var _labelPtsMX = _labelPtsAX;
var _labelPtsMY = _labelPtsAY + _EspaceLabelY;

//------------------ Zone 9 : Infos Case ------------------------------------------------------

// Placement label Nombre d'Aliés
var __LABEL_NB_ALLIESX  = 185;
var __LABEL_NB_ALLIESY = 530;

// Placement label Nombre d'Ennemis
var __LABEL_NB_ENNEMISX = __LABEL_NB_ALLIESX ;
var __LABEL_NB_ENNEMISY = __LABEL_NB_ALLIESY + _EspaceLabelY;

// Placement label Nombre de Goules
var __LABEL_NB_GOULESX = __LABEL_NB_ALLIESX ;
var __LABEL_NB_GOULESY = __LABEL_NB_ENNEMISY + _EspaceLabelY;

//------------------ Zone 8 : Proba de la case -------------------------------------------------------

// Placement label Probabilité de Cache
var _labelProbaCacheX = __LABEL_NB_ALLIESX + 240;
var _labelProbaCacheY = __LABEL_NB_ALLIESY ;

// Placement label Probabilité de Fouille
var _labelProbaFouilleX = _labelProbaCacheX ;
var _labelProbaFouilleY = _labelProbaCacheY + _EspaceLabelY;

//------------------ Zone 13 : Modes------------------------------------------------------

// Placement label Choix Mode
//var _labelChoixModeX = _contBtnModesX+5;
//var _labelChoixModeY = _contBtnModesY-20;

//------------------ Zone 4 : Equipement Perso-------------------------------------------------------

// Placement Conteneur ArmeEquip
var _contArmeX = 100;
var _contArmeY = 470;

// Dimension Conteneur ArmeEquip
var _contArmeH = 30;
var _contArmeW = 30;

// Placement Conteneur ArmureEquip
var _contArmureX = _contArmeX;
var _contArmureY = _contArmeY+40;

// Dimension Conteneur ArmureEquip
var _contArmureH = 30;
var _contArmureW = 30;

//------------------ Zone 8 : Listes-------------------------------------------------------

// Placement Conteneur des Boutons liste
var _contBtnsListesX = 50;
var _contBtnsListesY = 180;
var _contBtnsListesW = 140;
var _contBtnsListesH = 2*_espaceBoutonY;

// Placement du label nombre de nouveaux messages
var _labelNombreNouvMsgX=_contBtnsListesX + _contBtnsListesW/3;
var _labelNombreNouvMsgY=_contBtnsListesY + 100;

// Placement label Choix Mode
var _labelBtnsListesX = _contBtnsListesX+2;
var _labelBtnsListesY = _contBtnsListesY-20;

// Placement label Choix Mode
//var _labelBtnsInvPersoX = _contBtnsInvPersoX-5;
//var _labelBtnsInvPersoY = _contBtnsInvPersoY-20;

//------------------------- Zone 6 : Btns Inv Case ---------------------------------------

// Placement label Choix Mode
//var _labelBtnsInvCaseX = _contBtnsInvCaseX-5;
//var _labelBtnsInvCaseY = _contBtnsInvCaseY-20;

//------------------ Zone 12 : Map -------------------------------------------------------

// Placement Conteneur Map (en fonction de la taille de l'image !!)
// Dimension Conteneur Map

var _contMapH = 316;
var _contMapW = 627;

var _contMapX = 1100/2 - _contMapW/2;
var _contMapY = 0;
//var _contMapY = 620/2 - 420/2;

//Placement Conteneur des informations de la case
var _contInfoCaseX = 175;
var _contInfoCaseY = 530;
var _contInfoCaseW = 750-_contInfoCaseX;
var _contInfoCaseH = _CANVAS_HAUTEUR-530;

/**
 * DECLARATION DES LABELS, CONTENEURS, CONTOURS ET BOUTONS
 */


var _LABEL_DEGATS 	= new createjs.Text("", _LABEL_POLICE, _COULEUR_LABELS);
var _LABEL_ATTAQUE_ZOMBIE;
var _LABEL_MODIF_NBR_ALLIES;
var _LABEL_MODIF_NBR_ENNEMIS;
var _LABEL_MODIF_NBR_ZOMBIE;

//_LABEL_DEGATS.x 	=
//_LABEL_DEGATS.y 	= 

////////////// VARIABLES POUR LES TOOLTIPS ///////////////
var _LABEL_POLICE="italic 12px Consolas";
var _CONTENEUR_TOOLTIP				;
var _LABEL_DESCRIPTION 				= new createjs.Text("", _LABEL_POLICE, _COULEUR_LABELS);
var _TAILLE_TOOLTIP					;
var _FOND_TOOLTIP 					;
_LABEL_DESCRIPTION.lineHeight 		= _LineHeight;
_LABEL_DESCRIPTION.textBaseline 	= _TextBaseline;
_LABEL_DESCRIPTION.x 				= 5;
_LABEL_DESCRIPTION.y 				= 5;

var _IMG_ITEM_SELECTED;

////////////// VARIABLES POUR LES INTERVALS ///////////////
var _ID_INTER_BLINK;
var _ID_INTER_BLINK_BARRE_VIE;
var _ID_INTER_MSG_RETOUR;
var _ID_INTER_CADRE_MAP;
var _ID_INTER_MODIF_FORCES;
var _ID_INTER_NBR_ZOMBIE_ATTAQUANTS;

var _BLINK_CPT;

//-------------- Déclaration des labels----------------------------------------------

var labelAction, labelObjetCase, labelInventaire, labelDescriptionItem,
labelPtsMove, labelPtsAction, labelPtsVie, labelPoidsSac, labelPtsAtq, labelPtsDef,
labelBonusArme, labelBonusArmure, labelCaseEnCours, _LABEL_NB_ALLIES, _LABEL_NB_ENNEMIS,
_LABEL_NB_GOULES, labelProbaCache, labelProbaFouille, labelPourcentLoad,
labelChoixMode, labelBtnsListes, labelBtnsInvPerso, labelBtnsInvCase, labelPtsFaim, 
labelAlliesListe, labelEnnemisListe, labelDescribePerso, labelMessage, 
labelDernierMessage, labelNombreNouvMsg, labelFichePerso, labelDescriptionCase,
labelLancementServeur;


//-------------- Déclaration des conteneurs----------------------------------------------

var _CONT_INV_CASE, contInvPerso, contArme, contArmure, contMap, contPerso, contBtnModes,
contBtnsListes, contDead, contInfoCase, contBtnsInvPerso, contBtnsInvCase, contBtnsInvCaseBis, contListe,
contListeAllies, contListeEnnemis, contZoneMessage, contMessage;

//-------------- Déclaration des contours----------------------------------------------

var shape, shape1, shape2, shape3, shape4, shape6, shape7, shape8, shapeMode,
shapeLabelsAction, shapeMessage, shapeDead, shapeInfoCase,
shapeBtnsListes, shapeBtnsInvPerso, shapeBtnsInvCase, shapeBtnsInvCaseBis, shapeBtnsListes, 
shapeBtnsInvPerso, shapeBtnsInvCase, shapeZoneMessage;

//-------------- Déclaration des boutons----------------------------------------------

var Btn_PAGE_PERSO_ALLIESRight, Btn_PAGE_PERSO_ALLIESLeft, Btn_PAGE_PERSO_ENNRight, Btn_PAGE_PERSO_ENNLeft,
Btn_PAGE_MESSAGESDown, Btn_PAGE_MESSAGESUp, BtnCancelListe;

/**
 * IMPORTANT : PERMET DE LANCER LE CANVAS !!
 */
onload = initialize;

/**
 * FONCTION D'INITIALISATION ET DE CHARGEMENT
 */

var lifeBarContainer;
function initialize() 
{
	// ************************************************
	// * Création du canvas et des autres élements   **
	// ************************************************
	
	// Création du canvas
	canvas = document.getElementById("myCanvas");
	
	//Création du stage (la scène) + recupération de sa taille
	stage = new createjs.Stage(canvas);
/*	createjs.Ticker.addListener("tick", function()
	{
		alert("tick");
	});*/
	
	// tailles
	_CANVAS_LARGEUR = stage.canvas.width;
	_CANVAS_HAUTEUR = stage.canvas.height;

	// autoriser le mouse over / out events
	stage.enableMouseOver(20);

	// enable touch interactions if supported on the current device:
	if(createjs.Touch.isSupported())
	{
		createjs.Touch.enable(stage);
	}

	// Teste la présence de HTML5 et de drag & drop
	/*if (Modernizr.draganddrop) {

    	} else {
    	  alert("! Vous devez passez en HTML5 !");
    	}*/

	// *******************************************
	// * Mise en place de la barre de chargement * 
	// *******************************************
	var manifest = [
	                {src:"public/Background_liste.jpg", id:"idBackgroundListe"},   
	                {src:"public/Background_1.png", id:"idBackground_1"}, 
	                {src:"public/Background_11.png", id:"idBackground_11"},  
	                {src:"public/Background_Dead.png", id:"idBackground_Dead"},
	                {src:"public/Background_Nuit.png", id:"idBackground_Nuit"},
	                {src:"public/blood.jpg", id:"idBackground_blood"}, 
	                {src:"public/Boutons/Historique.png", id:"idBtnHistorique"},
	                {src:"public/Boutons/Attaquer.png", id:"idBtnAttaquer"},
	                {src:"public/Boutons/AttaquerGris.png", id:"idBtnAttaquerGris"},
	                {src:"public/Boutons/Deposer.png", id:"idBtnDeposer"},
	                {src:"public/Boutons/DeposerGris.png", id:"idBtnDeposerGris"},
	                {src:"public/Boutons/Desequiper.png", id:"idBtnDesequiper"},
	                {src:"public/Boutons/DesequiperGris.png", id:"idBtnDesequiperGris"},
	                {src:"public/Boutons/Equiper.png", id:"idBtnEquiper"},
	                {src:"public/Boutons/EquiperGris.png", id:"idBtnEquiperGris"},
	                {src:"public/Boutons/FouilleR.png", id:"idBtnFouilleR"},
	                {src:"public/Boutons/FouilleRGris.png", id:"idBtnFouilleRGris"},
	                {src:"public/Boutons/Ramasser.png", id:"idBtnRamasser"},
	                {src:"public/Boutons/RamasserGris.png", id:"idBtnRamasserGris"},
	                {src:"public/Boutons/CacheGreen.png", id:"idBtnCacheGreen"},
	                {src:"public/Boutons/CacheRed.png", id:"idBtnCacheRed"},
	                {src:"public/Boutons/DefenseGreen.png", id:"idBtnDefenseGreen"},
	                {src:"public/Boutons/DefenseRed.png", id:"idBtnDefenseRed"},
	                {src:"public/Boutons/FouilleGreen.png", id:"idBtnFouilleGreen"},
	                {src:"public/Boutons/FouilleRed.png", id:"idBtnFouilleRed"},
	                {src:"public/Boutons/Joueurs.png", id:"idBtnJoueurs"},
	                {src:"public/Boutons/JoueursGris.png", id:"idBtnJoueursGris"},
	                {src:"public/Boutons/Consommer.png", id:"idBtnConsommer"},
	                {src:"public/Boutons/ConsommerGris.png", id:"idBtnConsommerGris"},
	                {src:"public/Boutons/Annuler.png", id:"idBtnAnnuler"},
	                {src:"public/Boutons/Zombie.png", id:"idBtnZombie"},
	                {src:"public/Boutons/ZombieGris.png", id:"idBtnZombieGris"},
	                {src:"public/Boutons/Revivre.png", id:"idBtnRevivre"},
	                {src:"public/Boutons/Retour.png", id:"idBtnRetour"},
	                {src:"public/Boutons/LArrow.png", id:"idBtnLArrow"},
	                {src:"public/Boutons/Left.png", id:"idBtnLeft"},
	                {src:"public/Boutons/Right.png", id:"idBtnRight"},
	                {src:"public/Boutons/Up.png", id:"idBtnUp"},
	                {src:"public/Boutons/Down.png", id:"idBtnDown"},
	                {src:"public/Boutons/RArrow.png", id:"idBtnRArrow"},
	                {src:"public/Boutons/DArrow.png", id:"idBtnDArrow"},
	                {src:"public/Boutons/UArrow.png", id:"idBtnUArrow"},
	                {src:"public/Boutons/Select.png", id:"idSelect"},
	                {src:"public/Boutons/Select64.png", id:"idSelect64"},
	                {src:"public/Boutons/Messages.png", id:"idBtnMessages"},
	                {src:"public/Boutons/MessagesVide.png", id:"idBtnMessagesVide"},
	                {src:"public/Boutons/MessagesGris.png", id:"idBtnMessagesGris"},
	                {src:"public/Boutons/Ok.png", id:"idBtnOk"},
	                {src:"public/Boutons/Vivant.png", id:"idBtnVivant"},
	                {src:"public/spritesheets/persos/Brute64.png", id:"idPersoBrute64"},
	                {src:"public/spritesheets/persos/Chercheur64.png", id:"idPersoChercheur64"},
	                {src:"public/spritesheets/persos/Explorateur64.png", id:"idPersoExplorateur64"},
	                {src:"public/spritesheets/persos/Brute64gris.png", id:"idPersoBrute64gris"},
	                {src:"public/spritesheets/persos/Chercheur64gris.png", id:"idPersoChercheur64gris"},
	                {src:"public/spritesheets/persos/Explorateur64gris.png", id:"idPersoExplorateur64gris"},
	                {src:"public/spritesheets/persos/perso.gif", id:"idPerso"},
	                {src:"public/map/1.png", id:"1"},
	                {src:"public/map/2_a.png", id:"2_a"},
	                {src:"public/map/2_b.png", id:"2_b"},
	                {src:"public/map/3.png", id:"3"},
	                {src:"public/map/4_a.png", id:"4_a"},
	                {src:"public/map/4_b.png", id:"4_b"},
	                {src:"public/map/4_c.png", id:"4_c"},
	                {src:"public/map/4_d.png", id:"4_d"},
	                {src:"public/map/5.png", id:"5"},
	                {src:"public/map/6.png", id:"6"},
	                {src:"public/map/7.png", id:"7"},
	                {src:"public/map/8.png", id:"8"},
	                {src:"public/map/9_a.png", id:"9_a"},
	                {src:"public/map/9_b.png", id:"9_b"},
	                {src:"public/map/9_c.png", id:"9_c"},
	                {src:"public/map/9_d.png", id:"9_d"},
	                {src:"public/map/10.png", id:"10"},
	                {src:"public/map/11.png", id:"11"},
	                {src:"public/map/12.png", id:"12"},
	                {src:"public/map/13.png", id:"13"},
	                {src:"public/map/14.png", id:"14"},
	                {src:"public/map/15.png", id:"15"},
	                {src:"public/map/16_a.png", id:"16_a"},
	                {src:"public/map/16_b.png", id:"16_b"},
	                {src:"public/map/16_c.png", id:"16_c"},
	                {src:"public/map/17_a.png", id:"17_a"},
	                {src:"public/map/17_b.png", id:"17_b"},
	                {src:"public/map/17_c.png", id:"17_c"},
	                {src:"public/map/18_a.png", id:"18_a"},
	                {src:"public/map/18_b.png", id:"18_b"},
	                {src:"public/map/19_a.png", id:"19_a"},
	                {src:"public/map/19_b.png", id:"19_b"},
	                {src:"public/map/19_c.png", id:"19_c"},
	                {src:"public/map/20.png", id:"20"},
	                {src:"public/map/21.png", id:"21"},
	                {src:"public/map/22_a.png", id:"22_a"},
	                {src:"public/map/22_b.png", id:"22_b"},
	                {src:"public/map/23.png", id:"23"},
	                {src:"public/map/24.png", id:"24"},
	                {src:"public/map/25.png", id:"25"},
	                {src:"public/map/26.png", id:"26"},
	                {src:"public/map/27.png", id:"27"},
	                {src:"public/map/28.png", id:"28"},
	                {src:"public/map/29.png", id:"29"},
	                {src:"public/map/30.png", id:"30"},
	                {src:"public/map/31.png", id:"31"},
	                {src:"public/map/32.png", id:"32"},
	                {src:"public/map/33.png", id:"33"},
	                {src:"public/map/34_a.png", id:"34_a"},
	                {src:"public/map/34_b.png", id:"34_b"},
	                {src:"public/map/35_a.png", id:"35_a"},
	                {src:"public/map/35_b.png", id:"35_b"},
	                {src:"public/map/35_c.png", id:"35_c"},
	                {src:"public/map/36_a.png", id:"36_a"},
	                {src:"public/map/36_b.png", id:"36_b"},
	                {src:"public/map/37.png", id:"37"},
	                {src:"public/map/38.png", id:"38"},
	                {src:"public/map/39.png", id:"39"},
	                {src:"public/spritesheets/arme/100.png", id:"100"},
	                {src:"public/spritesheets/arme/101.png", id:"101"},
	                {src:"public/spritesheets/arme/102.png", id:"102"},
	                {src:"public/spritesheets/arme/103.png", id:"103"},
	                {src:"public/spritesheets/arme/104.png", id:"104"},
	                {src:"public/spritesheets/arme/105.png", id:"105"},
	                {src:"public/spritesheets/arme/106.png", id:"106"},
	                {src:"public/spritesheets/arme/107.png", id:"107"},
	                {src:"public/spritesheets/arme/108.png", id:"108"},
	                {src:"public/spritesheets/arme/109.png", id:"109"},
	                {src:"public/spritesheets/arme/110.png", id:"110"},
	                {src:"public/spritesheets/arme/111.png", id:"111"},
	                {src:"public/spritesheets/arme/112.png", id:"112"},
	                {src:"public/spritesheets/arme/113.png", id:"113"},
	                {src:"public/spritesheets/arme/114.png", id:"114"},
	                {src:"public/spritesheets/arme/115.png", id:"115"},
	                {src:"public/spritesheets/arme/116.png", id:"116"},
	                {src:"public/spritesheets/arme/117.png", id:"117"},
	                {src:"public/spritesheets/arme/118.png", id:"118"},
	                {src:"public/spritesheets/arme/119.png", id:"119"},
	                {src:"public/spritesheets/arme/120.png", id:"120"},
	                {src:"public/spritesheets/arme/121.png", id:"121"},
	                {src:"public/spritesheets/armure/200.png", id:"200"},
	                {src:"public/spritesheets/armure/201.png", id:"201"},
	                {src:"public/spritesheets/armure/202.png", id:"202"},
	                {src:"public/spritesheets/armure/203.png", id:"203"},
	                {src:"public/spritesheets/armure/204.png", id:"204"},
	                {src:"public/spritesheets/armure/205.png", id:"205"},
	                {src:"public/spritesheets/armure/206.png", id:"206"},
	                {src:"public/spritesheets/armure/207.png", id:"207"},
	                {src:"public/spritesheets/armure/208.png", id:"208"},
	                {src:"public/spritesheets/armure/209.png", id:"209"},
	                {src:"public/spritesheets/armure/210.png", id:"210"},
	                {src:"public/spritesheets/armure/211.png", id:"211"},
	                {src:"public/spritesheets/armure/212.png", id:"212"},
	                {src:"public/spritesheets/odd/300.png", id:"300"},
	                {src:"public/spritesheets/odd/301.png", id:"301"},
	                {src:"public/spritesheets/odd/302.png", id:"302"},
	                {src:"public/spritesheets/odd/303.png", id:"303"},
	                {src:"public/spritesheets/odd/304.png", id:"304"},
	                {src:"public/spritesheets/odd/305.png", id:"305"},
	                {src:"public/spritesheets/odd/306.png", id:"306"},
	                {src:"public/spritesheets/odd/307.png", id:"307"},
	                {src:"public/spritesheets/odd/308.png", id:"308"},
	                {src:"public/spritesheets/potionSoin/400.png", id:"400"},
	                {src:"public/spritesheets/potionSoin/401.png", id:"401"},
	                {src:"public/spritesheets/potionSoin/402.png", id:"402"},
	                {src:"public/spritesheets/potionSoin/403.png", id:"403"},
	                {src:"public/spritesheets/potionAction/500.png", id:"500"},
	                {src:"public/spritesheets/potionAction/501.png", id:"501"},
	                {src:"public/spritesheets/potionAction/502.png", id:"502"},
	                {src:"public/spritesheets/potionAction/503.png", id:"503"},
	                {src:"public/spritesheets/potionMouvement/600.png", id:"600"},
	                {src:"public/spritesheets/potionMouvement/601.png", id:"601"},
	                {src:"public/spritesheets/potionMouvement/602.png", id:"602"},
	                {src:"public/spritesheets/potionMouvement/603.png", id:"603"},
	                {src:"public/spritesheets/nourriture/700.png", id:"700"},
	                {src:"public/spritesheets/nourriture/701.png", id:"701"},
	                {src:"public/spritesheets/nourriture/702.png", id:"702"},
	                {src:"public/spritesheets/nourriture/703.png", id:"703"},
	                {src:"public/spritesheets/nourriture/704.png", id:"704"},
	                {src:"public/spritesheets/nourriture/705.png", id:"705"},
	                {src:"public/spritesheets/nourriture/706.png", id:"706"},
	                {src:"public/spritesheets/nourriture/707.png", id:"707"},
	                {src:"public/spritesheets/nourriture/708.png", id:"708"},
	                {src:"public/spritesheets/nourriture/709.png", id:"709"},
	                {src:"public/spritesheets/nourriture/710.png", id:"710"},
	                {src:"public/spritesheets/nourriture/711.png", id:"711"},
	                {src:"public/spritesheets/nourriture/712.png", id:"712"},
	                {src:"public/spritesheets/nourriture/713.png", id:"713"},
	                {src:"public/pictos/nbrAllie.png", id:"imgAllies"},
	                {src:"public/pictos/nbrEnnemis.png", id:"imgEnnemis"},
	                {src:"public/pictos/nbrZombies.png", id:"imgZombies"},
	                {src:"public/pictos/ptsVie.png", id:"imgVie"},
	                {src:"public/pictos/ptsFaim.png", id:"imgFaim"},
	                {src:"public/pictos/ptsAction.png", id:"imgAction"},
	                {src:"public/pictos/ptsMouvement.png", id:"imgMouvement"},
	                {src:"public/pictos/poidsSac.png", id:"imgSac"},
	                {src:"public/pictos/ptsAttaque.png", id:"imgAttaque"},
	                {src:"public/pictos/ptsDef.png", id:"imgDefense"},
	                {src:"public/pictos/probaFouille.png", id:"imgFouille"},
	                {src:"public/pictos/probaCache.png", id:"imgCache"}
	                ];

	// application du background Preload
	backgroundPreload = new createjs.Bitmap("public/Background_1.png");
	backgroundPreload.image.onload = setImg(backgroundPreload, 0, 0);
	backgroundPreload.cursor="wait";

	loadProgressLabel = stage.addChild(new createjs.Text("","70px Infected","#850000"));
	loadProgressLabel.lineWidth = 800;
	loadProgressLabel.textAlign = "center";
	//Centrer le label en x
	//loadProgressLabel.x = canvas.width/2;
	loadProgressLabel.x = canvas.width/2;
	loadProgressLabel.y = canvas.height/2 - 80;
	
	labelPourcentLoad= stage.addChild(new createjs.Text("","70px Consolas","#850000"));
	labelPourcentLoad.x=loadProgressLabel.x +20;
	labelPourcentLoad.y=loadProgressLabel.y+190;

	loadingBarContainer = new createjs.Container();
	loadingBarContainer.cursor="wait";

	loadingBarHeight = 80;
	loadingBarWidth = 500;
	LoadingBarColor = createjs.Graphics.getRGB(85,0,0);

	loadingBar = new createjs.Shape();
	loadingBar.graphics.beginFill(LoadingBarColor).drawRect(0, 0, 1, loadingBarHeight).endFill();

	frame = new createjs.Shape();
	padding = 3;
	frame.graphics.setStrokeStyle(1).beginStroke(LoadingBarColor).drawRect(-padding/2, -padding/2, loadingBarWidth+padding, loadingBarHeight+padding);

	loadingBarContainer.addChild(loadingBar, frame);
	// Centrer la barre de chargement
	//loadingBarContainer.x = Math.round(canvas.width/2 - loadingBarWidth/2);
	loadingBarContainer.x=canvas.width/2 - loadingBarWidth/2;
	loadingBarContainer.y = canvas.height/2 ;
	stage.addChild(loadingBarContainer);

	preload = new createjs.LoadQueue(false);
	preload.addEventListener("complete", handleComplete);
	preload.addEventListener("progress", handleProgress);

	preload.loadManifest(manifest);
	//stage.update();


	// Rafraichissement
	createjs.Ticker.setInterval(20);
	createjs.Ticker.addEventListener("tick", function()
	{
		// actualise les éléments d'easel
		stage.update();
		
		// redessine les barres de vie (utilisation du contexte)
		if (_CONTENEUR_BARRES_INITIALISES && !_ECRAN_MORT && !_ECRAN_ATTAQUE_NUIT) 
		{
			setContourBarre(lifeBarContainer.x,lifeBarContainer.y);
			setContourBarre(faimBarContainer.x, faimBarContainer.y);
			setContourBarre(actionBarContainer.x, actionBarContainer.y);
			setContourBarre(moveBarContainer.x, moveBarContainer.y);
			setContourBarre(sacBarContainer.x, sacBarContainer.y);
			setContourBarre(fouilleBarContainer.x, fouilleBarContainer.y);
			setContourBarre(cacheBarContainer.x, cacheBarContainer.y);
		}
	});
}

function handleProgress() 
{
	loadingBar.scaleX = preload.progress * loadingBarWidth;

	progresPrecentage = Math.round(preload.progress*100);
	loadProgressLabel.text =("Loading Apocalypse\n\n\n\n" + progresPrecentage);
	labelPourcentLoad.text=" %";

	//stage.update();
}

function handleComplete() 
{
	stage.removeChild(labelPourcentLoad);
	backgroundPreload.cursor="pointer";
	loadingBarContainer.cursor="pointer";

	loadProgressLabel.text = "Click to Survive";
	//stage.update();

	canvas.addEventListener("click", handleClick);
	canvas.addEventListener("touchstart", handleClick);
}

function handleClick() {
	stage.removeChild(loadProgressLabel, loadingBarContainer, backgroundPreload);
	canvas.removeEventListener("click", handleClick);
	canvas.removeEventListener("touchstart", handleClick);
	start();
}

function start()
{
	// Lancement du jeu si connexion ok
	if(socket.socket.connected)
		{
		setPlateau();
		}
}

function setPlateau()
{
	// application du background
	var background = new createjs.Bitmap("public/Background_11.png");
	
	background.image.onload = setImg(background, 0, 0);
	
	// Affichage des labels de titres

	var _labelTitreSac			= new createjs.Text("SAC", _POLICE_TITRE_1, _COULEUR_TITRE);
	var _labelTitreMode			= new createjs.Text("MODE", _POLICE_TITRE_1, _COULEUR_TITRE);
	var _labelTitreCase			= new createjs.Text("CASE", _POLICE_TITRE_1, _COULEUR_TITRE);
	var _labelTitreInventaire   = new createjs.Text("INVENTAIRE", _POLICE_TITRE_2, _COULEUR_TITRE_2);
	var _labelTitreObjetsCase   = new createjs.Text("OBJETS DE LA CASE", _POLICE_TITRE_2, _COULEUR_TITRE_2);
	var _labelTitreForces   = new createjs.Text("FORCES EN PRESENCE", _POLICE_TITRE_2, _COULEUR_TITRE_2);

	_labelTitreSac.x 		= 690;
	_labelTitreSac.y 		= 392;
	_labelTitreMode.x 		= 527;
	_labelTitreMode.y 		= 392;
	_labelTitreCase.x 		= 910;
	_labelTitreCase.y 		= 392;

	_labelTitreInventaire.x = 870;
	_labelTitreInventaire.y = 10;
	_labelTitreObjetsCase.x = 870;
	_labelTitreObjetsCase.y = 120;

	_labelTitreForces.x = 5;
	_labelTitreForces.y = 45;

	stage.addChild(_labelTitreSac);
	stage.addChild(_labelTitreMode);
	stage.addChild(_labelTitreCase);
	stage.addChild(_labelTitreInventaire);
	stage.addChild(_labelTitreObjetsCase);
	stage.addChild(_labelTitreForces);
	// *****************************************
	// ** creation des conteneurs               *
	// ******************************************

	// - ZONE CONTENEUR MESSAGE -
	contZoneMessage = new createjs.Container();
	contZoneMessage.x = 0;
	contZoneMessage.y = _contMapH+2;
	contZoneMessage.width = _CANVAS_LARGEUR;
	contZoneMessage.height = 60;
	stage.addChild(contZoneMessage);
	shapeZoneMessage = new createjs.Shape();
	stage.addChild(shapeZoneMessage);
	shapeZoneMessage.graphics.setStrokeStyle(2).beginStroke("#405050").drawRect(
			contZoneMessage.x-2, contZoneMessage.y-2, contZoneMessage.width+2, contZoneMessage.height+2);

	// Label des messages de retour
	labelAction = contZoneMessage.addChild(new createjs.Text("", _POLICE_LABEL, _colorLabelAction));
	labelAction.x = 5;

	// Label dernier message
	labelDernierMessage = contZoneMessage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	/*labelDernierMessage.lineHeight = _LineHeight;
	labelDernierMessage.textBaseline = _TextBaseline;*/
	labelDernierMessage.x = labelAction.x;
	labelDernierMessage.y = _EspaceLabelY;

	// Label description case
	labelDescriptionCase = contZoneMessage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	/*labelDescriptionCase.lineHeight = _LineHeight;
	labelDescriptionCase.textBaseline = _TextBaseline;*/
	labelDescriptionCase.x = labelAction.x;
	labelDescriptionCase.y = 2*_EspaceLabelY;

	// - ZONE ITEMS-
	contTousItems = new createjs.Container();
	contTousItems.x = _CANVAS_LARGEUR - (_contMapX);
	contTousItems.y = 0;
	contTousItems.width = _CANVAS_LARGEUR - (_contMapX+_contMapW);
	contTousItems.height = _contMapH;
	stage.addChild(contTousItems);
	/*shapeTousItems = new createjs.Shape();
	stage.addChild(shapeTousItems);
	shapeTousItems.graphics.setStrokeStyle(2).beginStroke("#FF0000").drawRect(
			contTousItems.x, contTousItems.y, contTousItems.width, contTousItems.height);*/

	//------------------Inventaire Case -------------------------------------------------------

	//------------------Inventaire perso -------------------------------------------------------
	contInvPerso = new createjs.Container();
	contInvPerso.x = 5;
	contInvPerso.y = 5;
	contInvPerso.width = 330;
	contInvPerso.height = 40;
	contTousItems.addChild(contInvPerso);
	shape1 = new createjs.Shape();
	contTousItems.addChild(shape1);
	shape1.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			contInvPerso.x-4, contInvPerso.y-4, contInvPerso.width+4, contInvPerso.height+4);

	_CONT_INV_CASE = new createjs.Container();
	_CONT_INV_CASE.x = contInvPerso.x;
	_CONT_INV_CASE.y = contInvPerso.y + 32;
	_CONT_INV_CASE.width = contInvPerso.width;
	_CONT_INV_CASE.height = contInvPerso.height;
	contTousItems.addChild(_CONT_INV_CASE);
	shape = new createjs.Shape();
	contTousItems.addChild(shape);
	shape.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_CONT_INV_CASE.x-4, _CONT_INV_CASE.y-4, _CONT_INV_CASE.width+4, _CONT_INV_CASE.height+4);

	contArme = new createjs.Container();
	contArme.x = _contArmeX;
	contArme.y = _contArmeY;
	contArme.width = _contArmeW;
	contArme.height = _contArmeH;
	stage.addChild(contArme);
	shape2 = new createjs.Shape();
	stage.addChild(shape2);
	shape2.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contArmeX-4, _contArmeY-4, _contArmeW+4, _contArmeH+4);

	contArmure = new createjs.Container();
	contArmure.x = _contArmureX;
	contArmure.y = _contArmureY;
	contArmure.width = _contArmureW;
	contArmure.height = _contArmureH;
	stage.addChild(contArmure);
	shape3 = new createjs.Shape();
	stage.addChild(shape3);
	shape3.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contArmureX-4, _contArmureY-4, _contArmureW+4, _contArmureH+4);

	//------------------ Zone 12 : Map -------------------------------------------------------
	contMap = new createjs.Container();
	contMap.x = _contMapX;
	contMap.y = _contMapY;
	contMap.width = _contMapW;
	contMap.height = _contMapH;
	stage.addChild(contMap);
	//contMap.cache(_contMapX, _contMapY, _contMapW, _contMapH);7

	//------------------------- Zone 8 : Btns Listes---------------------------------------
	contBtnsListes = new createjs.Container();
	contBtnsListes.x = _contBtnsListesX;
	contBtnsListes.y = _contBtnsListesY;
	contBtnsListes.width = _contBtnsListesW;
	contBtnsListes.height = _contBtnsListesH;
	stage.addChild(contBtnsListes);
	/*shapeBtnsListes = new createjs.Shape();
	stage.addChild(shapeBtnsListes);
	shapeBtnsListes.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contBtnsListesX-4, _contBtnsListesY-4, _contBtnsListesW+5, _contBtnsListesH+5);*/

	// - ZONE BOUTONS -
	contBoutons = new createjs.Container();
	contBoutons.x = 450;
	contBoutons.y = 380;
	contBoutons.width = _CANVAS_LARGEUR - contBoutons.x;
	contBoutons.height = _CANVAS_HAUTEUR - contBoutons.y;
	stage.addChild(contBoutons);
	shapeBoutons = new createjs.Shape();
	stage.addChild(shapeBoutons);
	shapeBoutons.graphics.setStrokeStyle(2).beginStroke("#405050").drawRect(
			contBoutons.x-2, contBoutons.y-2, contBoutons.width+2, contBoutons.height+2);

	//------------------------- Placement Conteneur des Boutons perso -----------------------------------------------
	contBtnModes = new createjs.Container();
	contBtnModes.x = 20;
	contBtnModes.y = 40;
	contBtnModes.width = 140;
	contBtnModes.height = 3*_espaceBoutonY;
	contBoutons.addChild(contBtnModes);
	/*shapeMode = new createjs.Shape();
	contBoutons.addChild(shapeMode);
	shapeMode.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			contBtnModes.x-4, contBtnModes.y-4, contBtnModes.width+5, contBtnModes.height+5);*/

	//------------------------- Zone 5 : Btns Inv Perso ---------------------------------------
	contBtnsInvPerso = new createjs.Container();
	contBtnsInvPerso.x = contBtnModes.x+_espaceBoutonX;
	contBtnsInvPerso.y = contBtnModes.y;
	contBtnsInvPerso.width = contBtnModes.width;
	contBtnsInvPerso.height = 3*_espaceBoutonY;
	contBoutons.addChild(contBtnsInvPerso);
	/*shapeBtnsInvPerso = new createjs.Shape();
	contBoutons.addChild(shapeBtnsInvPerso);
	shapeBtnsInvPerso.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			contBtnsInvPerso.x-4, contBtnsInvPerso.y-4, contBtnsInvPerso.width+4, contBtnsInvPerso.height+4);*/

	//------------------------- Zone 6 : Btns Inv Case ---------------------------------------
	contBtnsInvCase = new createjs.Container();
	contBtnsInvCase.x = contBtnModes.x+2*_espaceBoutonX;
	contBtnsInvCase.y = contBtnModes.y;
	contBtnsInvCase.width = contBtnModes.width;
	contBtnsInvCase.height = 2*_espaceBoutonY;
	contBoutons.addChild(contBtnsInvCase);
	/*shapeBtnsInvCase = new createjs.Shape();
	contBoutons.addChild(shapeBtnsInvCase);
	shapeBtnsInvCase.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			contBtnsInvCase.x-4, contBtnsInvCase.y-4, contBtnsInvCase.width+4, contBtnsInvCase.height+4);*/

	contBtnsInvCaseBis = new createjs.Container();
	contBtnsInvCaseBis.x = contBtnModes.x+3*_espaceBoutonX;
	contBtnsInvCaseBis.y = contBtnModes.y;
	contBtnsInvCaseBis.width = contBtnModes.width;
	contBtnsInvCaseBis.height = 2*_espaceBoutonY;
	contBoutons.addChild(contBtnsInvCaseBis);
	/*shapeBtnsInvCaseBis = new createjs.Shape();
	contBoutons.addChild(shapeBtnsInvCaseBis);
	shapeBtnsInvCaseBis.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			contBtnsInvCaseBis.x-4, contBtnsInvCaseBis.y-4, contBtnsInvCaseBis.width+4, contBtnsInvCaseBis.height+4);*/
	
	contInfoCase = new createjs.Container();
	contInfoCase.x = _contInfoCaseX;
	contInfoCase.y = _contInfoCaseY;
	contInfoCase.width = _contInfoCaseW;
	contInfoCase.height = _contInfoCaseH;
	stage.addChild(contInfoCase);
	shapeInfoCase = new createjs.Shape();
	stage.addChild(shapeInfoCase);
	shapeInfoCase.graphics.setStrokeStyle(_BARRES_FRAMES_STROKE).beginStroke("#99FF00").drawRect(
			_contInfoCaseX-4, _contInfoCaseY-4, _contInfoCaseW+5, _contInfoCaseH+5);

	// ******************************************
	// ** Création des barres du perso 			*
	// ******************************************

	//------------------- Zone 1 -----------------------------------------------------
	// Barre de vie
	lifeBarContainer = new createjs.Container();

	lifeBarHeight = _BARRES_HEIGHT ;
	lifeBarWidth = _BARRES_WIDTH;
	lifeBarColor = createjs.Graphics.getRGB(0,255,0);

	lifeBar = new createjs.Shape();
	lifeBar.graphics.beginFill(lifeBarColor).drawRect(0, 0, 1, lifeBarHeight).endFill();
	
	lifeBarContainer.addChild(lifeBar);
	lifeBarContainer.x = 200;
	lifeBarContainer.y = 390;
	stage.addChild(lifeBarContainer);

	// Barre de Faim

	faimBarContainer = new createjs.Container();

	faimBarWidth = _BARRES_WIDTH;
	faimBarHeight = _BARRES_HEIGHT ;
	faimBarColor = createjs.Graphics.getRGB(99,0,66);

	faimBar = new createjs.Shape();
	faimBar.graphics.beginFill(faimBarColor).drawRect(0, 0, 1, faimBarHeight).endFill();

	faimBarContainer.addChild(faimBar);
	faimBarContainer.x = lifeBarContainer.x;
	faimBarContainer.y = lifeBarContainer.y + ESPACE_BARRES_Y;
	stage.addChild(faimBarContainer);

	//------------------- Zone 2 -----------------------------------------------------
	// Barre d'action

	actionBarContainer = new createjs.Container();

	actionBarWidth = _BARRES_WIDTH;
	actionBarHeight = _BARRES_HEIGHT ;
	actionBarColor = createjs.Graphics.getRGB(255,0,0);

	actionBar = new createjs.Shape();
	actionBar.graphics.beginFill(actionBarColor).drawRect(0, 0, 1, actionBarHeight).endFill();

	actionBarContainer.addChild(actionBar);
	actionBarContainer.x = lifeBarContainer.x;
	actionBarContainer.y = lifeBarContainer.y + 2*ESPACE_BARRES_Y;
	stage.addChild(actionBarContainer);

	// Barre de mouvement

	moveBarContainer = new createjs.Container();

	moveBarWidth = _BARRES_WIDTH;
	moveBarHeight = _BARRES_HEIGHT ;
	moveBarColor = createjs.Graphics.getRGB(0,51,255);

	moveBar = new createjs.Shape();
	moveBar.graphics.beginFill(moveBarColor).drawRect(0, 0, 1, moveBarHeight).endFill();

	moveBarContainer.addChild(moveBar);
	moveBarContainer.x = lifeBarContainer.x;
	moveBarContainer.y = lifeBarContainer.y + 3*ESPACE_BARRES_Y;
	stage.addChild(moveBarContainer);

	// Barre de Poids du Sac

	sacBarContainer = new createjs.Container();

	sacBarWidth = _BARRES_WIDTH;
	sacBarHeight = _BARRES_HEIGHT ;
	sacBarColor = createjs.Graphics.getRGB(204,153,0);

	sacBar = new createjs.Shape();
	sacBar.graphics.beginFill(sacBarColor).drawRect(0, 0, 1, sacBarHeight).endFill();

	sacBarContainer.addChild(sacBar);
	sacBarContainer.x = lifeBarContainer.x;
	sacBarContainer.y = lifeBarContainer.y + 4*ESPACE_BARRES_Y;
	stage.addChild(sacBarContainer);

	// Barre de proba Fouille

	fouilleBarContainer = new createjs.Container();

	fouilleBarWidth = _BARRES_WIDTH;
	fouilleBarHeight = _BARRES_HEIGHT ;
	fouilleBarColor = createjs.Graphics.getRGB(255,153,0);

	fouilleBar = new createjs.Shape();
	fouilleBar.graphics.beginFill(fouilleBarColor).drawRect(0, 0, 1, fouilleBarHeight).endFill();

	fouilleBarContainer.addChild(fouilleBar);
	fouilleBarContainer.x = lifeBarContainer.x;
	fouilleBarContainer.y = lifeBarContainer.y + 7*ESPACE_BARRES_Y;
	stage.addChild(fouilleBarContainer);

	// Barre de proba Cache

	cacheBarContainer = new createjs.Container();

	cacheBarWidth = _BARRES_WIDTH;
	cacheBarHeight = _BARRES_HEIGHT ;
	cacheBarColor = createjs.Graphics.getRGB(102,102,51);

	cacheBar = new createjs.Shape();
	cacheBar.graphics.beginFill(cacheBarColor).drawRect(0, 0, 1, cacheBarHeight).endFill();

	cacheBarContainer.addChild(cacheBar);
	cacheBarContainer.x = lifeBarContainer.x;
	cacheBarContainer.y = lifeBarContainer.y + 8*ESPACE_BARRES_Y;
	stage.addChild(cacheBarContainer);

	_CONTENEUR_BARRES_INITIALISES = true;

	// - ZONE PICTOGRAMMES BARRES DU PERSO-
	contPictoBarres = new createjs.Container();
	contPictoBarres.x = lifeBarContainer.x - 40;
	contPictoBarres.y = lifeBarContainer.y - 10;
	contPictoBarres.width = 32;
	contPictoBarres.height = 8*ESPACE_BARRES_Y + 40;
	stage.addChild(contPictoBarres);
	/*shapePictoBarres = new createjs.Shape();
	stage.addChild(shapePictoBarres);
	shapePictoBarres.graphics.setStrokeStyle(2).beginStroke("#00FF00").drawRect(
			contPictoBarres.x-2, contPictoBarres.y-2, contPictoBarres.width+2, contPictoBarres.height+2);*/

	imgVie = new createjs.Bitmap("public/pictos/ptsVie.png");
	imgVie.y=-2;
	contPictoBarres.addChild(imgVie);

	imgFaim = new createjs.Bitmap("public/pictos/ptsFaim.png");
	imgFaim.y=25;
	contPictoBarres.addChild(imgFaim);

	imgAction = new createjs.Bitmap("public/pictos/ptsAction.png");
	imgAction.y=25*2;
	contPictoBarres.addChild(imgAction);

	imgMouvement = new createjs.Bitmap("public/pictos/ptsMouvement.png");
	imgMouvement.y=25*3;
	contPictoBarres.addChild(imgMouvement);

	imgSac = new createjs.Bitmap("public/pictos/poidsSac.png");
	imgSac.y=25*4;
	contPictoBarres.addChild(imgSac);

	imgAttaque = new createjs.Bitmap("public/pictos/ptsAttaque.png");
	imgAttaque.y=25*5;
	contPictoBarres.addChild(imgAttaque);

	imgDefense = new createjs.Bitmap("public/pictos/ptsDef.png");
	imgDefense.y=25*6;
	contPictoBarres.addChild(imgDefense);

	imgFouille = new createjs.Bitmap("public/pictos/probaFouille.png");
	imgFouille.y=25*7;
	contPictoBarres.addChild(imgFouille);

	imgCache = new createjs.Bitmap("public/pictos/probaCache.png");
	imgCache.y=25*8;
	contPictoBarres.addChild(imgCache);

	// - ZONE PICTOGRAMMES INFO CASE-
	contPictoCase = new createjs.Container();
	contPictoCase.x = 10; // avt : 50
	contPictoCase.y = 65; // avt : 45
	contPictoCase.width = 32;
	contPictoCase.height = 3*ESPACE_BARRES_Y + 40;
	stage.addChild(contPictoCase);
	/*shapePictoCase = new createjs.Shape();
	stage.addChild(shapePictoCase);
	shapePictoCase.graphics.setStrokeStyle(2).beginStroke("#00FF00").drawRect(
			contPictoCase.x-2, contPictoCase.y-2, contPictoCase.width+2, contPictoCase.height+2);*/

	imgAllies = new createjs.Bitmap("public/pictos/nbrAllie.png");
	imgAllies.y=-2;
	contPictoCase.addChild(imgAllies);

	imgEnnemis = new createjs.Bitmap("public/pictos/nbrEnnemis.png");
	imgEnnemis.y=32;
	contPictoCase.addChild(imgEnnemis);

	imgZombies = new createjs.Bitmap("public/pictos/nbrZombies_plusPetit.png");
	imgZombies.x=2; // avt : -2
	imgZombies.y=33*2+4;
	contPictoCase.addChild(imgZombies);

	_LABEL_NB_ALLIES = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	/*_LABEL_NB_ALLIES.lineHeight = _LineHeight;
	_LABEL_NB_ALLIES.textBaseline = _TextBaseline;*/
	_LABEL_NB_ALLIES.x = contPictoCase.x + 40 ;
	_LABEL_NB_ALLIES.y = contPictoCase.y + 5;
	_LABEL_NB_ALLIES.text="0";

	_LABEL_NB_ENNEMIS = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	/*_LABEL_NB_ENNEMIS.lineHeight = _LineHeight;
	_LABEL_NB_ENNEMIS.textBaseline = _TextBaseline;*/
	_LABEL_NB_ENNEMIS.x = _LABEL_NB_ALLIES.x;
	_LABEL_NB_ENNEMIS.y = _LABEL_NB_ALLIES.y+35;
	_LABEL_NB_ENNEMIS.text="0";

	_LABEL_NB_GOULES = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	/*_LABEL_NB_GOULES.lineHeight = _LineHeight;
	_LABEL_NB_GOULES.textBaseline = _TextBaseline;*/
	_LABEL_NB_GOULES.x = _LABEL_NB_ALLIES.x;
	_LABEL_NB_GOULES.y = _LABEL_NB_ALLIES.y+25*2+23; // avt : y*32*2+10
	_LABEL_NB_GOULES.text="0";



	// ******************************************
	// ********* Déclaration des labels *********
	// ******************************************

	// Placement label ItemCase
	var _labelItemCaseX = contTousItems.x + _CONT_INV_CASE.x + 180;
	var _labelItemCaseY = contTousItems.y + _CONT_INV_CASE.y - 20;

	// Placement label Description Item
	var _labelDescriptionItemX = contTousItems.x + _CONT_INV_CASE.x-5;
	var _labelDescriptionItemY = contTousItems.y + _CONT_INV_CASE.y + 40;

	// Label nombre nouveaux messages
	labelNombreNouvMsg = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelNombreNouvMsg.lineHeight = _LineHeight;
	labelNombreNouvMsg.textBaseline = _TextBaseline;
	labelNombreNouvMsg.x = _labelNombreNouvMsgX;
	labelNombreNouvMsg.y = _labelNombreNouvMsgY;

	// Label nom case en cours
	labelCaseEnCours = stage.addChild(new createjs.Text("", _POLICE_TITRE_1, _COULEUR_TITRE));
	labelCaseEnCours.lineHeight = _LineHeight;
	labelCaseEnCours.textBaseline = _TextBaseline;
	labelCaseEnCours.x = 5;
	labelCaseEnCours.y = 5;

	// Label presentation objet dans la case
	labelObjetCase = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelObjetCase.lineHeight = _LineHeight;
	labelObjetCase.textBaseline = _TextBaseline;
	labelObjetCase.x = _labelItemCaseX;
	labelObjetCase.y = _labelItemCaseY;

	labelDescriptionItem = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelDescriptionItem.lineHeight = _LineHeight;
	labelDescriptionItem.textBaseline = _TextBaseline;
	labelDescriptionItem.x = _labelDescriptionItemX;
	labelDescriptionItem.y = _labelDescriptionItemY;

	labelInventaire = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelInventaire.lineHeight = _LineHeight;
	labelInventaire.textBaseline = _TextBaseline;
	labelInventaire.x = _labelItemPersoX;
	labelInventaire.y = _labelItemPersoY;

	/*labelChoixMode = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelChoixMode.lineHeight = _LineHeight;
	labelChoixMode.textBaseline = _TextBaseline;
	labelChoixMode.x = _labelChoixModeX;
	labelChoixMode.y = _labelChoixModeY;
	//labelChoixMode.text="Passer en Mode :";

	labelBtnsListes = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelBtnsListes.lineHeight = _LineHeight;
	labelBtnsListes.textBaseline = _TextBaseline;
	labelBtnsListes.x = _labelBtnsListesX;
	labelBtnsListes.y = _labelBtnsListesY;
	//labelBtnsListes.text="Afficher liste :";

	labelBtnsInvPerso = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelBtnsInvPerso.lineHeight = _LineHeight;
	labelBtnsInvPerso.textBaseline = _TextBaseline;
	labelBtnsInvPerso.x = _labelBtnsInvPersoX-5;
	labelBtnsInvPerso.y = _labelBtnsInvPersoY;
	//labelBtnsInvPerso.text="Actions sur le sac :";

	labelBtnsInvCase = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelBtnsInvCase.lineHeight = _LineHeight;
	labelBtnsInvCase.textBaseline = _TextBaseline;
	labelBtnsInvCase.x = _labelBtnsInvCaseX-8;
	labelBtnsInvCase.y = _labelBtnsInvCaseY;
	//labelBtnsInvCase.text="Actions sur la case :";*/

	labelArme = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelArme.lineHeight = _LineHeight;
	labelArme.textBaseline = _TextBaseline;
	labelArme.x = _labelArmeX;
	labelArme.y = _labelArmeY;
	//labelArme.text="Arme équipée : ";

	labelArmure = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelArmure.lineHeight = _LineHeight;
	labelArmure.textBaseline = _TextBaseline;
	labelArmure.x = _labelArmureX;
	labelArmure.y = _labelArmureY;
	//labelArmure.text="Armure équipée : ";

	//------------------- Zone 1 -----------------------------------------------------

	labelPtsVie = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelPtsVie.lineHeight = _LineHeight;
	labelPtsVie.textBaseline = _TextBaseline;
	labelPtsVie.x = _labelPtsVX;
	labelPtsVie.y = _labelPtsVY;

	labelPtsFaim = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelPtsFaim.lineHeight = _LineHeight;
	labelPtsFaim.textBaseline = _TextBaseline;
	labelPtsFaim.x = _labelPtsFX;
	labelPtsFaim.y = _labelPtsFY;

	//------------------- Zone 2 -----------------------------------------------------

	labelPtsAction = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelPtsAction.lineHeight = _LineHeight;
	labelPtsAction.textBaseline = _TextBaseline;
	labelPtsAction.x = _labelPtsAX;
	labelPtsAction.y = _labelPtsAY;

	labelPtsMove = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelPtsMove.lineHeight = _LineHeight;
	labelPtsMove.textBaseline = _TextBaseline;
	labelPtsMove.x = _labelPtsMX;
	labelPtsMove.y = _labelPtsMY;

	//---------------------------------------

	labelPtsAtq = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelPtsAtq.lineHeight = _LineHeight;
	labelPtsAtq.textBaseline = _TextBaseline;
	labelPtsAtq.x = _labelPtsAtqX;
	labelPtsAtq.y = _labelPtsAtqY;

	labelPtsDef = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelPtsDef.lineHeight = _LineHeight;
	labelPtsDef.textBaseline = _TextBaseline;
	labelPtsDef.x = _labelPtsDefX;
	labelPtsDef.y = _labelPtsDefY;

	labelBonusArme = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELSBonus));
	labelBonusArme.lineHeight = _LineHeight;
	labelBonusArme.textBaseline = _TextBaseline;
	labelBonusArme.x = _labelPtsAtqX + 170 ;
	labelBonusArme.y = _labelPtsAtqY;

	labelBonusArmure = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELSBonus));
	labelBonusArmure.lineHeight = _LineHeight;
	labelBonusArmure.textBaseline = _TextBaseline;
	labelBonusArmure.x = _labelPtsDefX + 170;
	labelBonusArmure.y = _labelPtsDefY;

	labelProbaCache = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelProbaCache.lineHeight = _LineHeight;
	labelProbaCache.textBaseline = _TextBaseline;
	labelProbaCache.x = _labelProbaCacheX;
	labelProbaCache.y = _labelProbaCacheY;

	labelProbaFouille = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelProbaFouille.lineHeight = _LineHeight;
	labelProbaFouille.textBaseline = _TextBaseline;
	labelProbaFouille.x = _labelProbaFouilleX;
	labelProbaFouille.y = _labelProbaFouilleY;

	//----------------------- Zone 14 : labels de retour-------------------------

	labelLancementServeur = stage.addChild(new createjs.Text("", _LABEL_POLICE, _COULEUR_LABELS));
	labelLancementServeur.lineHeight = _LineHeight;
	labelLancementServeur.textBaseline = _TextBaseline;
	labelLancementServeur.x =880;
	labelLancementServeur.y =600;

	// ******************************************
	// ** Création des boutons de déplacement ***
	// ******************************************
	var Up = stage.addChild(new createjs.Bitmap("public/Boutons/Up.png"));
	Up.x= _contMapX + _contMapW/2 - Up.image.width/2;
	Up.y = _contMapY;
	Up.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
	});
	Up.addEventListener('touchstart', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
	});

	var Down = stage.addChild(new createjs.Bitmap("public/Boutons/Down.png"));
	Down.x = _contMapX+ _contMapW/2 - Down.image.width/2;
	Down.y = _contMapY + _contMapH - _centrageBpMap;
	Down.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});
	Down.addEventListener('touchstart', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});

	var Left = stage.addChild(new createjs.Bitmap("public/Boutons/Left.png"));
	Left.x = _contMapX;
	Left.y = _contMapY + _contMapH/2 - Left.image.height/2;
	Left.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
	});
	Down.addEventListener('touchstart', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});

	var Right = stage.addChild(new createjs.Bitmap("public/Boutons/Right.png"));
	Right.x = _contMapX + _contMapW - _centrageBpMap;
	Right.y = _contMapY + _contMapH/2 - Right.image.height/2;
	Right.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'EST');
	});
	Down.addEventListener('touchstart', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});

	Up.cursor=Down.cursor=Left.cursor=Right.cursor="pointer";

	// ******************************************
	// ************ Boutons d'action ************
	// ******************************************

	Btn_PAGE_ITEM_PERSORight = stage.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
	Btn_PAGE_ITEM_PERSORight.x= contInvPerso.x + contInvPerso.width;
	Btn_PAGE_ITEM_PERSORight.y= contInvPerso.y + 5;
	Btn_PAGE_ITEM_PERSORight.visible=false;
	Btn_PAGE_ITEM_PERSORight.addEventListener('click', function(event) {
		_PAGE_ITEM_PERSO++;
		pressBtnEquip=false;
		socket.emit('INFO_PERSONNAGE_CS');
	});
	Btn_PAGE_ITEM_PERSORight.addEventListener('touchstart', function(event) {
		_PAGE_ITEM_PERSO++;
		pressBtnEquip=false;
		socket.emit('INFO_PERSONNAGE_CS');
	});

	Btn_PAGE_ITEM_PERSOLeft = stage.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
	Btn_PAGE_ITEM_PERSOLeft.x= contInvPerso.x - 30;
	Btn_PAGE_ITEM_PERSOLeft.y= contInvPerso.y + 5;
	Btn_PAGE_ITEM_PERSOLeft.visible=false;
	Btn_PAGE_ITEM_PERSOLeft.addEventListener('click', function(event) {
		_PAGE_ITEM_PERSO--;
		pressBtnEquip=false;
		socket.emit('INFO_PERSONNAGE_CS');
	});
	Btn_PAGE_ITEM_PERSOLeft.addEventListener('touchstart', function(event) {
		_PAGE_ITEM_PERSO--;
		pressBtnEquip=false;
		socket.emit('INFO_PERSONNAGE_CS');
	});
	

	Btn_PAGE_ITEM_CASERight = stage.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
	Btn_PAGE_ITEM_CASERight.x= _CONT_INV_CASE.x  + _CONT_INV_CASE.width;
	Btn_PAGE_ITEM_CASERight.y= _CONT_INV_CASE.y + 5;
	Btn_PAGE_ITEM_CASERight.visible=false;
	Btn_PAGE_ITEM_CASERight.addEventListener('click', function(event) {
		_PAGE_ITEM_CASE++;
		socket.emit('INFO_CASE_CS');

	});
	Btn_PAGE_ITEM_CASERight.addEventListener('touchstart', function(event) {
		_PAGE_ITEM_CASE++;
		socket.emit('INFO_CASE_CS');

	});

	Btn_PAGE_ITEM_CASELeft = stage.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
	Btn_PAGE_ITEM_CASELeft.x= _CONT_INV_CASE.x - 30;
	Btn_PAGE_ITEM_CASELeft.y= _CONT_INV_CASE.y + 5;
	Btn_PAGE_ITEM_CASELeft.visible=false;
	Btn_PAGE_ITEM_CASELeft.addEventListener('click', function(event) {
		_PAGE_ITEM_CASE--;
		socket.emit('INFO_CASE_CS');
	});
	Btn_PAGE_ITEM_CASELeft.addEventListener('touchstart', function(event) {
		_PAGE_ITEM_CASE--;
		socket.emit('INFO_CASE_CS');
	});

	Btn_PAGE_ITEM_PERSORight.cursor=Btn_PAGE_ITEM_PERSOLeft.cursor=Btn_PAGE_ITEM_CASERight.cursor=Btn_PAGE_ITEM_CASELeft.cursor="pointer";

	// ******************************************
	// *********** INITIALISATION ***************
	// ******************************************
	socket.emit('GET_DATE_CS');
	game();
}


function game() 
{
	// Couleur autour de la carte
	shape4 = new createjs.Shape();
	stage.addChild(shape4);
	shape4.graphics.setStrokeStyle(2).beginStroke("#405050").drawRect(
			_contMapX-2, _contMapY-2, _contMapW+2, _contMapH+2);
	
	//_espaceBoutonYInitialisation des informations
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
}

function message()
{
	var nbMsgAffiches=10;

	contMessage = new createjs.Container();
	contMessage.x = _contMapX;
	contMessage.y = _contMapY;
	contMessage.width = _contMapW;
	contMessage.height = _contMapH;
	stage.addChild(contMessage);
	shapeMessage = new createjs.Shape();
	stage.addChild(shapeMessage);
	shapeMessage.graphics.setStrokeStyle(4).beginStroke("#006600").drawRect(
			contMessage.x-2, contMessage.y-2, contMessage.width+2, contMessage.height+2);

	var background_message = new createjs.Bitmap("public/Background_liste.jpg");
	background_message.scaleX=0.840;
	background_message.scaleY=0.750
	contMessage.addChild(background_message);

	labelMessage = contMessage.addChild(new createjs.Text("", _POLICE_MESSAGES, _COULEUR_LABELS));
	labelMessage.lineHeight = _LineHeight;
	labelMessage.textBaseline = _TextBaseline;
	labelMessage.x = 20;
	labelMessage.y = 50;


	var BtnValideMsg = new createjs.Bitmap("public/Boutons/Ok.png");
	BtnValideMsg.x=450;
	BtnValideMsg.y=240;
	contMessage.addChild(BtnValideMsg);
	BtnValideMsg.addEventListener('click', function(event) {
		socket.emit('ACCUSE_LECTURE_MSG_CS');
		stage.removeChild(contMessage);
		game();
	});
	BtnValideMsg.addEventListener('touchstart', function(event) {
		socket.emit('ACCUSE_LECTURE_MSG_CS');
		stage.removeChild(contMessage);
		game();
	});


	BtnValideMsg.cursor="pointer";

	// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();
	var Taille = Math.ceil(_listeMessages.length / nbMsgAffiches);
	var TailleFinListe =(_listeMessages.length % nbMsgAffiches);

	for (var j=0; j<Taille; j++)
	{
		var NewListe=new Array();

		// Si derniere page
		if(j==Taille-1 && TailleFinListe!=0)
		{
			//Boucle des items liste incomplète
			for (var i=j*nbMsgAffiches; i<j*nbMsgAffiches+TailleFinListe; i++)
			{
				if(_listeMessages[i]!=undefined)
				{
					// mise de l'item dans une variable
					var msg = _listeMessages[i];

					// mise de l'item dans une variable
					NewListe.push(msg);
				}
			}
			// ajout de la nouvelle liste au tableau de listes
			TabListe.push(NewListe);  
		}
		else
		{
			for (var i=j*nbMsgAffiches; i<(j*nbMsgAffiches+nbMsgAffiches); i++)
			{
				if(_listeMessages[i]!=undefined)
				{
					// mise de l'item dans une variable
					var msg = _listeMessages[i];

					// mise de l'item dans une variable
					NewListe.push(msg);
				}
			}
			TabListe.push(NewListe);
		}
	}

	setBtnMessage(TabListe, Taille);
	afficherMessage(TabListe);

	//stage.update();
}

function afficherMessage(TabListeMessage)
{
	var longLigneMax=117; //88
	try 
	{
		// instructions à essayer
		labelMessage.text="";
		for (var i = 0; i < TabListeMessage[_PAGE_MESSAGES].length ; i++) 
		{
			for (var j=0; j<TabListeMessage[_PAGE_MESSAGES][i].length ; j+=longLigneMax)
			{
				var message=TabListeMessage[_PAGE_MESSAGES][i].substring(j,j+longLigneMax);
				if(j==longLigneMax || TabListeMessage[_PAGE_MESSAGES][i].length<longLigneMax)
				{
					labelMessage.text+=message;
				}
				else
				{
					labelMessage.text+=message;
					labelMessage.text+="-\n";
				}
			}
		}
	}
	catch(e){}
	//stage.update();
}

function afficherDescCase(desc)
{
	var longLigneMax=69;
	try 
	{
		// instructions à essayer
		labelDescriptionCase.text="";
		for (var i = 0; i < desc.length ; i+=longLigneMax) 
		{
			var message=desc.substring(i,i+longLigneMax);
			if(i==longLigneMax || desc.length<longLigneMax)
			{
				labelDescriptionCase.text+=message;
			}
			else
			{
				labelDescriptionCase.text+=message + "-\n";
			}
		}
	}
	catch(e){}
	//stage.update();
}

function afficherDescItem(desc)
{
	var longLigneMax=42	;
	try 
	{
		// instructions à essayer
		for (var i = 0; i < desc.length ; i+=longLigneMax) 
		{
			var message=desc.substring(i,i+longLigneMax);
			if(i==longLigneMax || desc.length<longLigneMax)
			{
				labelDescriptionItem.text+=message;
			}
			else
			{
				labelDescriptionItem.text+=message + "-\n";
			}
		}
	}
	catch(e){}
	//stage.update();
}

function liste()
{
	socket.emit('INFO_CASE_ALLIES_CS');
	socket.emit('INFO_CASE_ENNEMIS_CS');

	contListe = new createjs.Container();
	contListe.x = _contMapX;
	contListe.y = _contMapY;
	contListe.width = _contMapW;
	contListe.height = _contMapH;
	stage.addChild(contListe);
	shape6 = new createjs.Shape();
	stage.addChild(shape6);
	shape6.graphics.setStrokeStyle(2).beginStroke("#999900").drawRect(
			contListe.x-2, contListe.y-2, contListe.width+2, contListe.height+2);

	var background_liste = new createjs.Bitmap("public/blood.jpg");
	background_liste.alpha=1;
	background_liste.scaleX=0.840;
	background_liste.scaleY=0.750;
	contListe.addChild(background_liste);

	labelAlliesListe = contListe.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelAlliesListe.lineHeight = _LineHeight;
	labelAlliesListe.textBaseline = _TextBaseline;
	labelAlliesListe.x = 20;
	labelAlliesListe.y = 6;
	labelAlliesListe.text="Liste des Alliés :";

	//Conteneur des ALLIES
	contListeAllies = new createjs.Container();
	contListeAllies.width = 10*64;
	contListeAllies.x = contListe.width/2 - contListeAllies.width/2;
	contListeAllies.y = labelAlliesListe.y + 20;
	contListeAllies.height = 70;
	contListe.addChild(contListeAllies);
	/*shape7 = new createjs.Shape();
	contListe.addChild(shape7);
	shape7.graphics.setStrokeStyle(1).beginStroke("#ffffff").drawRect(
			contListeAllies.x+7, contListeAllies.y, contListeAllies.width-14, contListeAllies.height);*/

	labelEnnemisListe = contListe.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelEnnemisListe.lineHeight = _LineHeight;
	labelEnnemisListe.textBaseline = _TextBaseline;
	labelEnnemisListe.x = 20;
	labelEnnemisListe.y = contListeAllies.y + contListeAllies.height + 6;
	labelEnnemisListe.text="Liste des Ennemis :";

	//Conteneur des ENNEMIS
	contListeEnnemis = new createjs.Container();
	contListeEnnemis.width = 10*64;
	contListeEnnemis.x = contListe.width/2 - contListeEnnemis.width/2;
	contListeEnnemis.y = contListeAllies.y + contListeAllies.height + 20;
	contListeEnnemis.height = 70;
	contListe.addChild(contListeEnnemis);
	/*shape8 = new createjs.Shape();
	contListe.addChild(shape8);
	shape8.graphics.setStrokeStyle(1).beginStroke("#ffffff").drawRect(
			contListeEnnemis.x+7, contListeEnnemis.y, contListeEnnemis.width-14, contListeEnnemis.height);*/

	labelDescribePerso = contListe.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelDescribePerso.lineHeight = _LineHeight;
	labelDescribePerso.textBaseline = _TextBaseline;
	labelDescribePerso.x = labelAlliesListe.x;
	labelDescribePerso.y = contListeEnnemis.y + contListeEnnemis.height +30;

	// Bouton ANNULER
	BtnCancelListe = new createjs.Bitmap("public/Boutons/Retour.png");
	BtnCancelListe.x=450;
	BtnCancelListe.y=240;
	contListe.addChild(BtnCancelListe);
	BtnCancelListe.addEventListener('click', function (event) {
		_SELECTED_PERSO=-1;
		stage.removeChild(contListe);
		game();
	});
	BtnCancelListe.addEventListener('touchstart', function (event) {
		_SELECTED_PERSO=-1;
		stage.removeChild(contListe);
		game();
	});

	Btn_PAGE_PERSO_ALLIESRight = new createjs.Bitmap("public/Boutons/Right.png");
	Btn_PAGE_PERSO_ALLIESRight.x= contListeAllies.x + contListeAllies.width;
	Btn_PAGE_PERSO_ALLIESRight.y= contListeAllies.y + 8;
	Btn_PAGE_PERSO_ALLIESRight.visible=false;
	contListe.addChild(Btn_PAGE_PERSO_ALLIESRight);
	Btn_PAGE_PERSO_ALLIESRight.addEventListener('click', function(event) {
		_PAGE_PERSO_ALLIES++;
		socket.emit('INFO_CASE_ALLIES_CS');
	});
	Btn_PAGE_PERSO_ALLIESRight.addEventListener('touchstart', function(event) {
		_PAGE_PERSO_ALLIES++;
		socket.emit('INFO_CASE_ALLIES_CS');
	});

	Btn_PAGE_PERSO_ALLIESLeft = new createjs.Bitmap("public/Boutons/Left.png");
	Btn_PAGE_PERSO_ALLIESLeft.x= contListeAllies.x - Btn_PAGE_PERSO_ALLIESLeft.image.width -5;
	Btn_PAGE_PERSO_ALLIESLeft.y= contListeAllies.y + 8;
	contListe.addChild(Btn_PAGE_PERSO_ALLIESLeft);
	Btn_PAGE_PERSO_ALLIESLeft.visible=false;
	Btn_PAGE_PERSO_ALLIESLeft.addEventListener('click', function(event) {
		_PAGE_PERSO_ALLIES--;
		socket.emit('INFO_CASE_ALLIES_CS');
	});
	Btn_PAGE_PERSO_ALLIESLeft.addEventListener('touchstart', function(event) {
		_PAGE_PERSO_ALLIES--;
		socket.emit('INFO_CASE_ALLIES_CS');
	});

	Btn_PAGE_PERSO_ENNRight = new createjs.Bitmap("public/Boutons/Right.png");
	Btn_PAGE_PERSO_ENNRight.x= contListeEnnemis.x + contListeEnnemis.witdh;
	Btn_PAGE_PERSO_ENNRight.y= contListeEnnemis.y + 8;
	Btn_PAGE_PERSO_ENNRight.visible=false;
	contListe.addChild(Btn_PAGE_PERSO_ENNRight);
	Btn_PAGE_PERSO_ENNRight.addEventListener('click', function(event) {
		_PAGE_PERSO_ENNemis++;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});
	Btn_PAGE_PERSO_ENNRight.addEventListener('touchstart', function(event) {
		_PAGE_PERSO_ENNemis++;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	Btn_PAGE_PERSO_ENNLeft = new createjs.Bitmap("public/Boutons/Left.png");
	Btn_PAGE_PERSO_ENNLeft.x= contListeEnnemis.x - Btn_PAGE_PERSO_ENNLeft.image.width - 5;
	Btn_PAGE_PERSO_ENNLeft.y= contListeEnnemis.y +  8;
	Btn_PAGE_PERSO_ENNLeft.visible=false;
	contListe.addChild(Btn_PAGE_PERSO_ENNLeft);
	Btn_PAGE_PERSO_ENNLeft.addEventListener('click', function(event) {
		_PAGE_PERSO_ENNemis--;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});
	Btn_PAGE_PERSO_ENNLeft.addEventListener('touchstart', function(event) {
		_PAGE_PERSO_ENNemis--;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	setBtnAttaquer(BtnCancelListe.x, BtnCancelListe.y);

	BtnCancelListe.cursor="pointer";
	Btn_PAGE_PERSO_ALLIESRight.cursor=Btn_PAGE_PERSO_ALLIESLeft.cursor=Btn_PAGE_PERSO_ENNRight.cursor=Btn_PAGE_PERSO_ENNLeft.cursor="pointer";

	//stage.update();
}

function attaqueNuit()
{
	stage.removeAllChildren();
	
	contNuit 		= new createjs.Container();
	contNuit.x 		= 0;
	contNuit.y 		= 0;
	contNuit.height = canvas.height;
	contNuit.width 	= canvas.width;
	stage.addChild(contNuit);

	shapeNuit = new createjs.Shape();
	stage.addChild(shapeNuit);
	shapeNuit.graphics.setStrokeStyle(10).beginStroke("#009900").drawRect(
			contNuit.x, contNuit.y, contNuit.width, contNuit.height);
	
	// Application du background qui va recouvrir le canvas
	var background_nuit = new createjs.Bitmap("public/Background_Nuit.png");
	contNuit.addChild(background_nuit);
	
	var BtnVivant = new createjs.Bitmap("public/Boutons/Vivant.png");
	BtnVivant.x=40;
	BtnVivant.y=560;
	contNuit.addChild(BtnVivant);
	BtnVivant.addEventListener('click', function (event) {
		stage.removeChild(contNuit);
		_ECRAN_ATTAQUE_NUIT = false;
		setPlateau();
	});
	BtnVivant.addEventListener('touchstart', function (event) {
		stage.removeChild(contNuit);
		setPlateau();
	});
	
	BtnVivant.cursor="pointer";
}

function dead(currentPerso) 
{
	_ECRAN_MORT = true;
	stage.removeAllChildren();

	contDead = new createjs.Container();
	contDead.x = 0;
	contDead.y = 0;
	contDead.height = canvas.height;
	contDead.width = canvas.width;
	stage.addChild(contDead);
	shapeDead = new createjs.Shape();
	stage.addChild(shapeDead);
	shapeDead.graphics.setStrokeStyle(10).beginStroke("#990000").drawRect(
			contDead.x, contDead.y, contDead.width, contDead.height);

	// Application du background qui va recouvrir le canvas
	var background_dead = new createjs.Bitmap("public/Background_Dead.png");
	contDead.addChild(background_dead);

	var causeDeLaMort;

	contItemPersoDead  = new createjs.Container();
	contItemPersoDead.x = 390;
	contItemPersoDead.y = 580;
	contItemPersoDead.height = 40;
	contItemPersoDead.width = 330;
	contDead.addChild(contItemPersoDead);
	shapeInvDead = new createjs.Shape();
	contDead.addChild(shapeInvDead);

	if(currentPerso.sacADos.length>0)
	{
		shapeInvDead.graphics.setStrokeStyle(1).beginStroke("#FFFFFF").drawRect(
				contItemPersoDead.x-4, contItemPersoDead.y-4, contItemPersoDead.width+4, contItemPersoDead.height+4);
	}

	Btn_PAGE_ITEM_PERSO_DEADRight= new createjs.Bitmap("public/Boutons/Right.png");
	Btn_PAGE_ITEM_PERSO_DEADRight.x= contItemPersoDead.x + contItemPersoDead.width;
	Btn_PAGE_ITEM_PERSO_DEADRight.y= contItemPersoDead.y-3;
	contDead.addChild(Btn_PAGE_ITEM_PERSO_DEADRight);
	Btn_PAGE_ITEM_PERSO_DEADRight.addEventListener('click', function(event) {
		_PAGE_ITEM_PERSO_DEAD++;
	});
	Btn_PAGE_ITEM_PERSO_DEADRight.addEventListener('touchstart', function(event) {
		_PAGE_ITEM_PERSO_DEAD++;
	});

	Btn_PAGE_ITEM_PERSO_DEADLeft = new createjs.Bitmap("public/Boutons/Left.png");
	Btn_PAGE_ITEM_PERSO_DEADLeft .x= contItemPersoDead.x - Btn_PAGE_ITEM_PERSO_DEADLeft.image.width -5;
	Btn_PAGE_ITEM_PERSO_DEADLeft .y= contItemPersoDead.y-3;
	contDead.addChild(Btn_PAGE_ITEM_PERSO_DEADLeft );
	Btn_PAGE_ITEM_PERSO_DEADLeft.addEventListener('click', function(event) {
		_PAGE_ITEM_PERSO_DEAD--;
	});
	Btn_PAGE_ITEM_PERSO_DEADLeft.addEventListener('touchstart', function(event) {
		_PAGE_ITEM_PERSO_DEAD--;
	});

	var labelDeadByWho = contDead.addChild(new createjs.Text("", _POLICE_MORT, _COULEUR_LABELS_MORT));
	labelDeadByWho.x=20;
	labelDeadByWho.y=20;
	
	var labelDeadHour = contDead.addChild(new createjs.Text("", _POLICE_MORT, _COULEUR_LABELS_HEURE_MORT));
	labelDeadHour.x = 450 ;
	labelDeadHour.y = 175;
	labelDeadHour.text="";
	
	var labelItemsRestants = contDead.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelItemsRestants.x=60;
	labelItemsRestants.y=contItemPersoDead.y+5;
	
	var date = _listeMessages[0].split(" :");
	//labelDeadHour.text=date[1];	
	if (date[0]!=null && date[0] == "Z")
	{
		causeDeLaMort="Un zombie rôdant dans la salle vous a dévoré !";
	}
	else if(date[0]!=null && date[0] == "N")
	{
		causeDeLaMort="Un zombie vous a dévoré durant l'attaque de nuit !";
	}
	else if(date[0]!=null && date[0] == "F")
	{
		causeDeLaMort="Vous êtes mort de faim !";
	}
	else if(date[0]!=null && date[0]!="Z" && date[0]!="N" && date[0]!="F")
	{
		causeDeLaMort=(date[0]+" vous a mis K-O !");
	}
	else
	{
		causeDeLaMort="";
	}
	
	labelDeadByWho.text=causeDeLaMort;

	//labelDeadByWho.lineHeight = _LineHeight;
	//labelDeadByWho.textBaseline = _TextBaseline;

	// Bouton ANNULER
	var BtnCancelDead = new createjs.Bitmap("public/Boutons/Revivre.png");
	BtnCancelDead.x=940;
	BtnCancelDead.y=560;
	contDead.addChild(BtnCancelDead);
	BtnCancelDead.addEventListener('click', function (event) {
		socket.emit('ACCUSE_LECTURE_MSG_CS');
		stage.removeChild(contDead);
		_ECRAN_MORT = false;

		// on remet les last à -1 pour pas qu'il affiche un msg au chgt de case
		_LAST_NOMBRE_ALLIES  = -1;
		_LAST_NOMBRE_ENNEMIS = -1;
		_LAST_NOMBRE_ZOMBIES = -1;

		setPlateau();
	});
	BtnCancelDead.addEventListener('touchstart', function (event) {
		socket.emit('ACCUSE_LECTURE_MSG_CS');
		stage.removeChild(contDead);
		_ECRAN_MORT = false;

		// on remet les last à -1 pour pas qu'il affiche un msg au chgt de case
		_LAST_NOMBRE_ALLIES  = -1;
		_LAST_NOMBRE_ENNEMIS = -1;
		_LAST_NOMBRE_ZOMBIES = -1;

		setPlateau();
	});


	BtnCancelDead.cursor="pointer";
	
	var Taille=Math.ceil(currentPerso.sacADos.length / 10);
	
	if(_PAGE_ITEM_PERSO_DEAD>Taille-1)
	{
		_PAGE_ITEM_PERSO_DEAD=Taille-1;
	}
	else if (_PAGE_ITEM_PERSO_DEAD<0)
	{
		_PAGE_ITEM_PERSO_DEAD=0;
	}

	if(_PAGE_ITEM_PERSO_DEAD==Taille-1)
	{
		Btn_PAGE_ITEM_PERSO_DEADRight.visible=false;
	}
	else
	{
		Btn_PAGE_ITEM_PERSO_DEADRight.visible=true;
	}

	if(_PAGE_ITEM_PERSO_DEAD==0)
	{
		Btn_PAGE_ITEM_PERSO_DEADLeft.visible=false;
	}
	else
	{
		Btn_PAGE_ITEM_PERSO_DEADLeft.visible=true;
	}

	if(Taille ==0)
	{
		Btn_PAGE_ITEM_PERSO_DEADLeft.visible=false;
		Btn_PAGE_ITEM_PERSO_DEADRight.visible=false;
	}
	
	if(currentPerso.sacADos[0]!=null)
	{
		labelItemsRestants.text="Items restants dans le sac :";
		// tableau qui contient toutes les listes d'objets
		var TabListe=new Array();
		var TailleFinListe =(currentPerso.sacADos.length % 10);

		var iPositionItemInConteneur=0;

		for (var j=0; j<Taille; j++)
		{
			var NewListe=new Array();

			if(j==Taille-1 && TailleFinListe!=0)
			{
				//Boucle des items liste incomplète
				for (var i=j*10; i<j*10+TailleFinListe; i++)
				{
					// mise de l'item dans une variable
					var item = currentPerso.sacADos[i];

					// ajout de l'item à la nouvelle liste
					NewListe.push(item);
				}
				// ajout de la nouvelle liste au tableau de listes
				TabListe.push(NewListe);  
			}
			else
			{
				//Boucle normale : creation nouvelle liste de 10 items max
				for (var i=j*10; i<(j*10+10); i++)
				{

					// mise de l'item dans une variable
					var item = currentPerso.sacADos[i];

					// mise de l'item dans une variable
					NewListe.push(item);
				}
				TabListe.push(NewListe);
			}
		}

		try 
		{
			// instructions à essayer
			for (var i = 0; i < TabListe[_PAGE_ITEM_PERSO_DEAD].length ; i++) 
			{
				var Obj=TabListe[_PAGE_ITEM_PERSO_DEAD][i];

				// Ajout de l'image à l'ihm
				var imgItem = new createjs.Bitmap(Obj.imageName);

				imgItem.x = (iPositionItemInConteneur * _spaceItem);
				imgItem.y = 4;
				contItemPersoDead.addChild(imgItem);

				// position de l'item dans le conteneur
				iPositionItemInConteneur++;
			}
			//stage.update();
		}
		catch(e){
			//alert("Page inexistante");
		}
	}
	else
	{
		labelItemsRestants.text="Votre sac est vide !";
	}
}

function setBtnMessage(TabListeMessage, Taille)
{
	Btn_PAGE_MESSAGESDown = new createjs.Bitmap("public/Boutons/Down.png");
	Btn_PAGE_MESSAGESDown.x= 746/2 - Btn_PAGE_MESSAGESDown.image.width/2;
	Btn_PAGE_MESSAGESDown.y= 365;
	contMessage.addChild(Btn_PAGE_MESSAGESDown);
	Btn_PAGE_MESSAGESDown.addEventListener('click', function(event) {
		_PAGE_MESSAGES++;
		setbtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});
	Btn_PAGE_MESSAGESDown.addEventListener('touchstart', function(event) {
		_PAGE_MESSAGES++;
		setbtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});

	Btn_PAGE_MESSAGESUp = new createjs.Bitmap("public/Boutons/Up.png");
	Btn_PAGE_MESSAGESUp.x=746/2 - Btn_PAGE_MESSAGESUp.image.width/2;
	Btn_PAGE_MESSAGESUp.y= 5;
	contMessage.addChild(Btn_PAGE_MESSAGESUp);
	Btn_PAGE_MESSAGESUp.addEventListener('click', function(event) {
		_PAGE_MESSAGES--;
		setbtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});
	Btn_PAGE_MESSAGESUp.addEventListener('touchstart', function(event) {
		_PAGE_MESSAGES--;
		setbtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});

	if(_PAGE_MESSAGES==Taille-1)
	{
		Btn_PAGE_MESSAGESDown.visible=false;
	}
	else
	{
		Btn_PAGE_MESSAGESDown.visible=true;
	}

	if(_PAGE_MESSAGES==0)
	{
		Btn_PAGE_MESSAGESUp.visible=false;
	}
	else
	{
		Btn_PAGE_MESSAGESUp.visible=true;
	}

	if(Taille ==0)
	{
		Btn_PAGE_MESSAGESUp.visible=false;
		Btn_PAGE_MESSAGESDown.visible=false;
	}

	Btn_PAGE_MESSAGESUp.cursor=Btn_PAGE_MESSAGESDown.cursor="pointer";
}

function setbtnMessageVisible(Taille)
{
	if(_PAGE_MESSAGES>Taille-1)
	{
		_PAGE_MESSAGES=Taille-1;
	}
	else if (_PAGE_MESSAGES<0)
	{
		_PAGE_MESSAGES=0;
	}

	if(_PAGE_MESSAGES==Taille-1)
	{
		Btn_PAGE_MESSAGESDown.visible=false;
	}
	else
	{
		Btn_PAGE_MESSAGESDown.visible=true;
	}

	if(_PAGE_MESSAGES==0)
	{
		Btn_PAGE_MESSAGESUp.visible=false;
	}
	else
	{
		Btn_PAGE_MESSAGESUp.visible=true;
	}

	if(Taille ==0)
	{
		Btn_PAGE_MESSAGESUp.visible=false;
		Btn_PAGE_MESSAGESDown.visible=false;
	}
}

function setBtnAttaquer(x,y)
{
	if (_SELECTED_PERSO != -1)
	{
		// Bouton ATTAQUER
		var BtnAttaquerListe = new createjs.Bitmap("public/Boutons/Attaquer.png");
		BtnAttaquerListe.x=x-150;
		BtnAttaquerListe.y=y;
		contListe.addChild(BtnAttaquerListe);
		BtnAttaquerListe.addEventListener('click', function(event) {
			if (_SELECTED_PERSO == -1) {
				//alert("Selectionner Ennemi avant d'attaquer !");
			}
			else
			{
				socket.emit('ACTION_ATTAQUE_CS', _SELECTED_PERSO);
				_SELECTED_PERSO = -1;
				liste();
			}
		});
		BtnAttaquerListe.addEventListener('touchstart', function(event) {
			if (_SELECTED_PERSO == -1) {
				//alert("Selectionner Ennemi avant d'attaquer !");
			}
			else
			{
				socket.emit('ACTION_ATTAQUE_CS', _SELECTED_PERSO);
				_SELECTED_PERSO = -1;
				liste();
			}
		});
		BtnAttaquerListe.cursor="pointer";
	}
	else
	{
		// Bouton ATTAQUER
		var BtnAttaquerListe = new createjs.Bitmap("public/Boutons/AttaquerGris.png");
		BtnAttaquerListe.x=x-150;
		BtnAttaquerListe.y=y;
		contListe.addChild(BtnAttaquerListe);
		BtnAttaquerListe.cursor="not-allowed";
	}
}

function setContPerso()
{
	if(_SELECTED_ITEM_PERSO!=-1 && _SELECTED_ITEM_PERSOType>= 4 && _SELECTED_ITEM_PERSOType <=7)
	{
		var BtnUtiliser = new createjs.Bitmap("public/Boutons/Consommer.png");
		BtnUtiliser.y=0;
		contBtnsInvPerso.addChild(BtnUtiliser);
		BtnUtiliser.addEventListener('click', function(event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de l'utiliser");
			} else {
				socket.emit('PERSONNAGE_USE_CS', _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});	
		BtnUtiliser.addEventListener('touchstart', function(event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de l'utiliser");
			} else {
				socket.emit('PERSONNAGE_USE_CS', _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});	

		BtnUtiliser.cursor ="pointer";

		var BtnEquiper = new createjs.Bitmap("public/Boutons/EquiperGris.png");
		BtnEquiper.y=_espaceBoutonY;
		contBtnsInvPerso.addChild(BtnEquiper);

		BtnEquiper.cursor ="not-allowed";

		var BtnDeposer = new createjs.Bitmap("public/Boutons/Deposer.png");
		BtnDeposer.y =0;
		contBtnsInvCase.addChild(BtnDeposer);
		BtnDeposer.addEventListener('click', function (event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnDeposer.addEventListener('touchstart', function (event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnDeposer.cursor ="pointer";
	}
	else if(_SELECTED_ITEM_PERSO!=-1 && (_SELECTED_ITEM_PERSOType==1 || _SELECTED_ITEM_PERSOType==2))
	{
		var BtnEquiper = new createjs.Bitmap("public/Boutons/Equiper.png");
		BtnEquiper.y=_espaceBoutonY;
		contBtnsInvPerso.addChild(BtnEquiper);
		BtnEquiper.addEventListener('click', function (event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de s'équiper");
			} else {
				socket.emit('INV_PERSONNAGE_CS', "EQUIPER", _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnEquiper.addEventListener('touchstart', function (event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de s'équiper");
			} else {
				socket.emit('INV_PERSONNAGE_CS', "EQUIPER", _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});

		BtnEquiper.cursor ="pointer";

		var BtnUtiliser = new createjs.Bitmap("public/Boutons/ConsommerGris.png");
		BtnUtiliser.y=0;
		contBtnsInvPerso.addChild(BtnUtiliser);

		BtnUtiliser.cursor ="not-allowed";		

		var BtnDeposer = new createjs.Bitmap("public/Boutons/Deposer.png");
		BtnDeposer.y =0;
		contBtnsInvCase.addChild(BtnDeposer);
		BtnDeposer.addEventListener('click', function (event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnDeposer.addEventListener('touchstart', function (event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnDeposer.cursor ="pointer";
	}
	else if(_SELECTED_ITEM_PERSO!=-1)
	{
		var BtnEquiper = new createjs.Bitmap("public/Boutons/EquiperGris.png");
		BtnEquiper.y=_espaceBoutonY;
		contBtnsInvPerso.addChild(BtnEquiper);

		BtnEquiper.cursor ="not-allowed";

		var BtnUtiliser = new createjs.Bitmap("public/Boutons/ConsommerGris.png");
		BtnUtiliser.y=0;
		contBtnsInvPerso.addChild(BtnUtiliser);

		BtnUtiliser.cursor ="not-allowed";		

		var BtnDeposer = new createjs.Bitmap("public/Boutons/Deposer.png");
		BtnDeposer.y =0;
		contBtnsInvCase.addChild(BtnDeposer);
		BtnDeposer.addEventListener('click', function (event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnDeposer.addEventListener('touchstart', function (event) {
			if (_SELECTED_ITEM_PERSO == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _SELECTED_ITEM_PERSO);
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnDeposer.cursor ="pointer";
	}
	else
	{
		var BtnUtiliser = new createjs.Bitmap("public/Boutons/ConsommerGris.png");
		BtnUtiliser.y=0;
		contBtnsInvPerso.addChild(BtnUtiliser);

		var BtnEquiper = new createjs.Bitmap("public/Boutons/EquiperGris.png");
		BtnEquiper.y=_espaceBoutonY;
		contBtnsInvPerso.addChild(BtnEquiper);

		var BtnDeposer = new createjs.Bitmap("public/Boutons/DeposerGris.png");
		BtnDeposer.y = 0;
		contBtnsInvCase.addChild(BtnDeposer);

		BtnUtiliser.cursor = BtnEquiper.cursor = BtnDeposer.cursor ="not-allowed";
	}
}

function setContEquipement()
{
	if(_SELECTED_ITEM_EQUIP!=-1)
	{
		var BtnDesequiper = new createjs.Bitmap("public/Boutons/Desequiper.png");
		BtnDesequiper.y=2*_espaceBoutonY;
		contBtnsInvPerso.addChild(BtnDesequiper);
		BtnDesequiper.addEventListener('click', function (event) {
			if (_SELECTED_ITEM_EQUIP == -1) {
				//alert("Selectionner Item avant de se déséquiper");
			}
			else{
				socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", _SELECTED_ITEM_EQUIP);
				_SELECTED_ITEM_EQUIP = -1;
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnDesequiper.addEventListener('touchstart', function (event) {
			if (_SELECTED_ITEM_EQUIP == -1) {
				//alert("Selectionner Item avant de se déséquiper");
			}
			else{
				socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", _SELECTED_ITEM_EQUIP);
				_SELECTED_ITEM_EQUIP = -1;
				_SELECTED_ITEM_PERSO = -1;
			}
		});
		BtnDesequiper.cursor="pointer";
	}
	else
	{
		var BtnDesequiper = new createjs.Bitmap("public/Boutons/DesequiperGris.png");
		BtnDesequiper.y=2*_espaceBoutonY;
		contBtnsInvPerso.addChild(BtnDesequiper);

		BtnDesequiper.cursor="not-allowed";
	}
}

function majBtnsItemCase()
{
	if(_SELECTED_ITEM_CASE!=-1)
	{
		var BtnRamasseObjet = new createjs.Bitmap("public/Boutons/Ramasser.png");
		BtnRamasseObjet.y=_espaceBoutonY;
		contBtnsInvCase.addChild(BtnRamasseObjet);
		BtnRamasseObjet.addEventListener('click', function (event) 
		{
			if (_SELECTED_ITEM_CASE == -1) 
			{
				//alert("Selectionner Item avant de Ramasser");
			} else 
			{
				socket.emit('INV_CASE_CS', "RAMASSER", _SELECTED_ITEM_CASE);
				_SELECTED_ITEM_CASE = -1;
			}
		});
		BtnRamasseObjet.addEventListener('touchstart', function (event) 
		{
			if (_SELECTED_ITEM_CASE == -1) 
			{
				//alert("Selectionner Item avant de Ramasser");
			} else 
			{
				socket.emit('INV_CASE_CS', "RAMASSER", _SELECTED_ITEM_CASE);
				_SELECTED_ITEM_CASE = -1;
			}
		});
		BtnRamasseObjet.cursor="pointer";
	}
	else
	{
		var BtnRamasseObjet = new createjs.Bitmap("public/Boutons/RamasserGris.png");
		BtnRamasseObjet.y=_espaceBoutonY;
		contBtnsInvCase.addChild(BtnRamasseObjet);

		BtnRamasseObjet.cursor="not-allowed";
	}

	//stage.update();
}

function setBtnJoueurs(nbJoueurs)
{
	if(nbJoueurs>0)
	{
		var BtnJoueurs = new createjs.Bitmap("public/Boutons/Joueurs.png");
		BtnJoueurs.y=0;
		contBtnsListes.addChild(BtnJoueurs);
		BtnJoueurs.addEventListener('click', function(event) 
		{
			liste();
		});	
		BtnJoueurs.addEventListener('touchstart', function(event) 
		{
			liste();
		});	
		BtnJoueurs.cursor="pointer";
	}
	else
	{
		var BtnJoueurs = new createjs.Bitmap("public/Boutons/JoueursGris.png");
		BtnJoueurs.y=0;
		contBtnsListes.addChild(BtnJoueurs);

		BtnJoueurs.cursor="not-allowed";
	}
}

function setBtnGoules(nbrGoules)
{
	if(nbrGoules>0)
	{
		var BtnAtqGoules = new createjs.Bitmap("public/Boutons/Zombie.png");
		BtnAtqGoules.y = _espaceBoutonY;
		contBtnsInvCaseBis.addChild(BtnAtqGoules);
		BtnAtqGoules.addEventListener('click', function(event) {
			socket.emit('ACTION_ATTAQUE_GOULE_CS');
		});
		BtnAtqGoules.addEventListener('touchstart', function(event) {
			socket.emit('ACTION_ATTAQUE_GOULE_CS');
		});
		BtnAtqGoules.cursor="pointer";
	}
	else
	{
		var BtnAtqGoules = new createjs.Bitmap("public/Boutons/ZombieGris.png");
		BtnAtqGoules.y = _espaceBoutonY;
		contBtnsInvCaseBis.addChild(BtnAtqGoules);
		BtnAtqGoules.cursor="not-allowed";
	}
}

function majBtnFouilleRapide(currentPerso)
{
	if(currentPerso.ptAction >=3)
	{
		var BtnFouilleRapide = new createjs.Bitmap("public/Boutons/FouilleR.png");
		BtnFouilleRapide.y = 0;
		contBtnsInvCaseBis.addChild(BtnFouilleRapide);
		// event click souris
		BtnFouilleRapide.addEventListener('click', function(event) 
		{
			socket.emit('ACTION_FOUILLE_RAPIDE_CS');
		});	
		// event touch (tactil)
		BtnFouilleRapide.addEventListener('touchstart', function(event) 
		{
			socket.emit('ACTION_FOUILLE_RAPIDE_CS');
		});	

		BtnFouilleRapide.cursor="pointer";
	}
	else
	{
		var BtnFouilleRapide = new createjs.Bitmap("public/Boutons/FouilleRGris.png");
		BtnFouilleRapide.y = 0;
		contBtnsInvCaseBis.addChild(BtnFouilleRapide);

		BtnFouilleRapide.cursor="pointer";
	}
}

function setImg(img, X, Y) 
{
	stage.addChild(img);	
	img.x = X;
	img.y = Y;
	////stage.update();
}

function setColorMsgRetour()
{
	/*
	//----- Changer la couleur du message de retour
	_boolColorAction=!_boolColorAction;
	if(_boolColorAction)
	{
		_colorLabelAction="#FF0";
	}
	else
	{
		_colorLabelAction="#FFF";
	}

	// Conteneur labels Move
	contZoneMessage.removeChild(labelAction);
	labelAction = contZoneMessage.addChild(new createjs.Text("", _POLICE_LABEL, _colorLabelAction));
	labelAction.lineHeight = _LineHeight;
	labelAction.textBaseline = _TextBaseline;
	labelAction.x = 0;
	labelAction.y = 0;
	//-------Fin changer couleur message de retour
	*/
}

// crée un contour arrondi autour des barres 
function setContourBarre(x, y)
{
	// plus propore (cache angles des barres)
	x -= 1;

	var ctx = canvas.getContext('2d');
    radius = 5;
  
	ctx.beginPath();
  
	ctx.lineWidth = 2;
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + _BARRES_WIDTH+2 - radius, y);
	ctx.quadraticCurveTo(x + _BARRES_WIDTH+2, y, x + _BARRES_WIDTH+2, y + radius);
	ctx.lineTo(x + _BARRES_WIDTH+2, y + _BARRES_HEIGHT - radius);
	ctx.quadraticCurveTo(x + _BARRES_WIDTH+2, y + _BARRES_HEIGHT, x + _BARRES_WIDTH+2 - radius, y + _BARRES_HEIGHT);
	ctx.lineTo(x + radius, y + _BARRES_HEIGHT);
	ctx.quadraticCurveTo(x, y + _BARRES_HEIGHT, x, y + _BARRES_HEIGHT - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	ctx.strokeStyle = 'gray';
	ctx.stroke();
}

/*
 *
 * MISES A JOUR DE L'INTERFACE
 *
 */
function majPositionPerso(currentPerso)
{
}

function majInventairePerso(currentPerso)
{
	// ********* AFFICHAGE POINTS ATT ET DEF DU PERSO *********/
	// pt att
	//if(currentPerso.armeEquipee != null)	PointsAttaque = currentPerso.multiPtsAttaque * currentPerso.armeEquipee.valeur ;
	//else									PointsAttaque = currentPerso.multiPtsAttaque ;
	// pt def
	//if(currentPerso.armureEquipee != null)	PointsDefense = currentPerso.multiPtsDefense * currentPerso.armureEquipee.valeur ;
	//else									PointsDefense = currentPerso.multiPtsDefense;
	// Mise à jour des labels
	//labelPtsAtq.text=("Points d'attaque :  " + PointsAttaque + "");
	//labelPtsDef.text=("Points de défense : " + PointsDefense + "");	
	
	
	// ********* AFFICHAGE DE LA LISTE DES OBJETS *********/
	var PoidsSac=0;
	var armeDejaEquip=false;
	var armureDejaEquip=false;
	
	// tableau qui contient toutes les listes d'objets
	var TabListe = new Array();

	//// REINITIALISATION DES CONTENEURS
	contInvPerso.removeAllChildren();
	contArmure.removeAllChildren();
	contArme.removeAllChildren();
	
	//// SUPPRESSION DE L'ARME EQUIPEE ET L'ARMURE EQUIPEE DE LA LISTE DES OBJETS
	var indexArmeEquip = -1;
	var indexArmureEquip = -1;
	
	// tri des items du sac a dos
	currentPerso.sacADos.sort(function(item1,item2){return item1.id-item2.id;});
	
	// parcours de la liste des items
	for (var i = 0; i < currentPerso.sacADos.length ; i++) 
	{
		if (currentPerso.armeEquipee != null && currentPerso.sacADos[i].id == currentPerso.armeEquipee.id)
		{
			indexArmeEquip = i;
			// Calcul du poinds du sac
			PoidsSac += currentPerso.sacADos[i].poids;
		}
		else if (currentPerso.armureEquipee != null && currentPerso.sacADos[i].id == currentPerso.armureEquipee.id)
		{
			indexArmureEquip = i;
			// Calcul du poinds du sac
			PoidsSac += currentPerso.sacADos[i].poids;
		}
	}
	
	// suppresion des items
	if (indexArmeEquip != -1) 	currentPerso.sacADos.splice(indexArmeEquip,1);
	if (indexArmureEquip != -1)
		{
			if (indexArmeEquip == -1 || indexArmureEquip < indexArmeEquip)
				currentPerso.sacADos.splice(indexArmureEquip,1);
			else
				currentPerso.sacADos.splice(indexArmureEquip-1,1);
		}

	
	//// AFFICHAGE DE L'ARME ET ENLEVAGE DE LA LISTE
	if (currentPerso.armeEquipee != null)
	{
		var imgItemArme = new createjs.Bitmap(currentPerso.armeEquipee.imageName);
		imgItemArme.cursor = "pointer";

		// Dessin de l'arme équipée
		contArme.addChild(imgItemArme);

		// évenement click
		contArme.addEventListener("click", function (event) 
		{
			var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
					afficherSelecteurItem(event.target.x, 0);
					_SELECTED_ITEM_CASE=currentItem.id;
			/*if (SelectEquipement!=null)
			{
				contArme.removeChild(SelectEquipement);
				contArmure.removeChild(SelectEquipement);
			}
			SelectEquipement 	= contArme.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
			SelectEquipement.x	=-5;
			SelectEquipement.y	=-4;
			_SELECTED_ITEM_EQUIP 	= currentPerso.armeEquipee.id;*/
			setContEquipement();
		});
		contArme.addEventListener("touchstart", function (event) 
		{
			var descriptionItem		=currentPerso.armeEquipee.description;
			labelDescriptionItem.text	=(currentPerso.armeEquipee.nom + " (+" + currentPerso.armeEquipee.valeur + ") " + "Poids : " + currentPerso.armeEquipee.poids + "\n");
			afficherDescItem(descriptionItem);
			
			if (SelectEquipement!=null)
			{
				contArme.removeChild(SelectEquipement);
				contArmure.removeChild(SelectEquipement);
			}
			SelectEquipement 	= contArme.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
			SelectEquipement.x	=-5;
			SelectEquipement.y	=-4;
			_SELECTED_ITEM_EQUIP 	= currentPerso.armeEquipee.id;
			setContEquipement();
			
		});

		// évenement quand la souris passe dessus
		contArme.addEventListener('mouseover', function(event) 
		{
			var descriptionItem		=currentPerso.armeEquipee.description;
			labelDescriptionItem.text	=(currentPerso.armeEquipee.nom + " (+" + currentPerso.armeEquipee.valeur + ") " + "Poids : " + currentPerso.armeEquipee.poids + "\n");
			afficherDescItem(descriptionItem);
			//stage.update();
		},false);

		// évenement quand la souris s'en va
		contArme.addEventListener('mouseout', function(event)
		{
			labelDescriptionItem.text="";
			//stage.update();
		},false);
		
		// évenement quand la souris s'en va
		contArme.addEventListener('touchend', function(event)
		{
			labelDescriptionItem.text="";
			//stage.update();
		},false);
		
		// retrait de l'arme de la liste des objets
	}
	
	//// AFFICHAGE DE L'ARMURE
	if (currentPerso.armureEquipee != null)
	{
		var imgItemArmure = new createjs.Bitmap(currentPerso.armureEquipee.imageName);
		imgItemArmure.cursor = "pointer";

		// Dessin de l'armure équipée
		contArmure.addChild(imgItemArmure);

		// Ajout des évenements
		contArmure.addEventListener("click", function (event) 
			{
				var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
					afficherSelecteurItem(event.target.x, 0);
					_SELECTED_ITEM_CASE=currentItem.id;
			/*if (SelectEquipement!=null)
			{
				contArme.removeChild(SelectEquipement);
				contArmure.removeChild(SelectEquipement);
			}
			SelectEquipement = contArmure.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
			SelectEquipement.x=-5;
			SelectEquipement.y=-4;
			_SELECTED_ITEM_EQUIP = currentPerso.armureEquipee.id;*/
			setContEquipement();
		});
		contArmure.addEventListener("touchstart", function (event) 
				{
			
			var descriptionItem=currentPerso.armureEquipee.description;
			labelDescriptionItem.text=(currentPerso.armureEquipee.nom + " (+" + currentPerso.armureEquipee.valeur + ") " + "Poids : " + currentPerso.armureEquipee.poids + "\n");
			afficherDescItem(descriptionItem);
			
				if (SelectEquipement!=null)
				{
					contArme.removeChild(SelectEquipement);
					contArmure.removeChild(SelectEquipement);
				}
				SelectEquipement = contArmure.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
				SelectEquipement.x=-5;
				SelectEquipement.y=-4;
				_SELECTED_ITEM_EQUIP = currentPerso.armureEquipee.id;
				setContEquipement();
				
				//stage.update();
			});

		contArmure.addEventListener('mouseover', function(event) 
			{
			var descriptionItem=currentPerso.armureEquipee.description;
			labelDescriptionItem.text=(currentPerso.armureEquipee.nom + " (+" + currentPerso.armureEquipee.valeur + ") " + "Poids : " + currentPerso.armureEquipee.poids + "\n");
			afficherDescItem(descriptionItem);
			//stage.update();
		},false);

		contArmure.addEventListener('mouseout', function(event)
			{
			labelDescriptionItem.text="";
			//stage.update();
		},false);
		
		contArmure.addEventListener('touchend', function(event)
				{
				labelDescriptionItem.text="";
				//stage.update();
			},false);
		
		// retrait de l'arme de la liste des objets
		
	}
	
	var Taille 						= Math.ceil(currentPerso.sacADos.length / 10);
	var TailleFinListe 				= (currentPerso.sacADos.length % 10);
	var iPositionItemInConteneur	= 0;
	
	for (var j=0; j<Taille; j++)
	{
		var NewListe=new Array();

		if(j==Taille-1 && TailleFinListe!=0)
		{
			//Boucle des items liste incomplète
			for (var i=j*10; i<j*10+TailleFinListe; i++)
			{
					// mise de l'item dans une variable
					var item = currentPerso.sacADos[i];
					
					// Calcul du poids du sac
					//PoidsSac+=item.poids;
					
					// ajout de l'item à la nouvelle liste
					NewListe.push(item);
			}
			
			// ajout de la nouvelle liste au tableau de listes
			TabListe.push(NewListe);  
		}
		else
		{
			//Boucle normale : creation nouvelle liste de 10 items max
			for (var i=j*10; i<(j*10+10); i++)
			{
				// mise de l'item dans une variable
				var item = currentPerso.sacADos[i];
				// Calcul du poids du sac
				//PoidsSac+=item.poids;
				// mise de l'item dans une variable
				NewListe.push(item);
			}
			TabListe.push(NewListe);
		}
	}

	if(_PAGE_ITEM_PERSO>Taille-1)	_PAGE_ITEM_PERSO = Taille-1;
	else if (_PAGE_ITEM_PERSO<0)	_PAGE_ITEM_PERSO = 0;

	if(_PAGE_ITEM_PERSO==Taille-1)	Btn_PAGE_ITEM_PERSORight.visible = false;
	else						Btn_PAGE_ITEM_PERSORight.visible = true;

	if(_PAGE_ITEM_PERSO==0)		Btn_PAGE_ITEM_PERSOLeft.visible = false;
	else						Btn_PAGE_ITEM_PERSOLeft.visible = true;

	if(Taille ==0)
	{
		Btn_PAGE_ITEM_PERSOLeft.visible=false;
		Btn_PAGE_ITEM_PERSORight.visible=false;
	}

	// Appel de fonction pour créer les boutons liés au Perso
	setContPerso();

	var Select;
	var SelectEquipement;
	
	// instructions à essayer
	try 
	{
		// affichage des objets du sac
		for (var i = 0; i < TabListe[_PAGE_ITEM_PERSO].length ; i++) 
		{
			// récupèration de l'item courant
			var Obj=TabListe[_PAGE_ITEM_PERSO][i];
			
			//alert("iPositionItemInConteneur : " + iPositionItemInConteneur);

			// ici, on fait en sorte de ne pas afficher l'arme/armure équipe dans l'inventaire, seulement UNE fois
			//if (currentPerso.armeEquipee != null && Obj.id == currentPerso.armeEquipee.id && armeDejaEquip==false /*&& pressBtnEquipArme==true*/) 
			//{
			//	armeDejaEquip = true;
			//}
			//else if (currentPerso.armureEquipee != null && Obj.id == currentPerso.armureEquipee.id && armureDejaEquip==false /*&& pressBtnEquipArmure==true*/) 
			//{
			//	armureDejaEquip = true;
			//}
			//else
			//{
				var imgItem 	= new createjs.Bitmap(Obj.imageName);
				imgItem.name 	= i;
				imgItem.cursor  = "pointer";

				// Ajout de l'évenement a l'image
				// ajout d'un texte quand l'user passera la souris dessus
				imgItem.addEventListener('mouseover', function(event) 
				{
					var currentItem = TabListe[_PAGE_ITEM_PERSO][event.target.name];
					var descriptionItem=currentItem.description;
					labelDescriptionItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
					afficherDescItem(descriptionItem);
				},false);

				imgItem.addEventListener('mouseout', function(event)
				{
					labelDescriptionItem.text="";
				},false);
				
				imgItem.addEventListener('touchend', function(event)
						{
							labelDescriptionItem.text="";
						},false);


				imgItem.addEventListener("click", function(event)
				{
					var currentItem = TabListe[_PAGE_ITEM_PERSO][event.target.name];
					afficherSelecteurItem(event.target.x, 0);
					_SELECTED_ITEM_PERSO=currentItem.id;
					_SELECTED_ITEM_PERSOType=currentItem.type;
					/*
					if (Select!=null)
					{
						contInvPerso.removeChild(Select);
					}
					var num=event.target.x;
					var currentItem = TabListe[_PAGE_ITEM_PERSO][event.target.name];
					_SELECTED_ITEM_PERSO=currentItem.id;
					_SELECTED_ITEM_PERSOType=currentItem.type;
					Select = contInvPerso.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
					Select.x=(num);
					Select.y=0;
					*/
					// Appel de fonction pour créer les boutons liés au Perso
					setContPerso();
				});
				imgItem.addEventListener("touchstart", function(event)
						{
							var currentItem = TabListe[_PAGE_ITEM_PERSO][event.target.name];
							var descriptionItem=currentItem.description;
							labelDescriptionItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
							afficherDescItem(descriptionItem);
					
							if (Select!=null)
							{
								contInvPerso.removeChild(Select);
							}
							var num=event.target.x;
							var currentItem = TabListe[_PAGE_ITEM_PERSO][event.target.name];
							_SELECTED_ITEM_PERSO=currentItem.id;
							_SELECTED_ITEM_PERSOType=currentItem.type;
							Select = contInvPerso.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
							Select.x=(num);
							Select.y=0;
							// Appel de fonction pour créer les boutons liés au Perso
							setContPerso();
							
							//stage.update();
						});
				
				imgItem.x = (iPositionItemInConteneur * _spaceItem);
				imgItem.y = 4;
				
				//imgItem.
				contInvPerso.addChild(imgItem);
				
				// position de l'item dans le conteneur
				iPositionItemInConteneur++;
			//}
		}
	}
	catch(e)
	{
		//alert("Erreur bêta-test : Merci de reporter l'erreur suivante : " + e);
	}
	
	setContEquipement();

	labelInventaire.text="";
	labelInventaire.text=(PoidsSac + "/" + currentPerso.poidsMax);

	// Affichage barre poids du sac
	sacBar.scaleX = (PoidsSac/currentPerso.poidsMax) * sacBarWidth;
}

function majInventaireCase(currentCase)
{
	// CLear de la liste des items de case
	_CONT_INV_CASE.removeAllChildren();
		// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();
	var Taille = Math.ceil(currentCase.listeItem.length / 10);
	var TailleFinListe =(currentCase.listeItem.length % 10);
	var iPositionItemInConteneur=0;
	for (var j=0; j<Taille; j++)
	{
		var NewListe=new Array();

		if(j==Taille-1 && TailleFinListe!=0)
		{
			//Boucle des items liste incomplète
			for (var i=j*10; i<j*10+TailleFinListe; i++)
			{
				// mise de l'item dans une variable
				var item = currentCase.listeItem[i];
					// ajout de l'item à la nouvelle liste
				NewListe.push(item);
			}
			// ajout de la nouvelle liste au tableau de listes
			TabListe.push(NewListe);  
		}
		else
		{
			//Boucle normale : creation nouvelle liste de 10 items max
			for (var i=j*10; i<(j*10+10); i++)
			{
					// mise de l'item dans une variable
				var item = currentCase.listeItem[i];
					// mise de l'item dans une variable
				NewListe.push(item);
			}
			TabListe.push(NewListe);
		}
	}
	if(_PAGE_ITEM_CASE>Taille-1) 	_PAGE_ITEM_CASE=Taille-1;
	else if (_PAGE_ITEM_CASE<=0) 	_PAGE_ITEM_CASE=0;
		
	if(_PAGE_ITEM_CASE==Taille-1) 	Btn_PAGE_ITEM_CASERight.visible=false;
	else 						Btn_PAGE_ITEM_CASERight.visible=true;
		
	if(_PAGE_ITEM_CASE==0) 		Btn_PAGE_ITEM_CASELeft.visible=false;
	else 						Btn_PAGE_ITEM_CASELeft.visible=true;
		
	if(Taille ==0)
	{
		Btn_PAGE_ITEM_CASELeft.visible=false;
		Btn_PAGE_ITEM_CASERight.visible=false;
	}
		
	majBtnsItemCase();
	
	try 
	{
		// instructions à essayer
		for (var i = 0; i < TabListe[_PAGE_ITEM_CASE].length ; i++) 
		{
			var currentItem = TabListe[_PAGE_ITEM_CASE][i];
			
			// Ajout de l'image à l'ihm
			var imgItem 	= new createjs.Bitmap(currentItem.imageName);
			imgItem.name 	= i;
			imgItem.cursor 	= "pointer";
			imgItem.x 		= (iPositionItemInConteneur * _spaceItem);
			imgItem.y 		= 4;
			_CONT_INV_CASE.addChild(imgItem);

			// incrémente la position de l'item dans le conteneur
			iPositionItemInConteneur++;

			// Ajout des évenements à l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgItem.addEventListener('mouseover', function(event) 
			{
				var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
				afficherTooltip(contTousItems.x + _CONT_INV_CASE.x + event.target.x, contTousItems.y + _CONT_INV_CASE.y + event.target.y, currentItem);
				//var descriptionItem=currentItem.description;
				//labelDescriptionItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
				//afficherDescItem(descriptionItem);
			},false);

			imgItem.addEventListener('mouseout', function(event)
			{
				supprimerTooltip();
			},false);
			
			imgItem.addEventListener('touchend', function(event)
			{
				supprimerTooltip();
			},false);

			imgItem.addEventListener("click", function(event)
			{
				var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
				afficherSelecteurItem(event.target.x, 0);
				_SELECTED_ITEM_CASE=currentItem.id;

				// maj des boutons
				majBtnsItemCase();

				/*if (Select!=null)
				{
					_CONT_INV_CASE.removeChild(Select);
				}
				var num=event.target.x;
				var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
				_SELECTED_ITEM_CASE=currentItem.id;
				Select = _CONT_INV_CASE.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
				Select.x=(num);
				Select.y=0;
				*/
				
			});
				
			imgItem.addEventListener("touchstart", function(event)
			{
				// event "sourie sur item"
				var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
				afficherTooltip(_CONT_INV_CASE.x + event.target.x, _CONT_INV_CASE.y + event.target.y, currentItem);

				// event "click sur item"
				var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
				afficherSelecteurItem(event.target.x, 0);
				_SELECTED_ITEM_CASE=currentItem.id;

				// maj des boutons
				majBtnsItemCase();
				/*
				var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
				var descriptionItem=currentItem.description;
				labelDescriptionItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
				afficherDescItem(descriptionItem);
				if (Select!=null)
				{
					_CONT_INV_CASE.removeChild(Select);
				}
				var num=event.target.x;
				var currentItem = TabListe[_PAGE_ITEM_CASE][event.target.name];
				_SELECTED_ITEM_CASE=currentItem.id;
				Select = _CONT_INV_CASE.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
				Select.x=(num);
				Select.y=0;
				*/
			});
		}
	}
	catch(e){
		//alert("Page inexistante");
	}
}
function majBarreVie(ptsVie, ptsVieMax)
{
	var degatsRecus = _PERSO_LAST_PTS_VIE - ptsVie;
	afficherBarreSante(ptsVie, ptsVieMax, false);
	// si pas de diminution de vie
	if (degatsRecus <= 0) 
	{
		// on quite l'algo si y'a pas eu de blessure
		return;
	}

	// affiche les degats recus
	//_LABEL_DEGATS.text = degatsRecus;
	
	// efface l'ancien timer, au cas où
	clearInterval(_ID_INTER_BLINK_BARRE_VIE);

	// define nbr clignotement
	_BLINK_CPT = 10;
	
	// lance le compteur
	_ID_INTER_BLINK_BARRE_VIE = setInterval( function() 
	{
		if (_BLINK_CPT % 2 == 0)
		{
			// barre vie en vert
			afficherBarreSante(ptsVie, ptsVieMax, false)

			// cadre map en gris
			defineCadreMap("gris");
		}
		else
		{
			// barre vie en rouge
			afficherBarreSante(ptsVie, ptsVieMax, true)
			// cadre map en rouge
			defineCadreMap("rouge");
		}
		// si fin du compteur
		if (_BLINK_CPT == 0)
		{
			// vide label de degats
			//_LABEL_DEGATS.text = "";
			afficherBarreSante(ptsVie, ptsVieMax, false)
			// supprime le timer
			clearInterval(_ID_INTER_BLINK_BARRE_VIE);
		}
		_BLINK_CPT--;
	}, 200);	
}

function majFichePersoSimple(currentPerso)
{

	var classe;

	// ********* AFFICHAGE IMAGE DU PERSO *********/
	// insertion de l'image du Perso
	if(currentPerso.competence=="brute")
	{
		classe="Brute";
		imgPerso = new createjs.Bitmap("public/spritesheets/persos/Brute64.png");
	}
	else if(currentPerso.competence=="chercheur")
	{
		classe="Chercheur";
		imgPerso = new createjs.Bitmap("public/spritesheets/persos/Chercheur64.png");
	}
	else if(currentPerso.competence=="explorateur")
	{
		classe="Explorateur";
		imgPerso = new createjs.Bitmap("public/spritesheets/persos/Explorateur64.png");
	}
	else
	{
		imgPerso = new createjs.Bitmap("public/spritesheets/persos/perso.gif");
		classe="Pas de compétence";
	}
	imgPerso.scaleX=1.5;
	imgPerso.scaleY=1.5;
	imgPerso.x = 0;
	imgPerso.y = 450;
	stage.addChild(imgPerso);

		// ********* AFFICHAGE CARACTERISTIQUES PROPRES A LA COMPETENCE *********/
	/*labelFichePerso.text=(classe+"\n"+
			"Zombies : "+currentPerso.goulesMax+"\n"+
			"Attaque x "+currentPerso.multiPtsAttaque+"\n"+
			"Défense x "+currentPerso.multiPtsDefense+"\n"+
			"Cache   x "+currentPerso.multiProbaCache+"\n"+
			"Fouille x "+currentPerso.multiProbaFouille);*/
}

function majBarresPerso(currentPerso)
{
	// AFFICHAGE POINTS DE VIE 
	// Mise à jour des barres de vie, action, move		
	majBarreVie(currentPerso.ptSante, currentPerso.ptSanteMax);
	// maj variable
	_PERSO_LAST_PTS_VIE = currentPerso.ptSante;

	// AFFICHAGE POINTS DE FAIM 
	// Sécurité pour le remplissage de la barre de faim
	if(currentPerso.ptFaim<=0)										faimBar.scaleX = 0;
	else if(currentPerso.ptFaim>=currentPerso.ptFaimMax)			faimBar.scaleX = faimBarWidth;	
	else 															faimBar.scaleX = (currentPerso.ptFaim/currentPerso.ptFaimMax) * _BARRES_WIDTH;
	
	// AFFICHAGE POINTS D'ACTION 
	// Sécurité pour le remplissage de la barre d'action
	if(currentPerso.ptAction<=0) 									actionBar.scaleX = 0;
	else if(currentPerso.ptAction>=currentPerso.ptActionMax)		actionBar.scaleX = actionBarWidth;
	else 															actionBar.scaleX = (currentPerso.ptAction/currentPerso.ptActionMax) * _BARRES_WIDTH;
	
	// AFFICHAGE POINTS DE MOUVEMENT
	// Sécurité pour le remplissage de la barre de move
	if(currentPerso.ptDeplacement >=currentPerso.ptDeplacementMax) 	moveBar.scaleX = moveBarWidth;
	else if(currentPerso.ptDeplacement<=0) 							moveBar.scaleX = 0;
	else 															moveBar.scaleX = (currentPerso.ptDeplacement/currentPerso.ptDeplacementMax) * _BARRES_WIDTH;

	// mise à jour des variables globales, qui serviront pour afficher les proba quand on fera un info case
	_PERSO_PROBA_CACHE	=currentPerso.multiProbaCache;
	_PERSO_PROBA_FOUILLE	=currentPerso.multiProbaFouille;
}

function majBoutonsMode(currentPerso)
{
	// ********* AFFICHAGE DES BOUTONS DE MODE *********/
	//stage.removeChild(BtnFouiller, BtnCacher, BtnDefendre);
	contBtnModes.removeAllChildren();
	switch(currentPerso.mode)
	{
	// mode oisif
	case 0:
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
		BtnFouiller.y=0;
		contBtnModes.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event)
		{
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	
		BtnFouiller.addEventListener('touchstart', function(event)
		{
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	
		
		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		BtnCacher.y = BtnFouiller.y + _espaceBoutonY;
		contBtnModes.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) 
		{
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	
		BtnCacher.addEventListener('touchstart', function(event) 
				{
					socket.emit('PERSONNAGE_MODE_CS', 2);
					socket.emit('INFO_PERSONNAGE_CS');
				});	
		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		BtnDefendre.y = BtnCacher.y + _espaceBoutonY;
		contBtnModes.addChild(BtnDefendre);
		BtnDefendre.addEventListener('click', function(event) 
		{
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});
		BtnDefendre.addEventListener('touchstart', function(event) 
				{
					socket.emit('PERSONNAGE_MODE_CS', 3);
					socket.emit('INFO_PERSONNAGE_CS');
				});
		BtnFouiller.cursor=BtnCacher.cursor=BtnDefendre.cursor="pointer";
		labelBonusArme.text=("");
		labelBonusArmure.text=("");
		break;
		
	// mode fouille
	case 1 :
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleGreen.png");
		BtnFouiller.y=0;
		contBtnModes.addChild(BtnFouiller);

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		BtnCacher.y = BtnFouiller.y + _espaceBoutonY;
		contBtnModes.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) 
		{
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	
		BtnCacher.addEventListener('touchstart', function(event) 
				{
					socket.emit('PERSONNAGE_MODE_CS', 2);
					socket.emit('INFO_PERSONNAGE_CS');
				});	
		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		BtnDefendre.y = BtnCacher.y + _espaceBoutonY;
		contBtnModes.addChild(BtnDefendre);
		BtnDefendre.addEventListener('click', function(event) 
		{
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});	
		BtnDefendre.addEventListener('touchstart', function(event) 
				{
					socket.emit('PERSONNAGE_MODE_CS', 3);
					socket.emit('INFO_PERSONNAGE_CS');
				});	
		BtnFouiller.cursor="not-allowed";
		BtnCacher.cursor=BtnDefendre.cursor="pointer";
		labelBonusArme.text=("");
		labelBonusArmure.text=("");
		break;
		
	// mode caché
	case 2 :  
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
		BtnFouiller.y=0;
		contBtnModes.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) 
		{
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	
		BtnFouiller.addEventListener('touchstart', function(event) 
				{
					socket.emit('PERSONNAGE_MODE_CS', 1);
					socket.emit('INFO_PERSONNAGE_CS');
				});	
		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheGreen.png");
		BtnCacher.y = BtnFouiller.y + _espaceBoutonY;
		contBtnModes.addChild(BtnCacher);
		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		BtnDefendre.y = BtnCacher.y + _espaceBoutonY;
		contBtnModes.addChild(BtnDefendre);
		BtnDefendre.addEventListener('click', function(event) 
		{
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});
		BtnDefendre.addEventListener('touchstart', function(event) 
				{
					socket.emit('PERSONNAGE_MODE_CS', 3);
					socket.emit('INFO_PERSONNAGE_CS');
				});
		BtnCacher.cursor="not-allowed";
		BtnFouiller.cursor=BtnDefendre.cursor="pointer";
		labelBonusArme.text=("");
		labelBonusArmure.text=("");
		break;

	// mode défense
	case 3 :  
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
		BtnFouiller.y=0;
		contBtnModes.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) 
		{
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	
		BtnFouiller.addEventListener('touchstart', function(event) 
				{
					socket.emit('PERSONNAGE_MODE_CS', 1);
					socket.emit('INFO_PERSONNAGE_CS');
				});	
		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		BtnCacher.y = BtnFouiller.y + _espaceBoutonY;
		contBtnModes.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) 
		{
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	
		BtnCacher.addEventListener('touchstart', function(event) 
				{
					socket.emit('PERSONNAGE_MODE_CS', 2);
					socket.emit('INFO_PERSONNAGE_CS');
				});	
		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseGreen.png");
		BtnDefendre.y = BtnCacher.y + _espaceBoutonY;
		contBtnModes.addChild(BtnDefendre);

		BtnDefendre.cursor="not-allowed";
		BtnFouiller.cursor=BtnCacher.cursor="pointer";

		/*labelBonusArme.text=("( + " + PointsAttaque*0.25+" )");
		labelBonusArmure.text=("( + " + PointsDefense*0.25+" )");*/
		labelBonusArme.text=("(x 1.75)");
		labelBonusArmure.text=("(x 1.75)");
		break;
	}
}

function majMessages(currentPerso)
{
	// ********* AFFICHAGE MESSAGES *********/
	var longDernierMsg=60;

	if(currentPerso.listeMsgAtt.length > 0)
	{
		_listeMessages=currentPerso.listeMsgAtt;
		// inverse la liste des messages
		_listeMessages.reverse();
		labelDernierMessage.text=_listeMessages[0];
		// Raccourcissement du dernier message
		/*if(_listeMessages[0].length<longDernierMsg)
		{
			var dernierMsg=_listeMessages[0].substring(0,_listeMessages[0].length-1);
			labelDernierMessage.text="";
			labelDernierMessage.text=dernierMsg;
		}
		else
		{
			var dernierMsg=_listeMessages[0].substring(0,longDernierMsg);
			labelDernierMessage.text="";
			labelDernierMessage.text=dernierMsg+"...";
		}*/
	}
	else
	{
		labelDernierMessage.text="";
		_listeMessages=null;
	}

	if(_listeMessages!=null && currentPerso.nbrNvMsg >0)
	{
		labelNombreNouvMsg.text="";
		labelNombreNouvMsg.text=("( "+ currentPerso.nbrNvMsg + " )");

		var BtnMessages = new createjs.Bitmap("public/Boutons/Messages.png");
		BtnMessages.y=_espaceBoutonY;
		contBtnsListes.addChild(BtnMessages);
		BtnMessages.addEventListener('click', function(event) {
			if(_listeMessages != null)
			{
				message();
			}
			else
			{
				//alert("Pas de nouveaux messages");
			}
		});
		BtnMessages.addEventListener('touchstart', function(event) {
			if(_listeMessages != null)
			{
				message();
			}
			else
			{
				//alert("Pas de nouveaux messages");
			}
		});
		BtnMessages.cursor="pointer";
	}
	else if(_listeMessages!=null && currentPerso.nbrNvMsg ==0)
	{
		labelNombreNouvMsg.text="";

		var BtnMessages = new createjs.Bitmap("public/Boutons/MessagesVide.png");
		BtnMessages.y=_espaceBoutonY;
		contBtnsListes.addChild(BtnMessages);
		BtnMessages.addEventListener('click', function(event) {
			if(_listeMessages != null)
			{
				message(_listeMessages);
			}
			else
			{
				//alert("Pas de nouveaux messages");
			}
		});
		BtnMessages.addEventListener('touchstart', function(event) {
			if(_listeMessages != null)
			{
				message(_listeMessages);
			}
			else
			{
				//alert("Pas de nouveaux messages");
			}
		});
		
		BtnMessages.cursor="pointer";
	}
	else
	{
		labelNombreNouvMsg.text="";

		var BtnMessages = new createjs.Bitmap("public/Boutons/MessagesGris.png");
		BtnMessages.y=_espaceBoutonY;
		contBtnsListes.addChild(BtnMessages);

		BtnMessages.cursor="not-allowed";
	}
}

function majForceEnPresence(nbrAllies, nbrEnnemis, nbrZombies)
{
	_LABEL_NB_ALLIES.text = nbrAllies;
	_LABEL_NB_ENNEMIS.text = nbrEnnemis;
	_LABEL_NB_GOULES.text = nbrZombies;

	// animation correspondante
	animationModificationForces(nbrAllies, nbrEnnemis, nbrZombies)	

	// update variables 
	_LAST_NOMBRE_ALLIES = nbrAllies;
	_LAST_NOMBRE_ENNEMIS = nbrEnnemis;
	_LAST_NOMBRE_ZOMBIES = nbrZombies;
}

/*
 *
 * ACTIONS SUR L'INTERFACE
 *
 */
function afficherMessageRetour(msg, type)
{
	/// CONFIGURATION COULEUR DU MESSAGE
	// msg ok
	if (type == 1) 		_colorLabelAction = "#02D15C";
	// msg warning
	else if (type == 2) _colorLabelAction = "#FA7500";
	// msg erreur
	else if (type == 3) _colorLabelAction = "#FF0000";
	// autre
	else 				_colorLabelAction = "#FFFFFF";

	// vide le conteneur
	contZoneMessage.removeChild(labelAction);

	// ajoute le label
	labelAction 				= contZoneMessage.addChild(new createjs.Text("", _POLICE_LABEL, _colorLabelAction));
	labelAction.lineHeight 		= _LineHeight;
	labelAction.textBaseline 	= _TextBaseline;
	labelAction.x 				= 5;
	labelAction.y 				= 0;
	labelAction.text 			= msg;
	

	//stage.update();
	/// AFFICHAGE PENDANT JUSTE 5 SECONDES
	clearInterval(_ID_INTER_MSG_RETOUR);
	_ID_INTER_MSG_RETOUR = setTimeout(function() 
	{
		// vide le conteneur
		contZoneMessage.removeChild(labelAction);
		//stage.update();
	}, 5000);	
}

function afficherBarreSante(ptsVie, ptsVieMax, couleurRouge)
{
	// config couleur de la barre
	if (couleurRouge)
	{
		lifeBarColor = createjs.Graphics.getRGB(220,0,0);
		lifeBar.graphics.beginFill(lifeBarColor).drawRect(0, 0, 1, lifeBarHeight).endFill();
	}
	else
	{
		lifeBarColor = createjs.Graphics.getRGB(0,255,0);
		lifeBar.graphics.beginFill(lifeBarColor).drawRect(0, 0, 1, lifeBarHeight).endFill();
	}
	// config taille
	if(ptsVie<=0)				lifeBar.scaleX = 0;
	else if(ptsVie>=ptsVieMax)	lifeBar.scaleX = _BARRES_WIDTH;
	else 						lifeBar.scaleX = (ptsVie/ptsVieMax) * _BARRES_WIDTH;
}

function defineCadreMap(couleur)
{
	if (couleur == "rouge")
	{shape4.graphics.setStrokeStyle(2).beginStroke("#FF0000").drawRect(
			_contMapX-2, _contMapY-2, _contMapW+2, _contMapH+2);
	}
	else
	{
		shape4.graphics.setStrokeStyle(2).beginStroke("#405050").drawRect(
			_contMapX-2, _contMapY-2, _contMapW+2, _contMapH+2);
	}
}

function afficherTooltip(x, y, obj)
{
	y += 40;

	// conteneur
	_CONTENEUR_TOOLTIP		= new createjs.Container();
	_CONTENEUR_TOOLTIP.x 	= x;
	_CONTENEUR_TOOLTIP.y 	= y;
	
	// défini les caractéristiques de l'objet
	var ligne0 = obj.nom;
	var ligne1 = "V : "+obj.valeur+" - P : " + obj.poids;
	var ligne2 = obj.description;
	
	_LABEL_DESCRIPTION.text = ligne0 +"\n" +ligne1 +"\n" + ligne2;

	// défini la taille du conteneur
	 _TAILLE_TOOLTIP = (Math.max(ligne1.length,ligne2.length, ligne0.length)) * 7 + 10;

	// config couleur fond conteneur
	var coul;
	switch (obj.type) 
	{
		case 1 : coul = createjs.Graphics.getRGB(150,0,0, 0.8); break;
		case 2 : coul = createjs.Graphics.getRGB(0,150,0, 0.8); break;
		case 3 : coul = createjs.Graphics.getRGB(0,0,150, 0.8); break;
		case 4 : coul = createjs.Graphics.getRGB(150,150,0, 0.8); break;
		case 5 : coul = createjs.Graphics.getRGB(150,150,0, 0.8); break;
		case 6 : coul = createjs.Graphics.getRGB(150,150,0, 0.8); break;
		case 7 : coul = createjs.Graphics.getRGB(0,150,150, 0.8); break;
	}

	// dessine le fond du conteneur
 	_FOND_TOOLTIP = new createjs.Shape();
	_FOND_TOOLTIP.graphics.beginFill(coul).drawRect(0, 0, _TAILLE_TOOLTIP, 55).endFill();

	// test si ca dépasse pas du canvas
	if(_CONTENEUR_TOOLTIP.x + _TAILLE_TOOLTIP > _CANVAS_LARGEUR)
	{
		_CONTENEUR_TOOLTIP.x = _CANVAS_LARGEUR - _TAILLE_TOOLTIP - 7;
	} 

	// ajout du fond et label au conteneur
	_CONTENEUR_TOOLTIP.addChild(_FOND_TOOLTIP);
	_CONTENEUR_TOOLTIP.addChild(_LABEL_DESCRIPTION);

	// ajout du conteneur au stage
	stage.addChild(_CONTENEUR_TOOLTIP);
}

function supprimerTooltip()
{
	stage.removeChild(_CONTENEUR_TOOLTIP);
}

function afficherSelecteurItem(x, y, taille)
{
	// supprime l'ancien fond
	supprimerSelecteurItem();

	// affichage fond
	_IMG_ITEM_SELECTED = new createjs.Shape();
	_IMG_ITEM_SELECTED.graphics.beginFill(createjs.Graphics.getRGB(255,0,0, 0.5)).drawRect(0, 0, 10, 10).endFill();
	_IMG_ITEM_SELECTED.x = x+5;
	_IMG_ITEM_SELECTED.y = y+25;

	Select   = _CONT_INV_CASE.addChild(_IMG_ITEM_SELECTED);
	//Select.x = x;
	//Select.y = 0;
}

function supprimerSelecteurItem()
{
	// supprime l'ancien fond
	_CONT_INV_CASE.removeChild(_IMG_ITEM_SELECTED);
}

function afficherFichePersoDetaillee()
{
}

function supprimerFichePersoDetaillee()
{
}

/*
 *
 * ANIMATIONS
 *
 */
 // crée un petite animation quand le joueur subit une attaque de zomzom
 var _LAST_NOMBRE_ALLIES = -1;
 var _LAST_NOMBRE_ENNEMIS = -1;
 var _LAST_NOMBRE_ZOMBIES = -1;

function animationModificationForces(nbrAllies, nbrEnnemis, nbrZombies)
{
	//if (typeof nbrEnnemis === "undefined") alert("NBR ENNEMI undefined");

	// si c'est à -1, c'est qu'on vient de faire un chgt de case, donc on n'affiche rien
	if (_LAST_NOMBRE_ALLIES == -1) return;

	if (nbrAllies < _LAST_NOMBRE_ALLIES)
	{
		stage.removeChild(_LABEL_MODIF_NBR_ALLIES);

		_LABEL_MODIF_NBR_ALLIES = new createjs.Text("Départ d'un allié !", _POLICE_TITRE_2, "#ff0000");
		_LABEL_MODIF_NBR_ALLIES.x = 74;
		_LABEL_MODIF_NBR_ALLIES.y = 70;

		stage.addChild(_LABEL_MODIF_NBR_ALLIES);
	}
	else if (nbrAllies > _LAST_NOMBRE_ALLIES)
	{
		stage.removeChild(_LABEL_MODIF_NBR_ALLIES);

		_LABEL_MODIF_NBR_ALLIES = new createjs.Text("Arrivée d'un allié !", _POLICE_TITRE_2, "#00ff00");
		_LABEL_MODIF_NBR_ALLIES.x = 74;
		_LABEL_MODIF_NBR_ALLIES.y = 70;

		stage.addChild(_LABEL_MODIF_NBR_ALLIES);
	}

	if (nbrEnnemis < _LAST_NOMBRE_ENNEMIS)
	{
		stage.removeChild(_LABEL_MODIF_NBR_ENNEMIS);

		_LABEL_MODIF_NBR_ENNEMIS = new createjs.Text("Départ d'un ennemi !", _POLICE_TITRE_2, "#00ff00");
		_LABEL_MODIF_NBR_ENNEMIS.x = 70;
		_LABEL_MODIF_NBR_ENNEMIS.y = 107;
		
		stage.addChild(_LABEL_MODIF_NBR_ENNEMIS);
	}
	else if (nbrEnnemis > _LAST_NOMBRE_ENNEMIS)
	{
		stage.removeChild(_LABEL_MODIF_NBR_ENNEMIS);

		_LABEL_MODIF_NBR_ENNEMIS = new createjs.Text("Arrivée d'un ennemi !", _POLICE_TITRE_2, "#ff0000");
		_LABEL_MODIF_NBR_ENNEMIS.x = 70;
		_LABEL_MODIF_NBR_ENNEMIS.y = 107;
		
		stage.addChild(_LABEL_MODIF_NBR_ENNEMIS);
	}	

	if (nbrZombies < _LAST_NOMBRE_ZOMBIES)
	{
		stage.removeChild(_LABEL_MODIF_NBR_ZOMBIE);
		_LABEL_MODIF_NBR_ZOMBIE = new createjs.Text((_LAST_NOMBRE_ZOMBIES-nbrZombies)+" zombie(s) en moins !", _POLICE_TITRE_2, "#00ff00");
		_LABEL_MODIF_NBR_ZOMBIE.x = 70;
		_LABEL_MODIF_NBR_ZOMBIE.y = 135;
		
		stage.addChild(_LABEL_MODIF_NBR_ZOMBIE);
	}

	clearInterval(_ID_INTER_MODIF_FORCES);
	_ID_INTER_MODIF_FORCES = setTimeout( function() 
	{
		// on enlèves les labels non permanants 
		stage.removeChild(_LABEL_MODIF_NBR_ALLIES);
		stage.removeChild(_LABEL_MODIF_NBR_ENNEMIS);
		stage.removeChild(_LABEL_MODIF_NBR_ZOMBIE);
	}, 2000);
}

// crée un petite animation quand le joueur subit une attaque de zomzom
function animationAttaqueZombie(nombreZombies)
{
	// si y'a pas de zombie -> Pas d'animation
	if (nombreZombies == 0)	 return;

	// maj label zombies attaquantes
	_LABEL_ATTAQUE_ZOMBIE = new createjs.Text("Attaque de "+nombreZombies+" zombie(s) !", _POLICE_TITRE_2, "#ff0000");
	_LABEL_ATTAQUE_ZOMBIE.x = 70;
	_LABEL_ATTAQUE_ZOMBIE.y = 150;
	stage.addChild(_LABEL_ATTAQUE_ZOMBIE);

	// faire clignoter le cadre
	animationCadreMap("rouge");

	clearInterval(_ID_INTER_NBR_ZOMBIE_ATTAQUANTS);

	_ID_INTER_NBR_ZOMBIE_ATTAQUANTS = setInterval(function()
	{
		stage.removeChild(_LABEL_ATTAQUE_ZOMBIE);
	}, 3000)
	// on enlèves les labels non permanants 
	
}

// fait clignoter une fois le cadre de map de la couleur voulu 
function animationCadreMap(couleur)
{
	// affichage contour carte en rouge
	defineCadreMap(couleur);

	clearInterval(_ID_INTER_CADRE_MAP);
	_ID_INTER_CADRE_MAP = setTimeout( function() 
	{
		// passage dans sa couleur d'origine
		defineCadreMap("gris");

	}, 250);	
}

//******************************************
//********* RECEPTION SERVEUR **************
//******************************************

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE DE DEPLACEMENT VERS UNE DIRECTION DONNEE Renvoi
 * la case avec MOVE_PERSONNAGE_SC 
 * return : oCase_Manager[oPersonnage_Manager[idUser].GetIdSalleEnCours()].GetCopieCase() si ok
 * erreur : 0 si erreur de case
 * erreur : -1 si impossible de bouger 
 * erreur : -2 si aucun de Pts Mouvement
 * erreur : -3 si trop de goules
 * erreur : -4 si zone sure adverse
 * 
 * 
 */
socket.on('MOVE_PERSONNAGE_SC', function (reponse)
{
	switch(reponse)
	{
	case 0:
		afficherMessageRetour("WARNING : ERREUR_CASE", 3);
		break;
	case -1:
		afficherMessageRetour("Déplacement impossible : il n'y a pas de case par là.", 3);
		break;
	case -2:
		afficherMessageRetour("Déplacement impossible : vous n'avez plus de points de mouvement.", 3);
		break;
	case -3:
		afficherMessageRetour("Déplacement impossible : il y a trop de zombies dans la case.", 3);
		break;
	case -4:
		afficherMessageRetour("Déplacement impossible : vous ne pouvez pas entrer dans la zone sûre adverse.", 3);
		break;
	default:
		afficherMessageRetour("Vous venez de vous déplacer en " + reponse, 1);

		// on remet les last à -1 pour pas qu'il affiche un msg au chgt de case
		_LAST_NOMBRE_ALLIES  = -1;
		_LAST_NOMBRE_ENNEMIS = -1;
		_LAST_NOMBRE_ZOMBIES = -1;

		// demande des infos de la nouvelle case
		socket.emit('INFO_CASE_CS');
		//socket.emit('INFO_PERSONNAGE_CS');
		break;
	}
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM 
 * return 1 si arme équipée / déséquipée
 * return 2 si armure équipée / déséquipée
 * erreur : 0 si objet n'est pas dans le sac / Objet inexistant
 * erreur : -3 si item n'est ni arme ni armure
 * erreur : -4 si l'item a dequiper n'est pas équipé au préalable
 */
socket.on('INV_PERSONNAGE_SC', function (type, currentItem, codeRetour, currentPerso)
{
	var msgAction = "";
	var codeAction = 0;
	if (codeRetour == 0) 
	{
		msgAction = ("Impossible : Il n'y a pas d'objet \"" + currentItem.id + "\" dans le sac.");
		codeAction = 2;
		_SELECTED_ITEM_EQUIP=-1;
		// quitte la fonction
		return;
	}
	if (type == "EQUIPER") 
	{
		switch (codeRetour)
		{
		case 0:
			msgAction = ("Impossible : Il n'y a pas d'objet \"" + currentItem.nom + "\" dans le sac.");
			codeAction = 3;
			_SELECTED_ITEM_PERSO=-1;
			break;

			// équipage ok
		case 1:
			msgAction = ("Vous êtes désormais équipé de l'arme \"" + currentItem.nom + "\".");
			codeAction = 1;
			majInventairePerso(currentPerso);
			break;

		case 2:
			msgAction = ("Vous êtes désormais équipé de l'armure \"" + currentItem.nom + "\".");
			codeAction = 1;
			majInventairePerso(currentPerso);
			break;

		case -1:
			msgAction = ("Vous êtes déja équipé de l'arme \"" + currentItem.nom + "\".");
			codeAction = 3;
			_SELECTED_ITEM_PERSO=-1;
			break;

		case -2:
			msgAction = ("Vous êtes déja équipé de l'armure \"" + currentItem.nom + "\".");
			codeAction = 3;
			_SELECTED_ITEM_PERSO=-1;
			break;

		case -3:
			msgAction = ("Impossible de s'équper de l'objet \"" + currentItem.nom + "\". Ce n'est ni une arme, ni une armure.");
			codeAction = 3;
			_SELECTED_ITEM_PERSO=-1;
			break;
		}
	} 
	else if (type == "DEQUIPER") 
	{
		if (codeRetour == -4)
		{
			msgAction  = ("Déséquipement impossible : vous n'êtes équipé d'aucune arme / armure");
			codeAction = 3;
			_SELECTED_ITEM_EQUIP=-1;
		} 
		else if (codeRetour == 1) 
		{
			// Si déquipe arme
			// efface l'arme
			contArme.removeAllChildren();
			msgAction = ("Vous venez de ranger de votre arme dans votre sac.");
			codeAction = 2;
			// on ne rafraichit que l'affichage de l'inventaire
			majInventairePerso(currentPerso);
			_SELECTED_ITEM_EQUIP=-1;
		}
		// Si déquipe armure
		else if (codeRetour == 2) 
		{
			// efface armure
			contArmure.removeAllChildren();
			_SELECTED_ITEM_EQUIP=-1;
			msgAction = ("Vous venez de retirer de votre armure.");
			codeAction = 2;
			// on ne rafraichit que l'affichage de l'inventaire
			majInventairePerso(currentPerso);
		}
	}
	// affichage du message pour informer l'utilisateur
	afficherMessageRetour(msgAction, codeAction);
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR RAMASSER OU DEPOSER UN ITEM 
 * 
 * return TYPE (RAMASSER OU DEPOSER)
 * 
 * ET return poidsTotal si ok 
 * erreur : -1 si poids insufisant
 * erreur : -2 si objet n'est pas dans la case / le sac 
 * erreur : -3 si objet à déposer est équipé
 * erreur : -4 si autre
 * erreur : -5 si raté par goules
 * erreur : -6 si tentative ramasser ODD dans zone sure
 * 
 * ET return id_item
 * 
 * ET degats reçus
 * 
 * ET nbr goules attaquantes
 */
socket.on('INV_CASE_SC', function (type, codeRetour, id_item, DegatsG, RestG)
{
	var msgAction = "";
	var codeAction = 0;
	if (type == 'RAMASSER') {
		switch(codeRetour)
		{
		// erreur
		case -4:
			msgAction = ("Erreur inconnue");
			 codeAction = 3;
			_SELECTED_ITEM_CASE=-1;
			break;
		case -3:
			msgAction =("Erreur inconnue");
			 codeAction = 3;
			_SELECTED_ITEM_CASE=-1;
			break;
			// poids insufisant
		case -1:
			msgAction =("Impossible de ramasser cet objet : vous avez atteint votre poids maximal.");
			 codeAction = 3;
			_SELECTED_ITEM_CASE=-1;
			break;
			// objet pas dans case
		case -2:
			msgAction =("Impossible de ramasser cet objet : l'item vient d'être ramassé par quelqu'un d'autre.");
			 codeAction = 3;
			_SELECTED_ITEM_CASE=-1;
			break;
		case -5:
			msgAction =("Vous avez été intercepté par des zombies rôdant dans la salle !");
			 codeAction = 3;
			if(DegatsG!=0)
			{
				msgAction +=("\n- " + DegatsG + " points de vie !");
			}
			_SELECTED_ITEM_CASE=-1;
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		case -6:
			afficherMessageRetour("Ramassage d'ODD \nimpossible ici !");
			 codeAction = 0;
			_SELECTED_ITEM_CASE=-1;
			// ramassage ok
		default:
			afficherMessageRetour("Objet ramassé");
			 codeAction = 0;
			if(DegatsG!=0)
			{
				labelAction.text +=("\n- "+ DegatsG + " points \nde vie !");//\n"+ RestG + " Zombies restants");
			}
			_SELECTED_ITEM_CASE=-1;
			socket.emit('INFO_PERSONNAGE_CS');
			socket.emit('INFO_CASE_CS');
			break;
		}
	}
	if (type == 'DEPOSER') 
	{
		switch(codeRetour)
		{
		// erreur
		case -3:
			afficherMessageRetour("Déséquipez avant \nde déposer !");
			 codeAction = 0;
			_SELECTED_ITEM_PERSO=-1;
			break;
		case -4:
			afficherMessageRetour("Erreur interne !");
			 codeAction = 0;
			_SELECTED_ITEM_PERSO=-1;
			break;
		case -2:
			afficherMessageRetour("L'item n'est plus\n dans le sac !");
			 codeAction = 0;
			_SELECTED_ITEM_PERSO=-1;
			break;
			// dépôt ok
		default:
			afficherMessageRetour("Objet déposé");//\nSac : " + codeRetour + " kg");
 			codeAction = 0;
			if(DegatsG!=0)
			{
				labelAction.text +=("\n- "+ DegatsG + " points \nde vie !");//\n"+ RestG + " Zombies restants");
			}
			_SELECTED_ITEM_PERSO=-1;
			socket.emit('INFO_CASE_CS');
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		}
	}
	afficherMessageRetour(msgAction, codeAction);
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE D'INFOS SUR UNE CASE 
 * Renvoi la case 
 * Si erreur : renvoi NULL
 * 
 * ET nbr allies
 * 
 * ET nbr ennemis
 */
socket.on('INFO_CASE_SC', function(currentCase, nbrAllies, nbrEnnemis, idSousCase)
{
	// maj nbr alliés - ennemis
	majForceEnPresence(nbrAllies, nbrEnnemis, currentCase.nbrGoules);

	var msgAction = "";
	var codeAction = 0;
	
	// tri des items de la case
	currentCase.listeItem.sort(function(item1,item2){return item1.id-item2.id;});
	// modification du nom de l'image a afficher
	if (idSousCase == -1)
	{
		currentCase.pathImg += ".png";
	}
	else
	{
		currentCase.pathImg += "_"+idSousCase;
		currentCase.pathImg += ".png";
	}
	var nbJoueurs=nbrAllies+nbrEnnemis;

	setBtnJoueurs(nbJoueurs);
	setBtnGoules(currentCase.nbrGoules);

	if (currentCase == "ERREUR_CASE")
	{
		labelAction.text=("Erreur de case !");
	}
	else {

		var ProbCache, ProbFouille;
		ProbCache=(currentCase.probaCache * _PERSO_PROBA_CACHE);
		ProbFouille=(currentCase.probaObjet * _PERSO_PROBA_FOUILLE);

		labelCaseEnCours.text=(/*"Case en cours :\n" + */currentCase.nom /*+ ""*/);
		/*_LABEL_NB_ALLIES.text=("Alliés dans la salle  : " + nbrAllies + "");
		_LABEL_NB_ENNEMIS.text=("Ennemis dans la salle : " + nbrEnnemis + "");
		_LABEL_NB_GOULES.text=("Zombies dans la salle : " + currentCase.nbrGoules + "");
		labelProbaCache.text=("Proba de Cache :              " + ProbCache + " %");
		labelProbaFouille.text=("Proba de Trouver item :       " + ProbFouille + " %");*/

		var descriptionCase=currentCase.description;
		afficherDescCase(descriptionCase);

		if(ProbCache>100)
		{
			cacheBar.scaleX = cacheBarWidth;
		}
		else
		{
			cacheBar.scaleX = (ProbCache/100) * cacheBarWidth;
		}

		if(ProbFouille>100)
		{
			fouilleBar.scaleX = fouilleBarWidth;
		}
		else
		{
			fouilleBar.scaleX = (ProbFouille/100) * fouilleBarWidth;
		}

		majInventaireCase(currentCase);

		// Changement de l'image de la Map
		contMap.removeChild(map);
		// insertion de la map
		var map = new createjs.Bitmap(currentCase.pathImg);
		map.scaleX=0.840;
		map.scaleY=0.750;
		// Placement de la map
		//map.x = contMap.width/2 - map.image.width/2;
		map.x = 0;
		//alert(contMap.width + " - " + map.image.width + " - " + map.x);
		contMap.addChild(map);

		// mise a jour des forces en présence

	}
	//stage.update();
});

/************************************************************************************************************
 * RECEPTION DES INFORMATIONS SUR LE PERSONNAGE
 */
socket.on('INFO_PERSONNAGE_SC', function(currentPerso) 
{
	// configure...
	/// ... le bouton de fouille rapide
	majBtnFouilleRapide(currentPerso);

	// affiche...
	/// ... la fiche du perso (relative a la competence)
	majFichePersoSimple(currentPerso);

	// met a jour..
	/// ... les barres du perso (vie, mouvement ...)
	majBarresPerso(currentPerso);

	/// ... son inventaire
	majInventairePerso(currentPerso);
	
	/// ... les boutons de mode
	majBoutonsMode(currentPerso);

	/// ... les mesages en attente
	majMessages(currentPerso);
		
	// si il est mort, on lui affiche l'écran de mort
	if(currentPerso.ptSante<=0 && currentPerso.listeMsgAtt.length > 0)
	{
		dead(currentPerso);
	}
});

/**************************************************************************************
 * RECEPTION Suite à une DEMANDE POUR UTILISER UN ITEM
 * 
 * renvoi id item
 * 
 * ET return 1 si ok
 * erreur : -1 si objet n'est pas dans le sac
 * erreur : -2 si objet pas utilisable
 */
socket.on('PERSONNAGE_USE_SC', function(id_item, codeRetour)
{
	var msgAction = "";
	var codeAction = 0;

	switch(codeRetour)
	{
	case 1: 
		labelAction.text=("Item consommé !");
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -1:
		labelAction.text=("L'item n'est plus \ndans le sac !");
		break;
	case -2:
		labelAction.text=("L'item n'est pas \nconsommable !");
		break;
	}
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR CHANGER DE MODE
 * 
 * return mode
 * 
 * ET return 1 si ok
 * erreur : 0 si erreur interne
 * erreur : -4 si déja dans ce mode
 * erreur : -5 si raté à cause goules
 * erreur : -10 si plus de pts actions
 * 
 * ET return dégats infligés
 * 
 * ET nbr goules attaquantes
 */
socket.on('PERSONNAGE_MODE_SC', function (mode, reponse, degatsInfliges, nbrGoulesA)
{
	var msgAction = "";
	var codeAction = 0;

	switch(reponse)
	{
	case 1: 
		afficherMessageRetour("Changement de \nmode ok !");
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case 0 : 
		afficherMessageRetour("Changement de \nmode raté !\nErreur interne");
		break;
	case -4 : 
		afficherMessageRetour("Changement de \nmode mode raté !\nDéjà dans ce mode !");
		break;
	case -5: 
		afficherMessageRetour("Changement de \nmode raté !");
		// s'il a eu des degats, on maj le perso
		if(degatsInfliges != 0)
		{
			socket.emit('INFO_PERSONNAGE_CS');
		}
		// si des zombies l'on attaqué, on affiche l'animation
		if (nbrGoulesA > 0)
		{
			animationAttaqueZombie(nbrGoulesA);
		}

		/*if(degatsInfliges!=0)
		{
			labelAction.text +=("\nMais blessé (" + degatsInfliges + ")"); 
		}*/

		/*if(nbrGoulesA==1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " zombie !");
		}
		else if(nbrGoulesA>1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " zombies !");
		}*/
		break;
	case -10:
		afficherMessageRetour("Changement de \nmode raté !\nPoints d'action \ninsuffisants !");
		break;
	}
	//stage.update();
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR EFFECTUER UNE FOUILLE RAPIDE
 * 
 * reponse :
 * return : 1 si ok
 * erreur : 0 si erreur interne
 * erreur : -1 si fouille rate
 * erreur : -5 si action raté
 * erreur : -10 si plus de pts actions
 * 
 * ET return éventuels item découvert
 * 
 * ET return éventuel dégats subis
 * 
 * ET return 1 si objet ajouté au sac, 0 si a la salle
 * 
 * ET return nbr ennemis découverts
 * 
 * ET nbr goules attaquantes
 */
socket.on('ACTION_FOUILLE_RAPIDE_SC', function (reponse, item, degatsInfliges, ajouteAuSac, nbrEnnemisDecouverts, nbrGoulesA)
{
	var msgAction = "";
	var codeAction = 0;
	switch(reponse)
	{
	case  1 : 
		afficherMessageRetour("Fouille rapide \nréussie !\nObjet découvert :\n" + item.nom);
		
		if (ajouteAuSac == 0)
		{
			labelAction.text += "\nAjouté à la case !";
			socket.emit('INFO_CASE_CS');
		}
		else if (ajouteAuSac == 1)
		{
			labelAction.text += "\nAjouté au sac !";
			socket.emit('INFO_PERSONNAGE_CS');
		}

		if(nbrEnnemisDecouverts==1)
		{
			labelAction.text +=("\n" + nbrEnnemisDecouverts + " Ennemi \ndécouvert !");
			socket.emit('INFO_CASE_CS');
		}
		else if(nbrEnnemisDecouverts>1)
		{
			labelAction.text +=("\n" + nbrEnnemisDecouverts + " Ennemis \ndécouverts !");
			socket.emit('INFO_CASE_CS');
		}

		if(degatsInfliges!=0)
		{
			labelAction.text +=("\nMais blessé (" + degatsInfliges + ")"); 
			if(nbrGoulesA==1)
			{
				//labelAction.text +=("\npar " + nbrGoulesA + " zombie !");
			}
			else if(nbrGoulesA>1)
			{
				animationAttaqueZombie(nbrGoulesA);
			}
			socket.emit('INFO_PERSONNAGE_CS');
		}
		break;
	case  0 : 
		afficherMessageRetour("Erreur interne");
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -1 : 
		afficherMessageRetour("Fouille rapide ratée");
		break;
	case -5 : 
		afficherMessageRetour("Fouille rapide ratée");
		if(degatsInfliges!=0)
		{
			labelAction.text +=("\nEt blessé (" + degatsInfliges + ")"); 
		}
		if(nbrGoulesA==1)
		{
			animationAttaqueZombie(nbrGoulesA);
		}
		else if(nbrGoulesA>1)
		{
			animationAttaqueZombie(nbrGoulesA);
		}
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -10 :
		afficherMessageRetour("Points d'action \ninsuffisants !");
		break;
	}
	//stage.update();
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR ATTAQUER UN AUTRE JOUEUR
 * return 1 si ok
 * erreur : 0 si erreur interne
 * erreur : -1 si joueur n'est plus dans la case
 * erreur : -5 si raté à cause goules
 * erreur : -10 si plus de pts actions
 * 
 * ET return dégats infligés
 * 
 * ET return dégats reçus (ennemi)
 * 
 * ET return dégats reçues (goules)
 * 
 * ET nbr goules attaquantes
 */
socket.on('ACTION_ATTAQUE_SC', function (codeRetour, degatsI, degatsRecusE, degatsRecusG, nbrGoulesA)
{
	var msgAction = "";
	var codeAction = 0;
	switch(codeRetour)
	{
	case 0: 
		labelAction.text=("Erreur interne");
		break;
	case 1:
		labelAction.text=("Attaque réussie !");
		if(degatsI!=0)
		{
			labelAction.text+=("\nL'ennemi a perdu :\n" + degatsI + " points de vies");
		}
		if(degatsRecusE!=0)
		{
			labelAction.text+=("\nL'ennemi a riposté :\n-" + degatsRecusE + " points de vies");
			socket.emit('INFO_PERSONNAGE_CS');
		}
		break;
	case -1:
		labelAction.text=("L'ennemi n'est \nplus ici !");
		break;
	case -5:
		labelAction.text=("Attaque ratée !");
		if(degatsInfliges!=0)
		{
			labelAction.text +=("\nEt blessé (" + degatsRecusG + ")"); 
		}
		if(nbrGoulesA==1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " zombie !");
		}
		else if(nbrGoulesA>1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " zombies !");
		}
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -10:
		labelAction.text=("Points d'action \ninsuffisants");
		break;
	}
	//stage.update();
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR ATTAQUER UNE GOULE
 * return 2 si deux goules tuées
 * return 1 si une goules tuée
 * erreur : 0 si erreur interne
 * erreur : -1 si aucune goule tuée
 * erreur : -2 si pas de goules dans la salle
 *  erreur : -10 si pas assez de PA
 * 
 * ET degats reçus
 * 
 */
socket.on('ACTION_ATTAQUE_GOULE_SC', function (goulesTues, degatsSubis, nbrGoulesA)
{
	// s'il a eu des degats, on maj le perso
	//if(degatsSubis != 0)
	//{
		//socket.emit('INFO_PERSONNAGE_CS');
	//}
	// si des zombies l'on attaqué, on affiche l'animation
	if (nbrGoulesA > 0)
	{
		animationAttaqueZombie(nbrGoulesA);
	}
	var msgAction = "";
	var codeAction = 0;
	switch(goulesTues)
	{
	case 2: 
		labelAction.text=("2 zombies tués !");
		//socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 1: 
		labelAction.text=("1 zombie tué !");
		//socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 0:
		labelAction.text=("Attaque de zombie : erreur interne");
		break;

	case -1:
		labelAction.text=("Attaque de zombie échouée !");
		//socket.emit('INFO_PERSONNAGE_CS');
		break;

	case -2:
		labelAction.text=("Pas de zombie dans la salle !");
		break;

	case -10:
		labelAction.text=("Pas assez de points d'actions !");
		break;
	}
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR RENVOYER LA LISTE DES ALLIES DANS LA CASE
 * 
 * return tableau associatif : [pseudo, personnageAAfficher]
 * erreur : liste vide si aucun allié dans la case
 */ 
socket.on('INFO_CASE_ALLIES_SC', function (listeAllies)
{
	var msgAction = "";
	var codeAction = 0;
	var i=0;
	var iPositionPersoInConteneur=0;

	var labelPseudo = contListe.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelPseudo.lineHeight = _LineHeight;
	labelPseudo.textBaseline = _TextBaseline;
	labelPseudo.x = labelDescribePerso.x;
	labelPseudo.y = labelDescribePerso.y - 20;

	contListeAllies.removeAllChildren();

	listePersoAllies = new Array();

	var imgPersoAllie;

	// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();

	var Taille = Math.ceil(listeAllies.length / 10);
	var TailleFinListe =(listeAllies.length % 10);

	for (var j=0; j<Taille; j++)
	{
		var NewListe=new Array();

		if(j==Taille-1 && TailleFinListe!=0)
		{
			//Boucle des items liste incomplète
			for (var i=j*10; i<j*10+TailleFinListe; i++)
			{
				// mise de l'item dans une variable
				var perso = listeAllies[i];

				// ajout de l'item à la nouvelle liste
				NewListe.push(perso);
			}
			// ajout de la nouvelle liste au tableau de listes
			TabListe.push(NewListe);  
		}
		else
		{
			//Boucle normale : creation nouvelle liste de 10 items max
			for (var i=j*10; i<(j*10+10); i++)
			{

				// mise de l'item dans une variable
				var perso = listeAllies[i];

				// mise de l'item dans une variable
				NewListe.push(perso);
			}
			TabListe.push(NewListe);
		}
	}

	if(_PAGE_PERSO_ALLIES>Taille-1)
	{
		_PAGE_PERSO_ALLIES=Taille-1;
	}
	else if (_PAGE_PERSO_ALLIES<0)
	{
		_PAGE_PERSO_ALLIES=0;
	}

	if(_PAGE_PERSO_ALLIES==Taille-1)
	{
		Btn_PAGE_PERSO_ALLIESRight.visible=false;
	}
	else
	{
		Btn_PAGE_PERSO_ALLIESRight.visible=true;
	}

	if(_PAGE_PERSO_ALLIES==0)
	{
		Btn_PAGE_PERSO_ALLIESLeft.visible=false;
	}
	else
	{
		Btn_PAGE_PERSO_ALLIESLeft.visible=true;
	}

	if(Taille ==0)
	{
		Btn_PAGE_PERSO_ALLIESLeft.visible=false;
		Btn_PAGE_PERSO_ALLIESRight.visible=false;
	}

	try 
	{
		// instructions à essayer
		for (var i = 0; i < TabListe[_PAGE_PERSO_ALLIES].length ; i++) 
		{
			var persoA=TabListe[_PAGE_PERSO_ALLIES][i];

			var ModePerso;
			var DescriptionSac;
			var PourcentVie;
			var DescriptionVie;
			var PourcentSac;

			listePersoAllies.push(persoA);

			if(persoA.competence=="brute")
			{
				imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Brute64.png");
				imgPersoAllie.x = iPositionPersoInConteneur * _spacePerso;
				imgPersoAllie.cursor= "normal";
			}
			else if(persoA.competence=="chercheur")
			{
				imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Chercheur64.png");
				imgPersoAllie.x = iPositionPersoInConteneur * _spacePerso;
				imgPersoAllie.cursor= "normal";
			}
			else if(persoA.competence=="explorateur")
			{
				imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Explorateur64.png");
				imgPersoAllie.x = iPositionPersoInConteneur * _spacePerso;
				imgPersoAllie.cursor= "normal";
			}

			imgPersoAllie.name = i;

			// Ajout de l'évenement a l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgPersoAllie.addEventListener('mouseover', function(event) {
				var currentPerso = TabListe[_PAGE_PERSO_ALLIES][event.target.name];
				// Texte de description du Mode
				ModePerso="";
				switch(currentPerso.mode)
				{
				case 0:
					ModePerso="Normal";
					break;
				case 1:
					ModePerso="Fouille";
					break;
				case 2:
					ModePerso="Caché";
					break;
				case 3:
					ModePerso="Défense";
					break;
				}

				labelPseudo.text=currentPerso.listeMsgAtt;

				labelDescribePerso.text = ("Competence : " + currentPerso.competence + 
						"\nMode : " + ModePerso + 
						"\nSanté : " + currentPerso.ptSante + " / " + currentPerso.ptSanteMax +
						"\nSac rempli à : " + currentPerso.sacADos + " %");

				if(currentPerso.armeEquipee!=null)
				{
					labelDescribePerso.text += "\nArme équipée : " + currentPerso.armeEquipee.nom + " " + currentPerso.armeEquipee.valeur;
				}
				else
				{
					labelDescribePerso.text += "\nPas d'arme équipée";
				}

				if(currentPerso.armureEquipee!=null)
				{
					labelDescribePerso.text += "\nArmure équipée : " + currentPerso.armureEquipee.nom + " " + currentPerso.armureEquipee.valeur;
				}
				else
				{
					labelDescribePerso.text += "\nPas d'armure équipée";

				}
				//stage.update();
			},false);

			imgPersoAllie.addEventListener('mouseout', function(event){
				labelDescribePerso.text="";
				labelPseudo.text="";
				//stage.update();
			},false);

			contListeAllies.addChild(imgPersoAllie);

			// position de l'item dans le conteneur
			iPositionPersoInConteneur++;
		}
	}
	catch(e)
	{
		//alert("Page inexistante !");
	}
	socket.emit('INFO_PERSONNAGE_CS');
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR RENVOYER LA LISTE DES ENNEMIS DANS LA CASE
 * 
 * return liste des ennemis (tableau associatif) [idUtilisateur, personnageEnnemi]
 * erreur : liste vide si aucun ennemis dans la case
 */ 
socket.on('INFO_CASE_ENNEMIS_SC', function (listeEnn)
{
	var msgAction = "";
	var codeAction = 0;

	var i=0;
	var iPositionPersoInConteneur=0;

	this.listePersoEnnemis = new Array();
	contListeEnnemis.removeAllChildren();

	var imgPersoEnnemi;

	// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();

	var Taille = Math.ceil(listeEnn.length / 10);
	var TailleFinListe =(listeEnn.length % 10);

	for (var j=0; j<Taille; j++)
	{
		var NewListe=new Array();

		if(j==Taille-1 && TailleFinListe!=0)
		{
			//Boucle des items liste incomplète
			for (var i=j*10; i<j*10+TailleFinListe; i++)
			{
				// mise de l'item dans une variable
				var perso = listeEnn[i];

				// ajout de l'item à la nouvelle liste
				NewListe.push(perso);
			}
			// ajout de la nouvelle liste au tableau de listes
			TabListe.push(NewListe);  
		}
		else
		{
			//Boucle normale : creation nouvelle liste de 10 items max
			for (var i=j*10; i<(j*10+10); i++)
			{

				// mise de l'item dans une variable
				var perso = listeEnn[i];

				// mise de l'item dans une variable
				NewListe.push(perso);
			}
			TabListe.push(NewListe);
		}
	}

	if(_PAGE_PERSO_ENN>Taille-1)
	{
		_PAGE_PERSO_ENN=Taille-1;
	}
	else if (_PAGE_PERSO_ENN<0)
	{
		_PAGE_PERSO_ENN=0;
	}

	if(_PAGE_PERSO_ENN==Taille-1)
	{
		Btn_PAGE_PERSO_ENNRight.visible=false;
	}
	else
	{
		Btn_PAGE_PERSO_ENNRight.visible=true;
	}

	if(_PAGE_PERSO_ENN==0)
	{
		Btn_PAGE_PERSO_ENNLeft.visible=false;
	}
	else
	{
		Btn_PAGE_PERSO_ENNLeft.visible=true;
	}

	if(Taille ==0)
	{
		Btn_PAGE_PERSO_ENNLeft.visible=false;
		Btn_PAGE_PERSO_ENNRight.visible=false;
	}

	var Select;

	try 
	{
		// instructions à essayer
		for (var i = 0; i < TabListe[_PAGE_PERSO_ENN].length ; i++) 
		{
			var persoE=TabListe[_PAGE_PERSO_ENN][i];

			var ModePerso;
			var DescriptionSac;
			var PourcentVie;
			var DescriptionVie;

			this.listePersoEnnemis.push(persoE);

			if(persoE.competence=="brute")
			{
				if(persoE.ptSante<=0)
				{
					imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Brute64gris.png");
					imgPersoEnnemi.x = iPositionPersoInConteneur * _spacePerso;
					imgPersoEnnemi.y = 2 ; 
					imgPersoEnnemi.cursor= "not-allowed";
				}
				else
				{
					imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Brute64.png");
					imgPersoEnnemi.x = iPositionPersoInConteneur * _spacePerso;
					imgPersoEnnemi.y = 2 ; 
					imgPersoEnnemi.cursor= "pointer";
				}
			}
			else if(persoE.competence=="chercheur")
			{
				if(persoE.ptSante<=0)
				{
					imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Chercheur64gris.png");
					imgPersoEnnemi.x = iPositionPersoInConteneur * _spacePerso;
					imgPersoEnnemi.y = 2 ; 
					imgPersoEnnemi.cursor= "not-allowed";
				}
				else
				{
					imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Chercheur64.png");
					imgPersoEnnemi.x = iPositionPersoInConteneur * _spacePerso;
					imgPersoEnnemi.y = 2 ; 
					imgPersoEnnemi.cursor= "pointer";
				}
			}
			else if(persoE.competence=="explorateur")
			{
				if(persoE.ptSante<=0)
				{
					imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Explorateur64gris.png");
					imgPersoEnnemi.x = iPositionPersoInConteneur * _spacePerso;
					imgPersoEnnemi.y = 2 ; 
					imgPersoEnnemi.cursor= "not-allowed";
				}
				else
				{
					imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Explorateur64.png");
					imgPersoEnnemi.x = iPositionPersoInConteneur * _spacePerso;
					imgPersoEnnemi.y = 2 ; 
					imgPersoEnnemi.cursor= "pointer";
				}

			}

			imgPersoEnnemi.name = i;

			// Ajout de l'évenement a l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgPersoEnnemi.addEventListener('mouseover', function(event)
					{
				var currentPerso = TabListe[_PAGE_PERSO_ENN][event.target.name];

				// Calcul du pourcentage de vie
				PourcentVie = currentPerso.ptSante / currentPerso.ptSanteMax * 100;
				// Texte de Description de la vie
				if(PourcentVie>=0 && PourcentVie==0)
				{
					DescriptionVie="";
					DescriptionVie="Le corps de ce joueur gît au sol...";
				}
				else if(PourcentVie>=0 && PourcentVie<20)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur n'a pas l'air très en forme";
				}
				else if(PourcentVie>=20 && PourcentVie<40)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur n'a pas l'air peu en forme";
				}
				else if(PourcentVie>=40 && PourcentVie<60)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur a l'air en forme";
				}
				else if(PourcentVie>=60 && PourcentVie<80)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur a l'air très en forme";
				}
				else if(PourcentVie>=80 && PourcentVie<=100)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur a l'air au top de sa forme";
				}

				// Texte de description du poids du sac
				if(currentPerso.sacADos>=0 && currentPerso.sacADos<20)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur n'a pas l'air très chargé !";
				}
				else if(currentPerso.sacADos>=20 && currentPerso.sacADos<40)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur a l'air peu chargé !";
				}
				else if(currentPerso.sacADos>=40 && currentPerso.sacADos<60)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur a l'air chargé !";
				}
				else if(currentPerso.sacADos>=60 && currentPerso.sacADos<80)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur a l'air très chargé !";
				}
				else if(currentPerso.sacADos>=80 && currentPerso.sacADos<=100)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur a l'air surchargé !";
				}

				// Texte de description du Mode
				switch(currentPerso.mode)
				{
				case 0: ModePerso="";
				ModePerso="Normal";
				break;
				case 1: ModePerso="";
				ModePerso="Fouille";
				break;
				case 2: ModePerso="";
				ModePerso="Caché";
				break;
				case 3: ModePerso="";
				ModePerso="Défense";
				break;
				}

				labelDescribePerso.text=("Competence : "+currentPerso.competence+
						"\nMode : "+ModePerso+
						"\n"+DescriptionVie+
						"\n"+DescriptionSac);

				if(currentPerso.armeEquipee!=null)
				{
					labelDescribePerso.text +=("\nArme équipée : " + currentPerso.armeEquipee.nom);
				}
				else
				{
					labelDescribePerso.text += "\nPas d'arme équipée";
				}


				if(currentPerso.armureEquipee!=null)
				{
					labelDescribePerso.text +=("\nArmure équipée :" + currentPerso.armureEquipee.nom);
				}
				else
				{
					labelDescribePerso.text += "\nPas d'armure équipée";
				}
				//stage.update();
					},false);

			imgPersoEnnemi.addEventListener('mouseout', function(event){
				labelDescribePerso.text="";
				//stage.update();
			},false);
			
			imgPersoEnnemi.addEventListener('touchend', function(event){
				labelDescribePerso.text="";
				//stage.update();
			},false);


			imgPersoEnnemi.addEventListener("click", function(event){
				if (Select!=null)
				{
					contListeEnnemis.removeChild(Select);
				}
				var num=event.target.x;
				Select = contListeEnnemis.addChild(new createjs.Bitmap("public/Boutons/Select64.png"));
				Select.x=(num);
				Select.y=0;
				var currentPerso = TabListe[_PAGE_PERSO_ENN][event.target.name];
				_SELECTED_PERSO=currentPerso.id;
				setBtnAttaquer(BtnCancelListe.x, BtnCancelListe.y);
				//stage.update();
			});
			imgPersoEnnemi.addEventListener("touchstart", function(event){
				
				var currentPerso = TabListe[_PAGE_PERSO_ENN][event.target.name];

				// Calcul du pourcentage de vie
				PourcentVie = currentPerso.ptSante / currentPerso.ptSanteMax * 100;
				// Texte de Description de la vie
				if(PourcentVie>=0 && PourcentVie==0)
				{
					DescriptionVie="";
					DescriptionVie="Le corps de ce joueur gît au sol...";
				}
				else if(PourcentVie>=0 && PourcentVie<20)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur n'a pas l'air très en forme";
				}
				else if(PourcentVie>=20 && PourcentVie<40)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur n'a pas l'air peu en forme";
				}
				else if(PourcentVie>=40 && PourcentVie<60)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur a l'air en forme";
				}
				else if(PourcentVie>=60 && PourcentVie<80)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur a l'air très en forme";
				}
				else if(PourcentVie>=80 && PourcentVie<=100)
				{
					DescriptionVie="";
					DescriptionVie="Ce joueur a l'air au top de sa forme";
				}

				// Texte de description du poids du sac
				if(currentPerso.sacADos>=0 && currentPerso.sacADos<20)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur n'a pas l'air très chargé !";
				}
				else if(currentPerso.sacADos>=20 && currentPerso.sacADos<40)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur a l'air peu chargé !";
				}
				else if(currentPerso.sacADos>=40 && currentPerso.sacADos<60)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur a l'air chargé !";
				}
				else if(currentPerso.sacADos>=60 && currentPerso.sacADos<80)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur a l'air très chargé !";
				}
				else if(currentPerso.sacADos>=80 && currentPerso.sacADos<=100)
				{
					DescriptionSac="";
					DescriptionSac="Ce joueur a l'air surchargé !";
				}

				// Texte de description du Mode
				switch(currentPerso.mode)
				{
				case 0: ModePerso="";
				ModePerso="Normal";
				break;
				case 1: ModePerso="";
				ModePerso="Fouille";
				break;
				case 2: ModePerso="";
				ModePerso="Caché";
				break;
				case 3: ModePerso="";
				ModePerso="Défense";
				break;
				}

				labelDescribePerso.text=("Competence : "+currentPerso.competence+
						"\nMode : "+ModePerso+
						"\n"+DescriptionVie+
						"\n"+DescriptionSac);

				if(currentPerso.armeEquipee!=null)
				{
					labelDescribePerso.text +=("\nArme équipée : " + currentPerso.armeEquipee.nom);
				}
				else
				{
					labelDescribePerso.text += "\nPas d'arme équipée";
				}


				if(currentPerso.armureEquipee!=null)
				{
					labelDescribePerso.text +=("\nArmure équipée :" + currentPerso.armureEquipee.nom);
				}
				else
				{
					labelDescribePerso.text += "\nPas d'armure équipée";
				}
				
				if (Select!=null)
				{
					contListeEnnemis.removeChild(Select);
				}
				var num=event.target.x;
				Select = contListeEnnemis.addChild(new createjs.Bitmap("public/Boutons/Select64.png"));
				Select.x=(num);
				Select.y=0;
				var currentPerso = TabListe[_PAGE_PERSO_ENN][event.target.name];
				_SELECTED_PERSO=currentPerso.id;
				setBtnAttaquer(BtnCancelListe.x, BtnCancelListe.y);
				//stage.update();
			});

			contListeEnnemis.addChild(imgPersoEnnemi);

			// position de l'item dans le conteneur
			iPositionPersoInConteneur++;

			// Update l'ihm
			//stage.update();
		}
	}
	catch(e){}

	socket.emit('INFO_PERSONNAGE_CS');
});

socket.on('ATTAQUE_NUIT_SC', function ()
{
	_ECRAN_ATTAQUE_NUIT = true;
	attaqueNuit();
});

socket.on('GET_DATE_SC', function (dateLancementSrv)
{
	labelLancementServeur.text="";
	var annee = dateLancementSrv.substring(0,4);
	var mois = dateLancementSrv.substring(5,7);
	var jour = dateLancementSrv.substring(8,10);
	var heure = parseInt(dateLancementSrv.substring(11,13))+1;
	var minuit = dateLancementSrv.substring(17,19);
	labelLancementServeur.text="Serveur lancé le "+jour+"/"+mois+" à "+heure +"h" +minuit;
});

//Creer bouton tout simple :
//var BtnSaveBD = stage.addChild(new Button("SAVE BD", ColorBtn));
//Couleur des boutons
//var ColorBtn="#850000";