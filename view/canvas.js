/**
 * DECLARATION DES VARIABLES GLOBALES
 * 
		/*var mouseTarget; // the display object currently under the mouse, or being dragged
		var dragStarted; // indicates whether we are currently in a drag operation
		var offset;
 * 
 */

// Variables pour le canvas
var canvas, stage, _largeurCanvas, _hauteurCanvas;

// Variables pour les images
var background, backgroundPreload, map, person, imgPerso;

// Variables pour les sélections
var _selectedItemCase = -1;
var _selectedItemPerso = -1;
var _selectedItemPersoType = -1;
var _selectedItemEquip = -1;
var _selectedPerso = -1;

// Variables pour les probabilités du perso
var _persoProbaCache=1;
var _persoProbaFouille=1;

//Liste des messages du personnage ( ! global ) 
var _listeMessages;

//Variables pour la coloration des messages de retour
var _boolColorAction=false;
var _colorLabelAction;

// Variables pour la navigation entre les pages items/persos/messages
var PageItemPerso=0;
var PageItemPersoDead=0;
var PageItemCase=0;
var PagePersoEnn=0;
var PagePersoAllies=0;
var PageMessage=0;

// Variables pour l'affichage des items équipés une fois
var armeDejaEquip=false;
var armureDejaEquip=false;
var pressBtnEquipArme=true;
var pressBtnEquipArmure=true;

// Variables correspondant aux flèches des pages
var BtnPageItemPersoRight, BtnPageItemPersoLeft, BtnPageItemCaseRight, BtnPageItemCaseLeft, BtnPageItemPersoDeadRight, BtnPageItemPersoDeadLeft;

//******************************************
//*  Réglages mise en forme (partie Design)*
//******************************************

// Police des labels du Plateau de jeu
var PoliceLabel="14px Consolas";
// label.lineHeight
var _LineHeight = 15;
// label.textBaseline
var _TextBaseline = "top";

// Couleurs des labels
var ColorLabel = "#fff";
var ColorLabelBonus = "#008000";

// Police du label de la page de mort
var _policeLabelMort="30px Consolas";
var _colorLabelMort="#FFFFFF";
var _colorLabelHeureMort="#000000";

// Pour centrer les flèches de la map
var _centrageBpMap = 50;

// Espacement entre les items
var _spaceItem = 32;
var _spacePerso = 64;

// Espacement entre les boutons
var _espaceBoutonY=45;

// Espacement entre les labels
var _EspaceLabelX = 265;
var _EspaceLabelY = 20;

// Placement Conteneur ItemCase
var _contItemCaseX = 750;
var _contItemCaseY = 530;

// Dimension Conteneur ItemCase
var _contItemCaseH = 40;
var _contItemCaseW = 330;

// Placement label ItemCase
var _labelItemCaseX = _contItemCaseX + 180;
var _labelItemCaseY = _contItemCaseY - 20;

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

// Placement Conteneur ItemPerso
var _contItemPersoX = _labelItemPersoX;
var _contItemPersoY = _labelItemPersoY + _EspaceLabelY-5;

// Dimension Conteneur ItemPerso
var _contItemPersoH = 40;
var _contItemPersoW = 330;

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

//------------------ Zone 9 : Infos Case -------------------------------------------------------

// Placement label Description Item
var _labelDescribeItemX = _contItemCaseX-5;
var _labelDescribeItemY = _contItemCaseY + 40;

// Placement label Nombre d'Aliés
var _labelNbAlliesX  = 175;
var _labelNbAlliesY = 530;

// Placement label Nombre d'Ennemis
var _labelNbEnnemisX = _labelNbAlliesX ;
var _labelNbEnnemisY = _labelNbAlliesY + _EspaceLabelY;

// Placement label Nombre de Goules
var _labelNbGoulesX = _labelNbAlliesX ;
var _labelNbGoulesY = _labelNbEnnemisY + _EspaceLabelY;

// Placement label description case
var _labelDescribeCaseX=_labelNbAlliesX;
var _labelDescribeCaseY=_labelNbGoulesY + _EspaceLabelY;

//------------------ Zone 8 : Proba de la case -------------------------------------------------------

// Placement label Probabilité de Cache
var _labelProbaCacheX = _labelNbAlliesX + 240;
var _labelProbaCacheY = _labelNbAlliesY ;

// Placement label Probabilité de Fouille
var _labelProbaFouilleX = _labelProbaCacheX ;
var _labelProbaFouilleY = _labelProbaCacheY + _EspaceLabelY;

// Placement label id Salle en cours
var _labelIdSalleX = _labelProbaCacheX;
var _labelIdSalleY = _labelProbaCacheY + 2*_EspaceLabelY;

//-----------------------------------------------------------------------------------

// Placement label Retour des actions
var _labelActionX = 10;
var _labelActionY = 580;

//------------------ Zone 13 : Modes-------------------------------------------------------

// Placement Conteneur des _labelProbaCacheYboutons de mode
var _contModeX = 20;
var _contModeY = 330;
var _contModeW = 140;
var _contModeH = 3*_espaceBoutonY;

// Placement label Choix Mode
var _labelChoixModeX = _contModeX+5;
var _labelChoixModeY = _contModeY-20;

//------------------ Zone 4 : Equipement Perso-------------------------------------------------------

// Placement Conteneur ArmeEquip
var _contArmeX = _labelArmeX + 125;
var _contArmeY = _labelArmeY-3;

// Dimension Conteneur ArmeEquip
var _contArmeH = 30;
var _contArmeW = 30;

// Placement Conteneur ArmureEquip
var _contArmureX = _labelArmureX + 135;
var _contArmureY = _labelArmureY-3;

// Dimension Conteneur ArmureEquip
var _contArmureH = 30;
var _contArmureW = 30;

//------------------ Zone 8 : Listes-------------------------------------------------------

// Placement Conteneur des Boutons liste
var _contBtnsListesX = _contModeX;
var _contBtnsListesY = 500;
var _contBtnsListesW = 140;
var _contBtnsListesH = 2*_espaceBoutonY;

// Placement du label nombre de nouveaux messages
var _labelNombreNouvMsgX=_contBtnsListesX + _contBtnsListesW/3;
var _labelNombreNouvMsgY=_contBtnsListesY + 100;

// Placement label Choix Mode
var _labelBtnsListesX = _contBtnsListesX+2;
var _labelBtnsListesY = _contBtnsListesY-20;

//------------------------- Zone 5 : Btns Inv Perso ---------------------------------------
// Placement Conteneur des Boutons perso
var _contBtnsInvPersoX = 945;
var _contBtnsInvPersoY = 140;
var _contBtnsInvPersoW = 140;
var _contBtnsInvPersoH = 3*_espaceBoutonY;

// Placement label Choix Mode
var _labelBtnsInvPersoX = _contBtnsInvPersoX-5;
var _labelBtnsInvPersoY = _contBtnsInvPersoY-20;

//------------------------- Zone 6 : Btns Inv Case ---------------------------------------
// Placement Conteneur des Boutons case
var _contBtnsInvCaseX = _contBtnsInvPersoX ;
var _contBtnsInvCaseY = 310;
var _contBtnsInvCaseW = 140;
var _contBtnsInvCaseH = 4*_espaceBoutonY;

// Placement label Choix Mode
var _labelBtnsInvCaseX = _contBtnsInvCaseX-5;
var _labelBtnsInvCaseY = _contBtnsInvCaseY-20;

//------------------ Zone 12 : Map -------------------------------------------------------

// Placement Conteneur Map (en fonction de la taille de l'image !!)
var _contMapX = 1100/2 - 746/2;
var _contMapY = 620/2 - 420/2;

// Dimension Conteneur Map
var _contMapH = 420;
var _contMapW = 746;

// Placement du dernier message
var _labelDernierMessageX = _labelPtsVX;
var _labelDernierMessageY = _contMapY-20;

//------------------- Zone 14 : Labels de retour------------------------------------------------------
//Placement Conteneur des labels de retour
var _contLabelsActionX = 5;
var _contLabelsActionY = 120;
var _contLabelsActionW = 165;
var _contLabelsActionH = 20*9;

//Placement Conteneur des informations de la case
var _contInfoCaseX = 175;
var _contInfoCaseY = 530;
var _contInfoCaseW = 750-_contInfoCaseX;
var _contInfoCaseH = _hauteurCanvas-530;

/**
 * DECLARATION DES LABELS, CONTENEURS, CONTOURS ET BOUTONS
 */

//-------------- Déclaration des labels----------------------------------------------

var labelAction, labelObjetCase, labelInventaire, labelDescribeItem,
labelPtsMove, labelPtsAction, labelPtsVie, labelPoidsSac, labelPtsAtq, labelPtsDef,
labelBonusArme, labelBonusArmure, labelIdSalle, labelNbAllies, labelNbEnnemis,
labelNbGoules, labelProbaCache, labelProbaFouille, labelPourcentLoad,
labelChoixMode, labelBtnsListes, labelBtnsInvPerso, labelBtnsInvCase, labelPtsFaim, 
labelAlliesListe, labelEnnemisListe, labelDescribePerso, labelMessage, 
labelDernierMessage, labelNombreNouvMsg, labelFichePerso, labelDescribeCase,
labelLancementServeur, labelAction;

//-------------- Déclaration des conteneurs----------------------------------------------

var contInvCase, contInvPerso, contArme, contArmure, contMap, contPerso, contMode,
contBtnsListes, contDead, contInfoCase, contBtnsInvPerso, contBtnsInvCase, contListe,
contListeAllies, contListeEnnemis, contLabelsAction, contMessage;

//-------------- Déclaration des contours----------------------------------------------

var shape, shape1, shape2, shape3, shape4, shape6, shape7, shape8, shapeMode,
shapeLabelsAction, shapeMessage, shapeDead, shapeInfoCase,
shapeBtnsListes, shapeBtnsInvPerso, shapeBtnsInvCase, shapeBtnsListes, 
shapeBtnsInvPerso, shapeBtnsInvCase;

//-------------- Déclaration des boutons----------------------------------------------

var BtnPagePersoAlliesRight, BtnPagePersoAlliesLeft, BtnPagePersoEnnRight, BtnPagePersoEnnLeft,
BtnPageMessageDown, BtnPageMessageUp, BtnCancelListe;

/**
 * IMPORTANT : PERMET DE LANCER LE CANVAS !!
 */
onload = initialize;

/**
 * FONCTION D'INITIALISATION ET DE CHARGEMENT
 */
function initialize() {

	// ************************************************
	// * Création du canvas et des autres élements   **
	// ************************************************
	
	// Création du canvas
	canvas = document.getElementById("myCanvas");
	
	//Création du stage (la scène) + recupération de sa taille
	stage = new createjs.Stage(canvas);
	_largeurCanvas = stage.canvas.width;
	_hauteurCanvas = stage.canvas.height;

	// autoriser le mouse over / out events
	stage.enableMouseOver(20);

	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);

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
	                {src:"public/Background_1.jpg", id:"idBackground_1"}, 
	                {src:"public/Background_11.jpg", id:"idBackground_11"},  
	                {src:"public/Background_Dead.jpg", id:"idBackground_Dead"},
	                {src:"public/Background_Nuit.jpg", id:"idBackground_Nuit"},
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
	                {src:"public/spritesheets/nourriture/713.png", id:"713"}
	                ];

	// application du background Preload
	backgroundPreload = new createjs.Bitmap("public/Background_1.jpg");
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
	stage.update();
}

