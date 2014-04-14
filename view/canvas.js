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

// variables picto
var imgVie;
var imgFaim;
var imgAction;
var imgMouvement;
var imgSac;
var imgAttaque;
var imgDefense;
var imgFouille;
var imgCache;


var _MODE_SIMPLE = true;
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
var _PERSO_LAST_PTS_VIE = -1;
var _PERSO_LAST_PTS_FAIM = -1
var _PERSO_LAST_PTS_ACTION = -1;
var _PERSO_LAST_PTS_MVT = -1;
var _PERSO_LAST_PTS_POIDS = -1;

//Liste des messages du personnage ( ! global ) 
var _listeMessages;
var _LAST_GOULES_MAX;

//Variables pour la coloration des messages de retour
var _boolColorAction=false;
var _colorLabelAction;

// Variables pour la navigation entre les pages items/persos/messages
var _PAGE_ITEM_PERSO_DEAD=0;
var _PAGE_ITEM_PERSO_EQUIP=0;
var _PAGE_ITEM_PERSO_CONSO=0;
var _PAGE_ITEM_PERSO_ODD=0;
var _PAGE_ITEM_CASE_EQUIP=0;
var _PAGE_ITEM_CASE_CONSO=0;
var _PAGE_ITEM_CASE_ODD=0;
var _PAGE_PERSO_ENN_1=0;
var _PAGE_PERSO_ENN_2=0;
var _PAGE_PERSO_ALLIES=0;
var _PAGE_MESSAGES=0;
var _PAGE_JOUEURS=false;
var _PAGE_LISTE_MESSAGES=false;
var _START=false;

var POIDS_DU_SAC=0;

// Variables pour l'affichage des items équipés une fois

//var pressBtnEquipArme=true;
//var pressBtnEquipArmure=true;

// Variables correspondant aux flèches des pages
var Btn_PAGE_ITEM_PERSORight, Btn_PAGE_ITEM_PERSOLeft, Btn_PAGE_ITEM_CASE_EQUIPRight, Btn_PAGE_ITEM_CASE_EQUIPLeft, Btn_PAGE_ITEM_CASE_CONSORight, Btn_PAGE_ITEM_CASE_CONSOLeft,
Btn_PAGE_ITEM_CASE_ODDRight, Btn_PAGE_ITEM_CASE_ODDLeft, Btn_PAGE_ITEM_PERSO_EQUIPRight, Btn_PAGE_ITEM_PERSO_EQUIPLeft, Btn_PAGE_ITEM_PERSO_CONSORight, Btn_PAGE_ITEM_PERSO_CONSOLeft,
Btn_PAGE_ITEM_PERSO_ODDRight, Btn_PAGE_ITEM_PERSO_ODDLeft,Btn_PAGE_ITEM_PERSO_DEADRight, Btn_PAGE_ITEM_PERSO_DEADLeft;

//******************************************
//*  Réglages mise en forme (partie Design)*
//******************************************

 var _CONTENEUR_BARRES_INITIALISES = false;
// Police des labels du Plateau de jeu
var _POLICE_TOOLTIP	="12px Fstein";
var _POLICE_LABEL	="15px Fstein";
var _POLICE_MESSAGES="13px Fstein";
var _POLICE_TITRE_1	= "20px Fstein"; //"30px BadGrunge";
var _POLICE_TITRE_2	= "15px Fstein"; //"23px BadGrunge";
var _POLICE_TITRE_3	= "12px Fstein"; //"23px BadGrunge";

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
var _POLICE_MORT="22px Fstein";
var _COULEUR_LABELS_MORT="#DDDDDD";
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
var __CONT_ARMEX = 100;
var __CONT_ARMEY = 460;

// Dimension Conteneur ArmeEquip
var __CONT_ARMEH = 30;
var __CONT_ARMEW = 30;

// Placement Conteneur ArmureEquip
var _contArmureX = __CONT_ARMEX;
var _contArmureY = __CONT_ARMEY+60;

// Dimension Conteneur ArmureEquip
var _contArmureH = 30;
var _contArmureW = 30;

//------------------ Zone 8 : Listes-------------------------------------------------------

// Placement Conteneur des Boutons liste
var _contBtnsListesX = 10;
var _contBtnsListesY = 180;
var _contBtnsListesW = 140;
var _contBtnsListesH = 2*_espaceBoutonY;

// Placement du label nombre de nouveaux messages
var _labelNombreNouvMsgX=_contBtnsListesX + _contBtnsListesW/3 + 135;
var _labelNombreNouvMsgY=_contBtnsListesY + 80;

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


// - DECLARATION DES LABELS, CONTENEURS, CONTOURS ET BOUTONS -

var _LABEL_MODIF_PTS_SANTE 	= new createjs.Text("", "bold 15px Fstein", "#FFFFFF");
_LABEL_MODIF_PTS_SANTE.x 	= 410;
_LABEL_MODIF_PTS_SANTE.y 	= 390;

var _LABEL_MODIF_PTS_FAIM 	= new createjs.Text("", "bold 15px Fstein", "#FFFFFF");
_LABEL_MODIF_PTS_FAIM.x 	= 410;
_LABEL_MODIF_PTS_FAIM.y 	= 415;

var _LABEL_MODIF_PTS_ACTION 	= new createjs.Text("", "bold 15px Fstein", "#FFFFFF");
_LABEL_MODIF_PTS_ACTION.x 	= 410;
_LABEL_MODIF_PTS_ACTION.y 	= 440;

var _LABEL_MODIF_PTS_MVT 	= new createjs.Text("", "bold 15px Fstein", "#FFFFFF");
_LABEL_MODIF_PTS_MVT.x 	= 410;
_LABEL_MODIF_PTS_MVT.y 	= 465;

var _LABEL_MODIF_PTS_POIDS 	= new createjs.Text("", "bold 15px Fstein", "#FFFFFF");
_LABEL_MODIF_PTS_POIDS.x 	= 410;
_LABEL_MODIF_PTS_POIDS.y 	= 490;


var _LABEL_ATTAQUE_ZOMBIE = new createjs.Text("", "bold 15px Fstein", "#FF0000");
var _LABEL_MODIF_NBR_ALLIES;
var _LABEL_MODIF_NBR_ENNEMIS;
var _LABEL_MODIF_NBR_ZOMBIE;

var _DUREE_AFFICHAGE = 3000;



////////////// VARIABLES POUR LES TOOLTIPS ///////////////
var _LABEL_POLICE="italic 12px Fstein";
var _CONTENEUR_TOOLTIP				;
var _LABEL_DESCRIPTION 				= new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS);
var _TAILLE_TOOLTIP					;
var _FOND_TOOLTIP 					;
_LABEL_DESCRIPTION.lineHeight 		= _LineHeight;
_LABEL_DESCRIPTION.textBaseline 	= _TextBaseline;
_LABEL_DESCRIPTION.x 				= 5;
_LABEL_DESCRIPTION.y 				= 5;

var _IMG_ITEM_SELECTED;

var _COLOR_LISTES="#dddddd";

////////////// VARIABLES POUR LES INTERVALS ///////////////
var _ID_INTER_BLINK;
var _ID_INTER_BLINK_BARRE_VIE;
var _ID_INTER_LABEL_MODIF_PTFAIM;
var _ID_INTER_LABEL_MODIF_PTACTIONS;
var _ID_INTER_LABEL_MODIF_PTMVT;
var _ID_INTER_LABEL_MODIF_POIDS;
var _ID_INTER_MSG_RETOUR;
var _ID_INTER_CADRE_MAP;
var _ID_INTER_MODIF_FORCES;
var _ID_INTER_NBR_ZOMBIE_ATTAQUANTS;

var _BLINK_CPT;

//-------------- Déclaration des labels----------------------------------------------

var labelAction, labelInventaire, labelDescriptionItem,
labelBonusArme, labelBonusArmure, labelCaseEnCours, _LABEL_NB_ALLIES, _LABEL_NB_ENNEMIS,
_LABEL_NB_GOULES, labelProbaCache, labelProbaFouille, labelPourcentLoad, 
labelAlliesListe, labelEnnemisListe, labelMessage, 
labelDernierMessage, labelNombreNouvMsg, labelFichePerso, labelDescriptionCase,
labelLancementServeur;

var labelEnnemisListe1, labelEnnemisListe2;


//-------------- Déclaration des conteneurs----------------------------------------------

var contArme, contArmure, contMap, contPerso, contBtnModes, contPictoCase,
contBtnsListes, contDead, contBtnsInvPerso, contBtnsInvCase, contBtnsInvCaseBis, contListe,
contListeAllies, contListeEnnemis1, contListeEnnemis2, contZoneMessage, contMessage;

//-------------- Déclaration des contours----------------------------------------------

var shape, shape1, shape2, shape3, shapeMap, shape6, shape7, shape8, shapeMode,
shapeLabelsAction, shapeMessage, shapeDead, shapeInfoCase,
shapeBtnsListes, shapeBtnsInvPerso, shapeBtnsInvCase, shapeBtnsInvCaseBis, shapeBtnsListes, 
shapeBtnsInvPerso, shapeBtnsInvCase, shapeZoneMessage;

//-------------- Déclaration des boutons----------------------------------------------

var Btn_PAGE_PERSO_ALLIESRight, Btn_PAGE_PERSO_ALLIESLeft, Btn_PAGE_PERSO_ENNRight, Btn_PAGE_PERSO_ENNLeft,
Btn_PAGE_MESSAGESDown, Btn_PAGE_MESSAGESUp, BtnCancelListe;

var TAB_CONT_ITEMS=new Array;
var TAB_SHAPE_ITEMS=new Array;

var _TAILLE_IMAGE_FLECHE=42;

/**
 * IMPORTANT : PERMET DE LANCER LE CANVAS !!
 */
onload = initialize;

/**
 * FONCTION D'INITIALISATION ET DE CHARGEMENT
 */

var lifeBarContainer;