function handleProgress() 
{

	loadingBar.scaleX = preload.progress * loadingBarWidth;

	progresPrecentage = Math.round(preload.progress*100);
	loadProgressLabel.text =("Loading Apocalypse...\n\n\n\n" + progresPrecentage);
	labelPourcentLoad.text=" %";

	stage.update();
}

function handleComplete() 
{
	stage.removeChild(labelPourcentLoad);
	backgroundPreload.cursor="pointer";
	loadingBarContainer.cursor="pointer";

	loadProgressLabel.text = "Click to Survive";
	stage.update();

	canvas.addEventListener("click", handleClick);
}

function handleClick() {
	stage.removeChild(loadProgressLabel, loadingBarContainer, backgroundPreload);
	canvas.removeEventListener("click", handleClick);
	start();
}

function start()
{
	// Lancement du jeu si connexion ok
	if(socket.socket.connected)
		setPlateau();
}

function setPlateau()
{
	// application du background
	var background = new createjs.Bitmap("public/Background_11.jpg");
	background.image.onload = setImg(background, 0, 0);

	// ******************************************
	// ** creation des conteneurs               *
	// ******************************************

	//------------------ Zone 7 : Inv Case -------------------------------------------------------
	contInvCase = new createjs.Container();
	contInvCase.x = _contItemCaseX;
	contInvCase.y = _contItemCaseY;
	contInvCase.height = _contItemCaseH;
	contInvCase.width = _contItemCaseW;
	stage.addChild(contInvCase);
	shape = new createjs.Shape();
	stage.addChild(shape);
	shape.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contItemCaseX-4, _contItemCaseY-4, _contItemCaseW+4, _contItemCaseH+4);

	//------------------ Zone 4 : Equipement perso -------------------------------------------------------
	contInvPerso = new createjs.Container();
	contInvPerso.x = _contItemPersoX;
	contInvPerso.y = _contItemPersoY;
	contInvPerso.height = _contItemPersoH;
	contInvPerso.width = _contItemPersoW;
	stage.addChild(contInvPerso);
	shape1 = new createjs.Shape();
	stage.addChild(shape1);
	shape1.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contItemPersoX-4, _contItemPersoY-4, _contItemPersoW+4, _contItemPersoH+4);

	contArme = new createjs.Container();
	contArme.x = _contArmeX;
	contArme.y = _contArmeY;
	contArme.height = _contArmeH;
	contArme.width = _contArmeW;
	stage.addChild(contArme);
	shape2 = new createjs.Shape();
	stage.addChild(shape2);
	shape2.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contArmeX-4, _contArmeY-4, _contArmeW+4, _contArmeH+4);

	contArmure = new createjs.Container();
	contArmure.x = _contArmureX;
	contArmure.y = _contArmureY;
	contArmure.height = _contArmureH;
	contArmure.width = _contArmureW;
	stage.addChild(contArmure);
	shape3 = new createjs.Shape();
	stage.addChild(shape3);
	shape3.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contArmureX-4, _contArmureY-4, _contArmureW+4, _contArmureH+4);

	//------------------ Zone 12 : Map -------------------------------------------------------
	contMap = new createjs.Container();
	contMap.x = _contMapX;
	contMap.y = _contMapY;
	contMap.height = _contMapH;
	contMap.width = _contMapW;
	stage.addChild(contMap);
	//contMap.cache(_contMapX, _contMapY, _contMapW, _contMapH);

	contPerso = new createjs.Container();
	contPerso.x = -5;
	contPerso.y = 15;
	contPerso.height = 64;
	contPerso.width = 64;
	stage.addChild(contPerso);
	/*shapePerso = new createjs.Shape();
	stage.addChild(shapePerso);
	shapePerso.graphics.setStrokeStyle(4).beginStroke("#850000").drawRect(
			2, 2, 173, 96);*/

	//------------------------- Zone 13 : Modes-----------------------------------------------
	contMode = new createjs.Container();
	contMode.x = _contModeX;
	contMode.y = _contModeY;
	contMode.height = _contModeH;
	contMode.width = _contModeW;
	stage.addChild(contMode);
	shapeMode = new createjs.Shape();
	stage.addChild(shapeMode);
	shapeMode.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contModeX-4, _contModeY-4, _contModeW+5, _contModeH+5);

	//------------------------- Zone 8 : Btns Listes---------------------------------------
	contBtnsListes = new createjs.Container();
	contBtnsListes.x = _contBtnsListesX;
	contBtnsListes.y = _contBtnsListesY;
	contBtnsListes.height = _contBtnsListesH;
	contBtnsListes.width = _contBtnsListesW;
	stage.addChild(contBtnsListes);
	shapeBtnsListes = new createjs.Shape();
	stage.addChild(shapeBtnsListes);
	shapeBtnsListes.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contBtnsListesX-4, _contBtnsListesY-4, _contBtnsListesW+5, _contBtnsListesH+5);

	//------------------------- Zone 5 : Btns Inv Perso ---------------------------------------
	contBtnsInvPerso = new createjs.Container();
	contBtnsInvPerso.x = _contBtnsInvPersoX;
	contBtnsInvPerso.y = _contBtnsInvPersoY;
	contBtnsInvPerso.height = _contBtnsInvPersoH;
	contBtnsInvPerso.width = _contBtnsInvPersoW;
	stage.addChild(contBtnsInvPerso);
	shapeBtnsInvPerso = new createjs.Shape();
	stage.addChild(shapeBtnsInvPerso);
	shapeBtnsInvPerso.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contBtnsInvPersoX-4, _contBtnsInvPersoY-4, _contBtnsInvPersoW+5, _contBtnsInvPersoH+5);

	//------------------------- Zone 6 : Btns Inv Case ---------------------------------------
	contBtnsInvCase = new createjs.Container();
	contBtnsInvCase.x = _contBtnsInvCaseX;
	contBtnsInvCase.y = _contBtnsInvCaseY;
	contBtnsInvCase.height = _contBtnsInvCaseH;
	contBtnsInvCase.width = _contBtnsInvCaseW;
	stage.addChild(contBtnsInvCase);
	shapeBtnsInvCase = new createjs.Shape();
	stage.addChild(shapeBtnsInvCase);
	shapeBtnsInvCase.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contBtnsInvCaseX-4, _contBtnsInvCaseY-4, _contBtnsInvCaseW+5, _contBtnsInvCaseH+5);

	//------------------------- Zone 14 : Labels de retour ---------------------------------------
	contLabelsAction = new createjs.Container();
	contLabelsAction.x = _contLabelsActionX;
	contLabelsAction.y = _contLabelsActionY;
	contLabelsAction.height = _contLabelsActionH;
	contLabelsAction.width = _contLabelsActionW;
	stage.addChild(contLabelsAction);
	shapeLabelsAction = new createjs.Shape();
	stage.addChild(shapeLabelsAction);
	shapeLabelsAction.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_contLabelsActionX-4, _contLabelsActionY-4, _contLabelsActionW+5, _contLabelsActionH+5);
	
	contInfoCase = new createjs.Container();
	contInfoCase.x = _contInfoCaseX;
	contInfoCase.y = _contInfoCaseY;
	contInfoCase.height = _contInfoCaseH;
	contInfoCase.width = _contInfoCaseW;
	stage.addChild(contInfoCase);
	shapeInfoCase = new createjs.Shape();
	stage.addChild(shapeInfoCase);
	shapeInfoCase.graphics.setStrokeStyle(1).beginStroke("#ffffff").drawRect(
			_contInfoCaseX-4, _contInfoCaseY-4, _contInfoCaseW+5, _contInfoCaseH+5);

	// ******************************************
	// ** Création des barres du perso 			*
	// ******************************************

	//------------------- Zone 1 -----------------------------------------------------
	// Barre de vie
	lifeBarContainer = new createjs.Container();

	lifeBarHeight = 10;
	lifeBarWidth = 100;
	lifeBarColor = createjs.Graphics.getRGB(0,150,0);
	lifeBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	lifeBar = new createjs.Shape();
	lifeBar.graphics.beginFill(lifeBarColor).drawRect(0, 0, 1, lifeBarHeight).endFill();

	frameLifeBar = new createjs.Shape();
	paddingLifeBar = 3;
	frameLifeBar.graphics.setStrokeStyle(1).beginStroke(lifeBarFrameColor).drawRect(-paddingLifeBar/2, -paddingLifeBar/2, lifeBarWidth+paddingLifeBar, lifeBarHeight+paddingLifeBar);

	lifeBarContainer.addChild(lifeBar, frameLifeBar);
	lifeBarContainer.x = _labelPtsVX+150;
	lifeBarContainer.y = _labelPtsVY ;
	stage.addChild(lifeBarContainer);

	// Barre de Faim

	faimBarContainer = new createjs.Container();

	faimBarHeight = 10;
	faimBarWidth = 100;
	faimBarColor = createjs.Graphics.getRGB(99,0,66);
	faimBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	faimBar = new createjs.Shape();
	faimBar.graphics.beginFill(faimBarColor).drawRect(0, 0, 1, faimBarHeight).endFill();

	frameFaimBar = new createjs.Shape();
	paddingFaimBar = 3;
	frameFaimBar.graphics.setStrokeStyle(1).beginStroke(faimBarFrameColor).drawRect(-paddingFaimBar/2, -paddingFaimBar/2, faimBarWidth+paddingFaimBar, faimBarHeight+paddingFaimBar);

	faimBarContainer.addChild(faimBar, frameFaimBar);
	faimBarContainer.x = lifeBarContainer.x;
	faimBarContainer.y = lifeBarContainer.y + _EspaceLabelY;
	stage.addChild(faimBarContainer);

	//------------------- Zone 2 -----------------------------------------------------
	// Barre d'action

	actionBarContainer = new createjs.Container();

	actionBarHeight = 10;
	actionBarWidth = 100;
	actionBarColor = createjs.Graphics.getRGB(255,0,0);
	actionBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	actionBar = new createjs.Shape();
	actionBar.graphics.beginFill(actionBarColor).drawRect(0, 0, 1, actionBarHeight).endFill();

	frameActionBar = new createjs.Shape();
	paddingActionBar = 3;
	frameActionBar.graphics.setStrokeStyle(1).beginStroke(actionBarFrameColor).drawRect(-paddingActionBar/2, -paddingActionBar/2, actionBarWidth+paddingActionBar, actionBarHeight+paddingActionBar);

	actionBarContainer.addChild(actionBar, frameActionBar);
	actionBarContainer.x = _labelPtsAX+175;
	actionBarContainer.y = _labelPtsAY;
	stage.addChild(actionBarContainer);

	// Barre de mouvement

	moveBarContainer = new createjs.Container();

	moveBarHeight = 10;
	moveBarWidth = 100;
	moveBarColor = createjs.Graphics.getRGB(0,51,255);
	moveBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	moveBar = new createjs.Shape();
	moveBar.graphics.beginFill(moveBarColor).drawRect(0, 0, 1, moveBarHeight).endFill();

	frameMoveBar = new createjs.Shape();
	paddingMoveBar = 3;
	frameMoveBar.graphics.setStrokeStyle(1).beginStroke(moveBarFrameColor).drawRect(-paddingMoveBar/2, -paddingMoveBar/2, moveBarWidth+paddingMoveBar, moveBarHeight+paddingMoveBar);

	moveBarContainer.addChild(moveBar, frameMoveBar);
	moveBarContainer.x = actionBarContainer.x;
	moveBarContainer.y = _labelPtsMY;
	stage.addChild(moveBarContainer);

	//------------------ Zone 8 : Proba de la case -------------------------------------------------------

	// Barre de proba Cache

	cacheBarContainer = new createjs.Container();

	cacheBarHeight = 10;
	cacheBarWidth = 100;
	cacheBarColor = createjs.Graphics.getRGB(102,102,51);
	cacheBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	cacheBar = new createjs.Shape();
	cacheBar.graphics.beginFill(cacheBarColor).drawRect(0, 0, 1, cacheBarHeight).endFill();

	frameCacheBar = new createjs.Shape();
	paddingCacheBar = 3;
	frameCacheBar.graphics.setStrokeStyle(1).beginStroke(cacheBarFrameColor).drawRect(-paddingCacheBar/2, -paddingCacheBar/2, cacheBarWidth+paddingCacheBar, cacheBarHeight+paddingCacheBar);

	cacheBarContainer.addChild(cacheBar, frameCacheBar);
	cacheBarContainer.x = _labelProbaCacheX + 200;
	cacheBarContainer.y = _labelProbaCacheY;
	stage.addChild(cacheBarContainer);

	// Barre de proba Fouille

	fouilleBarContainer = new createjs.Container();

	fouilleBarHeight = 10;
	fouilleBarWidth = 100;
	fouilleBarColor = createjs.Graphics.getRGB(255,153,0);
	fouilleBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	fouilleBar = new createjs.Shape();
	fouilleBar.graphics.beginFill(fouilleBarColor).drawRect(0, 0, 1, fouilleBarHeight).endFill();

	frameFouilleBar = new createjs.Shape();
	paddingFouilleBar = 3;
	frameFouilleBar.graphics.setStrokeStyle(1).beginStroke(fouilleBarFrameColor).drawRect(-paddingFouilleBar/2, -paddingFouilleBar/2, fouilleBarWidth+paddingFouilleBar, fouilleBarHeight+paddingFouilleBar);

	fouilleBarContainer.addChild(fouilleBar, frameFouilleBar);
	fouilleBarContainer.x = _labelProbaFouilleX + 200;
	fouilleBarContainer.y = _labelProbaFouilleY;
	stage.addChild(fouilleBarContainer);

	//------------------------- Zone 4 : Equipement perso-----------------------------------------------

	// Barre de Poids du Sac

	sacBarContainer = new createjs.Container();

	sacBarHeight = 10;
	sacBarWidth = 100;
	sacBarColor = createjs.Graphics.getRGB(204,153,0);
	sacBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	sacBar = new createjs.Shape();
	sacBar.graphics.beginFill(sacBarColor).drawRect(0, 0, 1, sacBarHeight).endFill();

	frameSacBar = new createjs.Shape();
	paddingSacBar = 3;
	frameSacBar.graphics.setStrokeStyle(1).beginStroke(sacBarFrameColor).drawRect(-paddingSacBar/2, -paddingSacBar/2, sacBarWidth+paddingSacBar, sacBarHeight+paddingSacBar);

	sacBarContainer.addChild(sacBar, frameSacBar);
	sacBarContainer.x = _labelItemPersoX + 180;
	sacBarContainer.y = _labelItemPersoY;
	stage.addChild(sacBarContainer);

	// ******************************************
	// ********* Déclaration des labels *********
	// ******************************************

	labelDescribeCase = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelDescribeCase.lineHeight = _LineHeight;
	labelDescribeCase.textBaseline = _TextBaseline;
	labelDescribeCase.x = _labelDescribeCaseX;
	labelDescribeCase.y = _labelDescribeCaseY;


	labelFichePerso = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelFichePerso.lineHeight = _LineHeight;
	labelFichePerso.textBaseline = _TextBaseline;
	labelFichePerso.x = contPerso.x + 58;
	labelFichePerso.y = _labelPtsVY;

	labelNombreNouvMsg = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelNombreNouvMsg.lineHeight = _LineHeight;
	labelNombreNouvMsg.textBaseline = _TextBaseline;
	labelNombreNouvMsg.x = _labelNombreNouvMsgX;
	labelNombreNouvMsg.y = _labelNombreNouvMsgY;

	labelDernierMessage = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelDernierMessage.lineHeight = _LineHeight;
	labelDernierMessage.textBaseline = _TextBaseline;
	labelDernierMessage.x = _labelDernierMessageX;
	labelDernierMessage.y = _labelDernierMessageY;

	labelIdSalle = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelIdSalle.lineHeight = _LineHeight;
	labelIdSalle.textBaseline = _TextBaseline;
	labelIdSalle.x = _labelIdSalleX;
	labelIdSalle.y = _labelIdSalleY;

	labelObjetCase = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelObjetCase.lineHeight = _LineHeight;
	labelObjetCase.textBaseline = _TextBaseline;
	labelObjetCase.x = _labelItemCaseX;
	labelObjetCase.y = _labelItemCaseY;

	labelDescribeItem = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelDescribeItem.lineHeight = _LineHeight;
	labelDescribeItem.textBaseline = _TextBaseline;
	labelDescribeItem.x = _labelDescribeItemX;
	labelDescribeItem.y = _labelDescribeItemY;

	labelInventaire = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelInventaire.lineHeight = _LineHeight;
	labelInventaire.textBaseline = _TextBaseline;
	labelInventaire.x = _labelItemPersoX;
	labelInventaire.y = _labelItemPersoY;

	labelChoixMode = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelChoixMode.lineHeight = _LineHeight;
	labelChoixMode.textBaseline = _TextBaseline;
	labelChoixMode.x = _labelChoixModeX;
	labelChoixMode.y = _labelChoixModeY;
	labelChoixMode.text="Passer en Mode :";

	labelBtnsListes = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelBtnsListes.lineHeight = _LineHeight;
	labelBtnsListes.textBaseline = _TextBaseline;
	labelBtnsListes.x = _labelBtnsListesX;
	labelBtnsListes.y = _labelBtnsListesY;
	labelBtnsListes.text="Afficher liste :";

	labelBtnsInvPerso = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelBtnsInvPerso.lineHeight = _LineHeight;
	labelBtnsInvPerso.textBaseline = _TextBaseline;
	labelBtnsInvPerso.x = _labelBtnsInvPersoX-5;
	labelBtnsInvPerso.y = _labelBtnsInvPersoY;
	labelBtnsInvPerso.text="Actions sur le sac :";

	labelBtnsInvCase = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelBtnsInvCase.lineHeight = _LineHeight;
	labelBtnsInvCase.textBaseline = _TextBaseline;
	labelBtnsInvCase.x = _labelBtnsInvCaseX-8;
	labelBtnsInvCase.y = _labelBtnsInvCaseY;
	labelBtnsInvCase.text="Actions sur la case :";

	labelArme = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelArme.lineHeight = _LineHeight;
	labelArme.textBaseline = _TextBaseline;
	labelArme.x = _labelArmeX;
	labelArme.y = _labelArmeY;
	labelArme.text="Arme équipée : ";

	labelArmure = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelArmure.lineHeight = _LineHeight;
	labelArmure.textBaseline = _TextBaseline;
	labelArmure.x = _labelArmureX;
	labelArmure.y = _labelArmureY;
	labelArmure.text="Armure équipée : ";

	//------------------- Zone 1 -----------------------------------------------------

	labelPtsVie = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsVie.lineHeight = _LineHeight;
	labelPtsVie.textBaseline = _TextBaseline;
	labelPtsVie.x = _labelPtsVX;
	labelPtsVie.y = _labelPtsVY;

	labelPtsFaim = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsFaim.lineHeight = _LineHeight;
	labelPtsFaim.textBaseline = _TextBaseline;
	labelPtsFaim.x = _labelPtsFX;
	labelPtsFaim.y = _labelPtsFY;

	//------------------- Zone 2 -----------------------------------------------------

	labelPtsAction = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsAction.lineHeight = _LineHeight;
	labelPtsAction.textBaseline = _TextBaseline;
	labelPtsAction.x = _labelPtsAX;
	labelPtsAction.y = _labelPtsAY;

	labelPtsMove = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsMove.lineHeight = _LineHeight;
	labelPtsMove.textBaseline = _TextBaseline;
	labelPtsMove.x = _labelPtsMX;
	labelPtsMove.y = _labelPtsMY;

	//---------------------------------------

	labelPtsAtq = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsAtq.lineHeight = _LineHeight;
	labelPtsAtq.textBaseline = _TextBaseline;
	labelPtsAtq.x = _labelPtsAtqX;
	labelPtsAtq.y = _labelPtsAtqY;

	labelPtsDef = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsDef.lineHeight = _LineHeight;
	labelPtsDef.textBaseline = _TextBaseline;
	labelPtsDef.x = _labelPtsDefX;
	labelPtsDef.y = _labelPtsDefY;

	labelBonusArme = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabelBonus));
	labelBonusArme.lineHeight = _LineHeight;
	labelBonusArme.textBaseline = _TextBaseline;
	labelBonusArme.x = _labelPtsAtqX + 170 ;
	labelBonusArme.y = _labelPtsAtqY;

	labelBonusArmure = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabelBonus));
	labelBonusArmure.lineHeight = _LineHeight;
	labelBonusArmure.textBaseline = _TextBaseline;
	labelBonusArmure.x = _labelPtsDefX + 170;
	labelBonusArmure.y = _labelPtsDefY;

	labelNbAllies = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelNbAllies.lineHeight = _LineHeight;
	labelNbAllies.textBaseline = _TextBaseline;
	labelNbAllies.x = _labelNbAlliesX ;
	labelNbAllies.y = _labelNbAlliesY;

	labelNbEnnemis = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelNbEnnemis.lineHeight = _LineHeight;
	labelNbEnnemis.textBaseline = _TextBaseline;
	labelNbEnnemis.x = _labelNbEnnemisX;
	labelNbEnnemis.y = _labelNbEnnemisY;

	labelNbGoules = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelNbGoules.lineHeight = _LineHeight;
	labelNbGoules.textBaseline = _TextBaseline;
	labelNbGoules.x = _labelNbGoulesX;
	labelNbGoules.y = _labelNbGoulesY;

	labelProbaCache = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelProbaCache.lineHeight = _LineHeight;
	labelProbaCache.textBaseline = _TextBaseline;
	labelProbaCache.x = _labelProbaCacheX;
	labelProbaCache.y = _labelProbaCacheY;

	labelProbaFouille = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelProbaFouille.lineHeight = _LineHeight;
	labelProbaFouille.textBaseline = _TextBaseline;
	labelProbaFouille.x = _labelProbaFouilleX;
	labelProbaFouille.y = _labelProbaFouilleY;

	//----------------------- Zone 14 : labels de retour-------------------------

	labelLancementServeur = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelLancementServeur.lineHeight = _LineHeight;
	labelLancementServeur.textBaseline = _TextBaseline;
	labelLancementServeur.x = 5;
	labelLancementServeur.y = 100;

	// ******************************************
	// ** Création des boutons de déplacement ***
	// ******************************************

	var Up = stage.addChild(new createjs.Bitmap("public/Boutons/Up.png"));
	Up.x= _contMapX + _contMapW/2 - Up.image.width/2;
	Up.y = _contMapY;
	Up.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
	});

	var Down = stage.addChild(new createjs.Bitmap("public/Boutons/Down.png"));
	Down.x = _contMapX+ _contMapW/2 - Down.image.width/2;
	Down.y = _contMapY + _contMapH - _centrageBpMap;
	Down.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});

	var Left = stage.addChild(new createjs.Bitmap("public/Boutons/Left.png"));
	Left.x = _contMapX;
	Left.y = _contMapY + _contMapH/2 - Left.image.height/2;
	Left.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
	});

	var Right = stage.addChild(new createjs.Bitmap("public/Boutons/Right.png"));
	Right.x = _contMapX + _contMapW - _centrageBpMap;
	Right.y = _contMapY + _contMapH/2 - Right.image.height/2;
	Right.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'EST');
	});

	Up.cursor=Down.cursor=Left.cursor=Right.cursor="pointer";

	// ******************************************
	// ************ Boutons d'action ************
	// ******************************************

	/*var BtnSaveBD = stage.addChild(new Button("SAVE BD", ColorBtn));
	BtnSaveBD.x = 970;
	BtnSaveBD.y = 590;
	BtnSaveBD.cursor="pointer";
	BtnSaveBD.addEventListener('click', function(event) {
		socket.emit('SAVE_BD_DEBUG_CS');
	});*/

	var BtnFouilleRapide = new createjs.Bitmap("public/Boutons/FouilleR.png");
	BtnFouilleRapide.y = 2* _espaceBoutonY;
	contBtnsInvCase.addChild(BtnFouilleRapide);
	BtnFouilleRapide.addEventListener('click', function(event) {
		socket.emit('ACTION_FOUILLE_RAPIDE_CS');
	});	


	BtnPageItemPersoRight = stage.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
	BtnPageItemPersoRight.x= _contItemPersoX + _contItemPersoW;
	BtnPageItemPersoRight.y= _contItemPersoY + 5;
	BtnPageItemPersoRight.visible=false;
	BtnPageItemPersoRight.addEventListener('click', function(event) {
		PageItemPerso++;
		pressBtnEquip=false;
		socket.emit('INFO_PERSONNAGE_CS');

	});

	BtnPageItemPersoLeft = stage.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
	BtnPageItemPersoLeft.x= _contItemPersoX - 30;
	BtnPageItemPersoLeft.y= _contItemPersoY + 5;
	BtnPageItemPersoLeft.visible=false;
	BtnPageItemPersoLeft.addEventListener('click', function(event) {
		PageItemPerso--;
		pressBtnEquip=false;
		socket.emit('INFO_PERSONNAGE_CS');
	});

	BtnPageItemCaseRight = stage.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
	BtnPageItemCaseRight.x= _contItemCaseX  + _contItemCaseW;
	BtnPageItemCaseRight.y= _contItemCaseY + 5;
	BtnPageItemCaseRight.visible=false;
	BtnPageItemCaseRight.addEventListener('click', function(event) {
		PageItemCase++;
		socket.emit('INFO_CASE_CS');

	});

	BtnPageItemCaseLeft = stage.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
	BtnPageItemCaseLeft.x= _contItemCaseX - 30;
	BtnPageItemCaseLeft.y= _contItemCaseY + 5;
	BtnPageItemCaseLeft.visible=false;
	BtnPageItemCaseLeft.addEventListener('click', function(event) {
		PageItemCase--;
		socket.emit('INFO_CASE_CS');
	});

	BtnPageItemPersoRight.cursor=BtnPageItemPersoLeft.cursor=BtnPageItemCaseRight.cursor=BtnPageItemCaseLeft.cursor="pointer";

	BtnFouilleRapide.cursor="pointer";

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
	shape4.graphics.setStrokeStyle(4).beginStroke("#850000").drawRect(
			_contMapX-2, _contMapY-2, _contMapW+2, _contMapH+2);
	
	//_espaceBoutonYInitialisation des informations
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
}