// Première Fonction appelée 
function initialize() 
{
	// ************************************************
	// * Création du canvas et des autres élements   **
	// ************************************************
	
	// Création du canvas
	canvas = document.getElementById("myCanvas");
	
	//Création du stage (la scène) + recupération de sa taille
	stage = new createjs.Stage(canvas);	
	// tailles
	_CANVAS_LARGEUR = stage.canvas.width;
	_CANVAS_HAUTEUR = stage.canvas.height;

	// autoriser le mouse over / out events
	stage.enableMouseOver(20);

	// autorise le tactile si l'appareil utilisé le supporte
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
	// Variable au format JSON qui permet de définir tous les élements à charger
	var manifest = [
					{src:"public/images/LOGO3.png", id:"idLogo"}, 
	                {src:"public/Background_liste.jpg", id:"idBackgroundListe"},   
	                {src:"public/Background_1.png", id:"idBackground_1"}, 
	                {src:"public/Background_11.png", id:"idBackground_11"},  
	                {src:"public/Background_Dead.png", id:"idBackground_Dead"},
	                {src:"public/Background_Nuit.png", id:"idBackground_Nuit"},
	                {src:"public/images/BackgroundMort.jpg", id:"idBackground_Dead2"},
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
	                {src:"public/map/1.jpg", id:"1"},
	                {src:"public/map/2_a.jpg", id:"2_a"},
	                {src:"public/map/2_b.jpg", id:"2_b"},
	                {src:"public/map/3.jpg", id:"3"},
	                {src:"public/map/4_a.jpg", id:"4_a"},
	                {src:"public/map/4_b.jpg", id:"4_b"},
	                {src:"public/map/4_c.jpg", id:"4_c"},
	                {src:"public/map/4_d.jpg", id:"4_d"},
	                {src:"public/map/5.jpg", id:"5"},
	                {src:"public/map/6.jpg", id:"6"},
	                {src:"public/map/7.jpg", id:"7"},
	                {src:"public/map/8.jpg", id:"8"},
	                {src:"public/map/9_a.jpg", id:"9_a"},
	                {src:"public/map/9_b.jpg", id:"9_b"},
	                {src:"public/map/9_c.jpg", id:"9_c"},
	                {src:"public/map/9_d.jpg", id:"9_d"},
	                {src:"public/map/10.jpg", id:"10"},
	                {src:"public/map/11.jpg", id:"11"},
	                {src:"public/map/12.jpg", id:"12"},
	                {src:"public/map/13.jpg", id:"13"},
	                {src:"public/map/14.jpg", id:"14"},
	                {src:"public/map/15.jpg", id:"15"},
	                {src:"public/map/16_a.jpg", id:"16_a"},
	                {src:"public/map/16_b.jpg", id:"16_b"},
	                {src:"public/map/16_c.jpg", id:"16_c"},
	                {src:"public/map/17_a.jpg", id:"17_a"},
	                {src:"public/map/17_b.jpg", id:"17_b"},
	                {src:"public/map/17_c.jpg", id:"17_c"},
	                {src:"public/map/18_a.jpg", id:"18_a"},
	                {src:"public/map/18_b.jpg", id:"18_b"},
	                {src:"public/map/19_a.jpg", id:"19_a"},
	                {src:"public/map/19_b.jpg", id:"19_b"},
	                {src:"public/map/19_c.jpg", id:"19_c"},
	                {src:"public/map/20.jpg", id:"20"},
	                {src:"public/map/21.jpg", id:"21"},
	                {src:"public/map/22_a.jpg", id:"22_a"},
	                {src:"public/map/22_b.jpg", id:"22_b"},
	                {src:"public/map/23.jpg", id:"23"},
	                {src:"public/map/24.jpg", id:"24"},
	                {src:"public/map/25.jpg", id:"25"},
	                {src:"public/map/26.jpg", id:"26"},
	                {src:"public/map/27.jpg", id:"27"},
	                {src:"public/map/28.jpg", id:"28"},
	                {src:"public/map/29.jpg", id:"29"},
	                {src:"public/map/30.jpg", id:"30"},
	                {src:"public/map/31.jpg", id:"31"},
	                {src:"public/map/32.jpg", id:"32"},
	                {src:"public/map/33.jpg", id:"33"},
	                {src:"public/map/34_a.jpg", id:"34_a"},
	                {src:"public/map/34_b.jpg", id:"34_b"},
	                {src:"public/map/35_a.jpg", id:"35_a"},
	                {src:"public/map/35_b.jpg", id:"35_b"},
	                {src:"public/map/35_c.jpg", id:"35_c"},
	                {src:"public/map/36_a.jpg", id:"36_a"},
	                {src:"public/map/36_b.jpg", id:"36_b"},
	                {src:"public/map/37.jpg", id:"37"},
	                {src:"public/map/38.jpg", id:"38"},
	                {src:"public/map/39.jpg", id:"39"},
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
	                {src:"public/pictos/nbrZombies_plusPetit.png", id:"imgZombies"},
	                {src:"public/pictos/ptsVie.png", id:"imgVie"},
	                {src:"public/pictos/ptsFaim.png", id:"imgFaim"},
	                {src:"public/pictos/ptsAction.png", id:"imgAction"},
	                {src:"public/pictos/ptsMouvement.png", id:"imgMouvement"},
	                {src:"public/pictos/poidsSac.png", id:"imgSac"},
	                {src:"public/pictos/ptsAttaque.png", id:"imgAttaque"},
	                {src:"public/pictos/ptsDef.png", id:"imgDefense"},
	                {src:"public/pictos/probaFouille.png", id:"imgFouille"},
	                {src:"public/pictos/probaCache.png", id:"imgCache"},
	                {src:"public/pictos/nbrNvMsgs.png", id:"imgMsg"},
	                {src:"public/pictos/pseudo.png", id:"imgPseudo"},
	                {src:"public/pictos/competence.png", id:"imgCompetence"},
	                {src:"public/images/attaqueNuit.jpg", id:"imgAttNuit"},
	                {src:"public/images/liste_joueurs.jpg", id:"imgListeJoueur"},
	                {src:"public/pictos/mode.png", id:"imgMode"},
	                {src:"/public/font/Fstein.ttf", id:"policeFstein"}
	                ];

	// Application de l'image de fond pendant le chargement
	backgroundPreload = new createjs.Bitmap("public/Background_1.png");
	backgroundPreload.image.onload = setImg(backgroundPreload, 0, 0);
	backgroundPreload.cursor="wait";
	var colorChargement="#990000";

	imgLogo = new createjs.Bitmap("public/images/LOGO.png");
	imgLogo.scaleX=1;
	imgLogo.scaleY=1;
	var positionLogoX = _CANVAS_LARGEUR - (450)/2 - 50;
	var positionLogoY = - 40 ;
	imgLogo.image.onload = setImg(imgLogo, positionLogoX, positionLogoY);
	imgLogo.cursor="wait";

	// Création d'un label affichant un message pendant le chargement
	loadProgressLabel = stage.addChild(new createjs.Text("","70px Fstein",colorChargement));
	loadProgressLabel.lineWidth = 800;
	loadProgressLabel.textAlign = "center";
	//Centrer le label horizontalement
	loadProgressLabel.x = canvas.width/2;
	loadProgressLabel.y = canvas.height/2 - 80;
	
	// Création d'un second label affichant le pourcentage du chargement
	labelPourcentLoad= stage.addChild(new createjs.Text("","70px Fstein",colorChargement));
	labelPourcentLoad.x=loadProgressLabel.x - 75;
	labelPourcentLoad.y=loadProgressLabel.y+180;

	// Création d'un conteneur pour placer la barre de chargement
	loadingBarContainer = new createjs.Container();
	// Pointeur d'attente lorsque la souris est sur la barre
	loadingBarContainer.cursor="wait";

	// Définition des caractéristiques de la barre
	loadingBarHeight = 80;
	loadingBarWidth = 700;
	LoadingBarColor = createjs.Graphics.getRGB(95,0,0);

	// Création de la barre de chargement en elle même
	loadingBar = new createjs.Shape();
	// Son remplissage 'ici à 0'
	loadingBar.graphics.beginFill(LoadingBarColor).drawRect(0, 0, 1, loadingBarHeight).endFill();

	// Création du contour de la barre de chargement
	frame = new createjs.Shape();
	frameBarColor = createjs.Graphics.getRGB(0,0,0);
	padding = 3;
	// Dessin du contour de la barre
	frame.graphics.setStrokeStyle(1).beginStroke(colorChargement).drawRect(-padding/2, -padding/2, loadingBarWidth+padding, loadingBarHeight+padding);

	// Ajout de la barre de chargement et de son contour dans le conteneur
	loadingBarContainer.addChild(loadingBar, frame);
	// Centrer la barre de chargement (grâce à son conteneur)
	loadingBarContainer.x=canvas.width/2 - loadingBarWidth/2;
	// La placer sous le label de chargement
	loadingBarContainer.y = loadProgressLabel.y + 80;
	// Ajout du conteneur de la barre de chargement au stage du canvas
	stage.addChild(loadingBarContainer);

	// Création de la file d'attente du chargement
	preload = new createjs.LoadQueue(false);
	// Ajout de deux événements
	// Lorsque le chargement est terminé
	preload.addEventListener("complete", handleComplete);
	// Lorsque le chargement est en progression
	preload.addEventListener("progress", handleProgress);

	// On charge la pile avec la variable au format JSON
	preload.loadManifest(manifest);

	// Rafraichissement toutes les 20 ms
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

// Pendant le chargement du canvas
function handleProgress() 
{
	// Remplissage de la barre de chargement
	loadingBar.scaleX = preload.progress * loadingBarWidth;
	
	// Calcul du pourcentage de progression
	var progresPercentage = Math.round(preload.progress*100);
	// Affichage du pourcentage
	loadProgressLabel.text =("Loading Apocalypse");
	labelPourcentLoad.text= progresPercentage + " %";
}

// Une fois le chargement du canvas terminé
function handleComplete() 
{
	// Suppression du label de chargement
	stage.removeChild(labelPourcentLoad);
	// Changement du pointeur de la souris
	backgroundPreload.cursor="pointer";
	loadingBarContainer.cursor="pointer";
	//Affichage d'un nouveau texte
	loadProgressLabel.text = "Click to Survive";
	// Ajout des événements pour démarrer le jeu
	canvas.addEventListener("click", handleClick);
	canvas.addEventListener("touchstart", handleClick);
}

// Click de l'utilisateur après le chargement
function handleClick() {
	// Suppression des outils utilisés pour le chargement
	stage.removeAllChildren();
	// Suppression des événements sur le canvas
	canvas.removeEventListener("click", handleClick);
	canvas.removeEventListener("touchstart", handleClick);
	//Lancement de la connexion
	start();
}

// Lancement de la connexion
function start()
{
	// Lancement du jeu si connexion ok
	if(socket.socket.connected)
		{
		setPlateau();
		}
}

// Mise en place du plateau de jeu
function setPlateau()
{
	// application du background
	var background = new createjs.Bitmap("public/Background_11.png");
	
	background.image.onload = setImg(background, 0, 0);

	// ***************************************************
	// ** Mise en place des différentes zones du canvas **
	// ***************************************************

		stage.addChild(_LABEL_MODIF_PTS_SANTE);
		stage.addChild(_LABEL_MODIF_PTS_FAIM);
		stage.addChild(_LABEL_MODIF_PTS_ACTION);
		stage.addChild(_LABEL_MODIF_PTS_MVT);
		stage.addChild(_LABEL_MODIF_PTS_POIDS);
		

	// - ZONE POUR L'AFFICHAGE DES ITEMS -
		contTousItems = new createjs.Container();
		contTousItems.x = _CANVAS_LARGEUR - (_contMapX);
		contTousItems.y = 0;
		contTousItems.width = _CANVAS_LARGEUR - (_contMapX+_contMapW);
		contTousItems.height = _contMapH;
		stage.addChild(contTousItems);

		var TailleConteneursItems=5*32

		// CONTENEUR DES ITEMS
		for(var i=0; i<6; i++)
		{
			if(i==0)
			{
				TAB_CONT_ITEMS[i]=new createjs.Container();
				TAB_CONT_ITEMS[i].width = TailleConteneursItems;
				TAB_CONT_ITEMS[i].height = 32;
				TAB_CONT_ITEMS[i].x = (contTousItems.width /2) - (TAB_CONT_ITEMS[i].width / 2);
				TAB_CONT_ITEMS[i].y = 32;
				contTousItems.addChild(TAB_CONT_ITEMS[i]);
			}
			else if(i==3)
			{
				TAB_CONT_ITEMS[i]=new createjs.Container();
				TAB_CONT_ITEMS[i].width = TailleConteneursItems;
				TAB_CONT_ITEMS[i].height = 32;
				TAB_CONT_ITEMS[i].x = (contTousItems.width /2) - (TAB_CONT_ITEMS[i].width / 2);
				TAB_CONT_ITEMS[i].y = 65+TAB_CONT_ITEMS[i-1].y;
				contTousItems.addChild(TAB_CONT_ITEMS[i]);
			}
			else
			{
				TAB_CONT_ITEMS[i]=new createjs.Container();
				TAB_CONT_ITEMS[i].width = TailleConteneursItems;
				TAB_CONT_ITEMS[i].height = 32;
				TAB_CONT_ITEMS[i].x = (contTousItems.width /2) - (TAB_CONT_ITEMS[i].width / 2);
				TAB_CONT_ITEMS[i].y = 46+TAB_CONT_ITEMS[i-1].y;
				
				contTousItems.addChild(TAB_CONT_ITEMS[i]);
			}

			/*TAB_SHAPE_ITEMS[i] = new createjs.Shape();
			contTousItems.addChild(TAB_SHAPE_ITEMS[i]);
			TAB_SHAPE_ITEMS[i].graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
					TAB_CONT_ITEMS[i].x, TAB_CONT_ITEMS[i].y, TAB_CONT_ITEMS[i].width, TAB_CONT_ITEMS[i].height);*/
		}

	// - ZONE MESSAGES (retour, description case, dernier message) -
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
		labelDescriptionCase = contZoneMessage.addChild(new createjs.Text("", _POLICE_LABEL, "#CCCCCC"));
		/*labelDescriptionCase.lineHeight = _LineHeight;
		labelDescriptionCase.textBaseline = _TextBaseline;*/
		labelDescriptionCase.x = labelAction.x;
		labelDescriptionCase.y = 2*_EspaceLabelY;

	// - CONTENEURS DES ITEMS EQUIPES -
		contArme = new createjs.Container();
		contArme.x = __CONT_ARMEX;
		contArme.y = __CONT_ARMEY;
		contArme.width = __CONT_ARMEW;
		contArme.height = __CONT_ARMEH;
		stage.addChild(contArme);
		shape2 = new createjs.Shape();
		stage.addChild(shape2);
		shape2.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
				__CONT_ARMEX, __CONT_ARMEY, __CONT_ARMEW, __CONT_ARMEH);

		contArmure = new createjs.Container();
		contArmure.x = _contArmureX;
		contArmure.y = _contArmureY;
		contArmure.width = _contArmureW;
		contArmure.height = _contArmureH;
		stage.addChild(contArmure);
		shape3 = new createjs.Shape();
		stage.addChild(shape3);
		shape3.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
				_contArmureX, _contArmureY, _contArmureW, _contArmureH);

	// conteneur pour les pts d'attaque
		_CONT_PTS_ATTAQUE = new createjs.Container();
		_CONT_PTS_ATTAQUE.x = 203; 
		_CONT_PTS_ATTAQUE.y = 520; 
		_CONT_PTS_ATTAQUE.width = 200;
		_CONT_PTS_ATTAQUE.height = 20;
		stage.addChild(_CONT_PTS_ATTAQUE)

	// conteneur pour les pts de défense
		_CONT_PTS_DEFENSE = new createjs.Container();
		_CONT_PTS_DEFENSE.x = 203; 
		_CONT_PTS_DEFENSE.y = 546; 
		_CONT_PTS_DEFENSE.width = 200;
		_CONT_PTS_DEFENSE.height = 20;
		stage.addChild(_CONT_PTS_DEFENSE)

	// - CONTENEUR MAP -
		contMap = new createjs.Container();
		contMap.x = _contMapX;
		contMap.y = _contMapY;
		contMap.width = _contMapW;
		contMap.height = _contMapH;
		stage.addChild(contMap);
		// Couleur autour de la carte
		shapeMap = new createjs.Shape();
		stage.addChild(shapeMap);
		shapeMap.graphics.setStrokeStyle(2).beginStroke("#405050").drawRect(
			_contMapX-2, _contMapY-2, _contMapW+2, _contMapH+2);
		//contMap.cache(_contMapX, _contMapY, _contMapW, _contMapH);

	// - CONTENEURS BOUTONS AFFICHER PAGE -
		contBtnsListes = new createjs.Container();
		contBtnsListes.x = _contBtnsListesX;
		contBtnsListes.y = _contBtnsListesY;
		contBtnsListes.width = _contBtnsListesW;
		contBtnsListes.height = _contBtnsListesH;
		stage.addChild(contBtnsListes);

	// - CONTENEUR BOUTONS ACTION -
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

	// - CONTENEUR BOUTONS MODE -
		contBtnModes = new createjs.Container();
		contBtnModes.x = 20;
		contBtnModes.y = 40;
		contBtnModes.width = 140;
		contBtnModes.height = 3*_espaceBoutonY;
		contBoutons.addChild(contBtnModes);

	// - CONTENEUR BOUTONS INVENTAIRE PERSONNAGE -
		contBtnsInvPerso = new createjs.Container();
		contBtnsInvPerso.x = contBtnModes.x+_espaceBoutonX;
		contBtnsInvPerso.y = contBtnModes.y;
		contBtnsInvPerso.width = contBtnModes.width;
		contBtnsInvPerso.height = 3*_espaceBoutonY;
		contBoutons.addChild(contBtnsInvPerso);

	// - CONTENEURs BOUNTONS INVENTAIRE CASE -
		contBtnsInvCase = new createjs.Container();
		contBtnsInvCase.x = contBtnModes.x+2*_espaceBoutonX;
		contBtnsInvCase.y = contBtnModes.y;
		contBtnsInvCase.width = contBtnModes.width;
		contBtnsInvCase.height = 2*_espaceBoutonY;
		contBoutons.addChild(contBtnsInvCase);

		contBtnsInvCaseBis = new createjs.Container();
		contBtnsInvCaseBis.x = contBtnModes.x+3*_espaceBoutonX;
		contBtnsInvCaseBis.y = contBtnModes.y;
		contBtnsInvCaseBis.width = contBtnModes.width;
		contBtnsInvCaseBis.height = 2*_espaceBoutonY;
		contBoutons.addChild(contBtnsInvCaseBis);

	// ******************************************
	// ** Création des barres du perso 			*
	// ******************************************

	// - ZONE DES BARRES D'ETAT DU PERSONNAGE - 
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

	// - ZONE PICTOGRAMMES BARRES DU PERSO -
		contPictoBarres = new createjs.Container();
		contPictoBarres.x = lifeBarContainer.x - 40;
		contPictoBarres.y = lifeBarContainer.y - 10;
		contPictoBarres.width = 32;
		contPictoBarres.height = 8*ESPACE_BARRES_Y + 40;
		stage.addChild(contPictoBarres);

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

	// - ZONE PICTOGRAMMES INFO CASE -
		contPictoCase = new createjs.Container();
		contPictoCase.x = 10; // avt : 50
		contPictoCase.y = 65; // avt : 45
		contPictoCase.width = 32;
		contPictoCase.height = 3*ESPACE_BARRES_Y + 40;
		stage.addChild(contPictoCase);

		afficherPictosCase();

		/// NB NOUVEAUX MESSAGES ///
		imgNvMsg = new createjs.Bitmap("public/pictos/nbrNvMsgs.png");
		imgNvMsg.x=contPictoBarres.x - 5; // avt : -2
		imgNvMsg.y= 248;
		stage.addChild(imgNvMsg);
		imgNvMsg.addEventListener('mouseover', function(event)
		{
			x = imgNvMsg.x;
			y = imgNvMsg.y;
			txt = "Nombre de nouveaux messages";
			afficherTooltipItem(x, y, txt, false); 
		});
		imgNvMsg.addEventListener('mouseout', function(event)  { supprimerTooltipItem(); });
		imgNvMsg.addEventListener('touchstart', function(event)				
		{ 
			x = imgNvMsg.x;
			y = imgNvMsg.y;
			txt = "Nombre de nouveaux messages";
			afficherTooltipItem(x, y, txt, false);  
		});
		imgNvMsg.addEventListener('touchend', function(event)   	{ supprimerTooltipItem(); });

	// ******************************************
	// ********* Déclaration des labels *********
	// ******************************************

		// Placement label ItemCase
		var _labelItemCaseX = contTousItems.x + TAB_CONT_ITEMS[3].x + 180;
		var _labelItemCaseY = contTousItems.y + TAB_CONT_ITEMS[3].y - 20;

		// Placement label Description Item
		var _labelDescriptionItemX = contTousItems.x + TAB_CONT_ITEMS[3].x-5;
		var _labelDescriptionItemY = contTousItems.y + TAB_CONT_ITEMS[3].y + 40;

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

		//---------------------------------------

		labelBonusArme = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELSBonus));
		labelBonusArme.lineHeight = _LineHeight;
		labelBonusArme.textBaseline = _TextBaseline;
		labelBonusArme.x = contArme.x - 8;
		labelBonusArme.y = contArme.y + 33;

		labelBonusArmure = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELSBonus));
		labelBonusArmure.lineHeight = _LineHeight;
		labelBonusArmure.textBaseline = _TextBaseline;
		labelBonusArmure.x = contArmure.x - 8;
		labelBonusArmure.y = contArmure.y + 33;

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

	// Affichage des labels forces en présence
		_LABEL_NB_ALLIES = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
		_LABEL_NB_ALLIES.x = contPictoCase.x + 40 ;
		_LABEL_NB_ALLIES.y = contPictoCase.y + 5;
		_LABEL_NB_ALLIES.text="0";

		_LABEL_NB_ENNEMIS = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
		_LABEL_NB_ENNEMIS.x = _LABEL_NB_ALLIES.x;
		_LABEL_NB_ENNEMIS.y = _LABEL_NB_ALLIES.y+35;
		_LABEL_NB_ENNEMIS.text="0";

		_LABEL_NB_GOULES = stage.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
		_LABEL_NB_GOULES.x = _LABEL_NB_ALLIES.x;
		_LABEL_NB_GOULES.y = _LABEL_NB_ALLIES.y+25*2+23; // avt : y*32*2+10
		_LABEL_NB_GOULES.text="0";

	// Affichage des labels de titres
		var _labelTitreMode			 = contBoutons.addChild(new createjs.Text("MODES", _POLICE_TITRE_1, _COULEUR_TITRE));
		var _labelTitreSac			 = contBoutons.addChild(new createjs.Text("SAC", _POLICE_TITRE_1, _COULEUR_TITRE));
		var _labelTitreCase			 = contBoutons.addChild(new createjs.Text("CASE", _POLICE_TITRE_1, _COULEUR_TITRE));
		
		var _labelTitreInventaire    = contTousItems.addChild(new createjs.Text("OBJETS DANS LE  SAC", _POLICE_TITRE_2, _COULEUR_TITRE_2));
		var _labelTitreInventaireE   = contTousItems.addChild(new createjs.Text("EQUIPABLES", _POLICE_TITRE_3, _COULEUR_TITRE_2));
		var _labelTitreInventaireC   = contTousItems.addChild(new createjs.Text("CONSOMMABLES", _POLICE_TITRE_3, _COULEUR_TITRE_2));
		var _labelTitreInventaireD   = contTousItems.addChild(new createjs.Text("DEFENSES", _POLICE_TITRE_3, _COULEUR_TITRE_2));
		
		var _labelTitreObjetsCase    = contTousItems.addChild(new createjs.Text("OBJETS DANS LA CASE", _POLICE_TITRE_2, _COULEUR_TITRE_2));
		var _labelTitreObjetsCaseE   = contTousItems.addChild(new createjs.Text("EQUIPABLES", _POLICE_TITRE_3, _COULEUR_TITRE_2));
		var _labelTitreObjetsCaseC   = contTousItems.addChild(new createjs.Text("CONSOMMABLES", _POLICE_TITRE_3, _COULEUR_TITRE_2));
		var _labelTitreObjetsCaseD   = contTousItems.addChild(new createjs.Text("DEFENSES", _POLICE_TITRE_3, _COULEUR_TITRE_2));
		
		var _labelTitreForces   	 = stage.addChild(new createjs.Text("FORCES EN PRESENCE", _POLICE_TITRE_2, _COULEUR_TITRE_2));

		_labelTitreMode.x 		= contBtnModes.x + 45;
		_labelTitreMode.y 		= contBtnModes.y - 30;
		_labelTitreSac.x 		= contBtnsInvPerso.x + 55;
		_labelTitreSac.y 		= contBtnsInvPerso.y - 30;
		_labelTitreCase.x 		= contBtnsInvCase.x + 125;
		_labelTitreCase.y 		= contBtnsInvCase.y - 30;

		_labelTitreInventaire.x  = 10;
		_labelTitreInventaire.y  = 5;
		_labelTitreInventaireE.x = TAB_CONT_ITEMS[0].x-10 // + 30;
		_labelTitreInventaireE.y = TAB_CONT_ITEMS[0].y-10 //- 15;
		_labelTitreInventaireC.x = TAB_CONT_ITEMS[1].x-10 //+ 10;
		_labelTitreInventaireC.y = TAB_CONT_ITEMS[1].y-12 //- 15;
		_labelTitreInventaireD.x = TAB_CONT_ITEMS[2].x-10 //+ 40;
		_labelTitreInventaireD.y = TAB_CONT_ITEMS[2].y-12//- 15;

		_labelTitreObjetsCase.x  = _labelTitreInventaire.x;
		_labelTitreObjetsCase.y  = TAB_CONT_ITEMS[3].y - 30;
		_labelTitreObjetsCaseE.x = TAB_CONT_ITEMS[3].x-10 //+ 30;
		_labelTitreObjetsCaseE.y = TAB_CONT_ITEMS[3].y-10 //- 15;
		_labelTitreObjetsCaseC.x = TAB_CONT_ITEMS[4].x-10 //+ 10;
		_labelTitreObjetsCaseC.y = TAB_CONT_ITEMS[4].y-10 //- 15;
		_labelTitreObjetsCaseD.x = TAB_CONT_ITEMS[5].x-10 //+ 40;
		_labelTitreObjetsCaseD.y = TAB_CONT_ITEMS[5].y-10 //- 15;

		_labelTitreForces.x = 5;
		_labelTitreForces.y = 45;

	// ******************************************
	// ** Création des boutons de déplacement ***
	// ******************************************
		var Up = stage.addChild(new createjs.Bitmap("public/Boutons/Up.png"));
		Up.x= _contMapX + _contMapW/2 - _TAILLE_IMAGE_FLECHE/2;
		Up.y = 0;
		Up.addEventListener('click', function(event) {
			socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
		});
		Up.addEventListener('touchstart', function(event) {
			socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
		});

		var Down = stage.addChild(new createjs.Bitmap("public/Boutons/Down.png"));
		Down.x = _contMapX+ _contMapW/2 - _TAILLE_IMAGE_FLECHE/2;
		Down.y = _contMapY + _contMapH - _TAILLE_IMAGE_FLECHE;
		Down.addEventListener('click', function(event) {
			socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
		});
		Down.addEventListener('touchstart', function(event) {
			socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
		});

		var Left = stage.addChild(new createjs.Bitmap("public/Boutons/Left.png"));
		Left.x = _contMapX;
		Left.y = _contMapY + _contMapH/2 - _TAILLE_IMAGE_FLECHE/2;
		Left.addEventListener('click', function(event) {
			socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
		});
		Down.addEventListener('touchstart', function(event) {
			socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
		});

		var Right = stage.addChild(new createjs.Bitmap("public/Boutons/Right.png"));
		Right.x = _contMapX + _contMapW - _TAILLE_IMAGE_FLECHE;
		Right.y = _contMapY + _contMapH/2 - _TAILLE_IMAGE_FLECHE/2;
		Right.addEventListener('click', function(event) {
			socket.emit('MOVE_PERSONNAGE_CS', 'EST');
		});
		Down.addEventListener('touchstart', function(event) {
			socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
		});

		Up.cursor=Down.cursor=Left.cursor=Right.cursor="pointer";

	// ********************************************************
	// ** Création des boutons Flèches pour les pages items ***
	// ********************************************************
		
		Btn_PAGE_ITEM_CASE_EQUIPRight = contTousItems.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
		Btn_PAGE_ITEM_CASE_EQUIPRight.x= TAB_CONT_ITEMS[3].x  + TAB_CONT_ITEMS[3].width;
		Btn_PAGE_ITEM_CASE_EQUIPRight.y= TAB_CONT_ITEMS[3].y + 5;
		Btn_PAGE_ITEM_CASE_EQUIPRight.visible=false;
		Btn_PAGE_ITEM_CASE_EQUIPRight.addEventListener('click', function(event) {
			_PAGE_ITEM_CASE_EQUIP++;
			socket.emit('INFO_CASE_CS');
		});
		Btn_PAGE_ITEM_CASE_EQUIPRight.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_CASE_EQUIP++;
			socket.emit('INFO_CASE_CS');
		});

		Btn_PAGE_ITEM_CASE_EQUIPLeft = contTousItems.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
		Btn_PAGE_ITEM_CASE_EQUIPLeft.x= TAB_CONT_ITEMS[3].x - 30;
		Btn_PAGE_ITEM_CASE_EQUIPLeft.y= TAB_CONT_ITEMS[3].y + 5;
		Btn_PAGE_ITEM_CASE_EQUIPLeft.visible=false;
		Btn_PAGE_ITEM_CASE_EQUIPLeft.addEventListener('click', function(event) {
			_PAGE_ITEM_CASE_EQUIP--;
			socket.emit('INFO_CASE_CS');
		});
		Btn_PAGE_ITEM_CASE_EQUIPLeft.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_CASE_EQUIP--;
			socket.emit('INFO_CASE_CS');
		});

		Btn_PAGE_ITEM_CASE_CONSORight = contTousItems.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
		Btn_PAGE_ITEM_CASE_CONSORight.x= TAB_CONT_ITEMS[4].x  + TAB_CONT_ITEMS[4].width;
		Btn_PAGE_ITEM_CASE_CONSORight.y= TAB_CONT_ITEMS[4].y + 5;
		Btn_PAGE_ITEM_CASE_CONSORight.visible=false;
		Btn_PAGE_ITEM_CASE_CONSORight.addEventListener('click', function(event) {
			_PAGE_ITEM_CASE_CONSO++;
			socket.emit('INFO_CASE_CS');

		});
		Btn_PAGE_ITEM_CASE_CONSORight.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_CASE_CONSO++;
			socket.emit('INFO_CASE_CS');

		});

		Btn_PAGE_ITEM_CASE_CONSOLeft= contTousItems.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
		Btn_PAGE_ITEM_CASE_CONSOLeft.x= TAB_CONT_ITEMS[4].x - 30;
		Btn_PAGE_ITEM_CASE_CONSOLeft.y= TAB_CONT_ITEMS[4].y + 5;
		Btn_PAGE_ITEM_CASE_CONSOLeft.visible=false;
		Btn_PAGE_ITEM_CASE_CONSOLeft.addEventListener('click', function(event) {
			_PAGE_ITEM_CASE_CONSO--;
			socket.emit('INFO_CASE_CS');
		});
		Btn_PAGE_ITEM_CASE_CONSOLeft.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_CASE_CONSO--;
			socket.emit('INFO_CASE_CS');
		});

		Btn_PAGE_ITEM_CASE_ODDRight = contTousItems.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
		Btn_PAGE_ITEM_CASE_ODDRight.x= TAB_CONT_ITEMS[5].x  + TAB_CONT_ITEMS[5].width;
		Btn_PAGE_ITEM_CASE_ODDRight.y= TAB_CONT_ITEMS[5].y + 5;
		Btn_PAGE_ITEM_CASE_ODDRight.visible=false;
		Btn_PAGE_ITEM_CASE_ODDRight.addEventListener('click', function(event) {
			_PAGE_ITEM_CASE_ODD++;
			socket.emit('INFO_CASE_CS');

		});
		Btn_PAGE_ITEM_CASE_ODDRight.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_CASE_ODD++;
			socket.emit('INFO_CASE_CS');

		});

		Btn_PAGE_ITEM_CASE_ODDLeft= contTousItems.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
		Btn_PAGE_ITEM_CASE_ODDLeft.x= TAB_CONT_ITEMS[5].x - 30;
		Btn_PAGE_ITEM_CASE_ODDLeft.y= TAB_CONT_ITEMS[5].y + 5;
		Btn_PAGE_ITEM_CASE_ODDLeft.visible=false;
		Btn_PAGE_ITEM_CASE_ODDLeft.addEventListener('click', function(event) {
			_PAGE_ITEM_CASE_ODD--;
			socket.emit('INFO_CASE_CS');
		});
		Btn_PAGE_ITEM_CASE_ODDLeft.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_CASE_ODD--;
			socket.emit('INFO_CASE_CS');
		});

		Btn_PAGE_ITEM_PERSO_EQUIPRight = contTousItems.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
		Btn_PAGE_ITEM_PERSO_EQUIPRight.x= TAB_CONT_ITEMS[0].x  + TAB_CONT_ITEMS[0].width;
		Btn_PAGE_ITEM_PERSO_EQUIPRight.y= TAB_CONT_ITEMS[0].y + 5;
		Btn_PAGE_ITEM_PERSO_EQUIPRight.visible=false;
		Btn_PAGE_ITEM_PERSO_EQUIPRight.addEventListener('click', function(event) {
			_PAGE_ITEM_PERSO_EQUIP++;
			socket.emit('INFO_PERSONNAGE_CS');
		});
		Btn_PAGE_ITEM_PERSO_EQUIPRight.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_PERSO_EQUIP++;
			socket.emit('INFO_PERSONNAGE_CS');
		});

		Btn_PAGE_ITEM_PERSO_EQUIPLeft = contTousItems.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
		Btn_PAGE_ITEM_PERSO_EQUIPLeft.x= TAB_CONT_ITEMS[0].x - 30;
		Btn_PAGE_ITEM_PERSO_EQUIPLeft.y= TAB_CONT_ITEMS[0].y + 5;
		Btn_PAGE_ITEM_PERSO_EQUIPLeft.visible=false;
		Btn_PAGE_ITEM_PERSO_EQUIPLeft.addEventListener('click', function(event) {
			_PAGE_ITEM_PERSO_EQUIP--;
			socket.emit('INFO_PERSONNAGE_CS');
		});
		Btn_PAGE_ITEM_PERSO_EQUIPLeft.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_PERSO_EQUIP--;
			socket.emit('INFO_PERSONNAGE_CS');
		});

		Btn_PAGE_ITEM_PERSO_CONSORight = contTousItems.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
		Btn_PAGE_ITEM_PERSO_CONSORight.x= TAB_CONT_ITEMS[1].x  + TAB_CONT_ITEMS[1].width;
		Btn_PAGE_ITEM_PERSO_CONSORight.y= TAB_CONT_ITEMS[1].y + 5;
		Btn_PAGE_ITEM_PERSO_CONSORight.visible=false;
		Btn_PAGE_ITEM_PERSO_CONSORight.addEventListener('click', function(event) {
			_PAGE_ITEM_PERSO_CONSO++;
			socket.emit('INFO_PERSONNAGE_CS');

		});
		Btn_PAGE_ITEM_PERSO_CONSORight.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_PERSO_CONSO++;
			socket.emit('INFO_PERSONNAGE_CS');

		});

		Btn_PAGE_ITEM_PERSO_CONSOLeft= contTousItems.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
		Btn_PAGE_ITEM_PERSO_CONSOLeft.x= TAB_CONT_ITEMS[1].x - 30;
		Btn_PAGE_ITEM_PERSO_CONSOLeft.y= TAB_CONT_ITEMS[1].y + 5;
		Btn_PAGE_ITEM_PERSO_CONSOLeft.visible=false;
		Btn_PAGE_ITEM_PERSO_CONSOLeft.addEventListener('click', function(event) {
			_PAGE_ITEM_PERSO_CONSO--;
			socket.emit('INFO_PERSONNAGE_CS');
		});
		Btn_PAGE_ITEM_PERSO_CONSOLeft.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_PERSO_CONSO--;
			socket.emit('INFO_PERSONNAGE_CS');
		});

		Btn_PAGE_ITEM_PERSO_ODDRight = contTousItems.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
		Btn_PAGE_ITEM_PERSO_ODDRight.x= TAB_CONT_ITEMS[2].x  + TAB_CONT_ITEMS[2].width;
		Btn_PAGE_ITEM_PERSO_ODDRight.y= TAB_CONT_ITEMS[2].y + 5;
		Btn_PAGE_ITEM_PERSO_ODDRight.visible=false;
		Btn_PAGE_ITEM_PERSO_ODDRight.addEventListener('click', function(event) {
			_PAGE_ITEM_PERSO_ODD++;
			socket.emit('INFO_PERSONNAGE_CS');

		});
		Btn_PAGE_ITEM_PERSO_ODDRight.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_PERSO_ODD++;
			socket.emit('INFO_PERSONNAGE_CS');

		});

		Btn_PAGE_ITEM_PERSO_ODDLeft= contTousItems.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
		Btn_PAGE_ITEM_PERSO_ODDLeft.x= TAB_CONT_ITEMS[2].x - 30;
		Btn_PAGE_ITEM_PERSO_ODDLeft.y= TAB_CONT_ITEMS[2].y + 5;
		Btn_PAGE_ITEM_PERSO_ODDLeft.visible=false;
		Btn_PAGE_ITEM_PERSO_ODDLeft.addEventListener('click', function(event) {
			_PAGE_ITEM_PERSO_ODD--;
			socket.emit('INFO_PERSONNAGE_CS');
		});
		Btn_PAGE_ITEM_PERSO_ODDLeft.addEventListener('touchstart', function(event) {
			_PAGE_ITEM_PERSO_ODD--;
			socket.emit('INFO_PERSONNAGE_CS');
		});

		Btn_PAGE_ITEM_CASE_EQUIPRight.cursor=Btn_PAGE_ITEM_CASE_EQUIPLeft.cursor=Btn_PAGE_ITEM_CASE_CONSORight.cursor=Btn_PAGE_ITEM_CASE_CONSOLeft.cursor=Btn_PAGE_ITEM_CASE_ODDRight.cursor=Btn_PAGE_ITEM_CASE_ODDLeft.cursor="pointer";
		Btn_PAGE_ITEM_PERSO_EQUIPRight.cursor=Btn_PAGE_ITEM_PERSO_EQUIPLeft.cursor=Btn_PAGE_ITEM_PERSO_CONSORight.cursor=Btn_PAGE_ITEM_PERSO_CONSOLeft.cursor=Btn_PAGE_ITEM_PERSO_ODDRight.cursor=Btn_PAGE_ITEM_PERSO_ODDLeft.cursor="pointer";

	// ******************************************
	// *********** INITIALISATION ***************
	// ******************************************
	socket.emit('GET_DATE_CS');
	game();
}