function message()
{
	var nbMsgAffiches=10;

	contMessage = new createjs.Container();
	contMessage.x = canvas.width/2 - 746/2;
	contMessage.y = canvas.height/2 - 420/2;
	contMessage.height = 420;
	contMessage.width = 746;
	stage.addChild(contMessage);
	shapeMessage = new createjs.Shape();
	stage.addChild(shapeMessage);
	shapeMessage.graphics.setStrokeStyle(4).beginStroke("#006600").drawRect(
			contMessage.x-2, contMessage.y-2, contMessage.width+2, contMessage.height+2);

	var background_message = new createjs.Bitmap("public/Background_liste.jpg");
	contMessage.addChild(background_message);

	labelMessage = contMessage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelMessage.lineHeight = _LineHeight;
	labelMessage.textBaseline = _TextBaseline;
	labelMessage.x = 20;
	labelMessage.y = 50;


	var BtnValideMsg = new createjs.Bitmap("public/Boutons/Ok.png");
	BtnValideMsg.x=600;
	BtnValideMsg.y=365;
	contMessage.addChild(BtnValideMsg);
	BtnValideMsg.addEventListener('click', function(event) {
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

	stage.update();
}

function afficherMessage(TabListeMessage)
{
	var longLigneMax=88;
	try 
	{
		// instructions à essayer
		labelMessage.text="";
		for (var i = 0; i < TabListeMessage[PageMessage].length ; i++) 
		{
			//alert(TabListeMessage[PageMessage][i].length);
			for (var j=0; j<TabListeMessage[PageMessage][i].length ; j+=longLigneMax)
			{
				var message=TabListeMessage[PageMessage][i].substring(j,j+longLigneMax);
				//alert("j : "+j);
				if(j==longLigneMax || TabListeMessage[PageMessage][i].length<longLigneMax)
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
	stage.update();
}

function afficherDescCase(desc)
{
	var longLigneMax=69;
	try 
	{
		// instructions à essayer
		labelDescribeCase.text="";
		for (var i = 0; i < desc.length ; i+=longLigneMax) 
		{
			var message=desc.substring(i,i+longLigneMax);
			if(i==longLigneMax || desc.length<longLigneMax)
			{
				labelDescribeCase.text+=message;
			}
			else
			{
				labelDescribeCase.text+=message + "-\n";
			}
		}
	}
	catch(e){}
	stage.update();
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
				labelDescribeItem.text+=message;
			}
			else
			{
				labelDescribeItem.text+=message + "-\n";
			}
		}
	}
	catch(e){}
	stage.update();
}

function liste()
{
	socket.emit('INFO_CASE_ALLIES_CS');
	socket.emit('INFO_CASE_ENNEMIS_CS');

	contListe = new createjs.Container();
	contListe.x = canvas.width/2 - 746/2;
	contListe.y = canvas.height/2 - 420/2;
	contListe.height = 420;
	contListe.width = 746;
	stage.addChild(contListe);
	shape6 = new createjs.Shape();
	stage.addChild(shape6);
	shape6.graphics.setStrokeStyle(4).beginStroke("#999900").drawRect(
			contListe.x-2, contListe.y-2, contListe.width+2, contListe.height+2);

	var background_liste = new createjs.Bitmap("public/blood.jpg");
	background_liste.alpha=1;
	contListe.addChild(background_liste);

	labelAlliesListe = contListe.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelAlliesListe.lineHeight = _LineHeight;
	labelAlliesListe.textBaseline = _TextBaseline;
	labelAlliesListe.x = 20;
	labelAlliesListe.y = 5;
	labelAlliesListe.text="Liste des Alliés :";

	labelEnnemisListe = contListe.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelEnnemisListe.lineHeight = _LineHeight;
	labelEnnemisListe.textBaseline = _TextBaseline;
	labelEnnemisListe.x = 20;
	labelEnnemisListe.y = 145;
	labelEnnemisListe.text="Liste des Ennemis :";

	labelDescribePerso = contListe.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelDescribePerso.lineHeight = _LineHeight;
	labelDescribePerso.textBaseline = _TextBaseline;
	labelDescribePerso.x = labelAlliesListe.y + 20;
	labelDescribePerso.y = 280;

	//Conteneur des ALLIES
	contListeAllies = new createjs.Container();
	contListeAllies.width = 10*64;
	contListeAllies.x = contListe.width/2 - contListeAllies.width/2;
	contListeAllies.y = labelAlliesListe.y + 20;
	contListeAllies.height = 70;
	contListe.addChild(contListeAllies);
	shape7 = new createjs.Shape();
	contListe.addChild(shape7);
	shape7.graphics.setStrokeStyle(1).beginStroke("#ffffff").drawRect(
			contListeAllies.x-4, contListeAllies.y-4, contListeAllies.width+4, contListeAllies.height+4);

	//Conteneur des ENNEMIS
	contListeEnnemis = new createjs.Container();
	contListeEnnemis.width = 10*64;
	contListeEnnemis.x = contListe.width/2 - contListeEnnemis.width/2;
	contListeEnnemis.y = 160;
	contListeEnnemis.height = 70;
	contListe.addChild(contListeEnnemis);
	shape8 = new createjs.Shape();
	contListe.addChild(shape8);
	shape8.graphics.setStrokeStyle(1).beginStroke("#ffffff").drawRect(
			contListeEnnemis.x-4, contListeEnnemis.y-4, contListeEnnemis.width+4, contListeEnnemis.height+4);

	// Bouton ANNULER
	BtnCancelListe = new createjs.Bitmap("public/Boutons/Retour.png");
	BtnCancelListe.x=600;
	BtnCancelListe.y=365;
	contListe.addChild(BtnCancelListe);
	BtnCancelListe.addEventListener('click', function (event) {
		_selectedPerso=-1;
		stage.removeChild(contListe);
		game();
	});

	BtnPagePersoAlliesRight = new createjs.Bitmap("public/Boutons/Right.png");
	BtnPagePersoAlliesRight.x= contListeAllies.x + contListeAllies.width;
	BtnPagePersoAlliesRight.y= contListeAllies.y + 8;
	BtnPagePersoAlliesRight.visible=false;
	contListe.addChild(BtnPagePersoAlliesRight);
	BtnPagePersoAlliesRight.addEventListener('click', function(event) {
		PagePersoAllies++;
		socket.emit('INFO_CASE_ALLIES_CS');
	});

	BtnPagePersoAlliesLeft = new createjs.Bitmap("public/Boutons/Left.png");
	BtnPagePersoAlliesLeft.x= contListeAllies.x - BtnPagePersoAlliesLeft.image.width -5;
	BtnPagePersoAlliesLeft.y= contListeAllies.y + 8;
	contListe.addChild(BtnPagePersoAlliesLeft);
	BtnPagePersoAlliesLeft.visible=false;
	BtnPagePersoAlliesLeft.addEventListener('click', function(event) {
		PagePersoAllies--;
		socket.emit('INFO_CASE_ALLIES_CS');
	});

	BtnPagePersoEnnRight = new createjs.Bitmap("public/Boutons/Right.png");
	BtnPagePersoEnnRight.x= contListeEnnemis.x + contListeEnnemis.witdh;
	BtnPagePersoEnnRight.y= contListeEnnemis.y + 8;
	BtnPagePersoEnnRight.visible=false;
	contListe.addChild(BtnPagePersoEnnRight);
	BtnPagePersoEnnRight.addEventListener('click', function(event) {
		PagePersoEnnemis++;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	BtnPagePersoEnnLeft = new createjs.Bitmap("public/Boutons/Left.png");
	BtnPagePersoEnnLeft.x= contListeEnnemis.x - BtnPagePersoEnnLeft.image.width - 5;
	BtnPagePersoEnnLeft.y= contListeEnnemis.y +  8;
	BtnPagePersoEnnLeft.visible=false;
	contListe.addChild(BtnPagePersoEnnLeft);
	BtnPagePersoEnnLeft.addEventListener('click', function(event) {
		PagePersoEnnemis--;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	setBtnAttaquer(BtnCancelListe.x, BtnCancelListe.y);

	BtnCancelListe.cursor="pointer";
	BtnPagePersoAlliesRight.cursor=BtnPagePersoAlliesLeft.cursor=BtnPagePersoEnnRight.cursor=BtnPagePersoEnnLeft.cursor="pointer";

	stage.update();
}

function attaqueNuit()
{
	stage.removeAllChildren();
	
	contNuit = new createjs.Container();
	contNuit.x = 0;
	contNuit.y = 0;
	contNuit.height = canvas.height;
	contNuit.width = canvas.width;
	stage.addChild(contNuit);
	shapeNuit = new createjs.Shape();
	stage.addChild(shapeNuit);
	shapeNuit.graphics.setStrokeStyle(10).beginStroke("#009900").drawRect(
			contNuit.x, contNuit.y, contNuit.width, contNuit.height);
	
	// Application du background qui va recouvrir le canvas
	var background_nuit = new createjs.Bitmap("public/Background_Nuit.jpg");
	contNuit.addChild(background_nuit);
	
	var BtnVivant = new createjs.Bitmap("public/Boutons/Vivant.png");
	BtnVivant.x=40;
	BtnVivant.y=560;
	contNuit.addChild(BtnVivant);
	BtnVivant.addEventListener('click', function (event) {
		stage.removeChild(contNuit);
		setPlateau();
	});
	
	BtnVivant.cursor="pointer";
}

function dead(currentPerso) 
{
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
	var background_dead = new createjs.Bitmap("public/Background_Dead.jpg");
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

	BtnPageItemPersoDeadRight= new createjs.Bitmap("public/Boutons/Right.png");
	BtnPageItemPersoDeadRight.x= contItemPersoDead.x + contItemPersoDead.width;
	BtnPageItemPersoDeadRight.y= contItemPersoDead.y-3;
	contDead.addChild(BtnPageItemPersoDeadRight);
	BtnPageItemPersoDeadRight.addEventListener('click', function(event) {
		PageItemPersoDead++;
	});

	BtnPageItemPersoDeadLeft = new createjs.Bitmap("public/Boutons/Left.png");
	BtnPageItemPersoDeadLeft .x= contItemPersoDead.x - BtnPageItemPersoDeadLeft.image.width -5;
	BtnPageItemPersoDeadLeft .y= contItemPersoDead.y-3;
	contDead.addChild(BtnPageItemPersoDeadLeft );
	BtnPageItemPersoDeadLeft.addEventListener('click', function(event) {
		PageItemPersoDead--;
	});

	var labelDeadByWho = contDead.addChild(new createjs.Text("", _policeLabelMort, _colorLabelMort));
	labelDeadByWho.x=20;
	labelDeadByWho.y=20;
	
	var labelDeadHour = contDead.addChild(new createjs.Text("", _policeLabelMort, _colorLabelHeureMort));
	labelDeadHour.x = 450 ;
	labelDeadHour.y = 175;
	labelDeadHour.text="";
	
	var labelItemsRestants = contDead.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
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
		setPlateau();
	});

	BtnCancelDead.cursor="pointer";
	
	var Taille=Math.ceil(currentPerso.sacADos.length / 10);
	
	if(PageItemPersoDead>Taille-1)
	{
		PageItemPersoDead=Taille-1;
	}
	else if (PageItemPersoDead<0)
	{
		PageItemPersoDead=0;
	}

	if(PageItemPersoDead==Taille-1)
	{
		BtnPageItemPersoDeadRight.visible=false;
	}
	else
	{
		BtnPageItemPersoDeadRight.visible=true;
	}

	if(PageItemPersoDead==0)
	{
		BtnPageItemPersoDeadLeft.visible=false;
	}
	else
	{
		BtnPageItemPersoDeadLeft.visible=true;
	}

	if(Taille ==0)
	{
		BtnPageItemPersoDeadLeft.visible=false;
		BtnPageItemPersoDeadRight.visible=false;
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
			for (var i = 0; i < TabListe[PageItemPersoDead].length ; i++) 
			{
				var Obj=TabListe[PageItemPersoDead][i];

				// Ajout de l'image à l'ihm
				var imgItem = new createjs.Bitmap(Obj.imageName);

				imgItem.x = (iPositionItemInConteneur * _spaceItem);
				imgItem.y = 4;
				contItemPersoDead.addChild(imgItem);

				// position de l'item dans le conteneur
				iPositionItemInConteneur++;
			}
			stage.update();
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
	BtnPageMessageDown = new createjs.Bitmap("public/Boutons/Down.png");
	BtnPageMessageDown.x= 746/2 - BtnPageMessageDown.image.width/2;
	BtnPageMessageDown.y= 365;
	contMessage.addChild(BtnPageMessageDown);
	BtnPageMessageDown.addEventListener('click', function(event) {
		PageMessage++;
		setbtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});

	BtnPageMessageUp = new createjs.Bitmap("public/Boutons/Up.png");
	BtnPageMessageUp.x=746/2 - BtnPageMessageUp.image.width/2;
	BtnPageMessageUp.y= 5;
	contMessage.addChild(BtnPageMessageUp);
	BtnPageMessageUp.addEventListener('click', function(event) {
		PageMessage--;
		setbtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
	});

	if(PageMessage==Taille-1)
	{
		BtnPageMessageDown.visible=false;
	}
	else
	{
		BtnPageMessageDown.visible=true;
	}

	if(PageMessage==0)
	{
		BtnPageMessageUp.visible=false;
	}
	else
	{
		BtnPageMessageUp.visible=true;
	}

	if(Taille ==0)
	{
		BtnPageMessageUp.visible=false;
		BtnPageMessageDown.visible=false;
	}

	BtnPageMessageUp.cursor=BtnPageMessageDown.cursor="pointer";
}

function setbtnMessageVisible(Taille)
{
	if(PageMessage>Taille-1)
	{
		PageMessage=Taille-1;
	}
	else if (PageMessage<0)
	{
		PageMessage=0;
	}

	if(PageMessage==Taille-1)
	{
		BtnPageMessageDown.visible=false;
	}
	else
	{
		BtnPageMessageDown.visible=true;
	}

	if(PageMessage==0)
	{
		BtnPageMessageUp.visible=false;
	}
	else
	{
		BtnPageMessageUp.visible=true;
	}

	if(Taille ==0)
	{
		BtnPageMessageUp.visible=false;
		BtnPageMessageDown.visible=false;
	}
}

function setBtnAttaquer(x,y)
{
	if (_selectedPerso != -1)
	{
		// Bouton ATTAQUER
		var BtnAttaquerListe = new createjs.Bitmap("public/Boutons/Attaquer.png");
		BtnAttaquerListe.x=x-150;
		BtnAttaquerListe.y=y;
		contListe.addChild(BtnAttaquerListe);
		BtnAttaquerListe.addEventListener('click', function(event) {
			if (_selectedPerso == -1) {
				//alert("Selectionner Ennemi avant d'attaquer !");
			}
			else
			{
				socket.emit('ACTION_ATTAQUE_CS', _selectedPerso);
				_selectedPerso = -1;
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
	if(_selectedItemPerso!=-1 && _selectedItemPersoType>= 4 && _selectedItemPersoType <=7)
	{
		var BtnUtiliser = new createjs.Bitmap("public/Boutons/Consommer.png");
		BtnUtiliser.y=0;
		contBtnsInvPerso.addChild(BtnUtiliser);
		BtnUtiliser.addEventListener('click', function(event) {
			if (_selectedItemPerso == -1) {
				//alert("Selectionner Item avant de l'utiliser");
			} else {
				socket.emit('PERSONNAGE_USE_CS', _selectedItemPerso);
				_selectedItemPerso = -1;
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
			if (_selectedItemPerso == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _selectedItemPerso);
				_selectedItemPerso = -1;
			}
		});
		BtnDeposer.cursor ="pointer";
	}
	else if(_selectedItemPerso!=-1 && (_selectedItemPersoType==1 || _selectedItemPersoType==2))
	{
		var BtnEquiper = new createjs.Bitmap("public/Boutons/Equiper.png");
		BtnEquiper.y=_espaceBoutonY;
		contBtnsInvPerso.addChild(BtnEquiper);
		BtnEquiper.addEventListener('click', function (event) {
			if (_selectedItemPerso == -1) {
				//alert("Selectionner Item avant de s'équiper");
			} else {
				socket.emit('INV_PERSONNAGE_CS', "EQUIPER", _selectedItemPerso);
				_selectedItemPerso = -1;
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
			if (_selectedItemPerso == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _selectedItemPerso);
				_selectedItemPerso = -1;
			}
		});
		BtnDeposer.cursor ="pointer";
	}
	else if(_selectedItemPerso!=-1)
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
			if (_selectedItemPerso == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", _selectedItemPerso);
				_selectedItemPerso = -1;
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
	if(_selectedItemEquip!=-1)
	{
		var BtnDesequiper = new createjs.Bitmap("public/Boutons/Desequiper.png");
		BtnDesequiper.y=2*_espaceBoutonY;
		contBtnsInvPerso.addChild(BtnDesequiper);
		BtnDesequiper.addEventListener('click', function (event) {
			if (_selectedItemEquip == -1) {
				//alert("Selectionner Item avant de se déséquiper");
			}
			else{
				socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", _selectedItemEquip);
				_selectedItemEquip = -1;
				_selectedItemPerso = -1;
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


function setContCase()
{
	if(_selectedItemCase!=-1)
	{
		var BtnRamasseObjet = new createjs.Bitmap("public/Boutons/Ramasser.png");
		BtnRamasseObjet.y=_espaceBoutonY;
		contBtnsInvCase.addChild(BtnRamasseObjet);
		BtnRamasseObjet.addEventListener('click', function (event) {
			if (_selectedItemCase == -1) {
				//alert("Selectionner Item avant de Ramasser");
			} else {
				socket.emit('INV_CASE_CS', "RAMASSER", _selectedItemCase);
				_selectedItemCase = -1;
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
	stage.update();

}

function setBtnJoueurs(nbJoueurs)
{
	if(nbJoueurs>0)
	{
		var BtnJoueurs = new createjs.Bitmap("public/Boutons/Joueurs.png");
		BtnJoueurs.y=0;
		contBtnsListes.addChild(BtnJoueurs);
		BtnJoueurs.addEventListener('click', function(event) {
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
		BtnAtqGoules.y = 3*_espaceBoutonY;
		contBtnsInvCase.addChild(BtnAtqGoules);
		BtnAtqGoules.addEventListener('click', function(event) {
			socket.emit('ACTION_ATTAQUE_GOULE_CS');
		});
		BtnAtqGoules.cursor="pointer";
	}
	else
	{
		var BtnAtqGoules = new createjs.Bitmap("public/Boutons/ZombieGris.png");
		BtnAtqGoules.y = 3*_espaceBoutonY;
		contBtnsInvCase.addChild(BtnAtqGoules);
		BtnAtqGoules.cursor="not-allowed";
	}
}

function setImg(img, X, Y) 
{
	stage.addChild(img);	
	img.x = X;
	img.y = Y;
	//stage.update();
}

function setColorMsgRetour()
{
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
	contLabelsAction.removeAllChildren();
	labelAction = contLabelsAction.addChild(new createjs.Text("", PoliceLabel, _colorLabelAction));
	labelAction.lineHeight = _LineHeight;
	labelAction.textBaseline = _TextBaseline;
	labelAction.x = 0;
	labelAction.y = 0;
	//-------Fin changer couleur message de retour
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
socket.on('MOVE_PERSONNAGE_SC', function (currentCase) {
	setColorMsgRetour();
	switch(currentCase)
	{
	case 0:
	labelAction.text="WARNING : ERREUR_CASE";
	break;

	case -1:
	labelAction.text = ("Impossible \nd'aller par là !");
	break;

	case -2:
	labelAction.text = ("Plus de points \nde mouvement !");
	break;

	case -3:
	labelAction.text = ("Trop de Zombies ici !");
	break;

	case -4:
	labelAction.text = ("Impossible de \npénetrer dans une \nzone sure adverse !");
	break;

	default:
	labelAction.text = ("Déplacement réussi !");
	socket.emit('INFO_CASE_CS');
	socket.emit('INFO_PERSONNAGE_CS');
	break;
	}
	stage.update();
	stage.update();
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM 
 * return 1 si arme équipée / déséquipée
 * return 2 si armure équipée / déséquipée
 * erreur : 0 si objet n'est pas dans le sac / Objet inexistant
 * erreur : -3 si item n'est ni arme ni armure
 * erreur : -4 si l'item a dequiper n'est pas équipé au préalable
 */
socket.on('INV_PERSONNAGE_SC', function (type, currentItem, codeRetour) {
	setColorMsgRetour();
	if (codeRetour == 0) {
		labelAction.text = ("L'objet \n" + currentItem.id + "\nn'est plus dans le sac ");
		_selectedItemEquip=-1;
		// quitte la fonction
		return;
	}
	if (type == "EQUIPER") {
		switch (codeRetour) {
		case 0:
			labelAction.text = ("Objet pas dans \nle sac !");
			_selectedItemPerso=-1;
			break;

			// équipage ok
		case 1:
			labelAction.text = ("Arme équipée");
			armeDejaEquip=false;
			pressBtnEquipArme=true;
			socket.emit('INFO_PERSONNAGE_CS');
			break;

		case 2:
			labelAction.text = ("Armure équipée");
			armureDejaEquip=false;
			pressBtnEquipArmure=true;
			socket.emit('INFO_PERSONNAGE_CS');
			break;

		case -1:
			labelAction.text = ("Arme déja équipée");
			_selectedItemPerso=-1;
			break;

		case -2:
			labelAction.text = ("Armure déja équipée");
			_selectedItemPerso=-1;
			break;

		case -3:
			labelAction.text = ("Objet non équipable");
			_selectedItemPerso=-1;
			break;
		}
	} else if (type == "DEQUIPER") {
		if (codeRetour == -4)
		{
			labelAction.tetx = ("Déséquipement \nimpossible \ncar pas équipé");
			_selectedItemEquip=-1;
		} else if (codeRetour == 1) {
			// Si déquipe arme
			// efface l'arme
			contArme.removeAllChildren();
			labelAction.text = ("Arme déséquipée");
			socket.emit('INFO_PERSONNAGE_CS');		
			_selectedItemEquip=-1;
		}
		// Si déquipe armure
		else if (codeRetour == 2) {
			// efface armure
			contArmure.removeAllChildren();
			_selectedItemEquip=-1;
			labelAction.text = ("Armure déséquipée");
			socket.emit('INFO_PERSONNAGE_CS');
		}
	}
	stage.update();
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
socket.on('INV_CASE_SC', function (type, codeRetour, id_item, DegatsG, RestG) {
	setColorMsgRetour();
	if (type == 'RAMASSER') {
		switch(codeRetour)
		{
		// erreur
		case -4:
			labelAction.text = ("Erreur inconnue");
			_selectedItemCase=-1;
			break;
		case -3:
			labelAction.text = ("Erreur inconnue");
			_selectedItemCase=-1;
			break;
			// poids insufisant
		case -1:
			labelAction.text = ("L'item est \ntrop lourd !");
			_selectedItemCase=-1;
			break;
			// objet pas dans case
		case -2:
			labelAction.text = ("L'item n'est plus \ndans la salle !");
			_selectedItemCase=-1;
			break;
		case -5:
			labelAction.text = ("Ramassage impossible \nà cause des \nzombies !");
			if(DegatsG!=0)
			{
				labelAction.text +=("\n- " + DegatsG + " points de vie !");
			}
			_selectedItemCase=-1;
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		case -6:
			labelAction.text = ("Ramassage d'ODD \nimpossible ici !");
			_selectedItemCase=-1;
			// ramassage ok
		default:
		labelAction.text = ("Objet ramassé");
		if(DegatsG!=0)
		{
			labelAction.text +=("\n- "+ DegatsG + " points \nde vie !");//\n"+ RestG + " Zombies restants");
		}
		_selectedItemCase=-1;
		socket.emit('INFO_PERSONNAGE_CS');
		socket.emit('INFO_CASE_CS');
		break;
		}
	}
	if (type == 'DEPOSER') {
		switch(codeRetour)
		{
		// erreur
		case -3:
			labelAction.text = ("Déséquipez avant \nde déposer !");
			_selectedItemPerso=-1;
			break;
		case -4:
			labelAction.text = ("Erreur interne !");
			_selectedItemPerso=-1;
			break;
		case -2:
			labelAction.text = ("L'item n'est plus\n dans le sac !");
			_selectedItemPerso=-1;
			break;
			// dépôt ok
		default:
		labelAction.text = ("Objet déposé");//\nSac : " + codeRetour + " kg");
		if(DegatsG!=0)
		{
			labelAction.text +=("\n- "+ DegatsG + " points \nde vie !");//\n"+ RestG + " Zombies restants");
		}
		_selectedItemPerso=-1;
		socket.emit('INFO_CASE_CS');
		socket.emit('INFO_PERSONNAGE_CS');
		break;
		}
	}
	stage.update();
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
	//alert("INFO CASE");
	
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
		setColorMsgRetour();
		//insereMessage("CLIENT :: nom case = " + "ERREUR_CASE");
		labelAction.text=("Erreur de case !");
	}
	else {

		var ProbCache, ProbFouille;
		ProbCache=(currentCase.probaCache * _persoProbaCache);
		ProbFouille=(currentCase.probaObjet * _persoProbaFouille);

		labelIdSalle.text=("Case en cours : " + currentCase.nom + "");
		labelNbAllies.text=("Alliés dans la salle : " + nbrAllies + "");
		labelNbEnnemis.text=("Ennemis dans la salle : " + nbrEnnemis + "");
		labelNbGoules.text=("Zombies dans la salle : " + currentCase.nbrGoules + "");
		labelProbaCache.text=("Proba de Cache :              " + ProbCache + " %");
		labelProbaFouille.text=("Proba de Trouver item :       " + ProbFouille + " %");

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

		labelObjetCase.text="";
		//labelObjetCase.text=("Objets présents : "+ currentCase.nom + "");
		labelObjetCase.text=("Objets présents : ");

		// CLear de la liste des items de case
		contInvCase.removeAllChildren();

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

		if(PageItemCase>Taille-1)
		{
			PageItemCase=Taille-1;
		}
		else if (PageItemCase<=0)
		{
			PageItemCase=0;
		}

		if(PageItemCase==Taille-1)
		{
			BtnPageItemCaseRight.visible=false;
		}
		else
		{
			BtnPageItemCaseRight.visible=true;
		}

		if(PageItemCase==0)
		{
			BtnPageItemCaseLeft.visible=false;
		}
		else
		{
			BtnPageItemCaseLeft.visible=true;
		}

		if(Taille ==0)
		{
			BtnPageItemCaseLeft.visible=false;
			BtnPageItemCaseRight.visible=false;
		}

		setContCase();

		var Select;

		try 
		{
			// instructions à essayer
			for (var i = 0; i < TabListe[PageItemCase].length ; i++) 
			{
				var Obj=TabListe[PageItemCase][i];

				// Ajout de l'image à l'ihm
				var imgItem = new createjs.Bitmap(Obj.imageName);

				imgItem.name = i;
				imgItem.cursor = "pointer";

				// Ajout de l'évenement a l'image
				// ajout d'un texte quand l'user passera la souris dessus
				imgItem.addEventListener('mouseover', function(event) {
					var currentItem = TabListe[PageItemCase][event.target.name];
					var descriptionItem=currentItem.description;
					labelDescribeItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
					afficherDescItem(descriptionItem);
					stage.update();
				},false);

				imgItem.addEventListener('mouseout', function(event){
					labelDescribeItem.text="";
					stage.update();
				},false);

				imgItem.addEventListener("click", function(event){
					if (Select!=null)
					{
						contInvCase.removeChild(Select);
					}
					var num=event.target.x;
					var currentItem = TabListe[PageItemCase][event.target.name];
					_selectedItemCase=currentItem.id;
					Select = contInvCase.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
					Select.x=(num);
					Select.y=0;

					setContCase();
				});

				imgItem.x = (iPositionItemInConteneur * _spaceItem);
				imgItem.y = 4;

				contInvCase.addChild(imgItem);

				// position de l'item dans le conteneur
				iPositionItemInConteneur++;
			}
		}
		catch(e){
			//alert("Page inexistante");
		}

		// Changement de l'image de la Map
		contMap.removeChild(map);
		// insertion de la map
		var map = new createjs.Bitmap(currentCase.pathImg);
		// Placement de la map
		map.x = contMap.width/2 - map.image.width/2;
		contMap.addChild(map);
	}
	stage.update();
});

/************************************************************************************************************
 * RECEPTION DES INFORMATIONS SUR LE PERSONNAGE
 */
socket.on('INFO_PERSONNAGE_SC', function(currentPerso) {

	var classe;

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
		classe="Pas de compétence"
	}
	contPerso.addChild(imgPerso);

	var PoidsSac=0;
	var PointsAttaque, PointsDefense;
	var currentItem;

	_persoProbaCache=currentPerso.multiProbaCache;
	_persoProbaFouille=currentPerso.multiProbaFouille;

	if(currentPerso.armeEquipee != null)
	{
		//PointsAttaque = currentPerso.getValeurArme() ;
		PointsAttaque =  currentPerso.multiPtsAttaque * currentPerso.armeEquipee.valeur ;
	}
	else
	{
		PointsAttaque = currentPerso.multiPtsAttaque ;
	}

	if(currentPerso.armureEquipee != null)
	{
		PointsDefense = currentPerso.multiPtsDefense * currentPerso.armureEquipee.valeur ;
	}
	else
	{
		PointsDefense = currentPerso.multiPtsDefense;
	}

	labelFichePerso.text=(classe+"\n"+
			"Zombies : "+currentPerso.goulesMax+"\n"+
			"Attaque x "+currentPerso.multiPtsAttaque+"\n"+
			"Défense x "+currentPerso.multiPtsDefense+"\n"+
			"Cache   x "+currentPerso.multiProbaCache+"\n"+
			"Fouille x "+currentPerso.multiProbaFouille);

	// Mise à jour des labels
	labelPtsAtq.text=("Points d'attaque :  " + PointsAttaque + "");
	labelPtsDef.text=("Points de défense : " + PointsDefense + "");	

	// Mise à jour des barres de vie, action, move		
	// Sécurité pour le remplissage de la barre de vie
	if(currentPerso.ptSante<=0)
	{
		//labelPtsVie.text=("Points de vie :         	 	0/" + currentPerso.ptSanteMax);
		labelPtsVie.text=("Points de vie :        " + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
		lifeBar.scaleX = 0;
	}
	else if(currentPerso.ptSante>=currentPerso.ptSanteMax)
	{
		labelPtsVie.text=("Points de vie :        " + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
		lifeBar.scaleX = lifeBarWidth;
	}
	else
	{
		labelPtsVie.text=("Points de vie :       " + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
		lifeBar.scaleX = (currentPerso.ptSante/currentPerso.ptSanteMax) * lifeBarWidth;
	}

	// Sécurité pour le remplissage de la barre de faim
	if(currentPerso.ptFaim<=0)
	{
		//labelPtsFaim.text=("Points de faim :         	 	0/" + currentPerso.ptFaimMax);
		labelPtsFaim.text=("Points de faim :        " + currentPerso.ptFaim + "/" + currentPerso.ptFaimMax);
		faimBar.scaleX = 0;
	}
	else if(currentPerso.ptFaim>=currentPerso.ptFaimMax)
	{
		labelPtsFaim.text=("Points de faim :        " + currentPerso.ptFaim + "/" + currentPerso.ptFaimMax);
		faimBar.scaleX = faimBarWidth;	
	}
	else
	{
		labelPtsFaim.text=("Points de faim :       " + currentPerso.ptFaim + "/" + currentPerso.ptFaimMax);
		faimBar.scaleX = (currentPerso.ptFaim/currentPerso.ptFaimMax) * faimBarWidth;
	}

	// Sécurité pour le remplissage de la barre d'action
	if(currentPerso.ptAction<=0)
	{
		//labelPtsAction.text=("Points d'action :	 	 	    	0/" + currentPerso.ptActionMax);
		labelPtsAction.text=("Points d'action :	 	 	    " + currentPerso.ptAction + "/" + currentPerso.ptActionMax);
		actionBar.scaleX = 0;
	}
	else if(currentPerso.ptAction>=currentPerso.ptActionMax)
	{
		labelPtsAction.text=("Points d'action :	 	 	    " + currentPerso.ptAction + "/" + currentPerso.ptActionMax);
		actionBar.scaleX = actionBarWidth;
	}
	else
	{
		labelPtsAction.text=("Points d'action :	 	 	    " + currentPerso.ptAction + "/" + currentPerso.ptActionMax);
		actionBar.scaleX = (currentPerso.ptAction/currentPerso.ptActionMax) * actionBarWidth;
	}

	// Sécurité pour le remplissage de la barre de move
	if(currentPerso.ptDeplacement >=currentPerso.ptDeplacementMax)
	{
		labelPtsMove.text=("Points de mouvement :     " + currentPerso.ptDeplacement + "/" + currentPerso.ptDeplacementMax);
		moveBar.scaleX = moveBarWidth;
	}
	else if(currentPerso.ptDeplacement<=0)
	{
		//labelPtsMove.text=("Points de mouvement :     0/" + currentPerso.ptDeplacementMax);
		labelPtsMove.text=("Points de mouvement :     " + currentPerso.ptDeplacement + "/" + currentPerso.ptDeplacementMax);
		moveBar.scaleX = 0;
	}
	else
	{
		labelPtsMove.text=("Points de mouvement :     " + currentPerso.ptDeplacement + "/" + currentPerso.ptDeplacementMax);
		moveBar.scaleX = (currentPerso.ptDeplacement/currentPerso.ptDeplacementMax) * moveBarWidth;
	}

	//stage.removeChild(BtnFouiller, BtnCacher, BtnDefendre);
	contMode.removeAllChildren();
	switch(currentPerso.mode)
	{
	case 0:
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
		BtnFouiller.y=0;
		contMode.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		BtnCacher.y = BtnFouiller.y + _espaceBoutonY;
		contMode.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		BtnDefendre.y = BtnCacher.y + _espaceBoutonY;
		contMode.addChild(BtnDefendre);
		BtnDefendre.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});

		BtnFouiller.cursor=BtnCacher.cursor=BtnDefendre.cursor="pointer";
		labelBonusArme.text=("");
		labelBonusArmure.text=("");

		break;

	case 1 :
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleGreen.png");
		BtnFouiller.y=0;
		contMode.addChild(BtnFouiller);

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		BtnCacher.y = BtnFouiller.y + _espaceBoutonY;
		contMode.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		BtnDefendre.y = BtnCacher.y + _espaceBoutonY;
		contMode.addChild(BtnDefendre);
		BtnDefendre.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		BtnFouiller.cursor="not-allowed";
		BtnCacher.cursor=BtnDefendre.cursor="pointer";

		labelBonusArme.text=("");
		labelBonusArmure.text=("");

		break;

	case 2 :  
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
		BtnFouiller.y=0;
		contMode.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheGreen.png");
		BtnCacher.y = BtnFouiller.y + _espaceBoutonY;
		contMode.addChild(BtnCacher);

		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		BtnDefendre.y = BtnCacher.y + _espaceBoutonY;
		contMode.addChild(BtnDefendre);
		BtnDefendre.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});

		BtnCacher.cursor="not-allowed";
		BtnFouiller.cursor=BtnDefendre.cursor="pointer";

		labelBonusArme.text=("");
		labelBonusArmure.text=("");

		break;

	case 3 :  
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
		BtnFouiller.y=0;
		contMode.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		BtnCacher.y = BtnFouiller.y + _espaceBoutonY;
		contMode.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseGreen.png");
		BtnDefendre.y = BtnCacher.y + _espaceBoutonY;
		contMode.addChild(BtnDefendre);

		BtnDefendre.cursor="not-allowed";
		BtnFouiller.cursor=BtnCacher.cursor="pointer";

		/*labelBonusArme.text=("( + " + PointsAttaque*0.25+" )");
		labelBonusArmure.text=("( + " + PointsDefense*0.25+" )");*/

		labelBonusArme.text=("(x 1.75)");
		labelBonusArmure.text=("(x 1.75)");

		break;
	}

	contInvPerso.removeAllChildren();

	// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();
	/*
	var indexArmeEquip;
	var indexArmureEquip;
	currentPerso.sacADos.splice(indexArmeEquip,1);
	currentPerso.sacADos.splice(indexArmureEquip,1);*/

	var Taille = Math.ceil(currentPerso.sacADos.length / 10);
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
					// Calcul du poids du sac
					PoidsSac+=item.poids;
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
				PoidsSac+=item.poids;
				// mise de l'item dans une variable
				NewListe.push(item);
			}
			TabListe.push(NewListe);
		}
	}

	if(PageItemPerso>Taille-1)
	{
		PageItemPerso=Taille-1;
	}
	else if (PageItemPerso<0)
	{
		PageItemPerso=0;
	}

	if(PageItemPerso==Taille-1)
	{
		BtnPageItemPersoRight.visible=false;
	}
	else
	{
		BtnPageItemPersoRight.visible=true;
	}

	if(PageItemPerso==0)
	{
		BtnPageItemPersoLeft.visible=false;
	}
	else
	{
		BtnPageItemPersoLeft.visible=true;
	}

	if(Taille ==0)
	{
		BtnPageItemPersoLeft.visible=false;
		BtnPageItemPersoRight.visible=false;
	}

	// Appel de fonction pour créer les boutons liés au Perso
	setContPerso();

	var Select;
	var SelectEquipement;

	// affichage des objets du sac
	try 
	{
		// instructions à essayer
		for (var i = 0; i < TabListe[PageItemPerso].length ; i++) 
		{
			var Obj=TabListe[PageItemPerso][i];
			
			//alert("iPositionItemInConteneur : " + iPositionItemInConteneur);

			if (currentPerso.armeEquipee != null && Obj.id == currentPerso.armeEquipee.id && armeDejaEquip==false && pressBtnEquipArme==true) 
			{
				// affichage arme équipee
				var imgItemArme = new createjs.Bitmap(currentPerso.armeEquipee.imageName);
				imgItemArme.cursor = "pointer";

				// Dessin de l'arme équipée
				contArme.removeAllChildren();
				contArme.addChild(imgItemArme);

				contArme.addEventListener("click", function (event) {
					if (SelectEquipement!=null)
					{
						contArme.removeChild(SelectEquipement);
						contArmure.removeChild(SelectEquipement);
					}
					SelectEquipement = contArme.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
					SelectEquipement.x=-5;
					SelectEquipement.y=-4;
					_selectedItemEquip = currentPerso.armeEquipee.id;
					setContEquipement();
				});

				contArme.addEventListener('mouseover', function(event) {
					var descriptionItem=currentPerso.armeEquipee.description;
					labelDescribeItem.text=(currentPerso.armeEquipee.nom + " (+" + currentPerso.armeEquipee.valeur + ") " + "Poids : " + currentPerso.armeEquipee.poids + "\n");
					afficherDescItem(descriptionItem);
					stage.update();
				},false);

				contArme.addEventListener('mouseout', function(event){
					labelDescribeItem.text="";
					stage.update();
				},false);
				
				armeDejaEquip=true;
			}
			else if (currentPerso.armureEquipee != null && Obj.id == currentPerso.armureEquipee.id && armureDejaEquip==false && pressBtnEquipArmure==true) 
			{
				// affichage arme équipee
				var imgItemArmure = new createjs.Bitmap(currentPerso.armureEquipee.imageName);
				imgItemArmure.cursor = "pointer";

				// Dessin de l'armure équipée
				contArmure.removeAllChildren();
				contArmure.addChild(imgItemArmure);

				contArmure.addEventListener("click", function (event) {
					if (SelectEquipement!=null)
					{
						contArme.removeChild(SelectEquipement);
						contArmure.removeChild(SelectEquipement);
					}
					SelectEquipement = contArmure.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
					SelectEquipement.x=-5;
					SelectEquipement.y=-4;
					_selectedItemEquip = currentPerso.armureEquipee.id;
					setContEquipement();
				});

				contArmure.addEventListener('mouseover', function(event) {
					var descriptionItem=currentPerso.armureEquipee.description;
					labelDescribeItem.text=(currentPerso.armureEquipee.nom + " (+" + currentPerso.armureEquipee.valeur + ") " + "Poids : " + currentPerso.armureEquipee.poids + "\n");
					afficherDescItem(descriptionItem);
					stage.update();
				},false);

				contArmure.addEventListener('mouseout', function(event){
					labelDescribeItem.text="";
					stage.update();
				},false);
				
				armureDejaEquip=true;
			}
			else
			{
				var imgItem = new createjs.Bitmap(Obj.imageName);

				imgItem.name = i;
				imgItem.cursor = "pointer";

				// Ajout de l'évenement a l'image
				// ajout d'un texte quand l'user passera la souris dessus
				imgItem.addEventListener('mouseover', function(event) {
					var currentItem = TabListe[PageItemPerso][event.target.name];
					var descriptionItem=currentItem.description;
					labelDescribeItem.text=(currentItem.nom + " (+" + currentItem.valeur + ") " + "Poids : " + currentItem.poids + "\n");
					afficherDescItem(descriptionItem);
					stage.update();
				},false);

				imgItem.addEventListener('mouseout', function(event){
					labelDescribeItem.text="";
					stage.update();
				},false);

				imgItem.addEventListener("click", function(event){
					if (Select!=null)
					{
						contInvPerso.removeChild(Select);
					}
					var num=event.target.x;
					var currentItem = TabListe[PageItemPerso][event.target.name];
					_selectedItemPerso=currentItem.id;
					_selectedItemPersoType=currentItem.type;
					Select = contInvPerso.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
					Select.x=(num);
					Select.y=0;
					// Appel de fonction pour créer les boutons liés au Perso
					setContPerso();
				});
				
				imgItem.x = (iPositionItemInConteneur * _spaceItem);
				imgItem.y = 4;
				contInvPerso.addChild(imgItem);
				
				// position de l'item dans le conteneur
				iPositionItemInConteneur++;
			}
		}
	}
	catch(e){}
	
	setContEquipement();

	labelInventaire.text="";
	labelInventaire.text=("Inventaire du perso :      "+ PoidsSac + "/" + currentPerso.poidsMax);

	// Affichage barre poids du sac
	sacBar.scaleX = (PoidsSac/currentPerso.poidsMax) * sacBarWidth;

	var longDernierMsg=60;

	if(currentPerso.listeMsgAtt.length > 0)
	{
		_listeMessages=currentPerso.listeMsgAtt;
		// inverse la liste des messages
		_listeMessages.reverse();
		// Raccourcissement du dernier message
		if(_listeMessages[0].length<longDernierMsg)
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
		}
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
	stage.update();
	if(currentPerso.ptSante<=0 && currentPerso.listeMsgAtt.length > 0)
	{
		dead(currentPerso);
	}
	// Update l'ihm
	stage.update();
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
socket.on('PERSONNAGE_USE_SC', function(id_item, codeRetour){
	setColorMsgRetour();
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
	stage.update();
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
socket.on('PERSONNAGE_MODE_SC', function (mode, reponse, degatsInfliges, nbrGoulesA) {
	setColorMsgRetour();
	switch(reponse)
	{
	case 1: 
		labelAction.text = ("Changement de \nmode ok !");
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case 0 : 
		labelAction.text = ("Changement de \nmode raté !\nErreur interne");
		break;
	case -4 : 
		labelAction.text = ("Changement de \nmode mode raté !\nDéjà dans ce mode !");
		break;
	case -5: 
		labelAction.text = ("Changement de \nmode raté !");
		if(degatsInfliges!=0)
		{
			labelAction.text +=("\nMais blessé (" + degatsInfliges + ")"); 
		}

		if(nbrGoulesA==1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " zombie !");
		}
		else if(nbrGoulesA>1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " zombies !");
		}
		break;
	case -10:
		labelAction.text = ("Changement de \nmode raté !\nPoints d'action \ninsuffisants !");
		break;
	}
	stage.update();
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
	setColorMsgRetour();
	switch(reponse)
	{
	case  1 : 
		labelAction.text =("Fouille rapide \nréussie !\nObjet découvert :\n" + item.nom);
		
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
				labelAction.text +=("\npar " + nbrGoulesA + " zombie !");
			}
			else if(nbrGoulesA>1)
			{
				labelAction.text +=("\npar " + nbrGoulesA + " zombies !");
			}
			socket.emit('INFO_PERSONNAGE_CS');
		}
		break;
	case  0 : 
		labelAction.text = "Erreur interne";
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -1 : 
		labelAction.text = "Fouille rapide ratée";
		break;
	case -5 : 
		labelAction.text = "Fouille rapide ratée";
		if(degatsInfliges!=0)
		{
			labelAction.text +=("\nEt blessé (" + degatsInfliges + ")"); 
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
	case -10 :
		labelAction.text = "Points d'action \ninsuffisants !";
		break;
	}
	stage.update();
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
socket.on('ACTION_ATTAQUE_SC', function (codeRetour, degatsI, degatsRecusE, degatsRecusG, nbrGoulesA){
	setColorMsgRetour();
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
	stage.update();
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
socket.on('ACTION_ATTAQUE_GOULE_SC', function (goulesTues, degatsSubis) {
	setColorMsgRetour();
	switch(goulesTues)
	{
	case 2: 
		labelAction.text=("2 zombies tués ! \n-" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 1: 
		labelAction.text=("1 zombie tué ! \n-" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 0:
		labelAction.text=("Attaque de zombie : \nerreur interne");
		break;

	case -1:
		labelAction.text=("Attaque de zombie \néchouée ! -" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case -2:
		labelAction.text=("Pas de zombie \ndans la salle !");
		break;

	case -10:
		labelAction.text=("Pas assez de \npoints d'actions !");
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
	//alert("retour ok");
	var i=0;
	var iPositionPersoInConteneur=0;

	var labelPseudo = contListe.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
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

	if(PagePersoAllies>Taille-1)
	{
		PagePersoAllies=Taille-1;
	}
	else if (PagePersoAllies<0)
	{
		PagePersoAllies=0;
	}

	if(PagePersoAllies==Taille-1)
	{
		BtnPagePersoAlliesRight.visible=false;
	}
	else
	{
		BtnPagePersoAlliesRight.visible=true;
	}

	if(PagePersoAllies==0)
	{
		BtnPagePersoAlliesLeft.visible=false;
	}
	else
	{
		BtnPagePersoAlliesLeft.visible=true;
	}

	if(Taille ==0)
	{
		BtnPagePersoAlliesLeft.visible=false;
		BtnPagePersoAlliesRight.visible=false;
	}

	try 
	{
		// instructions à essayer
		for (var i = 0; i < TabListe[PagePersoAllies].length ; i++) 
		{
			var persoA=TabListe[PagePersoAllies][i];

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
				var currentPerso = TabListe[PagePersoAllies][event.target.name];
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
				stage.update();
			},false);

			imgPersoAllie.addEventListener('mouseout', function(event){
				labelDescribePerso.text="";
				labelPseudo.text="";
				stage.update();
			},false);

			contListeAllies.addChild( imgPersoAllie);

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

	if(PagePersoEnn>Taille-1)
	{
		PagePersoEnn=Taille-1;
	}
	else if (PagePersoEnn<0)
	{
		PagePersoEnn=0;
	}

	if(PagePersoEnn==Taille-1)
	{
		BtnPagePersoEnnRight.visible=false;
	}
	else
	{
		BtnPagePersoEnnRight.visible=true;
	}

	if(PagePersoEnn==0)
	{
		BtnPagePersoEnnLeft.visible=false;
	}
	else
	{
		BtnPagePersoEnnLeft.visible=true;
	}

	if(Taille ==0)
	{
		BtnPagePersoEnnLeft.visible=false;
		BtnPagePersoEnnRight.visible=false;
	}

	var Select;

	try 
	{
		// instructions à essayer
		for (var i = 0; i < TabListe[PagePersoEnn].length ; i++) 
		{
			var persoE=TabListe[PagePersoEnn][i];

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
				var currentPerso = TabListe[PagePersoEnn][event.target.name];

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
				stage.update();
					},false);

			imgPersoEnnemi.addEventListener('mouseout', function(event){
				labelDescribePerso.text="";
				stage.update();
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
				var currentPerso = TabListe[PagePersoEnn][event.target.name];
				_selectedPerso=currentPerso.id;
				setBtnAttaquer(BtnCancelListe.x, BtnCancelListe.y);
				stage.update();
			});

			contListeEnnemis.addChild(imgPersoEnnemi);

			// position de l'item dans le conteneur
			iPositionPersoInConteneur++;

			// Update l'ihm
			stage.update();
		}
	}
	catch(e){}

	socket.emit('INFO_PERSONNAGE_CS');
		});

socket.on('ATTAQUE_NUIT_SC', function ()
		{
			attaqueNuit();
		});

socket.on('GET_DATE_SC', function (dateLancementSrv)
		{
	labelLancementServeur.text="";
	var annee = dateLancementSrv.substring(0,4);
	var mois = dateLancementSrv.substring(5,7);
	var jour = dateLancementSrv.substring(8,10);
	var heure = dateLancementSrv.substring(11,19);
	labelLancementServeur.text="Le "+jour+"/"+mois+" à "+heure;
		});

//Creer bouton tout simple :
//var BtnSaveBD = stage.addChild(new Button("SAVE BD", ColorBtn));
//Couleur des boutons
//var ColorBtn="#850000";