// Lancement du jeu
function game() 
{	
	// Initialisation des informations
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
}

/* Pour les fonctions suivantes :
	//// page... 		: Afficher une page sur le canvas
	//// afficher...	: Affichage non permanent (avec temporisation)
	//// maj... 		: Mise à jour d'une information ou d'un objet graphique
	//// set...			: Positionne un Objet graphique
	//// define...		: Définit une valeur
	//// animation...	: Animation graphique d'un élément
*/

// Page des messages recus
function pageMessages()
{
	// Si la page de la liste de messages a déjà été ouverte, on supprime tout son contenu, afin de ne pas réécrire dessus.
	if(contMessage!=null)
	{
		contMessage.removeAllChildren();
	}

	var nbMsgAffiches=14;
	var coul=createjs.Graphics.getRGB(0,0,0, 0.5);

	contMessage = new createjs.Container();
	contMessage.x = _contMapX;
	contMessage.y = _contMapY;
	contMessage.width = _contMapW;
	contMessage.height = _contMapH;
	stage.addChild(contMessage);
	/*shapeMessage = new createjs.Shape();
	stage.addChild(shapeMessage);
	shapeMessage.graphics.setStrokeStyle(2).beginStroke("#006600").drawRect(
			contMessage.x-2, contMessage.y-2, contMessage.width+2, contMessage.height+2);*/

	var background_message = new createjs.Bitmap("public/Background_liste.jpg");
	contMessage.addChild(background_message);

	labelMessage = contMessage.addChild(new createjs.Text("", _POLICE_MESSAGES, _COULEUR_LABELS));
	labelMessage.lineHeight = _LineHeight;
	labelMessage.textBaseline = _TextBaseline;
	labelMessage.x = 20;
	labelMessage.y = 50;

	/*var BtnValideMsg = new createjs.Bitmap("public/Boutons/Ok.png");
	BtnValideMsg.x=450;
	BtnValideMsg.y=260;
	contMessage.addChild(BtnValideMsg);
	BtnValideMsg.addEventListener('click', function(event) {
		socket.emit('ACCUSE_LECTURE_MSG_CS');
		stage.removeChild(contMessage);
		_PAGE_LISTE_MESSAGES=!_PAGE_LISTE_MESSAGES;
		game();
	});
	BtnValideMsg.addEventListener('touchstart', function(event) {
		socket.emit('ACCUSE_LECTURE_MSG_CS');
		stage.removeChild(contMessage);
		_PAGE_LISTE_MESSAGES=!_PAGE_LISTE_MESSAGES;
		game();
	});
	BtnValideMsg.cursor="pointer";*/

	var epaisseur=45;

	barreMessageUp = new createjs.Shape();
	contMessage.addChild(barreMessageUp);
	barreMessageUp.graphics.beginFill(coul).drawRect(0, 0, contMessage.width, epaisseur).endFill();

	barreMessageDown = new createjs.Shape();
	contMessage.addChild(barreMessageDown);
	barreMessageDown.graphics.beginFill(coul).drawRect(0, contMessage.height-epaisseur, contMessage.width, epaisseur).endFill();

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

	majBtnMessage(TabListe, Taille);
	afficherMessage(TabListe);
}

// Fonction permettant de bien afficher les messages
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
}

function afficherPictosCase()
{
	var y = contPictoCase.y ;
	var x = contPictoCase.x + 100;
	/// ALLIES ///
		imgAllies = new createjs.Bitmap("public/pictos/nbrAllie.png");
		imgAllies.y=0;
		contPictoCase.addChild(imgAllies);
		imgAllies.addEventListener('mouseover', function(event)
		{
			y = contPictoCase.y - imgAllies.y;
			txt = "Nombre d'alliés dans la case";
			afficherTooltipItem(x, y, txt, false); 
		});
		imgAllies.addEventListener('mouseout', function(event)  { supprimerTooltipItem(); });
		imgAllies.addEventListener('touchstart', function(event)				
		{ 
			y = contPictoCase.y - imgAllies.y;
			txt = "Nombre d'alliés dans la case";
			afficherTooltipItem(x, y, txt, false);  
		});
		imgAllies.addEventListener('touchend', function(event)   	{ supprimerTooltipItem(); });
		
		/// ENNEMIS ///
		imgEnnemis = new createjs.Bitmap("public/pictos/nbrEnnemis.png");
		imgEnnemis.y=32;
		contPictoCase.addChild(imgEnnemis);
		imgEnnemis.addEventListener('mouseover', function(event)
		{
			y = contPictoCase.y + imgEnnemis.y;
			txt = "Nombre d'ennemis dans la case";
			afficherTooltipItem(x, y, txt, false); 
		});
		imgEnnemis.addEventListener('mouseout', function(event)  { supprimerTooltipItem(); });
		imgEnnemis.addEventListener('touchstart', function(event)				
		{ 
			y = contPictoCase.y + imgEnnemis.y;
			txt = "Nombre d'ennemis dans la case";
			afficherTooltipItem(x, y, txt, false);  
		});
		imgEnnemis.addEventListener('touchend', function(event)   	{ supprimerTooltipItem(); });

		/// ZOMBIES ///
		imgZombies = new createjs.Bitmap("public/pictos/nbrZombies_plusPetit.png");
		imgZombies.x=2; // avt : -2
		imgZombies.y=33*2+4;
		contPictoCase.addChild(imgZombies);
		imgZombies.addEventListener('mouseover', function(event)
		{
			y = contPictoCase.y + imgZombies.y;
			txt = "Nombre de zombies dans la case";
			afficherTooltipItem(x, y, txt, false); 
		});
		imgZombies.addEventListener('mouseout', function(event)  { supprimerTooltipItem(); });
		imgZombies.addEventListener('touchstart', function(event)				
		{ 
			y = contPictoCase.y + imgZombies.y;
			txt = "Nombre de zombies dans la case";
			afficherTooltipItem(x, y, txt, false);  
		});
		imgZombies.addEventListener('touchend', function(event)   	{ supprimerTooltipItem(); });
}

// Afficher la description de la case en cours
function majDesCase(desc)
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
}

// Afficher la description de l'item courant
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
}

// Afficher la description de l'item courant
function afficherNomCase(desc)
{
	var longLigneMax=20;
	var tailleDesc = desc.length;
	try 
	{
		// instructions à essayer
		for (var i = 0; i < desc.length; i+=longLigneMax) 
		{
			tailleDesc-=longLigneMax;
			var message=desc.substring(i,i+longLigneMax);
			if((tailleDesc<=0 && i>longLigneMax) || desc.length<longLigneMax)
			{
				labelCaseEnCours.text+=message;
			}
			else
			{
				labelCaseEnCours.text+=message + "-\n";
			}
			
		}
	}
	catch(e){}
}

// Afficher la page des personnages dans la case
function pagePersonnages()
{
	// Si la page de la liste des joueurs a déjà été ouverte, on supprime tout son contenu
	if(contListe!=null)
	{
		contListe.removeAllChildren();
	}

	contListe = new createjs.Container();
	contListe.x = _contMapX;
	contListe.y = _contMapY;
	contListe.width = _contMapW;
	contListe.height = _contMapH;
	stage.addChild(contListe);

	socket.emit('INFO_CASE_ALLIES_CS');
	socket.emit('INFO_CASE_ENNEMIS_CS');

	var nbrPersos=8;

	
	/*shape6 = new createjs.Shape();
	stage.addChild(shape6);
	shape6.graphics.setStrokeStyle(2).beginStroke("#999900").drawRect(
			contListe.x-2, contListe.y-2, contListe.width+2, contListe.height+2);*/

	var background_liste = new createjs.Bitmap("public/images/liste_joueurs.jpg");
	background_liste.alpha=1;
	contListe.addChild(background_liste);

	labelAlliesListe = contListe.addChild(new createjs.Text("", _POLICE_LABEL, _COLOR_LISTES));
	labelAlliesListe.lineHeight = _LineHeight;
	labelAlliesListe.textBaseline = _TextBaseline;
	labelAlliesListe.x = 20;
	labelAlliesListe.y = 6;
	labelAlliesListe.text="Liste des Alliés :";

	//Conteneur des ALLIES
	contListeAllies = new createjs.Container();
	contListeAllies.width = nbrPersos*64;
	contListeAllies.x = contListe.width/2 - contListeAllies.width/2;
	contListeAllies.y = labelAlliesListe.y + 20;
	contListeAllies.height = 70;
	contListe.addChild(contListeAllies);
	/*shape7 = new createjs.Shape();
	contListe.addChild(shape7);
	shape7.graphics.setStrokeStyle(1).beginStroke("#ff0000").drawRect(
			contListeAllies.x, contListeAllies.y, contListeAllies.width, contListeAllies.height);*/

	labelEnnemisListe1 = contListe.addChild(new createjs.Text("", _POLICE_LABEL, _COLOR_LISTES));
	labelEnnemisListe1.lineHeight = _LineHeight;
	labelEnnemisListe1.textBaseline = _TextBaseline;
	labelEnnemisListe1.x = 20;
	labelEnnemisListe1.y = contListeAllies.y + contListeAllies.height + 6;

	//Conteneur des ENNEMIS
	contListeEnnemis1 = new createjs.Container();
	contListeEnnemis1.width = nbrPersos*64;
	contListeEnnemis1.x = contListeAllies.x;
	contListeEnnemis1.y = labelEnnemisListe1.y + 20;
	contListeEnnemis1.height = 70;
	contListe.addChild(contListeEnnemis1);
	/*shape8 = new createjs.Shape();
	contListe.addChild(shape8);
	shape8.graphics.setStrokeStyle(1).beginStroke("#00ff00").drawRect(
			contListeEnnemis1.x, contListeEnnemis1.y, contListeEnnemis1.width, contListeEnnemis1.height);*/

	labelEnnemisListe2 = contListe.addChild(new createjs.Text("", _POLICE_LABEL, _COLOR_LISTES));
	labelEnnemisListe2.lineHeight = _LineHeight;
	labelEnnemisListe2.textBaseline = _TextBaseline;
	labelEnnemisListe2.x = 20;
	labelEnnemisListe2.y = contListeEnnemis1.y + contListeAllies.height + 6;

	//Conteneur des ENNEMIS
	contListeEnnemis2 = new createjs.Container();
	contListeEnnemis2.width = nbrPersos*64;
	contListeEnnemis2.x = contListeAllies.x;
	contListeEnnemis2.y = labelEnnemisListe2.y + 20;
	contListeEnnemis2.height = 70;
	contListe.addChild(contListeEnnemis2);
	/*shape9 = new createjs.Shape();
	contListe.addChild(shape9);
	shape9.graphics.setStrokeStyle(1).beginStroke("#0000ff").drawRect(
			contListeEnnemis2.x, contListeEnnemis2.y, contListeEnnemis2.width, contListeEnnemis2.height);*/

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

	Btn_PAGE_PERSO_ENN_1_Right = new createjs.Bitmap("public/Boutons/Right.png");
	Btn_PAGE_PERSO_ENN_1_Right.x= contListeEnnemis1.x + contListeEnnemis1.witdh;
	Btn_PAGE_PERSO_ENN_1_Right.y= contListeEnnemis1.y + 8;
	Btn_PAGE_PERSO_ENN_1_Right.visible=false;
	contListe.addChild(Btn_PAGE_PERSO_ENN_1_Right);
	Btn_PAGE_PERSO_ENN_1_Right.addEventListener('click', function(event) {
		_PAGE_PERSO_ENN_1++;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});
	Btn_PAGE_PERSO_ENN_1_Right.addEventListener('touchstart', function(event) {
		_PAGE_PERSO_ENN_1++;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	Btn_PAGE_PERSO_ENN_1_Left = new createjs.Bitmap("public/Boutons/Left.png");
	Btn_PAGE_PERSO_ENN_1_Left.x= contListeEnnemis1.x - Btn_PAGE_PERSO_ENN_1_Left.image.width - 5;
	Btn_PAGE_PERSO_ENN_1_Left.y= contListeEnnemis1.y +  8;
	Btn_PAGE_PERSO_ENN_1_Left.visible=false;
	contListe.addChild(Btn_PAGE_PERSO_ENN_1_Left);
	Btn_PAGE_PERSO_ENN_1_Left.addEventListener('click', function(event) {
		_PAGE_PERSO_ENN_1--;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});
	Btn_PAGE_PERSO_ENN_1_Left.addEventListener('touchstart', function(event) {
		_PAGE_PERSO_ENN_1--;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	Btn_PAGE_PERSO_ENN_2_Right = new createjs.Bitmap("public/Boutons/Right.png");
	Btn_PAGE_PERSO_ENN_2_Right.x= contListeEnnemis1.x + contListeEnnemis1.witdh;
	Btn_PAGE_PERSO_ENN_2_Right.y= contListeEnnemis1.y + 8;
	Btn_PAGE_PERSO_ENN_2_Right.visible=false;
	contListe.addChild(Btn_PAGE_PERSO_ENN_2_Right);
	Btn_PAGE_PERSO_ENN_2_Right.addEventListener('click', function(event) {
		_PAGE_PERSO_ENN_2++;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});
	Btn_PAGE_PERSO_ENN_2_Right.addEventListener('touchstart', function(event) {
		_PAGE_PERSO_ENN_2++;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	Btn_PAGE_PERSO_ENN_2_Left = new createjs.Bitmap("public/Boutons/Left.png");
	Btn_PAGE_PERSO_ENN_2_Left.x= contListeEnnemis2.x - Btn_PAGE_PERSO_ENN_2_Left.image.width - 5;
	Btn_PAGE_PERSO_ENN_2_Left.y= contListeEnnemis2.y +  8;
	Btn_PAGE_PERSO_ENN_2_Left.visible=false;
	contListe.addChild(Btn_PAGE_PERSO_ENN_2_Left);
	Btn_PAGE_PERSO_ENN_2_Left.addEventListener('click', function(event) {
		_PAGE_PERSO_ENN_2--;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});
	Btn_PAGE_PERSO_ENN_2_Left.addEventListener('touchstart', function(event) {
		_PAGE_PERSO_ENN_2--;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	// Bouton ANNULER
	/*BtnCancelListe = new createjs.Bitmap("public/Boutons/Retour.png");
	BtnCancelListe.x=450;
	BtnCancelListe.y=260;
	contListe.addChild(BtnCancelListe);
	BtnCancelListe.addEventListener('click', function (event) {
		_SELECTED_PERSO=-1;
		stage.removeChild(contListe);
		_PAGE_JOUEURS=!_PAGE_JOUEURS;
		game();
	});
	BtnCancelListe.addEventListener('touchstart', function (event) {
		_SELECTED_PERSO=-1;
		stage.removeChild(contListe);
		_PAGE_JOUEURS=!_PAGE_JOUEURS;
		game();
	});*/

	majBtnAttaquer(_contMapW - 134, _contMapH -45);

	//BtnCancelListe.cursor="pointer";
	Btn_PAGE_PERSO_ALLIESRight.cursor=Btn_PAGE_PERSO_ALLIESLeft.cursor="pointer";
	Btn_PAGE_PERSO_ENN_1_Right.cursor=Btn_PAGE_PERSO_ENN_1_Left.cursor="pointer";
	Btn_PAGE_PERSO_ENN_2_Right.cursor=Btn_PAGE_PERSO_ENN_2_Left.cursor="pointer";
}

// Afficher la page qui prévient de l'attaque de nuit
function pageAttaqueDeNuit()
{
	// On vide le canvas
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
	var background_nuit = new createjs.Bitmap("public/images/attaqueNuit.jpg");
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

// Afficher la page lorsque le joueur est mort
function pageMortPersonnage(currentPerso) 
{
	_ECRAN_MORT = true;
	_START=false;
	//On vide le canvas
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
	var background_dead = new createjs.Bitmap("public/images/BackgroundMort.jpg");
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
	labelDeadByWho.x=225;
	labelDeadByWho.y=74;
	
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

function majBtnMessage(TabListeMessage, Taille)
{

	// Création des boutons
	Btn_PAGE_MESSAGESDown = new createjs.Bitmap("public/Boutons/Down.png");
	Btn_PAGE_MESSAGESDown.x= contMessage.width/2 - _TAILLE_IMAGE_FLECHE/2;
	Btn_PAGE_MESSAGESDown.y= contMessage.height - _TAILLE_IMAGE_FLECHE;
	contMessage.addChild(Btn_PAGE_MESSAGESDown);
	Btn_PAGE_MESSAGESDown.addEventListener('click', function(event) {
		_PAGE_MESSAGES++;
		majBtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});
	Btn_PAGE_MESSAGESDown.addEventListener('touchstart', function(event) {
		_PAGE_MESSAGES++;
		majBtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});

	Btn_PAGE_MESSAGESUp = new createjs.Bitmap("public/Boutons/Up.png");
	Btn_PAGE_MESSAGESUp.x= contMessage.width/2 - _TAILLE_IMAGE_FLECHE/2;
	Btn_PAGE_MESSAGESUp.y=0;
	contMessage.addChild(Btn_PAGE_MESSAGESUp);
	Btn_PAGE_MESSAGESUp.addEventListener('click', function(event) {
		_PAGE_MESSAGES--;
		majBtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});
	Btn_PAGE_MESSAGESUp.addEventListener('touchstart', function(event) {
		_PAGE_MESSAGES--;
		majBtnMessageVisible(Taille);
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

function majBtnMessageVisible(Taille)
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

function majBtnAttaquer(x,y)
{
	if (_SELECTED_PERSO != -1)
	{
		// Bouton ATTAQUER
		var BtnAttaquerListe = new createjs.Bitmap("public/Boutons/Attaquer.png");
		BtnAttaquerListe.x=x;
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
				pagePersonnages();
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
				pagePersonnages();
			}
		});
		BtnAttaquerListe.cursor="pointer";
	}
	else
	{
		// Bouton ATTAQUER
		var BtnAttaquerListe = new createjs.Bitmap("public/Boutons/AttaquerGris.png");
		BtnAttaquerListe.x=x;
		BtnAttaquerListe.y=y;
		contListe.addChild(BtnAttaquerListe);
		BtnAttaquerListe.cursor="not-allowed";
	}
}

function majBtnsItemPerso()
{
	contBtnsInvPerso.removeChild(BtnUtiliser, BtnEquiper);
	contBtnsInvCase.removeChild(BtnDeposer);
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

function majBtnDesequiper()
{
	contBtnsInvPerso.removeChild(BtnDesequiper);
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

function majBtnRamasser()
{
	contBtnsInvCase.removeChild(BtnRamasseObjet);
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
			if (_SELECTED_ITEM_CASE == -1)			{
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
}

function majBtnJoueurs(nbJoueurs)
{
	contBtnsListes.removeChild(BtnJoueurs);
	if(nbJoueurs>0)
	{
		var BtnJoueurs = new createjs.Bitmap("public/Boutons/Joueurs.png");
		BtnJoueurs.y=0;
		contBtnsListes.addChild(BtnJoueurs);
		BtnJoueurs.addEventListener('click', function(event) 
		{
			if(_PAGE_JOUEURS == false)
			{
				afficherPageJoueurs();
			}
			else
			{
				supprimerPageJoueurs();
			}
		});	
		BtnJoueurs.addEventListener('touchstart', function(event) 
		{
			if(_PAGE_JOUEURS == false)
			{
				afficherPageJoueurs();
			}
			else
			{
				supprimerPageJoueurs();
			}
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

function majBoutonMessages(currentPerso)
{
	contBtnsListes.removeChild(BtnMessages);
	// ********* AFFICHAGE DERNIER MESSAGE *********/
	if(currentPerso.listeMsgAtt.length > 0)
	{
		_listeMessages=currentPerso.listeMsgAtt;
		// inverse la liste des messages
		_listeMessages.reverse();
		labelDernierMessage.text=_listeMessages[0];
	}
	else
	{
		labelDernierMessage.text="";
		_listeMessages=null;
	}

	if(_listeMessages!=null && currentPerso.nbrNvMsg >0)
	{
		labelNombreNouvMsg.text="";
		labelNombreNouvMsg.text=(currentPerso.nbrNvMsg);

		var BtnMessages = new createjs.Bitmap("public/Boutons/Messages.png");
		BtnMessages.y=_espaceBoutonY;
		contBtnsListes.addChild(BtnMessages);
		BtnMessages.addEventListener('click', function(event) {
			if(_PAGE_LISTE_MESSAGES == false)
			{
				afficherPageMessage();
			}
			else
			{
				socket.emit('ACCUSE_LECTURE_MSG_CS');
				supprimerPageMessage();
			}
		});
		BtnMessages.addEventListener('touchstart', function(event) {
			if(_PAGE_LISTE_MESSAGES == false)
			{
				afficherPageMessage();
			}
			else
			{
				socket.emit('ACCUSE_LECTURE_MSG_CS');
				supprimerPageMessage();
			}
		});
		BtnMessages.cursor="pointer";
	}
	else if(_listeMessages!=null && currentPerso.nbrNvMsg ==0)
	{
		labelNombreNouvMsg.text="0";
		var BtnMessages = new createjs.Bitmap("public/Boutons/MessagesVide.png");
		BtnMessages.y=_espaceBoutonY;
		contBtnsListes.addChild(BtnMessages);
		BtnMessages.addEventListener('click', function(event) {
			if(_PAGE_LISTE_MESSAGES == false)
			{
				afficherPageMessage();
			}
			else
			{
				supprimerPageMessage();
			}
		});
		BtnMessages.addEventListener('touchstart', function(event) {
			if(_PAGE_LISTE_MESSAGES == false)
			{
				afficherPageMessage();
			}
			else
			{
				supprimerPageMessage();
			}
		});
		BtnMessages.cursor="pointer";
	}
	else
	{
		labelNombreNouvMsg.text="0";

		var BtnMessages = new createjs.Bitmap("public/Boutons/MessagesGris.png");
		BtnMessages.y=_espaceBoutonY;
		contBtnsListes.addChild(BtnMessages);

		BtnMessages.cursor="not-allowed";
	}
}

function afficherPageMessage()
{
	supprimerPageJoueurs();
	_PAGE_LISTE_MESSAGES=true;
	pageMessages();	
}

function afficherPageJoueurs()
{
	supprimerPageMessage();
	_PAGE_JOUEURS=true;
	pagePersonnages();
}

function supprimerPageMessage()
{
	_PAGE_LISTE_MESSAGES=false;
	stage.removeChild(contMessage);
	socket.emit('INFO_PERSONNAGE_CS');
}

function supprimerPageJoueurs()
{
	_PAGE_JOUEURS=false;
	stage.removeChild(contListe);
	//game();
}

function majBtnGoules(nbrGoules)
{
	contBtnsInvCaseBis.removeChild(BtnAtqGoules);
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
	if(contBtnsInvCaseBis!=null)
	{
		contBtnsInvCaseBis.removeChild(BtnFouilleRapide);
	}
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
}

// FONCTION NON UTILISEE	
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
	POIDS_DU_SAC=0;
	var armeDejaEquip=false;
	var armureDejaEquip=false;
	
	// tableau qui contient toutes les listes d'objets
	var TabListe = new Array();

	// tableaux selon le type des objets
	var TabPersoEquip=new Array();
	var TabPersoConso=new Array();
	var TabPersoOdd=new Array();

	var TabPersoEquipAvecPage=new Array();
	var TabPersoConsoAvecPage=new Array();
	var TabPersoOddAvecPage=new Array();

	var nbPagesPersoEquip;
	var nbPagesPersoConso;
	var nbPagesPersoOdd;

	var TailleEquipFin;
	var TailleConsoFin;
	var TailleOddFin;

	// Valeur pour découper les listes d'items
	var decoup=5;

	//// REINITIALISATION DES CONTENEURS
	for(var i=0; i<3; i++)
	{
		TAB_CONT_ITEMS[i].removeAllChildren();
	}
	contArmure.removeAllChildren();
	contArme.removeAllChildren();

	var iPositionItemInConteneur=0;

	// Retirer de la liste des items du perso les items équipés
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
			POIDS_DU_SAC += currentPerso.sacADos[i].poids;
		}
		else if (currentPerso.armureEquipee != null && currentPerso.sacADos[i].id == currentPerso.armureEquipee.id)
		{
			indexArmureEquip = i;
			// Calcul du poinds du sac
			POIDS_DU_SAC += currentPerso.sacADos[i].poids;
		}
	}
	
	// suppresion des items
	if (indexArmeEquip != -1) 	
	{
		currentPerso.sacADos.splice(indexArmeEquip,1);
	}
	if (indexArmureEquip != -1)
		{
			if (indexArmeEquip == -1 || indexArmureEquip < indexArmeEquip)
				currentPerso.sacADos.splice(indexArmureEquip,1);
			else
				currentPerso.sacADos.splice(indexArmureEquip-1,1);
		}

	
	//// AFFICHAGE DE L'ARME
	if (currentPerso.armeEquipee != null)
	{
		var imgItemArme = new createjs.Bitmap(currentPerso.armeEquipee.imageName);
		imgItemArme.cursor = "pointer";

		// Dessin de l'arme équipée
		contArme.addChild(imgItemArme);

		// évenement click
		imgItemArme.addEventListener("click", function (event) 
		{
			//var currentItem = event.target.name;
			afficherSelecteurItemEquip(event.target.x, 0, 1);
			_SELECTED_ITEM_EQUIP=currentPerso.armeEquipee.id;
			majBtnDesequiper();
		});
		imgItemArme.addEventListener("touchstart", function (event) 
		{
			afficherTooltipItem(contArme.x, contArmure.y, currentPerso.armeEquipee, true);
			
			/*if (SelectEquipement!=null)
			{
				contArme.removeChild(SelectEquipement);
				contArmure.removeChild(SelectEquipement);
			}
			SelectEquipement 	= contArme.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
			SelectEquipement.x	=-5;
			SelectEquipement.y	=-4;*/
			_SELECTED_ITEM_EQUIP 	= currentPerso.armeEquipee.id;
			majBtnDesequiper();
			
		});
		// évenement quand la souris passe dessus
		imgItemArme.addEventListener('mouseover', function(event) 
		{
			afficherTooltipItem(contArme.x, contArme.y, currentPerso.armeEquipee, true);
			//var currentItem = event.target.name;
			//afficherTooltipItem(contArmure.x + event.target.x, contArmure.y + event.target.y, currentItem, true);

			/*var descriptionItem		=currentPerso.armeEquipee.description;
			labelDescriptionItem.text	=(currentPerso.armeEquipee.nom + " (+" + currentPerso.armeEquipee.valeur + ") " + "Poids : " + currentPerso.armeEquipee.poids + "\n");
			afficherDescItem(descriptionItem);*/
		},false);

		// évenement quand la souris s'en va
		imgItemArme.addEventListener('mouseout', function(event)
		{
			supprimerTooltipItem();
		},false);
		
		// évenement quand la souris s'en va
		imgItemArme.addEventListener('touchend', function(event)
		{
			supprimerTooltipItem();
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
		imgItemArmure.addEventListener("click", function (event) 
		{
			afficherSelecteurItemEquip(event.target.x, 0, 2);
			/*if (SelectEquipement!=null)
			{
				contArme.removeChild(SelectEquipement);
				contArmure.removeChild(SelectEquipement);
			}
			SelectEquipement = contArmure.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
			SelectEquipement.x=-5;
			SelectEquipement.y=-4;*/
			_SELECTED_ITEM_EQUIP = currentPerso.armureEquipee.id;
			majBtnDesequiper();
		});
		imgItemArmure.addEventListener("touchstart", function (event) 
		{
			afficherTooltipItem(contArmure.x, contArmure.y, currentPerso.armureEquipee, true);
			/*var descriptionItem=currentPerso.armureEquipee.description;
			labelDescriptionItem.text=(currentPerso.armureEquipee.nom + " (+" + currentPerso.armureEquipee.valeur + ") " + "Poids : " + currentPerso.armureEquipee.poids + "\n");
			afficherDescItem(descriptionItem);*/
			
			/*if (SelectEquipement!=null)
			{
				contArme.removeChild(SelectEquipement);
				contArmure.removeChild(SelectEquipement);
			}
			SelectEquipement = contArmure.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
			SelectEquipement.x=-5;
			SelectEquipement.y=-4;*/
			_SELECTED_ITEM_EQUIP = currentPerso.armureEquipee.id;
			majBtnDesequiper();
		});

		imgItemArmure.addEventListener('mouseover', function(event) 
		{
			afficherTooltipItem(contArmure.x, contArmure.y, currentPerso.armureEquipee, true);
			/*var descriptionItem=currentPerso.armureEquipee.description;
			labelDescriptionItem.text=(currentPerso.armureEquipee.nom + " (+" + currentPerso.armureEquipee.valeur + ") " + "Poids : " + currentPerso.armureEquipee.poids + "\n");
			afficherDescItem(descriptionItem);*/
		},false);

		imgItemArmure.addEventListener('mouseout', function(event)
		{
			supprimerTooltipItem();
		},false);
		
		imgItemArmure.addEventListener('touchend', function(event)
		{
			supprimerTooltipItem();
		},false);
	}

	// Parcourir la liste des items de la case
	// Rangement des items selon leur type dans des listes typées
	for (var j=0; j<currentPerso.sacADos.length; j++)
	{
		// mise de l'item dans une variable
		var item = currentPerso.sacADos[j];
		// ajout du poids
		POIDS_DU_SAC += item.poids;
		// Ranger l'item selon son type
		if(item.type==1 || item.type==2)
		{
			TabPersoEquip.push(item);
		}
		else if(item.type==3)
		{
			TabPersoOdd.push(item);
		}
		else
		{
			TabPersoConso.push(item);
		}
	}

	// Calcul du nombre de pages nécessaires
	nbPagesPersoEquip 	= Math.ceil(TabPersoEquip.length / decoup);
	nbPagesPersoConso 	= Math.ceil(TabPersoConso.length / decoup);
	nbPagesPersoOdd   	= Math.ceil(TabPersoOdd.length / decoup);
	// Calcul de la taille des dernières pages
	TailleEquipFin 		= (TabPersoEquip.length % decoup);
	TailleConsoFin 		= (TabPersoConso.length % decoup);
	TailleOddFin   		= (TabPersoOdd.length % decoup);

	majFlechesItemsPerso(nbPagesPersoEquip, nbPagesPersoConso, nbPagesPersoOdd);

	// VERIFIER QUE LES LISTES CONTIENNENT BIEN DES ITEMS !
	if(TabPersoEquip.length!=0)
	{
		// Découpage des listes
		decouperListes(TabPersoEquip, TabPersoEquipAvecPage, nbPagesPersoEquip, TailleEquipFin, decoup);
		majConteneurItemPerso(TabPersoEquipAvecPage);
	}

	if(TabPersoConso.length!=0)
	{
		// Découpage des listes
		decouperListes(TabPersoConso, TabPersoConsoAvecPage, nbPagesPersoConso, TailleConsoFin, decoup);
		majConteneurItemPerso(TabPersoConsoAvecPage);
	}

	if(TabPersoOdd.length!=0)
	{
		// Découpage des listes
		decouperListes(TabPersoOdd, TabPersoOddAvecPage, nbPagesPersoOdd, TailleOddFin, decoup);
		majConteneurItemPerso(TabPersoOddAvecPage);
	}


	//------------------------------------------------------------

	// Appel de fonction pour créer les boutons liés au Perso
	majBtnsItemPerso();

	var Select;
	var SelectEquipement;
	
	majBtnDesequiper();

	// Affichage barre poids du sac
	majBarreGeneric(POIDS_DU_SAC, currentPerso.poidsMax, _PERSO_LAST_PTS_POIDS, 
		sacBar, _LABEL_MODIF_PTS_POIDS, _ID_INTER_LABEL_MODIF_POIDS);
	_PERSO_LAST_PTS_POIDS = POIDS_DU_SAC;
	//sacBar.scaleX = (POIDS_DU_SAC/currentPerso.poidsMax) * sacBarWidth;
}

function majInventaireCase(currentCase)
{
	// Vider la liste des items de case
	for(var i=3; i<6; i++)
	{
		TAB_CONT_ITEMS[i].removeAllChildren();
	}

	// Valeur pour découper les listes d'items
	var decoup=5;
	// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();
	// tableaux selon le type des objets
	var TabCaseEquip=new Array();
	var TabCaseConso=new Array();
	var TabCaseOdd=new Array();

	var TabCaseEquipAvecPage=new Array();
	var TabCaseConsoAvecPage=new Array();
	var TabCaseOddAvecPage=new Array();

	var nbPagesCaseEquip;
	var nbPagesCaseConso;
	var nbPagesCaseOdd;

	var TailleEquipFin;
	var TailleConsoFin;
	var TailleOddFin;

	// définition de la taille pour le découpage des listes
	//var Taille = Math.ceil(currentCase.listeItem.length / decoup);
	//var TailleFinListe =(currentCase.listeItem.length % decoup);
	var iPositionItemInConteneur=0;

	// Parcourir la liste des items de la case
	// Rangement des items selon leur type dans des listes typées
	for (var j=0; j<currentCase.listeItem.length; j++)
	{
		// mise de l'item dans une variable
		var item = currentCase.listeItem[j];
		// Ranger l'item selon son type
		if(item.type==1 || item.type==2)
		{
			TabCaseEquip.push(item);
			//alert("TabCaseEquip : " + item.id);
		}
		else if(item.type==3)
		{
			TabCaseOdd.push(item);
			//alert("TabCaseOdd : " + item.id);
		}
		else
		{
			TabCaseConso.push(item);
			//alert("TabCaseConso : " + item.id);
		}
	}

	// Calcul du nombre de pages nécessaires
	nbPagesCaseEquip = Math.ceil(TabCaseEquip.length / decoup);
	nbPagesCaseConso = Math.ceil(TabCaseConso.length / decoup);
	nbPagesCaseOdd   = Math.ceil(TabCaseOdd.length / decoup);
	// Calcul de la taille des dernières pages
	TailleEquipFin =(TabCaseEquip.length % decoup);
	TailleConsoFin =(TabCaseConso.length % decoup);
	TailleOddFin   =(TabCaseOdd.length % decoup);

	majFlechesItemsCase(nbPagesCaseEquip, nbPagesCaseConso, nbPagesCaseOdd);

	// VERIFIER QUE LES LISTES CONTIENNENT BIEN DES ITEMS !
	if(TabCaseEquip.length!=0)
	{
		// Découpage des listes
		decouperListes(TabCaseEquip, TabCaseEquipAvecPage, nbPagesCaseEquip, TailleEquipFin, decoup);
		majConteneurItemCase(TabCaseEquipAvecPage);
	}

	if(TabCaseConso.length!=0)
	{
		// Découpage des listes
		decouperListes(TabCaseConso, TabCaseConsoAvecPage, nbPagesCaseConso, TailleConsoFin, decoup);
		majConteneurItemCase(TabCaseConsoAvecPage);
	}

	if(TabCaseOdd.length!=0)
	{
		// Découpage des listes
		decouperListes(TabCaseOdd, TabCaseOddAvecPage, nbPagesCaseOdd, TailleOddFin, decoup);
		majConteneurItemCase(TabCaseOddAvecPage);
	}
}

function decouperListes(tabOrigine, tabFinal, nbrPages, tailleFin, decoup)
{
	//alert("Longueur de tab : " + tabOrigine.length);
	//alert("nbrPages " + nbrPages);
	// Découpage de la liste d'Equipement
	// pour chaque page....
	for(var i=0; i<nbrPages; i++)
	{
		// Création d'une liste représentant la page, contenant des items
		var tabPage=new Array();
		// si la page courante == derniere page ET le nombre d'item dans la dernière page != 0
		if(i==nbrPages-1 && tailleFin!=0)
		{
			//alert("DERNIERE PAGE - valeur de i : " + i );
			//Boucle des items liste incomplète, pour la derniere page
			var limiteDaffichage = i*decoup;
			for (var j=limiteDaffichage; j<(limiteDaffichage+tailleFin); j++)
			{
				// mise de l'item dans une variable
				var item = tabOrigine[j];
				// ajout de l'item à la dernière page
				tabPage.push(item);
				//alert("tabPage[j].id : " + tabPage[j%5].id);
			}
			// Ajout de cette page reférencée : TabCaseEquip[dernière_page][item]
			tabFinal.push(tabPage);
		}
		else
		{
			//alert("PAGE : " + i);
			//Boucle normale : creation de pages remplies
			//alert("Limite : " + ((i*decoup)+(decoup)));

			// Pour 0...4
			var limiteDaffichage = i*decoup;
			for (var j=limiteDaffichage; j<(limiteDaffichage+(decoup)); j++)
			{
				//alert("position de l'item dans la liste :" + j);
				
				// mise de l'item dans une variable
				var item = tabOrigine[j];
				// ajout de l'item à la page
				tabPage.push(item);
				//alert("id de l'item dans tab Page a l'index " + j + " : " + tabPage[j%5].id);
			}
			// Ajout de cette page reférencée : TabCaseEquip[dernière_page][item]
			tabFinal.push(tabPage);
		}
	}
	//alert("tab : " + tab[0][0].id);
}

function majFlechesItemsCase(nbPagesCaseEquip, nbPagesCaseConso, nbPagesCaseOdd)
{
	// Affichage des boutons du conteneur case Equipement
	if(_PAGE_ITEM_CASE_EQUIP>nbPagesCaseEquip-1) 	_PAGE_ITEM_CASE_EQUIP=nbPagesCaseEquip-1;
	else if (_PAGE_ITEM_CASE_EQUIP<=0) 					_PAGE_ITEM_CASE_EQUIP=0;
		
	if(_PAGE_ITEM_CASE_EQUIP==nbPagesCaseEquip-1) 	Btn_PAGE_ITEM_CASE_EQUIPRight.visible=false;
	else 											Btn_PAGE_ITEM_CASE_EQUIPRight.visible=true;
		
	if(_PAGE_ITEM_CASE_EQUIP==0) 					Btn_PAGE_ITEM_CASE_EQUIPLeft.visible=false;
	else 											Btn_PAGE_ITEM_CASE_EQUIPLeft.visible=true;
		
	if(nbPagesCaseEquip ==0)
	{
		Btn_PAGE_ITEM_CASE_EQUIPLeft.visible=false;
		Btn_PAGE_ITEM_CASE_EQUIPRight.visible=false;
	}

	// Affichage des boutons du conteneur case Consommable
	if(_PAGE_ITEM_CASE_CONSO>nbPagesCaseConso-1) 	_PAGE_ITEM_CASE_CONSO=nbPagesCaseConso-1;
	else if (_PAGE_ITEM_CASE_CONSO<=0) 				_PAGE_ITEM_CASE_CONSO=0;
		
	if(_PAGE_ITEM_CASE_CONSO==nbPagesCaseConso-1) 	Btn_PAGE_ITEM_CASE_CONSORight.visible=false;
	else 											Btn_PAGE_ITEM_CASE_CONSORight.visible=true;
		
	if(_PAGE_ITEM_CASE_CONSO==0) 					Btn_PAGE_ITEM_CASE_CONSOLeft.visible=false;
	else 											Btn_PAGE_ITEM_CASE_CONSOLeft.visible=true;
		
	if(nbPagesCaseConso ==0)
	{
		Btn_PAGE_ITEM_CASE_CONSOLeft.visible=false;
		Btn_PAGE_ITEM_CASE_CONSORight.visible=false;
	}

	// Affichage des boutons du conteneur case ODD
	if(_PAGE_ITEM_CASE_ODD>nbPagesCaseOdd-1) 	_PAGE_ITEM_CASE_ODD=nbPagesCaseOdd-1;
	else if (_PAGE_ITEM_CASE_ODD<=0) 			_PAGE_ITEM_CASE_ODD=0;
		
	if(_PAGE_ITEM_CASE_ODD==nbPagesCaseOdd-1) 	Btn_PAGE_ITEM_CASE_ODDRight.visible=false;
	else 										Btn_PAGE_ITEM_CASE_ODDRight.visible=true;
		
	if(_PAGE_ITEM_CASE_ODD==0) 					Btn_PAGE_ITEM_CASE_ODDLeft.visible=false;
	else 										Btn_PAGE_ITEM_CASE_ODDLeft.visible=true;
		
	if(nbPagesCaseOdd ==0)
	{
		Btn_PAGE_ITEM_CASE_ODDLeft.visible=false;
		Btn_PAGE_ITEM_CASE_ODDRight.visible=false;
	}
}

function majFlechesItemsPerso(nbPagesPersoEquip, nbPagesPersoConso, nbPagesPersoOdd)
{
	// Affichage des boutons du conteneur perso Equipement
	if(_PAGE_ITEM_PERSO_EQUIP>nbPagesPersoEquip-1) 	_PAGE_ITEM_PERSO_EQUIP=nbPagesPersoEquip-1;
	else if (_PAGE_ITEM_PERSO_EQUIP<=0) 			_PAGE_ITEM_PERSO_EQUIP=0;
		
	if(_PAGE_ITEM_PERSO_EQUIP==nbPagesPersoEquip-1) 	Btn_PAGE_ITEM_PERSO_EQUIPRight.visible=false;
	else 											Btn_PAGE_ITEM_PERSO_EQUIPRight.visible=true;
		
	if(_PAGE_ITEM_PERSO_EQUIP==0) 					Btn_PAGE_ITEM_PERSO_EQUIPLeft.visible=false;
	else 											Btn_PAGE_ITEM_PERSO_EQUIPLeft.visible=true;
		
	if(nbPagesPersoEquip ==0)
	{
		Btn_PAGE_ITEM_PERSO_EQUIPLeft.visible=false;
		Btn_PAGE_ITEM_PERSO_EQUIPRight.visible=false;
	}

	// Affichage des boutons du conteneur perso Equipement
	if(_PAGE_ITEM_PERSO_CONSO>nbPagesPersoConso-1) 	_PAGE_ITEM_PERSO_CONSO=nbPagesPersoConso-1;
	else if (_PAGE_ITEM_PERSO_CONSO<=0) 			_PAGE_ITEM_PERSO_CONSO=0;
		
	if(_PAGE_ITEM_PERSO_CONSO==nbPagesPersoConso-1) Btn_PAGE_ITEM_PERSO_CONSORight.visible=false;
	else 											Btn_PAGE_ITEM_PERSO_CONSORight.visible=true;
		
	if(_PAGE_ITEM_PERSO_CONSO==0) 					Btn_PAGE_ITEM_PERSO_CONSOLeft.visible=false;
	else 											Btn_PAGE_ITEM_PERSO_CONSOLeft.visible=true;
		
	if(nbPagesPersoConso ==0)
	{
		Btn_PAGE_ITEM_PERSO_CONSOLeft.visible=false;
		Btn_PAGE_ITEM_PERSO_CONSORight.visible=false;
	}

	// Affichage des boutons du conteneur perso Equipement
	if(_PAGE_ITEM_PERSO_ODD>nbPagesPersoOdd-1) 	_PAGE_ITEM_PERSO_ODD=nbPagesPersoOdd-1;
	else if (_PAGE_ITEM_PERSO_ODD<=0) 			_PAGE_ITEM_PERSO_ODD=0;
		
	if(_PAGE_ITEM_PERSO_ODD==nbPagesPersoOdd-1) 	Btn_PAGE_ITEM_PERSO_ODDRight.visible=false;
	else 											Btn_PAGE_ITEM_PERSO_ODDRight.visible=true;
		
	if(_PAGE_ITEM_PERSO_ODD==0) 					Btn_PAGE_ITEM_PERSO_ODDLeft.visible=false;
	else 											Btn_PAGE_ITEM_PERSO_ODDLeft.visible=true;
		
	if(nbPagesPersoOdd ==0)
	{
		Btn_PAGE_ITEM_PERSO_ODDLeft.visible=false;
		Btn_PAGE_ITEM_PERSO_ODDRight.visible=false;
	}
}

function majConteneurItemCase(tab)
{
	var page;
	var numCont;
	// Détermination des variables globales à utliser selon le type
	// 1er index : PAGE -> TABLEAU D'ITEM
	// 2eme index : ITEM
	if(tab[0][0].type==1 || tab[0][0].type==2)
	{
		page=_PAGE_ITEM_CASE_EQUIP;
		numCont=3;

	}
	else if(tab[0][0].type==3)
	{
		page=_PAGE_ITEM_CASE_ODD;
		numCont=5;
	}
	else
	{
		page=_PAGE_ITEM_CASE_CONSO;
		numCont=4;
	}

	var iPositionItemInConteneur=0;

	// Affichage des items dans le conteneur
	try 
	{
		// Parcours de la liste des items typés
		for (var i = 0; i < tab[page].length ; i++) 
		{
			// Création de l'item courant
			var currentItem = tab[page][i];
			
			// Ajout de l'image à l'ihm
			var imgItem 	= new createjs.Bitmap(currentItem.imageName);
			imgItem.name 	= i;
			imgItem.cursor 	= "pointer";
			imgItem.x 		= (iPositionItemInConteneur * _spaceItem);
			TAB_CONT_ITEMS[numCont].addChild(imgItem);

			// incrémente la position de l'item dans le conteneur
			iPositionItemInConteneur++;

			// Ajout des évenements à l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgItem.addEventListener('mouseover', function(event) 
			{
				var currentItem = tab[page][event.target.name];
				afficherTooltipItem(contTousItems.x + TAB_CONT_ITEMS[numCont].x + event.target.x, contTousItems.y + TAB_CONT_ITEMS[numCont].y + event.target.y, currentItem, true);
				//var descriptionItem=currentItem.description;
				//labelDescriptionItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
				//afficherDescItem(descriptionItem);
			},false);

			imgItem.addEventListener('mouseout', function(event)
			{
				supprimerTooltipItem();
			},false);
			
			imgItem.addEventListener('touchend', function(event)
			{
				supprimerTooltipItem();
			},false);

			imgItem.addEventListener("click", function(event)
			{
				var currentItem = tab[page][event.target.name];
				afficherSelecteurItemCase(event.target.x, 0, currentItem.type);
				_SELECTED_ITEM_CASE=currentItem.id;

				// maj des boutons
				majBtnRamasser();

				/*if (Select!=null)
				{
					TAB_CONT_ITEMS[numCont].removeChild(Select);
				}
				var num=event.target.x;
				var currentItem = tab[_PAGE_ITEM_CASE][event.target.name];
				_SELECTED_ITEM_CASE=currentItem.id;
				Select = TAB_CONT_ITEMS[3].addChild(new createjs.Bitmap("public/Boutons/Select.png"));
				Select.x=(num);
				Select.y=0;
				*/
				
			});
				
			imgItem.addEventListener("touchstart", function(event)
			{
				// event "sourie sur item"
				var currentItem = tab[page][event.target.name];
				afficherTooltipItem(TAB_CONT_ITEMS[numCont].x + event.target.x, TAB_CONT_ITEMS[numCont].y + event.target.y, currentItem, true);

				// event "click sur item"
				var currentItem = tab[page][event.target.name];
				afficherSelecteurItemCase(event.target.x, 0, currentItem.type);
				_SELECTED_ITEM_CASE=currentItem.id;

				// maj des boutons
				majBtnRamasser();
				/*
				var currentItem = tab[page][event.target.name];
				var descriptionItem=currentItem.description;
				labelDescriptionItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
				afficherDescItem(descriptionItem);
				if (Select!=null)
				{
					TAB_CONT_ITEMS[3].removeChild(Select);
				}
				var num=event.target.x;
				var currentItem = tab[page][event.target.name];
				_SELECTED_ITEM_CASE=currentItem.id;
				Select = TAB_CONT_ITEMS[numCont].addChild(new createjs.Bitmap("public/Boutons/Select.png"));
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

function majConteneurItemPerso(tab)
{
	var page;
	var numCont;
	
	if(tab[0][0].type==1 || tab[0][0].type==2)
	{
		page=_PAGE_ITEM_PERSO_EQUIP;
		numCont=0;

	}
	else if(tab[0][0].type==3)
	{
		page=_PAGE_ITEM_PERSO_ODD;
		numCont=2;
	}
	else
	{
		page=_PAGE_ITEM_PERSO_CONSO;
		numCont=1;
	}

	var iPositionItemInConteneur=0;

	// Affichage des items dans le conteneur
	try 
	{
		// Parcours de la liste des items typés
		for (var i = 0; i < tab[page].length ; i++) 
		{
			// Création de l'item courant
			var currentItem = tab[page][i];
			
			// Ajout de l'image à l'ihm
			var imgItem 	= new createjs.Bitmap(currentItem.imageName);
			imgItem.name 	= i;
			imgItem.cursor 	= "pointer";
			imgItem.x 		= (iPositionItemInConteneur * _spaceItem);
			TAB_CONT_ITEMS[numCont].addChild(imgItem);

			// incrémente la position de l'item dans le conteneur
			iPositionItemInConteneur++;

			// Ajout des évenements à l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgItem.addEventListener('mouseover', function(event) 
			{
				var currentItem = tab[page][event.target.name];
				afficherTooltipItem(contTousItems.x + TAB_CONT_ITEMS[numCont].x + event.target.x, contTousItems.y + TAB_CONT_ITEMS[numCont].y + event.target.y, currentItem, true);
				//var descriptionItem=currentItem.description;
				//labelDescriptionItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
				//afficherDescItem(descriptionItem);
			},false);

			imgItem.addEventListener('mouseout', function(event)
			{
				supprimerTooltipItem();
			},false);
			
			imgItem.addEventListener('touchend', function(event)
			{
				supprimerTooltipItem();
			},false);

			imgItem.addEventListener("click", function(event)
			{
				var currentItem = tab[page][event.target.name];
				afficherSelecteurItemPerso(event.target.x, 0, currentItem.type);
				_SELECTED_ITEM_PERSO=currentItem.id;
				_SELECTED_ITEM_PERSOType=currentItem.type;
				// maj des boutons
				majBtnsItemPerso();

				/*if (Select!=null)
				{
					TAB_CONT_ITEMS[numCont].removeChild(Select);
				}
				var num=event.target.x;
				var currentItem = tab[_PAGE_ITEM_CASE][event.target.name];
				_SELECTED_ITEM_PERSO=currentItem.id;
				Select = TAB_CONT_ITEMS[3].addChild(new createjs.Bitmap("public/Boutons/Select.png"));
				Select.x=(num);
				Select.y=0;
				*/
				
			});
				
			imgItem.addEventListener("touchstart", function(event)
			{
				// event "sourie sur item"
				var currentItem = tab[page][event.target.name];
				afficherTooltipItem(TAB_CONT_ITEMS[numCont].x + event.target.x, TAB_CONT_ITEMS[numCont].y + event.target.y, currentItem, true);

				// event "click sur item"
				var currentItem = tab[page][event.target.name];
				afficherSelecteurItemPerso(event.target.x, 0, currentItem.type);
				_SELECTED_ITEM_PERSO=currentItem.id;
				_SELECTED_ITEM_PERSOType=currentItem.type;

				// maj des boutons
				majBtnsItemPerso();
				/*
				var currentItem = tab[page][event.target.name];
				var descriptionItem=currentItem.description;
				labelDescriptionItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
				afficherDescItem(descriptionItem);
				if (Select!=null)
				{
					TAB_CONT_ITEMS[3].removeChild(Select);
				}
				var num=event.target.x;
				var currentItem = tab[page][event.target.name];
				_SELECTED_ITEM_PERSO=currentItem.id;
				Select = TAB_CONT_ITEMS[numCont].addChild(new createjs.Bitmap("public/Boutons/Select.png"));
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
	var diff = _PERSO_LAST_PTS_VIE - ptsVie;
	

	afficherBarreSante(ptsVie, ptsVieMax, false);
	// si pas de diminution de vie
	if (diff == 0 || _PERSO_LAST_PTS_VIE == -1 ) 
	{
		// on quite l'algo si y'a pas eu de blessure
		return;
	}

	// affiche les degats recus
	_LABEL_MODIF_PTS_SANTE.text = "";
	if 		(diff > 0) _LABEL_MODIF_PTS_SANTE.text = "-"+diff;
	else if (diff < 0) _LABEL_MODIF_PTS_SANTE.text = "+"+diff;
	
	// efface l'ancien timer, au cas où
	clearInterval(_ID_INTER_BLINK_BARRE_VIE);

	// define nbr clignotement
	_BLINK_CPT = 10;
	
	// lance le compteur
	_ID_INTER_BLINK_BARRE_VIE = setInterval( function() 
	{
		if (_BLINK_CPT % 2 == 0 && diff > 0)
		{
			// barre vie en vert
			afficherBarreSante(ptsVie, ptsVieMax, false)

			// cadre map en gris
			defineCadreMap("gris");
		}
		else if (diff > 0)
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
			_LABEL_MODIF_PTS_SANTE.text = "";
			// affichage la barre de snaté normale
			afficherBarreSante(ptsVie, ptsVieMax, false)
			// supprime le timer
			clearInterval(_ID_INTER_BLINK_BARRE_VIE);
		}
		_BLINK_CPT--;
	}, _DUREE_AFFICHAGE/_BLINK_CPT);	
}
/*
function majBarreAction(ptsAction, ptsActionMax)
{
	var diff = _PERSO_LAST_PTS_ACTION - ptsAction;
	
	// maj barre action
	// AFFICHAGE POINTS D'ACTION 
	// Sécurité pour le remplissage de la barre d'action
	if(ptsAction<=0) 						actionBar.scaleX = 0;
	else if(ptsAction>=ptsActionMax)		actionBar.scaleX = actionBarWidth;
	else 									actionBar.scaleX = (ptsAction/ptsActionMax) * _BARRES_WIDTH;

	// si pas de perte ou que c'est une initialisaiton
	if (diff == 0 || _PERSO_LAST_PTS_ACTION == -1 ) 
	{
		// on quite l'algo si y'a pas eu de perte
		return;
	}

	// affiche les degats recus
	_LABEL_MODIF_PTS_ACTION.text = "";
	if 		(diff > 0) _LABEL_MODIF_PTS_ACTION.text = "-"+diff;
	else if (diff < 0) _LABEL_MODIF_PTS_ACTION.text = "+"+diff;
	
	// efface l'ancien timer, au cas où
	clearInterval(_ID_INTER_LABEL_MODIF_PTACTIONS);
	
	// lance le compteur
	_ID_INTER_LABEL_MODIF_PTACTIONS = setInterval( function() 
	{
		
		// vide label de degats
		_LABEL_MODIF_PTS_ACTION.text = "";

		// supprime le timer
		clearInterval(_ID_INTER_LABEL_MODIF_PTACTIONS);
	}, _DUREE_AFFICHAGE);	
}

function majBarrFaim(ptsFaim, ptsFaimMax)
{
	var diff = _PERSO_LAST_PTS_ACTION - ptsAction;
	
	// maj barre action
	// AFFICHAGE POINTS D'ACTION 
	// Sécurité pour le remplissage de la barre d'action
	if(ptsAction<=0) 						actionBar.scaleX = 0;
	else if(ptsAction>=ptsActionMax)		actionBar.scaleX = actionBarWidth;
	else 									actionBar.scaleX = (ptsAction/ptsActionMax) * _BARRES_WIDTH;

	// si pas de perte ou que c'est une initialisaiton
	if (diff == 0 || _PERSO_LAST_PTS_ACTION == -1 ) 
	{
		// on quite l'algo si y'a pas eu de perte
		return;
	}

	// affiche les degats recus
	_LABEL_MODIF_PTS_ACTION.text = "";
	if 		(diff > 0) _LABEL_MODIF_PTS_ACTION.text = "-"+diff;
	else if (diff < 0) _LABEL_MODIF_PTS_ACTION.text = "+"+diff;
	
	// efface l'ancien timer, au cas où
	clearInterval(_ID_INTER_LABEL_MODIF_PTACTIONS);
	
	// lance le compteur
	_ID_INTER_LABEL_MODIF_PTACTIONS = setInterval( function() 
	{
		
		// vide label de degats
		_LABEL_MODIF_PTS_ACTION.text = "";

		// supprime le timer
		clearInterval(_ID_INTER_LABEL_MODIF_PTACTIONS);
	}, _DUREE_AFFICHAGE);	
}



function majBarreMvt(ptsMvt, ptsMvtMax)
{
	var diff = _PERSO_LAST_PTS_MVT - ptsMvt;
	
	// AFFICHAGE POINTS 
	// Sécurité pour le remplissage de la barre 
	if(ptsMvt<=0) 					moveBar.scaleX = 0;
	else if(ptsMvt>=ptsMvtMax)		moveBar.scaleX = actionBarWidth;
	else 							moveBar.scaleX = (ptsMvt/ptsMvtMax) * _BARRES_WIDTH;

	// si pas de perte ou que c'est une initialisaiton
	if (diff == 0 || _PERSO_LAST_PTS_MVT == -1 ) 
	{
		// on quite l'algo si y'a pas eu de perte
		return;
	}

	// affiche les degats recus
	_LABEL_MODIF_PTS_MVT.text = "";
	if 		(diff > 0) _LABEL_MODIF_PTS_MVT.text = "-"+diff;
	else if (diff < 0) _LABEL_MODIF_PTS_MVT.text = "+"+diff;

	// efface l'ancien timer, au cas où
	clearInterval(_ID_INTER_LABEL_MODIF_PTMVT);
	
	// lance le compteur
	_ID_INTER_LABEL_MODIF_PTMVT = setInterval( function() 
	{
		
		// vide label de degats
		_LABEL_MODIF_PTS_MVT.text = "";

		// supprime le timer
		clearInterval(_ID_INTER_LABEL_MODIF_PTMVT);
	}, _DUREE_AFFICHAGE);	
}

function majBarrePoids(poids, poidsMax)
{
	var diff = _PERSO_LAST_PTS_POIDS - poids;
	
	// maj barre action
	// AFFICHAGE POINTS D 
	// Sécurité pour le remplissage de la barre
	if(poids<=0) 					sacBar.scaleX = 0;
	else if(poids>=poidsMax)		sacBar.scaleX = sacBarWidth;
	else 							sacBar.scaleX = (poids/poidsMax) * _BARRES_WIDTH;

	// si pas de perte
	if (diff == 0 || _PERSO_LAST_PTS_POIDS == -1 ) 
	{
		// on quite l'algo si y'a pas eu de perte
		return;
	}

	// affiche les degats recus
	_LABEL_MODIF_PTS_POIDS.text = "";
	if 		(diff > 0) _LABEL_MODIF_PTS_POIDS.text = "-"+diff;
	else if (diff < 0) _LABEL_MODIF_PTS_POIDS.text = "+"+diff;
	
	// efface l'ancien timer, au cas où
	clearInterval(_ID_INTER_LABEL_MODIF_POIDS);
	
	// lance le compteur
	_ID_INTER_LABEL_MODIF_POIDS = setInterval( function() 
	{
		
		// vide label de degats
		_LABEL_MODIF_PTS_POIDS.text = "";

		// supprime le timer
		clearInterval(_ID_INTER_LABEL_MODIF_POIDS);
	}, _DUREE_AFFICHAGE);	
}
*/
function majBarreGeneric(pts, ptsMax, last, objetBarre, objetLabel, id_timer)
{
	var diff = last - pts;
	// maj barre
	if(pts<=0) 					objetBarre.scaleX = 0;
	else if(pts>=ptsMax)		objetBarre.scaleX = actionBarWidth;
	else 						objetBarre.scaleX = (pts/ptsMax) * _BARRES_WIDTH;

	// si pas de perte ou que c'est une initialisaiton
	if (diff == 0 || last == -1 ) 
	{
		// on quite l'algo si y'a pas eu de perte
		return;
	}


	// affiche les degats recus
	objetLabel.text = "";
	if 		(diff > 0) objetLabel.text = "-"+diff;
	else if (diff < 0) objetLabel.text = "+"+diff;
	
	// efface l'ancien timer, au cas où
	clearInterval(id_timer);
	
	// lance le compteur
	id_timer = setInterval( function() 
	{
		
		// vide label de degats
		objetLabel.text = "";

		// supprime le timer
		clearInterval(id_timer);
	}, _DUREE_AFFICHAGE);	
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
	_PERSO_LAST_PTS_VIE = currentPerso.ptSante;

	majBarreGeneric(currentPerso.ptAction, currentPerso.ptActionMax, _PERSO_LAST_PTS_ACTION, 
		actionBar, _LABEL_MODIF_PTS_ACTION, _ID_INTER_LABEL_MODIF_PTACTIONS)
	_PERSO_LAST_PTS_ACTION = currentPerso.ptAction;

	majBarreGeneric(currentPerso.ptDeplacement, currentPerso.ptDeplacementMax, _PERSO_LAST_PTS_MVT,
		moveBar, _LABEL_MODIF_PTS_MVT, _ID_INTER_LABEL_MODIF_PTMVT);
	_PERSO_LAST_PTS_MVT = currentPerso.ptDeplacement;

	majBarreGeneric(currentPerso.ptFaim, currentPerso.ptFaimMax, _PERSO_LAST_PTS_FAIM, 
		faimBar, _LABEL_MODIF_PTS_FAIM, _ID_INTER_LABEL_MODIF_PTFAIM)
	_PERSO_LAST_PTS_ACTION = currentPerso.ptAction;

	//majBarreGeneric(currentPerso.ptDeplacement, currentPerso.ptDeplacementMax, _PERSO_LAST_PTS_MVT,
	//	moveBar, _LABEL_MODIF_PTS_MVT, _ID_INTER_LABEL_MODIF_PTMVT);
	//_PERSO_LAST_PTS_MVT = currentPerso.ptDeplacement;

	// AFFICHAGE POINTS DE FAIM 
	// Sécurité pour le remplissage de la barre de faim
	//if(currentPerso.ptFaim<=0)										faimBar.scaleX = 0;
	//else if(currentPerso.ptFaim>=currentPerso.ptFaimMax)			faimBar.scaleX = faimBarWidth;	
	//else 															faimBar.scaleX = (currentPerso.ptFaim/currentPerso.ptFaimMax) * _BARRES_WIDTH;
	
	//if (_LABEL_MODIF_PTS_FAIM)
	/*
	// AFFICHAGE POINTS D'ACTION 
	// Sécurité pour le remplissage de la barre d'action
	if(currentPerso.ptAction<=0) 									actionBar.scaleX = 0;
	else if(currentPerso.ptAction>=currentPerso.ptActionMax)		actionBar.scaleX = actionBarWidth;
	else 															actionBar.scaleX = (currentPerso.ptAction/currentPerso.ptActionMax) * _BARRES_WIDTH;
	// affichage d'un label
	var diminutionPts = _PERSO_LAST_PTS_ACTION - currentPerso.ptAction;
	_LABEL_MODIF_PTS_ACTION.text = "-"+diminutionPts;
	*/
	// AFFICHAGE POINTS DE MOUVEMENT
	// Sécurité pour le remplissage de la barre de move
	/*if(currentPerso.ptDeplacement >=currentPerso.ptDeplacementMax) 	moveBar.scaleX = moveBarWidth;
	else if(currentPerso.ptDeplacement<=0) 							moveBar.scaleX = 0;
	else 															moveBar.scaleX = (currentPerso.ptDeplacement/currentPerso.ptDeplacementMax) * _BARRES_WIDTH;
	*/
	// mise à jour des variables globales, qui serviront pour afficher les proba quand on fera un info case
	_PERSO_PROBA_CACHE	=currentPerso.multiProbaCache;
	_PERSO_PROBA_FOUILLE	=currentPerso.multiProbaFouille;
}

function majBoutonsMode(currentPerso)
{
	// ********* AFFICHAGE DES BOUTONS DE MODE *********/
	contBtnModes.removeAllChildren();
	switch(currentPerso.mode)
	{
	// mode oisif
	case 0 : //alert("case 0");
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
		BtnFouiller.y=0;
		contBtnModes.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event)
		{
			//alert("click");
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
	case 1 : //alert("case 1 fouille");
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
	case 2 : //alert("case 2 caché"); 
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
	case 3 : //alert("case 3 défense"); 
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

function majForceEnPresence(nbrAllies, nbrEnnemis, nbrZombies)
{
	_LABEL_NB_ALLIES.text = nbrAllies;
	_LABEL_NB_ENNEMIS.text = nbrEnnemis;

	stage.removeChild(_LABEL_NB_GOULES);
	if (nbrZombies > _LAST_GOULES_MAX)
	{
		_LABEL_NB_GOULES = new createjs.Text("", _POLICE_LABEL, "#FF0000");
		_LABEL_NB_GOULES.x = _LABEL_NB_ALLIES.x;
		_LABEL_NB_GOULES.y = _LABEL_NB_ALLIES.y+25*2+23; // avt : y*32*2+10
	}
	else if (nbrZombies == 0)
	{
		_LABEL_NB_GOULES = new createjs.Text("", _POLICE_LABEL, "#00FF00");
		_LABEL_NB_GOULES.x = _LABEL_NB_ALLIES.x;
		_LABEL_NB_GOULES.y = _LABEL_NB_ALLIES.y+25*2+23; // avt : y*32*2+10
	}
	else
	{
		_LABEL_NB_GOULES = new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS);
		_LABEL_NB_GOULES.x = _LABEL_NB_ALLIES.x;
		_LABEL_NB_GOULES.y = _LABEL_NB_ALLIES.y+25*2+23; // avt : y*32*2+10
	}
	_LABEL_NB_GOULES.text = nbrZombies;
	stage.addChild(_LABEL_NB_GOULES);

	// animation correspondante
	animationModificationForces(nbrAllies, nbrEnnemis, nbrZombies)	

	// si le panneau des joueurs dans la salle était ouvert, ET si il y a eu une modif sur le nombre de joueurs
	if (
		_PAGE_JOUEURS 
		&& 
		(_LAST_NOMBRE_ALLIES != -1 && _LAST_NOMBRE_ALLIES != nbrAllies 
			|| 
		_LAST_NOMBRE_ENNEMIS != -1 && _LAST_NOMBRE_ENNEMIS != nbrEnnemis)
		)
	{
		//  on le ferme et rouvre
		supprimerPageJoueurs();
		afficherPageJoueurs();
	}
	// update variables 
	_LAST_NOMBRE_ALLIES = nbrAllies;
	_LAST_NOMBRE_ENNEMIS = nbrEnnemis;
	_LAST_NOMBRE_ZOMBIES = nbrZombies;


}

function majEventsPictoPerso(currentPerso)
{
	var x,y,txt;
	x = contPictoBarres.x;
	/// VIE ////
	imgVie.addEventListener('mouseover', function(event) 		
	{ 
		y= contPictoBarres.y + imgVie.y;
		txt = "Vie : " + currentPerso.ptSante+"/"+currentPerso.ptSanteMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgVie.addEventListener('mouseout', function(event)  		{ supprimerTooltipItem(); });
	imgVie.addEventListener('touchstart', function(event)				
	{ 
		y = contPictoBarres.y + imgVie.y;
		txt = "Vie : " + currentPerso.ptSante+"/"+currentPerso.ptSanteMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgVie.addEventListener('touchend', function(event)  		{ supprimerTooltipItem(); });


	/// FAIM ////
	imgFaim.addEventListener('mouseover', function(event) 				
	{ 
		y = contPictoBarres.y + imgFaim.y;
		txt = "Faim : " + currentPerso.ptFaim+"/"+currentPerso.ptFaimMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgFaim.addEventListener('mouseout', function(event)  		{ supprimerTooltipItem(); });
	imgFaim.addEventListener('touchstart', function(event)				
	{ 
		y = contPictoBarres.y + imgVie.y;
		txt = "Faim : " + currentPerso.ptFaim+"/"+currentPerso.ptFaimMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgFaim.addEventListener('touchend', function(event)   		{ supprimerTooltipItem(); });


	/// ACTION ////
	imgAction.addEventListener('mouseover', function(event) 			
	{ 
		y = contPictoBarres.y + imgAction.y;
		txt = "Action : " + currentPerso.ptAction+"/"+currentPerso.ptActionMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgAction.addEventListener('mouseout', function(event)  	{ supprimerTooltipItem(); });
	imgAction.addEventListener('touchstart', function(event)			
	{ 
		y = contPictoBarres.y + imgAction.y;
		txt = "Action : " + currentPerso.ptAction+"/"+currentPerso.ptActionMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgAction.addEventListener('touchend', function(event)  	{ supprimerTooltipItem(); });


	/// MOUVEMENT ////
	imgMouvement.addEventListener('mouseover', function(event)  		
	{ 
		y = contPictoBarres.y + imgMouvement.y;
		txt = "Mouvement : " + currentPerso.ptDeplacement+"/"+currentPerso.ptDeplacementMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgMouvement.addEventListener('mouseout', function(event)  	{ supprimerTooltipItem(); });
	imgMouvement.addEventListener('touchstart', function(event) 		
	{ 
		y = contPictoBarres.y + imgMouvement.y;
		txt = "Mouvement : " + currentPerso.ptDeplacement+"/"+currentPerso.ptDeplacementMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgMouvement.addEventListener('touchend', function(event)   { supprimerTooltipItem(); });


	/// SAC ////
	imgSac.addEventListener('mouseover', function(event) 				
	{ 
		y = contPictoBarres.y + imgSac.y;
		txt = "Poids du sac : " + POIDS_DU_SAC+"/"+currentPerso.poidsMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgSac.addEventListener('mouseout', function(event)  		{ supprimerTooltipItem(); });
	imgSac.addEventListener('touchstart', function(event)				
	{ 
		y = contPictoBarres.y + imgSac.y;
		txt = "Poids du sac : " + currentPerso.ptSante+"/"+currentPerso.poidsMax;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgSac.addEventListener('touchend', function(event)   		{ supprimerTooltipItem(); });


	/// ATTAQUE ////
	var ptsAttaque;
	if(currentPerso.armeEquipee != null)
	{
		ptsAttaque = currentPerso.multiPtsAttaque * currentPerso.armeEquipee.valeur ;
	}
	else
	{
		ptsAttaque = currentPerso.multiPtsAttaque ;
	}

	imgAttaque.addEventListener('mouseover', function(event) 			
	{ 
		y = contPictoBarres.y + imgAttaque.y;
		txt = "Attaque : " + ptsAttaque;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgAttaque.addEventListener('mouseout', function(event)  	{ supprimerTooltipItem(); });
	imgAttaque.addEventListener('touchstart', function(event)			
	{ 
		y = contPictoBarres.y + imgAttaque.y;
		txt = "Attaque : " + ptsAttaque;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgAttaque.addEventListener('touchend', function(event)   	{ supprimerTooltipItem(); });


	/// DEFENSE ////
	var ptsDefense;
	if(currentPerso.armureEquipee != null)
	{
		ptsDefense = currentPerso.multiPtsDefense * currentPerso.armureEquipee.valeur ;
	}
	else
	{
		ptsDefense = currentPerso.multiPtsDefense;
	}

	imgDefense.addEventListener('mouseover', function(event) 			
	{ 
		y = contPictoBarres.y + imgDefense.y;
		txt = "Défense : " + ptsDefense;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgDefense.addEventListener('mouseout', function(event)  	{ supprimerTooltipItem(); });
	imgDefense.addEventListener('touchstart', function(event)			
	{ 
		y = contPictoBarres.y + imgDefense.y;
		txt = "Défense : " + ptsDefense;
		afficherTooltipItem(x, y, txt, false); 
	});
	imgDefense.addEventListener('touchend', function(event)   	{ supprimerTooltipItem(); });
}

function majEventsPictoProbas(pourcentFouille, pourcentCache)
{
	var x,y,txt;
	x = contPictoBarres.x;

		/// FOUILLE ////
	imgFouille.addEventListener('mouseover', function(event) 			
	{ 
		y = contPictoBarres.y + imgFouille.y;
		txt = "Découverte item : " + pourcentFouille +" %";
		afficherTooltipItem(x, y, txt, false); 
	});
	imgFouille.addEventListener('mouseout', function(event)  	{ supprimerTooltipItem(); });
	imgFouille.addEventListener('touchstart', function(event)			
	{ 
		y = contPictoBarres.y + imgFouille.y;
		txt = "Découverte item  : " + pourcentFouille +" %";
		afficherTooltipItem(x, y, txt, false); 
	});
	imgFouille.addEventListener('touchend', function(event)   	{ supprimerTooltipItem(); });

	/// CACHE ////
	imgCache.addEventListener('mouseover', function(event) 				
	{ 
		y = contPictoBarres.y + imgCache.y;
		txt = "Cache : " + pourcentCache +" %";
		afficherTooltipItem(x, y, txt, false); 
	});
	imgCache.addEventListener('mouseout', function(event)  		{ supprimerTooltipItem(); });
	imgCache.addEventListener('touchstart', function(event)				
	{ 
		y = contPictoBarres.y + imgCache.y;
		txt = "Cache : " + pourcentCache +" %";
		afficherTooltipItem(x, y, txt, false); 
	});
	imgCache.addEventListener('touchend', function(event)   	{ supprimerTooltipItem(); });
}

function majPtsAttaqueDefense(currentPerso)
{
	_CONT_PTS_ATTAQUE.removeAllChildren();
	_CONT_PTS_DEFENSE.removeAllChildren();
	var ptsAttaque = 75;
	var ptsDefense = 21;
	var espaceEntreImages = 50;
	var maxImages = 14;
	var diviseur = 2;
	if(currentPerso.armeEquipee != null)
	{
		ptsAttaque = currentPerso.multiPtsAttaque * currentPerso.armeEquipee.valeur ;
	}
	else
	{
		ptsAttaque = currentPerso.multiPtsAttaque ;
	}

	if(currentPerso.armureEquipee != null)
	{
		ptsDefense = currentPerso.multiPtsDefense * currentPerso.armureEquipee.valeur ;
	}
	else
	{
		ptsDefense = currentPerso.multiPtsDefense;
	}

	var i;
	var pt = parseInt(ptsAttaque / diviseur);
	var circle;
	var imgInserees = 0;
	var position = 0;
	var couleur = "#FF0000";
	// boucle pts attaque
	for (i = 0; i < pt; i++)
	{
		// config de la couleur du cercle
		if 		(imgInserees < maxImages)		couleur = "#00FF00"
		else if (imgInserees < maxImages * 2 )  couleur = "#FFFF00"
		else if (imgInserees < maxImages * 3 )  couleur = "#FFFFFF"
		else 									couleur = "#FF0000"

		// config du cercle
	 	circle = new createjs.Shape();
	 	circle.graphics.beginFill(couleur).drawCircle(0, 0, 4);
		circle.x = position*15;
		circle.y = 0;
		_CONT_PTS_ATTAQUE.addChild(circle);

		position++;
		imgInserees++;

		// max d'images dans le conteneur : 14
		if (imgInserees % maxImages == 0)
		{
			position = 0;
		}
	}
	pt = parseInt(ptsDefense / diviseur);
	imgInserees = 0;
	position = 0;
	// boucle pts defense
	for (i = 0; i < pt; i++)
	{
		// config de la couleur du cercle
		if 		(imgInserees < maxImages)		couleur = "#00FF00"
		else if (imgInserees < maxImages * 2 )  couleur = "#FFFF00"
		else if (imgInserees < maxImages * 3 )  couleur = "#FFFFFF"
		else 									couleur = "#FF0000"

		// config du cercle
	 	circle = new createjs.Shape();
	 	 circle.graphics.beginFill(couleur).drawCircle(0, 0, 4);
		circle.x = position*15;
		circle.y = 0;
		_CONT_PTS_DEFENSE.addChild(circle);

		position++;
		imgInserees++;

		// max d'images dans le conteneur : 14
		if (imgInserees % maxImages == 0)
		{
			position = 0;
		}
	}
}

function majImageMap(currentCase, idSousCase)
{
	// modification du nom de l'image a afficher
	if (idSousCase == -1)
	{
		currentCase.pathImg += ".jpg";
	}
	else
	{
		currentCase.pathImg += "_"+idSousCase;
		currentCase.pathImg += ".jpg";
	}

	if(contMap!=null)
	{
		// suppresion de la map du canvas
	contMap.removeChild(map);
	}
	
	
	// chargement de l'image de la case
	var map = new createjs.Bitmap(currentCase.pathImg);
	
	// Placement de la map
	map.x = 0;
	contMap.addChild(map);
}

function changeModeAffichage()
{
	//changement de mode
	_MODE_SIMPLE = ! _MODE_SIMPLE;
	
	if (_MODE_SIMPLE)
	{

	}
	else
	{

	}
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

	/// AFFICHAGE PENDANT JUSTE 5 SECONDES
	clearInterval(_ID_INTER_MSG_RETOUR);
	_ID_INTER_MSG_RETOUR = setTimeout(function() 
	{
		// vide le conteneur
		contZoneMessage.removeChild(labelAction);
	}, _DUREE_AFFICHAGE);	
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
	{
		shapeMap.graphics.setStrokeStyle(2).beginStroke("#FF0000").drawRect(
			_contMapX-2, _contMapY-2, _contMapW+2, _contMapH+2);
	}
	else
	{
		shapeMap.graphics.setStrokeStyle(2).beginStroke("#405050").drawRect(
			_contMapX-2, _contMapY-2, _contMapW+2, _contMapH+2);
	}
}

function afficherTooltipItem(x, y, obj, item)
{
	stage.removeChild(_CONTENEUR_TOOLTIP);
	var hauteur = 0;
	var coul;
	// si c'est une description d'item
	if (item)
	{
		y += 40;
		hauteur = 55;
		// défini les caractéristiques de l'objet
		var ligne0 = obj.nom;
		var ligne1 = "Valeur : "+obj.valeur+" - Poids : " + obj.poids;
		var ligne2 = obj.description;
	
		_LABEL_DESCRIPTION.text = ligne0 +"\n" +ligne1 +"\n" + ligne2;

		// défini la taille du conteneur
		 _TAILLE_TOOLTIP = (Math.max(ligne1.length,ligne2.length, ligne0.length)) * 7 + 10;

		// config couleur fond conteneur
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
	}
	else
	{
		y -= 20;
		x -= 90;
		hauteur = 25;
		_LABEL_DESCRIPTION.text = obj;
		
		// défini la taille du conteneur
		_TAILLE_TOOLTIP = obj.length*7 +15;

		// config couleur fond conteneur
		coul = createjs.Graphics.getRGB(66,0,33, 0.8);
	}

	// conteneur
	_CONTENEUR_TOOLTIP		= new createjs.Container();
	_CONTENEUR_TOOLTIP.x 	= x;
	_CONTENEUR_TOOLTIP.y 	= y;

	// dessine le fond du conteneur
 	_FOND_TOOLTIP = new createjs.Shape();
	_FOND_TOOLTIP.graphics.beginFill(coul).drawRect(0, 0, _TAILLE_TOOLTIP, hauteur).endFill();

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

function supprimerTooltipItem()
{
	stage.removeChild(_CONTENEUR_TOOLTIP);
}

function afficherSelecteurItemPerso(x, y, typeItem)
{
	// Détermine dans quel conteneur se trouve l'item selectionné
	var numContPerso;
	if(typeItem==1 || typeItem==2)
	{
		numContPerso=0;

	}
	else if(typeItem==3)
	{
		numContPerso=2;
	}
	else
	{
		numContPerso=1;
	}
	// supprime l'ancien fond
	supprimerSelecteurItem(numContPerso);

	// affichage fond
	_IMG_ITEM_SELECTED = new createjs.Shape();
	_IMG_ITEM_SELECTED.graphics.beginFill(createjs.Graphics.getRGB(255,0,0, 0.5)).drawRect(0, 0, 10, 10).endFill();
	_IMG_ITEM_SELECTED.x = x+5;
	_IMG_ITEM_SELECTED.y = y+25;

	Select   = TAB_CONT_ITEMS[numContPerso].addChild(_IMG_ITEM_SELECTED);
	//Select.x = x;
	//Select.y = 0;
}

function afficherSelecteurItemCase(x, y, typeItem)
{
	// Détermine dans quel conteneur se trouve l'item selectionné
	var numContCase;
	if(typeItem==1 || typeItem==2)
	{
		numContCase=3;

	}
	else if(typeItem==3)
	{
		numContCase=5;
	}
	else
	{
		numContCase=4;
	}

	// supprime l'ancien fond
	supprimerSelecteurItem(numContCase);

	// affichage fond
	_IMG_ITEM_SELECTED = new createjs.Shape();
	_IMG_ITEM_SELECTED.graphics.beginFill(createjs.Graphics.getRGB(255,0,0, 0.5)).drawRect(0, 0, 10, 10).endFill();
	_IMG_ITEM_SELECTED.x = x+5;
	_IMG_ITEM_SELECTED.y = y+25;

	Select   = TAB_CONT_ITEMS[numContCase].addChild(_IMG_ITEM_SELECTED);
	//Select.x = x;
	//Select.y = 0;
}

function afficherSelecteurItemEquip(x, y, typeItem)
{
	
	// Détermine dans quel conteneur se trouve l'item selectionné
	var numContPerso;
	if(typeItem==1)
	{
		contArme.removeChild(_IMG_ITEM_SELECTED);
		// affichage fond
		_IMG_ITEM_SELECTED = new createjs.Shape();
		_IMG_ITEM_SELECTED.graphics.beginFill(createjs.Graphics.getRGB(255,0,0, 0.5)).drawRect(0, 0, 10, 10).endFill();
		_IMG_ITEM_SELECTED.x = x+5;
		_IMG_ITEM_SELECTED.y = y+25;

		Select   = contArme.addChild(_IMG_ITEM_SELECTED);
	}
	else if(typeItem==2)
	{
		contArmure.removeChild(_IMG_ITEM_SELECTED);
		// affichage fond
		_IMG_ITEM_SELECTED = new createjs.Shape();
		_IMG_ITEM_SELECTED.graphics.beginFill(createjs.Graphics.getRGB(255,0,0, 0.5)).drawRect(0, 0, 10, 10).endFill();
		_IMG_ITEM_SELECTED.x = x+5;
		_IMG_ITEM_SELECTED.y = y+25;

		Select   = contArmure.addChild(_IMG_ITEM_SELECTED);
	}
	//Select.x = x;
	//Select.y = 0;
}

function supprimerSelecteurItem(numero)
{
	// supprime l'ancien fond
	TAB_CONT_ITEMS[numero].removeChild(_IMG_ITEM_SELECTED);
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
	}, _DUREE_AFFICHAGE);
}

// crée un petite animation quand le joueur subit une attaque de zomzom
function animationAttaqueZombie(nombreZombies)
{
	// si y'a pas de zombie -> Pas d'animation
	if (nombreZombies == 0)	 return;

	// maj label zombies attaquantes
	_LABEL_ATTAQUE_ZOMBIE.text = "";
	_LABEL_ATTAQUE_ZOMBIE.text = "Attaque de "+nombreZombies+" zombie(s) !";
	//_LABEL_ATTAQUE_ZOMBIE = new createjs.Text("Attaque de "+nombreZombies+" zombie(s) !", _POLICE_TITRE_2, "#ff0000");
	_LABEL_ATTAQUE_ZOMBIE.x = 70;
	_LABEL_ATTAQUE_ZOMBIE.y = 150;
	stage.addChild(_LABEL_ATTAQUE_ZOMBIE);

	// faire clignoter le cadre
	animationCadreMap("rouge");

	clearInterval(_ID_INTER_NBR_ZOMBIE_ATTAQUANTS);

	_ID_INTER_NBR_ZOMBIE_ATTAQUANTS = setInterval(function()
	{
		stage.removeChild(_LABEL_ATTAQUE_ZOMBIE);
	}, _DUREE_AFFICHAGE)
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
		socket.emit('INFO_PERSONNAGE_CS');
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
			majPtsAttaqueDefense(currentPerso);
			break;

		case 2:
			msgAction = ("Vous êtes désormais équipé de l'armure \"" + currentItem.nom + "\".");
			codeAction = 1;
			majInventairePerso(currentPerso);
			majPtsAttaqueDefense(currentPerso);
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
			majPtsAttaqueDefense(currentPerso);
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
			majPtsAttaqueDefense(currentPerso);
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
socket.on('INV_CASE_SC', function (type, codeRetour, id_item, DegatsG, RestG, item)
{
	if (RestG > 0)
	{
		animationAttaqueZombie(RestG);
	}

	var msgAction = "";
	var codeAction = 0;
	if (type == 'RAMASSER') 
	{
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
			msgAction =("Impossible de ramasser " + item.nom + " : vous avez atteint votre poids maximal.");
			 codeAction = 3;
			_SELECTED_ITEM_CASE=-1;
			break;
			// objet pas dans case
		case -2:
			msgAction =("Impossible de ramasser " + item.nom + " : l'item vient d'être ramassé par quelqu'un d'autre.");
			 codeAction = 3;
			_SELECTED_ITEM_CASE=-1;
			break;
		case -5:
			msgAction =("Vous avez été intercepté par des zombies rôdant dans la salle !");
			codeAction = 3;
			_SELECTED_ITEM_CASE=-1;
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		case -6:
			msgAction = ("Ramassage d'ODD impossible : voulez vous trahir votre équipe ?");
			codeAction = 3;
			_SELECTED_ITEM_CASE=-1;
			break;
			// ramassage ok
		default:

			msgAction = ("L'item " + item.nom + " a été ajouté a votre sac ");
			codeAction = 1;
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
			msgAction = ("Déséquipez avant de déposer !");
			 codeAction = 2;
			_SELECTED_ITEM_PERSO=-1;
			break;
		case -4:
			msgAction = ("Erreur interne !");
			 codeAction = 2;
			_SELECTED_ITEM_PERSO=-1;
			break;
		case -2:
			msgAction = ("L'item " + item.nom + " n'est plus dans le sac !");
			 codeAction = 2;
			_SELECTED_ITEM_PERSO=-1;
			break;
			// dépôt ok
		default:
			msgAction = ("Vous venez de deposer :  "+ item.nom );//+ " );//\nSac : " + codeRetour + " kg");
 			codeAction = 1;
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
	if (currentCase == "ERREUR_CASE")
	{
		var msgAction = "";
		var codeAction = 0;
		labelAction.text=("Erreur de case !");
		return;
	}

	// Le personnage a changé de case, l'objet ne doit plus être sélectionner
	_SELECTED_ITEM_CASE=-1;

	// Tri des items de la case
	currentCase.listeItem.sort(function(item1,item2){return item1.id-item2.id;});

	// Met a jour...
	// ...l'image de la case
	majImageMap(currentCase, idSousCase);

	// .. les forces en présence
	majForceEnPresence(nbrAllies, nbrEnnemis, currentCase.nbrGoules);

	// ... le bouton d'attaque zombies 
	majBtnGoules(currentCase.nbrGoules);

	// ... le boutons des joueurs
	majBtnJoueurs(nbrAllies+nbrEnnemis);
	
	// ... reset les 'selecteds' des items
	majBtnRamasser();
	
	// ... l'inventaire de case
	majInventaireCase(currentCase);

	// ...les proba de cache et fouille
	var probaCache, probaFouille;
	probaCache   = currentCase.probaCache * _PERSO_PROBA_CACHE;
	probaFouille = currentCase.probaObjet * _PERSO_PROBA_FOUILLE;

	// ... les barres liés au proba fouille / cache 
	if(probaCache >  90)	cacheBar.scaleX = 0.9 * cacheBarWidth;
	else 					cacheBar.scaleX = (probaCache/100) * cacheBarWidth;

	if(probaFouille > 90)	fouilleBar.scaleX = 0.9 * fouilleBarWidth;
	else 					fouilleBar.scaleX = (probaFouille/100) * fouilleBarWidth;

	// .. les tooltips liés aux pictos du joueur
	majEventsPictoProbas(probaFouille, probaCache);
	
	// ... le tabel du nom de la case
	labelCaseEnCours.text = "";
	afficherNomCase(currentCase.nom);

	// ... la description de la case
	//majDesCase(currentCase.description);
	labelDescriptionCase.text = "";
	labelDescriptionCase.text = currentCase.description;

});

/************************************************************************************************************
 * RECEPTION DES INFORMATIONS SUR LE PERSONNAGE
 */
socket.on('INFO_PERSONNAGE_SC', function(currentPerso) 
{
	//alert('INFO_PERSO');
	// retien le goule max poru choix de la couleur du nombre de goules
	_LAST_GOULES_MAX = currentPerso.goulesMax;

	// configure...
	/// ... le bouton de fouille rapide
	majBtnFouilleRapide(currentPerso);

	// affiche...
	/// ... la fiche du perso (relative a la competence)
	// à ne faire qu'une seule fois au démarage 
	if(imgPerso==null || _START==false)
	{
		majFichePersoSimple(currentPerso);
		_START=true;
	}

	// met a jour..
	/// ... les barres du perso (vie, mouvement ...)
	majBarresPerso(currentPerso);

	/// ... son inventaire
	majInventairePerso(currentPerso);
	
	/// ... les boutons de mode
	majBoutonsMode(currentPerso);

	/// ... les mesages en attente
	majBoutonMessages(currentPerso);
		
	/// ... les pts attaque et def
	majPtsAttaqueDefense(currentPerso);
		/// branche 
	majEventsPictoPerso(currentPerso);

	// si il est mort, on lui affiche l'écran de mort
	if(currentPerso.ptSante<=0 && currentPerso.listeMsgAtt.length > 0)
	{
		pageMortPersonnage(currentPerso);
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
socket.on('PERSONNAGE_USE_SC', function(id_item, codeRetour, item)
{
	switch(codeRetour)
	{
	case 1: 
		afficherMessageRetour("Vous venez de consommer l'item : " + item.nom, 1);
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -1:
		afficherMessageRetour("Consommation impossible : L'item " + item.nom + "n'est plus dans le sac !", 3);
		break;
	case -2:
		afficherMessageRetour("Consommation impossible : L'item " + item.nom + "n'est pas consommable !", 3);
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
	if (nbrGoulesA > 0)
	{
		animationAttaqueZombie(nbrGoulesA);
	}
	switch(reponse)
	{
	case 1: 
		afficherMessageRetour("Vous venez de changer de mode ", 1);
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case 0 : 
		afficherMessageRetour("Changement de mode raté ! Erreur interne", 3);
		break;
	case -4 : 
		afficherMessageRetour("Changement de mode mode raté ! Vous êtes dans ce mode !", 2);
		break;
	case -5: 
		afficherMessageRetour("Vous avez été intercepté par des zombies rôdant dans la salle !", 3);
		// s'il a eu des degats, on maj le perso
		/*if(degatsInfliges != 0)
		{
			socket.emit('INFO_PERSONNAGE_CS');
		}
		// si des zombies l'on attaqué, on affiche l'animation
		if (nbrGoulesA > 0)
		{
			animationAttaqueZombie(nbrGoulesA);
		}*/

		/*if(degatsInfliges!=0)
		{
			labelAction.text +=("Mais blessé (" + degatsInfliges + ")"); 
		}*/

		/*if(nbrGoulesA==1)
		{
			labelAction.text +=("par " + nbrGoulesA + " zombie !");
		}
		else if(nbrGoulesA>1)
		{
			labelAction.text +=("par " + nbrGoulesA + " zombies !");
		}*/
		break;
	case -10:
		afficherMessageRetour("Changement de mode raté : vous n'avez pas assez de points d'action !", 3);
		break;
	}
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
	if (nbrGoulesA > 0)
	{
		animationAttaqueZombie(nbrGoulesA);
	}
	
	var msgAction = "";
	var codeAction = 0;
	switch(reponse)
	{
	case  1 : 
		msgAction = ("Fouille rapide réussie ! Objet découvert : " + item.nom);
		
		if (ajouteAuSac == 0)
		{
			msgAction += " ajouté à la case ! ";
			codeAction = 1;
			socket.emit('INFO_CASE_CS');
		}
		else if (ajouteAuSac == 1)
		{
			msgAction += " ajouté au sac ! ";
			codeAction = 1;
			socket.emit('INFO_PERSONNAGE_CS');
		}

		if(nbrEnnemisDecouverts==1)
		{
			msgAction =(nbrEnnemisDecouverts + " Ennemi découvert ! ");
			codeAction = 1;
			socket.emit('INFO_CASE_CS');
		}
		else if(nbrEnnemisDecouverts>1)
		{
			msgAction =(nbrEnnemisDecouverts + " Ennemis découverts ! ");
			codeAction = 1;
			socket.emit('INFO_CASE_CS');
		}
		break;
	case  0 : 
		msgAction = ("Erreur interne");
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -1 : 
		msgAction = ("Fouille rapide ratée");
		codeAction = 2;
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -5 : 
		msgAction = ("Fouille rapide ratée");
		codeAction = 2;
		socket.emit('INFO_PERSONNAGE_CS');
		/*if(degatsInfliges!=0)
		{
			labelAction.text +=(" et blessé (" + degatsInfliges + ")"); 
		}
		if(nbrGoulesA==1)
		{
			animationAttaqueZombie(nbrGoulesA);
		}
		else if(nbrGoulesA>1)
		{
			animationAttaqueZombie(nbrGoulesA);
		}*/
		
		break;
	case -10 :
		msgAction = ("Points d'action insuffisants !");
		codeAction = 3;
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	}
	afficherMessageRetour(msgAction, codeAction);
	//socket.emit('INFO_PERSONNAGE_CS');
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
			labelAction.text+=("L'ennemi a perdu : " + degatsI + "points de vies");
		}
		if(degatsRecusE!=0)
		{
			labelAction.text+=("L'ennemi a riposté : -" + degatsRecusE + " points de vies");
			socket.emit('INFO_PERSONNAGE_CS');
		}
		break;
	case -1:
		labelAction.text=("L'ennemi n'est plus ici !");
		break;
	case -5:
		labelAction.text=("Attaque ratée !");
		if(degatsInfliges!=0)
		{
			labelAction.text +=(" Et blessé (" + degatsRecusG + ")"); 
		}
		if(nbrGoulesA==1)
		{
			labelAction.text +=(" par " + nbrGoulesA + " zombie !");
		}
		else if(nbrGoulesA>1)
		{
			labelAction.text +=(" par " + nbrGoulesA + " zombies !");
		}
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -10:
		labelAction.text=("Points d'action insuffisants");
		break;
	}
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
		afficherMessageRetour("Votre attaque contre les zombies a réussi !", 1);
		//socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 1: 
		afficherMessageRetour("Votre attaque contre les zombies a réussi !", 1);
		//socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 0:
		afficherMessageRetour("Attaque de zombie : erreur interne", 2);
		break;

	case -1:
		afficherMessageRetour("Votre attaque contre les zombies a échouée !", 3);
		//socket.emit('INFO_PERSONNAGE_CS');
		break;

	case -2:
		afficherMessageRetour("Impossible : Il n'y a pas de zombie dans la salle !", 3);
		break;

	case -10:
		afficherMessageRetour("Attaque impossible : vous n'avez pas assez de points d'action !", 3);
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
	alert("longueur liste alliés : " + listeAllies.length);
	var msgAction = "";
	var codeAction = 0;
	var decoup=8;

	contListeAllies.removeAllChildren();

	listePersoAllies = new Array();

	var imgPersoAllie;

	// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();

	var nbrPages = Math.ceil(listeAllies.length / decoup);
	var TailleFinListe =(listeAllies.length % decoup);

	//Gestion de l'affichage des boutons
	majFlechesListesPersoAllies(nbrPages);

	if(listeAllies.length!=0)
	{
		decouperListes(listeAllies, TabListe, nbrPages, TailleFinListe, decoup);
		majConteneurPersoListeAllies(TabListe, contListeAllies, _PAGE_PERSO_ALLIES);
	}

	//socket.emit('INFO_PERSONNAGE_CS');
});

function afficherTooltipPersoListe(x, y, currentPerso, modePerso, allie, DescriptionVie, DescriptionSac)
{
	var hauteur = 0;
	var coul;
	var largeur = 0;
	var espacementPictos = 15;
	var miseAechelle = 0.75;
	var startPosition = 5;

	y += 90;
	x += 130;
	hauteur = 7*espacementPictos + 3;

	// conteneur : Attention à bien respecter l'ordre d'affichage,
	// d'abord conteneur, fond, et ensuite les images
	contDescriptionPerso = new createjs.Container();
	contDescriptionPerso.x = x;
	contDescriptionPerso.y = y;
	contDescriptionPerso.width = 32;
	contDescriptionPerso.height = hauteur;
	contListe.addChild(contDescriptionPerso);

	// dessine le fond du conteneur
 	fondConteneurDescriptionPerso = new createjs.Shape();
	

	// test si ca dépasse pas du canvas
	if(contDescriptionPerso.x + largeur > _CANVAS_LARGEUR)
	{
		contDescriptionPerso.x = _CANVAS_LARGEUR - largeur - 7;
	} 

	// ajout du fond au conteneur
	contDescriptionPerso.addChild(fondConteneurDescriptionPerso);

	// Déclaration des pictogrammes
	var imgArme, imgArmure, imgPseudo;

	var imgCompetence = new createjs.Bitmap("public/pictos/competence.png");
	imgCompetence.x=startPosition;
	imgCompetence.y=-startPosition+espacementPictos;
	imgCompetence.scaleX=miseAechelle;
	imgCompetence.scaleY=miseAechelle;

	var imgMode = new createjs.Bitmap("public/pictos/mode.png");
	imgMode.x=startPosition;
	imgMode.y=-startPosition+espacementPictos*2;
	imgMode.scaleX=miseAechelle;
	imgMode.scaleY=miseAechelle;

	var imgSante = new createjs.Bitmap("public/pictos/ptsVie.png");
	imgSante.x=startPosition;
	imgSante.y=-startPosition+espacementPictos*3;
	imgSante.scaleX=miseAechelle;
	imgSante.scaleY=miseAechelle;

	var imgSac = new createjs.Bitmap("public/pictos/poidsSac.png");
	imgSac.x=startPosition;
	imgSac.y=-startPosition+espacementPictos*4;
	imgSac.scaleX=miseAechelle;
	imgSac.scaleY=miseAechelle;

	// Déclaration du label de description
	var labelDescribePerso = contListe.addChild(new createjs.Text("", _POLICE_LABEL, _COULEUR_LABELS));
	labelDescribePerso.x = 35 ;
	labelDescribePerso.y = -startPosition + 5;

	// si c'est une description d'allié
	if (allie)
	{
		// Ajout du picto pseudo
		imgPseudo = new createjs.Bitmap("public/pictos/pseudo.png");
		imgPseudo.x=startPosition;
		imgPseudo.y=-startPosition;
		imgPseudo.scaleX=miseAechelle;
		imgPseudo.scaleY=miseAechelle;

		// défini les caractéristiques du personnage
		// Option 1
		var ligne0 = "Pseudo : " + currentPerso.listeMsgAtt;
		var ligne1 = "Compétence : " + currentPerso.competence;
		var ligne2 = "Mode : " + modePerso;
		var ligne3 = "Santé : " + currentPerso.ptSante + " / " + currentPerso.ptSanteMax;
		var ligne4 = "Sac rempli à : " + currentPerso.sacADos + " %";

		// Option 2
		/*var ligne0 = currentPerso.listeMsgAtt;
		var ligne1 = currentPerso.competence;
		var ligne2 = modePerso;
		var ligne3 = currentPerso.ptSante + " / " + currentPerso.ptSanteMax;
		var ligne4 = currentPerso.sacADos + " %";*/
		
		// On regarde si le personnage est équipé
		if(currentPerso.armeEquipee!=null)
		{
			var ligne5 = currentPerso.armeEquipee.nom + " - Valeur : " + currentPerso.armeEquipee.valeur;
			imgArme = new createjs.Bitmap(currentPerso.armeEquipee.imageName);
			imgArme.x=imgPseudo.x;
			imgArme.y=imgPseudo.y+espacementPictos*5;
			imgArme.scaleX=miseAechelle;
			imgArme.scaleY=miseAechelle;
			contDescriptionPerso.addChild(imgArme);
		}
		else
		{
			var ligne5 = "Pas d'arme équipée";
		}

		if(currentPerso.armureEquipee!=null)
		{
			var ligne6 = currentPerso.armureEquipee.nom + " - Valeur : " + currentPerso.armureEquipee.valeur;
			imgArmure = new createjs.Bitmap(currentPerso.armureEquipee.imageName);
			imgArmure.x=imgPseudo.x;
			imgArmure.y=imgPseudo.y+espacementPictos*6;
			imgArmure.scaleX=miseAechelle;
			imgArmure.scaleY=miseAechelle;
			contDescriptionPerso.addChild(imgArmure);
		}
		else
		{
			var ligne6 = "Pas d'armure équipée";
		}
		
		// Construction du label avec toutes les lignes
		labelDescribePerso.text = ligne0 +"\n" +ligne1 +"\n" + ligne2 + "\n" + ligne3 + "\n" +ligne4 +"\n" 	+ ligne5 + "\n" + ligne6;

		// calcul de la largeur du conteneur
		largeur = (Math.max(ligne1.length,ligne2.length, ligne0.length, ligne3.length, ligne4.length, ligne5.length, ligne6.length)) *7 + 80;

		// définition de la couleur de fond
		coul = createjs.Graphics.getRGB(0,0,250, 0.6);

		fondConteneurDescriptionPerso.graphics.beginFill(coul).drawRect(0, 0, largeur, hauteur).endFill();
	}
	// si c'est une description d'ennemi
	else
	{
		// défini les caractéristiques du personnage
		// Option 1
		var ligne1 = "Compétence : " + currentPerso.competence;
		var ligne2 = "Mode : " + modePerso;
		var ligne3 = DescriptionVie;
		var ligne4 = DescriptionSac;

		// Option 2
		/*var ligne1 = currentPerso.competence;
		var ligne2 = modePerso;
		var ligne3 = DescriptionVie;
		var ligne4 = DescriptionSac;*/
		
		// On regarde si le personnage est équipé
		if(currentPerso.armeEquipee!=null)
		{
			var ligne5 = currentPerso.armeEquipee.nom;
			imgArme = new createjs.Bitmap(currentPerso.armeEquipee.imageName);
			imgArme.x=startPosition;
			imgArme.y=-startPosition+espacementPictos*5;
			imgArme.scaleX=miseAechelle;
			imgArme.scaleY=miseAechelle;
			contDescriptionPerso.addChild(imgArme);
		}
		else
		{
			var ligne5 = "Pas d'arme équipée";
		}

		if(currentPerso.armureEquipee!=null)
		{
			var ligne6 = currentPerso.armureEquipee.nom;
			imgArmure = new createjs.Bitmap(currentPerso.armureEquipee.imageName);
			imgArmure.x=startPosition;
			imgArmure.y=-startPosition+espacementPictos*6;
			imgArmure.scaleX=miseAechelle;
			imgArmure.scaleY=miseAechelle;
			contDescriptionPerso.addChild(imgArmure);
		}
		else
		{
			var ligne6 = "Pas d'armure équipée";
		}
		
		// Construction du label avec toutes les lignes
		labelDescribePerso.text = "\n" + ligne1 + "\n" + ligne2 + "\n" + ligne3 + "\n" +ligne4 +"\n" + ligne5 + "\n" + ligne6;

		// calcul de la largeur du conteneur
		largeur = (Math.max(ligne1.length,ligne2.length, ligne3.length, ligne4.length, ligne5.length, ligne6.length)) *7 + 80;

		// définition de la couleur de fond
		coul = createjs.Graphics.getRGB(150,0,0, 0.8);

		fondConteneurDescriptionPerso.graphics.beginFill(coul).drawRect(0, 0, largeur, hauteur).endFill();
	}

	// Ajout du label au conteneur
	contDescriptionPerso.addChild(labelDescribePerso);
	
	// Ajout des images dans le conteneur
	contDescriptionPerso.addChild(imgPseudo);
	contDescriptionPerso.addChild(imgCompetence);
	contDescriptionPerso.addChild(imgMode);
	contDescriptionPerso.addChild(imgSante);
	contDescriptionPerso.addChild(imgSac);

	// ajout du conteneur au stage
	contListe.addChild(contDescriptionPerso);
}

function supprimerTooltipPersoListe()
{
	contListe.removeChild(contDescriptionPerso);
}

function majConteneurPersoListeAllies(tab, conteneur, pageEnCours)
{
	conteneur.removeAllChildren();
	var imgPersoAllie;
	var iPositionPersoInConteneur=0;
	try 
	{
		// instructions à essayer
		for (var i = 0; i < tab[pageEnCours].length ; i++) 
		{
			var persoA=tab[pageEnCours][i];

			var modePerso;

			//listePersoAllies.push(persoA);

			if(persoA.competence=="brute")
			{
				if(persoA.ptSante<=0)
				{
					imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Brute64gris.png");
				}
				else
				{
					imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Brute64.png");
				}
			}
			else if(persoA.competence=="chercheur")
			{
				if(persoA.ptSante<=0)
				{
					imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Chercheur64gris.png");
				}
				else
				{
					imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Chercheur64.png");
				}
			}
			else if(persoA.competence=="explorateur")
			{
				if(persoA.ptSante<=0)
				{
					imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Explorateur64gris.png");
				}
				else
				{
					imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Explorateur64.png");
				}
			}
			imgPersoAllie.x = iPositionPersoInConteneur * _spacePerso;
			imgPersoAllie.cursor= "normal";
			imgPersoAllie.name = i;

			// MOUSE OVER
			// Ajout de l'évenement a l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgPersoAllie.addEventListener('mouseover', function(event) {
				var currentPerso = tab[pageEnCours][event.target.name];
				// Texte de description du Mode
				modePerso="";
				switch(currentPerso.mode)
				{
				case 0:
					modePerso="Normal";
					break;
				case 1:
					modePerso="Fouille";
					break;
				case 2:
					modePerso="Caché";
					break;
				case 3:
					modePerso="Défense";
					break;
				}

			// Appel de la fonction pour afficher le tooltip
			afficherTooltipPersoListe(event.target.x, event.target.y, currentPerso, modePerso, 1);
			},false);

			imgPersoAllie.addEventListener('mouseout', function(event){
				supprimerTooltipPersoListe();
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
}

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR RENVOYER LA LISTE DES ENNEMIS DANS LA CASE
 * 
 * return liste des ennemis (tableau associatif) [idUtilisateur, personnageEnnemi]
 * erreur : liste vide si aucun ennemis dans la case
 */ 
socket.on('INFO_CASE_ENNEMIS_SC', function (listeEnn1, listeEnn2, equipe)
{
	//alert("Equipe = " + " - longueur liste 1 : " + listeEnn1.length + " longueur liste 2 : " + listeEnn2.length);

	var msgAction = "";
	var codeAction = 0;
	var decoup=8;

	var i=0;
	var iPositionPersoInConteneur=0;

	var Select;

	//this.listePersoEnnemis = new Array();
	contListeEnnemis1.removeAllChildren();
	contListeEnnemis2.removeAllChildren();

	// tableau qui contient toutes les listes d'objets
	var TabListe1=new Array();
	var TabListe2=new Array();

	var nbrPages1 = Math.ceil(listeEnn1.length / 10);
	var TailleFinListe1 =(listeEnn1.length % 10);
	//alert("nbrPages1 : " + nbrPages1);
	//alert("TailleFinListe1 : " + TailleFinListe1);

	var nbrPages2 = Math.ceil(listeEnn2.length / 10);
	var TailleFinListe2 =(listeEnn2.length % 10);
	//alert("nbrPages2 : " + nbrPages2);
	//alert("TailleFinListe2 : " + TailleFinListe2);

	majFlechesListesPersoEnnemis(nbrPages1, nbrPages2);

	// VERIFIER QUE LES LISTES CONTIENNENT BIEN DES ITEMS !
	if(listeEnn1.length!=0)
	{
		//alert("if 1");
		// Découpage des listes
		decouperListes(listeEnn1, TabListe1, nbrPages1, TailleFinListe1, decoup);
		majConteneurPersoListeEnnemi(TabListe1, contListeEnnemis1, _PAGE_PERSO_ENN_1);
	}

	if(listeEnn2.length!=0)
	{
		//alert("if 2");
		// Découpage des listes
		decouperListes(listeEnn2, TabListe2, nbrPages2, TailleFinListe2, decoup);
		majConteneurPersoListeEnnemi(TabListe2, contListeEnnemis2, _PAGE_PERSO_ENN_2);
	}

	// Ecriture du nom des équipes selon l'équipe actuelle :
	if(equipe==1)
	{
		labelEnnemisListe1.text="Liste des Ennemis QSF :";
		labelEnnemisListe2.text="Liste des Ennemis INNO :";
	}
	else if(equipe==2)
	{
		labelEnnemisListe1.text="Liste des Ennemis AGI :";
		labelEnnemisListe2.text="Liste des Ennemis QSF :";
	}
	else if(equipe==3)
	{
		labelEnnemisListe1.text="Liste des Ennemis AGI :";
		labelEnnemisListe2.text="Liste des Ennemis INNO :";
	}

	//socket.emit('INFO_PERSONNAGE_CS');
});

function majFlechesListesPersoAllies(nbPages)
{
	if(_PAGE_PERSO_ALLIES>nbPages-1)
	{
		_PAGE_PERSO_ALLIES=nbPages-1;
	}
	else if (_PAGE_PERSO_ALLIES<0)
	{
		_PAGE_PERSO_ALLIES=0;
	}

	if(_PAGE_PERSO_ALLIES==nbPages-1)
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

	if(nbPages ==0)
	{
		Btn_PAGE_PERSO_ALLIESLeft.visible=false;
		Btn_PAGE_PERSO_ALLIESRight.visible=false;
	}
}

function majFlechesListesPersoEnnemis(nbPagesEquipe1, nbPagesEquipe2)
{
	// Traitement pour l'équipe 1
	if(_PAGE_PERSO_ENN_1>nbPagesEquipe1-1)
	{
		_PAGE_PERSO_ENN_1=nbPagesEquipe1-1;
	}
	else if (_PAGE_PERSO_ENN_1<0)
	{
		_PAGE_PERSO_ENN_1=0;
	}

	if(_PAGE_PERSO_ENN_1==nbPagesEquipe1-1)
	{
		Btn_PAGE_PERSO_ENN_1_Right.visible=false;
	}
	else
	{
		Btn_PAGE_PERSO_ENN_1_Right.visible=true;
	}

	if(_PAGE_PERSO_ENN_1==0)
	{
		Btn_PAGE_PERSO_ENN_1_Left.visible=false;
	}
	else
	{
		Btn_PAGE_PERSO_ENN_1_Left.visible=true;
	}

	if(nbPagesEquipe1 ==0)
	{
		Btn_PAGE_PERSO_ENN_1_Left.visible=false;
		Btn_PAGE_PERSO_ENN_1_Right.visible=false;
	}
	
	// Traitement pour l'équipe 2
	if(_PAGE_PERSO_ENN_2>nbPagesEquipe2-1)
	{
		_PAGE_PERSO_ENN_2=nbPagesEquipe2-1;
	}
	else if (_PAGE_PERSO_ENN_2<0)
	{
		_PAGE_PERSO_ENN_2=0;
	}

	if(_PAGE_PERSO_ENN_2==nbPagesEquipe2-1)
	{
		Btn_PAGE_PERSO_ENN_2_Right.visible=false;
	}
	else
	{
		Btn_PAGE_PERSO_ENN_2_Right.visible=true;
	}

	if(_PAGE_PERSO_ENN_2==0)
	{
		Btn_PAGE_PERSO_ENN_2_Left.visible=false;
	}
	else
	{
		Btn_PAGE_PERSO_ENN_2_Left.visible=true;
	}

	if(nbPagesEquipe2 ==0)
	{
		Btn_PAGE_PERSO_ENN_2_Left.visible=false;
		Btn_PAGE_PERSO_ENN_2_Right.visible=false;
	}
}

function majConteneurPersoListeEnnemi(tab, conteneur, pageEnCours)
{
	alert("Page en cours : " + pageEnCours);
	//conteneur.removeAllChildren();
	var imgPersoEnnemi;
	
	var iPositionPersoInConteneur=0;
		for (var i = 0; i < tab[pageEnCours].length ; i++) 
		{
			var persoE=tab[pageEnCours][i];

			var modePerso;
			var DescriptionSac;
			var PourcentVie;
			var DescriptionVie;

			//this.listePersoEnnemis.push(persoE);

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
			conteneur.addChild(imgPersoEnnemi);
			imgPersoEnnemi.name = i;

			// Ajout de l'évenement a l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgPersoEnnemi.addEventListener('mouseover', function(event)
			{
				var currentPerso = tab[pageEnCours][event.target.name];

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
					case 0: modePerso="";
					modePerso="Normal";
					break;
					case 1: modePerso="";
					modePerso="Fouille";
					break;
					case 2: modePerso="";
					modePerso="Caché";
					break;
					case 3: modePerso="";
					modePerso="Défense";
					break;
				}

				// Appel de la fonction pour afficher le tooltip
				afficherTooltipPersoListe(event.target.x, event.target.y, currentPerso, modePerso, 0, DescriptionVie, DescriptionSac);

			},false);

			imgPersoEnnemi.addEventListener('mouseout', function(event){
				supprimerTooltipPersoListe();
			},false);
			
			imgPersoEnnemi.addEventListener('touchend', function(event){
				supprimerTooltipPersoListe();
			},false);


			imgPersoEnnemi.addEventListener("click", function(event){
				if (Select!=null)
				{
					conteneur.removeChild(Select);
				}
				var num=event.target.x;
				Select = conteneur.addChild(new createjs.Bitmap("public/Boutons/Select64.png"));
				Select.x=(num);
				Select.y=0;
				var currentPerso = tab[pageEnCours][event.target.name];
				_SELECTED_PERSO=currentPerso.id;
				majBtnAttaquer(BtnCancelListe.x, BtnCancelListe.y);
			});
			imgPersoEnnemi.addEventListener("touchstart", function(event){
				
				var currentPerso = tab[pageEnCours][event.target.name];

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
				case 0: modePerso="";
				modePerso="Normal";
				break;
				case 1: modePerso="";
				modePerso="Fouille";
				break;
				case 2: modePerso="";
				modePerso="Caché";
				break;
				case 3: modePerso="";
				modePerso="Défense";
				break;
				}
				// Appel de la fonction pour afficher le tooltip
				afficherTooltipPersoListe(event.target.x, event.target.y, currentPerso, modePerso, 0, DescriptionVie, DescriptionSac);

				if (Select!=null)
				{
					conteneur.removeChild(Select);
				}
				var num=event.target.x;
				Select = conteneur.addChild(new createjs.Bitmap("public/Boutons/Select64.png"));
				Select.x=(num);
				Select.y=0;
				var currentPerso = TabListe[_PAGE_PERSO_ENN][event.target.name];
				_SELECTED_PERSO=currentPerso.id;
				majBtnAttaquer(BtnCancelListe.x, BtnCancelListe.y);
			});

			

			// position de l'item dans le conteneur
			iPositionPersoInConteneur++;
		}
}

socket.on('ATTAQUE_NUIT_SC', function ()
{
	_ECRAN_ATTAQUE_NUIT = true;
	pageAttaqueDeNuit();
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