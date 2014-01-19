var canvas;
var stage, w, h, output;
var context;


var mouseTarget; // the display object currently under the mouse, or being dragged
var dragStarted; // indicates whether we are currently in a drag operation
var offset;

var listeItemsCase;
var listeItemsPerso;
var SelectedItemCase = -1;
var SelectedItemPerso = -1;
var SelectedItemEquip = -1;
var SelectedPerso = -1;
var PersoProbaCache=1;
var PersoProbaFouille=1;

var background, backgroundPreload, map, perso;

//Espacement items
var SpaceItem = 30;
//Police des labels
var PoliceLabel="14px monospace";

//label.lineHeight
var _LineHeight = 15;
//label.textBaseline
var _TextBaseline = "top";

//******************************************
//*  Réglages mise en forme (partie Design)*
//******************************************

//Espacement des boutons
var H=50;

//Abscisse des boutons 
var AbsBtn=0;
var AbsBtnD=950;

//Ordonnée des boutons
var OrdBtn=0;
var OrdBtnsPerso=150;
var OrdBtnListe = 150;

//Couleur des boutons
var ColorBtn="#850000";
//var ColorPad="#313131";

var ColorPad=createjs.Graphics.getRGB(0,0,0,0.01);
var ColorGreen="#008000";

//Couleur des labels
var ColorLabel = "#fff";
var ColorLabelBonus = ColorGreen;

//Espacement des labels
var _EspaceLabelX = 300;
var _EspaceLabelY = 20;

//Placement label Mode Perso
var _labelModeX = 440 + _EspaceLabelX;
var _labelModeY = 0;

//Placement Conteneur ItemCase
var _ContItemCaseX = _labelModeX;
var _ContItemCaseY = 620-75;

//Dimension Conteneur ItemCase
var _ContItemCaseH = 32;
var _ContItemCaseW = 320;

//Placement label ItemCase
var _labelItemCaseX = _ContItemCaseX;
var _labelItemCaseY = _ContItemCaseY - 20;

//Placement label Arme
var _labelArmeX = 750;
//var _labelArmeY = _labelModeY + _EspaceLabelY +5;
var _labelArmeY = 15;

//Placement label Armure
var _labelArmureX = _labelArmeX + 180;
//var _labelArmureY = _labelArmeY + _EspaceLabelY+10;
var _labelArmureY = _labelArmeY;

//Placement label ItemPerso
var _labelItemPersoX = _labelArmeX;
var _labelItemPersoY = _labelArmureY + _EspaceLabelY + 15;

//Placement Conteneur ItemPerso
var _ContItemPersoX = _labelItemPersoX;
var _ContItemPersoY = _labelItemPersoY + _EspaceLabelY+5;

//Dimension Conteneur ItemPerso
var _ContItemPersoH = 32;
var _ContItemPersoW = 320;

//------------------- Zone 1 : 1/2 barres perso -----------------------------------------------------

//Placement label Points de vie
var _labelPtsVX = 160;
var _labelPtsVY = 20;

//Placement label Points de faim
var _labelPtsFX = _labelPtsVX;
var _labelPtsFY = _labelPtsVY + _EspaceLabelY;

//Placement label Points d'Attaque
var _labelPtsAtqX = _labelPtsVX;
var _labelPtsAtqY = _labelPtsFY + _EspaceLabelY;

//Placement label Points de Défense
var _labelPtsDefX = _labelPtsVX
var _labelPtsDefY = _labelPtsAtqY +_EspaceLabelY;

//------------------ Zone 2 : 2/2 barres perso -------------------------------------------------------

//Placement label Points d'action
var _labelPtsAX = _labelPtsVX + _EspaceLabelX;
var _labelPtsAY = _labelPtsVY;

//Placement label Points de mouvements
var _labelPtsMX = _labelPtsAX;
var _labelPtsMY = _labelPtsAY + _EspaceLabelY;

//---------------------------------------------------------------------------------

//Placement label id Salle en cours
var _labelIdSalleX = _labelPtsAX;
var _labelIdSalleY = _labelPtsMY + _EspaceLabelY;


//Placement label Poids du Sac
/*var _labelPoidsSacX = _labelPtsVX + _EspaceLabelX;
var _labelPoidsSacY = _labelPtsDefY + _EspaceLabelY; */

//------------------ Zone 9 : Infos Case -------------------------------------------------------

//Placement label Description Item
var _labelDescribeItemX = _ContItemCaseX;
var _labelDescribeItemY = _ContItemCaseY + 30;

//Placement label Nombre d'Aliés
var _labelNbAliesX = 350;
var _labelNbAliesY = _labelItemCaseY;

//Placement label Nombre d'Ennemis
var _labelNbEnnemisX = _labelNbAliesX;
var _labelNbEnnemisY = _labelNbAliesY + _EspaceLabelY;

//Placement label Nombre de Goules
var _labelNbGoulesX = _labelNbAliesX;
var _labelNbGoulesY = _labelNbEnnemisY + _EspaceLabelY;

//------------------ Zone 8 : Proba de la case -------------------------------------------------------

//Placement label Probabilité de Cache
var _labelProbaCacheX = _labelNbAliesX;
var _labelProbaCacheY = _labelNbGoulesY + _EspaceLabelY;

//Placement label Probabilité de Fouille
var _labelProbaFouilleX = _labelNbAliesX;
var _labelProbaFouilleY = _labelProbaCacheY + _EspaceLabelY;

//-----------------------------------------------------------------------------------

//Placement label Retour Goules
var _labelRetourGoulesX = 10;
var _labelRetourGoulesY = 580;

//------------------ Zone 13 : Modes-------------------------------------------------------

//Placement Conteneur des boutons de mode
var _ContModeX = 50;
var _ContModeY = 330;
var _ContModeW = 140;
var _ContModeH = 150;

//Placement label Choix Mode
var _labelChoixModeX = _ContModeX+5;
var _labelChoixModeY = _ContModeY-20;

//------------------ Zone 4 : Equipement Perso-------------------------------------------------------

//Placement Conteneur ArmeEquip
var _ContArmeX = _labelArmeX + 125;
var _ContArmeY = _labelArmeY-3;

//Dimension Conteneur ArmeEquip
var _ContArmeH = 30;
var _ContArmeW = 30;

//Placement Conteneur ArmureEquip
var _ContArmureX = _labelArmureX + 135;
var _ContArmureY = _labelArmureY-3;

//Dimension Conteneur ArmureEquip
var _ContArmureH = 30;
var _ContArmureW = 30;

//------------------ Zone 8 : Listes-------------------------------------------------------

//Placement Conteneur des Boutons liste
var _ContBtnsListesX = 50;
var _ContBtnsListesY = 510;
var _ContBtnsListesW = 140;
var _ContBtnsListesH = 100;

//Placement label Choix Mode
var _labelBtnsListesX = _ContBtnsListesX+2;
var _labelBtnsListesY = _ContBtnsListesY-20;

//------------------------- Zone 5 : Btns Inv Perso ---------------------------------------
//Placement Conteneur des Boutons liste
var _ContBtnsInvPersoX = 910;
var _ContBtnsInvPersoY = 140;
var _ContBtnsInvPersoW = 140;
var _ContBtnsInvPersoH = 150;

//Placement label Choix Mode
var _labelBtnsInvPersoX = _ContBtnsInvPersoX-5;
var _labelBtnsInvPersoY = _ContBtnsInvPersoY-20;

//------------------------- Zone 6 : Btns Inv Case ---------------------------------------
//Placement Conteneur des Boutons liste
var _ContBtnsInvCaseX = _ContBtnsInvPersoX ;
var _ContBtnsInvCaseY = 340;
var _ContBtnsInvCaseW = 140;
var _ContBtnsInvCaseH = 150;

//Placement label Choix Mode
var _labelBtnsInvCaseX = _ContBtnsInvCaseX-5;
var _labelBtnsInvCaseY = _ContBtnsInvCaseY-20;

//------------------ Zone 12 : Map -------------------------------------------------------

//Placement Conteneur Map (en fonction de la taille de l'image !!)
var _ContMapX = 1100/2 - 620/2;
var _ContMapY = 620/2 - 379/2;

//Dimension Conteneur Map
var _ContMapH = 379;
var _ContMapW = 620;

//------------------- Zone 14 : Labels de retour------------------------------------------------------

var _ContLabelsMoveX = 10;
var _ContLabelsMoveY = 120;
var _ContLabelsMoveW = 220;
var _ContLabelsMoveH = 20;

var _ContLabelsObjetX = 10;
var _ContLabelsObjetY = _ContLabelsMoveY + 30;
var _ContLabelsObjetW = 220;
var _ContLabelsObjetH = 60;

var _ContLabelsAtqX = 10;
var _ContLabelsAtqY = _ContLabelsObjetY + 70;
var _ContLabelsAtqW = 220;
var _ContLabelsAtqH = 20;

var _ContLabelsModeX = 10;
var _ContLabelsModeY = _ContLabelsAtqY + 30;
var _ContLabelsModeW = 220;
var _ContLabelsModeH = 80;

//-------------- Déclaration des labels----------------------------------------------

var txtSalle, txtObjet, labelRetourFouilleRapide,
labelObjetCase,	labelInventaire, labelDescribeItem, labelRetourMode,
labelPtsMove, labelPtsAction, labelPtsVie, labelPoidsSac, labelPtsAtq, labelPtsDef,
labelBonusArme, labelBonusArmure, labelIdSalle, labelNomSalle, labelRetourGoules,
labelNbAlies, labelNbEnnemis, labelNbGoules, labelProbaCache, labelProbaFouille,
labelChoixMode, labelBtnsListes, labelBtnsInvPerso, labelBtnsInvCase, labelPtsFaim;

var labelAlliesListe, labelEnnemisListe, labelDescribePerso, labelMessage;

var contInvCase, contInvPerso, contArme, contArmure, contMap, contPerso, contMode,
contBtnsListes,
contBtnsInvPerso, contBtnsInvCase, contListe, contListeAllies, contListeEnnemis,
contLabelsMove, contLabelsObjet, contLabelsAtq, contLabelsMode, contMessage;

var shape, shape1, shape2, shape3, shape4, shape6, shape7, shape8, shapeMode,
shapeLabelsMove, shapeLabelsObjet, shapeLabelsAtq, shapeLabelsMode, shapeMessage;

var _EpaisseurBpPad = 50;

var ListeMessages;

var imgPerso, shapeBtnsListes, shapeBtnsInvPerso, shapeBtnsInvCase, shapeBtnsListes, 
shapeBtnsInvPerso, shapeBtnsInvCase;

onload = initialize;

function initialize() {

	// ************************************************
	// * Récupération du canvas et création contexte **
	// ************************************************

	canvas = document.getElementById("myCanvas");
	stage = new createjs.Stage(canvas);
	w = stage.canvas.width;
	h = stage.canvas.height;

	// enabled mouse over / out events
	stage.enableMouseOver(20);
	context = canvas.getContext("2d");

	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);

	// Teste la présence de HTML5 et de drag & drop
	/*if (Modernizr.draganddrop) {

    	} else {
    	  alert("! Vous devez passez en HTML5 !");
    	}*/

	// *******************************************
	// ** Mise en place barre de chargement      * 
	// *******************************************
	var manifest = [
	                {src:"public/BackgroundPreload.jpg", id:"idBackgroundPreload"}, 
	                {src:"public/Background_liste.jpg", id:"idBackgroundListe"},   
	                {src:"public/Background_1.jpg", id:"idBackground_1"}, 
	                {src:"public/Background_11.jpg", id:"idBackground_11"},    
	                {src:"public/blood.jpg", id:"idBackground_blood"}, 
	                {src:"public/ButtonRed.png", id:"idButton"},
	                {src:"public/ButtonGreen.png", id:"idButton2"},
	                {src:"public/Boutons/Historique.png", id:"idBtnHistorique"},
	                {src:"public/Boutons/Utiliser.png", id:"idBtnUtiliser"},
	                {src:"public/Boutons/Attaquer.png", id:"idBtnAttaquer"},
	                {src:"public/Boutons/AttaquerZ.png", id:"idBtnAttaquerZ"},
	                {src:"public/Boutons/Deposer.png", id:"idBtnDeposer"},
	                {src:"public/Boutons/Desequiper.png", id:"idBtnDesequiper"},
	                {src:"public/Boutons/Equiper.png", id:"idBtnEquiper"},
	                {src:"public/Boutons/FouilleR.png", id:"idBtnFouilleR"},
	                {src:"public/Boutons/Ramasser.png", id:"idBtnRamasser"},
	                {src:"public/Boutons/CacheGreen.png", id:"idBtnCacheGreen"},
	                {src:"public/Boutons/CacheRed.png", id:"idBtnCacheRed"},
	                {src:"public/Boutons/DefenseGreen.png", id:"idBtnDefenseGreen"},
	                {src:"public/Boutons/DefenseRed.png", id:"idBtnDefenseRed"},
	                {src:"public/Boutons/FouilleGreen.png", id:"idBtnFouilleGreen"},
	                {src:"public/Boutons/FouilleRed.png", id:"idBtnFouilleRed"},
	                {src:"public/Boutons/Allies.png", id:"idBtnAllies"},
	                {src:"public/Boutons/Ennemis.png", id:"idBtnEnnemis"},
	                {src:"public/Boutons/Annuler.png", id:"idBtnAnnuler"},
	                {src:"public/map/0-0.png", id:"0-0"},
	                {src:"public/map/0-1.png", id:"0-1"},
	                {src:"public/map/0-2.png", id:"0-2"},
	                {src:"public/map/0-4.png", id:"0-4"},
	                {src:"public/map/1-1.png", id:"1-1"},
	                {src:"public/map/1-2.png", id:"1-2"},
	                {src:"public/map/2-0.png", id:"2-0"},
	                {src:"public/map/2-1.png", id:"2-1"},
	                {src:"public/map/2-2.png", id:"2-2"},
	                {src:"public/spritesheets/persos/Brute.gif", id:"idPersoBrute"},
	                {src:"public/spritesheets/persos/Chercheur.gif", id:"idPersoChercheur"},
	                {src:"public/spritesheets/persos/Explorateur.gif", id:"idPersoExplorateur"},
	                {src:"public/spritesheets/persos/perso.gif", id:"idPerso"},
	                {src:"public/spritesheets/arme/100.png", id:"100"},
	                {src:"public/spritesheets/arme/101.png", id:"101"},
	                {src:"public/spritesheets/arme/102.png", id:"102"},
	                {src:"public/spritesheets/arme/103.png", id:"103"},
	                {src:"public/spritesheets/armure/200.png", id:"200"},
	                {src:"public/spritesheets/armure/201.png", id:"201"},
	                {src:"public/spritesheets/armure/202.png", id:"202"},
	                {src:"public/spritesheets/armure/203.png", id:"203"},
	                {src:"public/spritesheets/odd/300.png", id:"300"},
	                {src:"public/spritesheets/odd/301.png", id:"301"},
	                {src:"public/spritesheets/odd/302.png", id:"302"},
	                {src:"public/spritesheets/odd/303.png", id:"303"},
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
	                {src:"public/spritesheets/potionMouvement/603.png", id:"603"}
	                ];

	// application du background Preload
	backgroundPreload = new createjs.Bitmap("public/Background_1.jpg");
	backgroundPreload.image.onload = setImg(backgroundPreload, 0, 0);

	loadProgressLabel = new createjs.Text("","70px Infected","#850000");
	loadProgressLabel.lineWidth = 800;
	loadProgressLabel.textAlign = "center";
	//Centrer le label en x
	//loadProgressLabel.x = canvas.width/2;
	loadProgressLabel.x = canvas.width/2;
	loadProgressLabel.y = canvas.height/2 - 80;
	stage.addChild(loadProgressLabel);

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

function handleProgress() {

	loadingBar.scaleX = preload.progress * loadingBarWidth;

	progresPrecentage = Math.round(preload.progress*100);
	loadProgressLabel.text =("Loading Apocalypse");

	stage.update();
}

function handleComplete() {

	/*background = preload.getResult("idBackground");
	map = preload.getResult("idMap");
	perso = preload.getResult("idPerso");*/

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
	// ******************************************
	// ********** Connexion au serveur  *********
	// ******************************************

	//var socket = io.connect('http://localhost:8080');

	// Lancement du jeu si connexion ok
	if(socket.socket.connected)
		game();
}

function game() {
	// application du background
	var background = new createjs.Bitmap("public/Background_11.jpg");
	background.image.onload = setImg(background, 0, 0);

	//*********** Fin de la partie design **************
	// ******************************************

	// ******************************************
	// ** creation des conteneurs               *
	// ******************************************

	//------------------ Zone 7 : Inv Case -------------------------------------------------------
	contInvCase = new createjs.Container();
	contInvCase.x = _ContItemCaseX;
	contInvCase.y = _ContItemCaseY;
	contInvCase.height = _ContItemCaseH;
	contInvCase.width = _ContItemCaseW;
	stage.addChild(contInvCase);
	shape = new createjs.Shape();
	stage.addChild(shape);
	shape.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContItemCaseX-4, _ContItemCaseY-4, _ContItemCaseW+4, _ContItemCaseH+4);

	//------------------ Zone 4 : Equipement perso -------------------------------------------------------
	contInvPerso = new createjs.Container();
	contInvPerso.x = _ContItemPersoX;
	contInvPerso.y = _ContItemPersoY;
	contInvPerso.height = _ContItemPersoH;
	contInvPerso.width = _ContItemPersoW;
	stage.addChild(contInvPerso);
	shape1 = new createjs.Shape();
	stage.addChild(shape1);
	shape1.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContItemPersoX-4, _ContItemPersoY-4, _ContItemPersoW+4, _ContItemPersoH+4);

	contArme = new createjs.Container();
	contArme.x = _ContArmeX;
	contArme.y = _ContArmeY;
	contArme.height = _ContArmeH;
	contArme.width = _ContArmeW;
	stage.addChild(contArme);
	shape2 = new createjs.Shape();
	stage.addChild(shape2);
	shape2.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContArmeX-4, _ContArmeY-4, _ContArmeW+4, _ContArmeH+4);

	contArmure = new createjs.Container();
	contArmure.x = _ContArmureX;
	contArmure.y = _ContArmureY;
	contArmure.height = _ContArmureH;
	contArmure.width = _ContArmureW;
	stage.addChild(contArmure);
	shape3 = new createjs.Shape();
	stage.addChild(shape3);
	shape3.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContArmureX-4, _ContArmureY-4, _ContArmureW+4, _ContArmureH+4);

	//------------------ Zone 12 : Map -------------------------------------------------------
	contMap = new createjs.Container();
	contMap.x = _ContMapX;
	contMap.y = _ContMapY;
	contMap.height = _ContMapH;
	contMap.width = _ContMapW;
	stage.addChild(contMap);
	shape4 = new createjs.Shape();
	stage.addChild(shape4);
	shape4.graphics.setStrokeStyle(4).beginStroke("#850000").drawRect(
			_ContMapX-2, _ContMapY-2, _ContMapW+2, _ContMapH+2);

	contPerso = new createjs.Container();
	contPerso.x = w/2 - 32/2;
	contPerso.y = h/2 - 32/2;
	contPerso.height = 32;
	contPerso.width = 32;
	stage.addChild(contPerso);

	//------------------------- Zone 13 : Modes-----------------------------------------------
	contMode = new createjs.Container();
	contMode.x = _ContModeX;
	contMode.y = _ContModeY;
	contMode.height = _ContModeH;
	contMode.width = _ContModeW;
	stage.addChild(contMode);
	shapeMode = new createjs.Shape();
	stage.addChild(shapeMode);
	shapeMode.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContModeX-4, _ContModeY-4, _ContModeW+5, _ContModeH+5);

	//------------------------- Zone 8 : Btns Listes---------------------------------------
	contBtnsListes = new createjs.Container();
	contBtnsListes.x = _ContBtnsListesX;
	contBtnsListes.y = _ContBtnsListesY;
	contBtnsListes.height = _ContBtnsListesH;
	contBtnsListes.width = _ContBtnsListesW;
	stage.addChild(contBtnsListes);
	shapeBtnsListes = new createjs.Shape();
	stage.addChild(shapeBtnsListes);
	shapeBtnsListes.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContBtnsListesX-4, _ContBtnsListesY-4, _ContBtnsListesW+5, _ContBtnsListesH+5);

	//------------------------- Zone 5 : Btns Inv Perso ---------------------------------------
	contBtnsInvPerso = new createjs.Container();
	contBtnsInvPerso.x = _ContBtnsInvPersoX;
	contBtnsInvPerso.y = _ContBtnsInvPersoY;
	contBtnsInvPerso.height = _ContBtnsInvPersoH;
	contBtnsInvPerso.width = _ContBtnsInvPersoW;
	stage.addChild(contBtnsInvPerso);
	shapeBtnsInvPerso = new createjs.Shape();
	stage.addChild(shapeBtnsInvPerso);
	shapeBtnsInvPerso.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContBtnsInvPersoX-4, _ContBtnsInvPersoY-4, _ContBtnsInvPersoW+5, _ContBtnsInvPersoH+5);

	//------------------------- Zone 6 : Btns Inv Case ---------------------------------------
	contBtnsInvCase = new createjs.Container();
	contBtnsInvCase.x = _ContBtnsInvCaseX;
	contBtnsInvCase.y = _ContBtnsInvCaseY;
	contBtnsInvCase.height = _ContBtnsInvCaseH;
	contBtnsInvCase.width = _ContBtnsInvCaseW;
	stage.addChild(contBtnsInvCase);
	shapeBtnsInvCase = new createjs.Shape();
	stage.addChild(shapeBtnsInvCase);
	shapeBtnsInvCase.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContBtnsInvCaseX-4, _ContBtnsInvCaseY-4, _ContBtnsInvCaseW+5, _ContBtnsInvCaseH+5);
	
	//------------------------- Zone 14 : Labels de retour ---------------------------------------
	contLabelsMove = new createjs.Container();
	contLabelsMove.x = _ContLabelsMoveX;
	contLabelsMove.y = _ContLabelsMoveY;
	contLabelsMove.height = _ContLabelsMoveH;
	contLabelsMove.width = _ContLabelsMoveW;
	stage.addChild(contLabelsMove);
	shapeLabelsMove = new createjs.Shape();
	stage.addChild(shapeLabelsMove);
	shapeLabelsMove.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContLabelsMoveX-4, _ContLabelsMoveY-4, _ContLabelsMoveW+5, _ContLabelsMoveH+5);
	
	contLabelsObjet = new createjs.Container();
	contLabelsObjet.x = _ContLabelsObjetX;
	contLabelsObjet.y = _ContLabelsObjetY;
	contLabelsObjet.height = _ContLabelsObjetH;
	contLabelsObjet.width = _ContLabelsObjetW;
	stage.addChild(contLabelsObjet);
	shapeLabelsObjet = new createjs.Shape();
	stage.addChild(shapeLabelsObjet);
	shapeLabelsObjet.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContLabelsObjetX-4, _ContLabelsObjetY-4, _ContLabelsObjetW+5, _ContLabelsObjetH+5);
	
	contLabelsAtq = new createjs.Container();
	contLabelsAtq.x = _ContLabelsAtqX;
	contLabelsAtq.y = _ContLabelsAtqY;
	contLabelsAtq.height = _ContLabelsAtqH;
	contLabelsAtq.width = _ContLabelsAtqW;
	stage.addChild(contLabelsAtq);
	shapeLabelsAtq = new createjs.Shape();
	stage.addChild(shapeLabelsAtq);
	shapeLabelsAtq.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContLabelsAtqX-4, _ContLabelsAtqY-4, _ContLabelsAtqW+5, _ContLabelsAtqH+5);
	
	contLabelsMode = new createjs.Container();
	contLabelsMode.x = _ContLabelsModeX;
	contLabelsMode.y = _ContLabelsModeY;
	contLabelsMode.height = _ContLabelsModeH;
	contLabelsMode.width = _ContLabelsModeW;
	stage.addChild(contLabelsMode);
	shapeLabelsMode = new createjs.Shape();
	stage.addChild(shapeLabelsMode);
	shapeLabelsMode.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContLabelsModeX-4, _ContLabelsModeY-4, _ContLabelsModeW+5, _ContLabelsModeH+5);

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
	//********** Déclaration des labels *******
	// ******************************************

	labelIdSalle = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelIdSalle.lineHeight = _LineHeight;
	labelIdSalle.textBaseline = _TextBaseline;
	labelIdSalle.x = _labelIdSalleX;
	labelIdSalle.y = _labelIdSalleY;

	labelNomSalle = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelNomSalle.lineHeight = _LineHeight;
	labelNomSalle.textBaseline = _TextBaseline;
	labelNomSalle.x = _labelIdSalleX;
	labelNomSalle.y = _labelIdSalleY + 20;

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
	labelBtnsInvPerso.x = _labelBtnsInvPersoX;
	labelBtnsInvPerso.y = _labelBtnsInvPersoY;
	labelBtnsInvPerso.text="Action sur Perso :";

	labelBtnsInvCase = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelBtnsInvCase.lineHeight = _LineHeight;
	labelBtnsInvCase.textBaseline = _TextBaseline;
	labelBtnsInvCase.x = _labelBtnsInvCaseX;
	labelBtnsInvCase.y = _labelBtnsInvCaseY;
	labelBtnsInvCase.text="Action sur Case :";

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
	labelPtsFaim.text="Points de faim :";

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

	labelNbAlies = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelNbAlies.lineHeight = _LineHeight;
	labelNbAlies.textBaseline = _TextBaseline;
	labelNbAlies.x = _labelNbAliesX;
	labelNbAlies.y = _labelNbAliesY;

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

	// Conteneur labels Move
	txtSalle = contLabelsMove.addChild(new createjs.Text("", PoliceLabel, "#0033FF"));
	txtSalle.lineHeight = _LineHeight;
	txtSalle.textBaseline = _TextBaseline;
	txtSalle.x = 0;
	txtSalle.y = 0;
	//txtSalle.text="txtSalle";
	
	// Conteneur labels Objet
	txtObjet = contLabelsObjet.addChild(new createjs.Text("", PoliceLabel, "#CC9900"));
	txtObjet.lineHeight = _LineHeight;
	txtObjet.textBaseline = _TextBaseline;
	txtObjet.x = 0;
	txtObjet.y = 0;
	txtObjet.text="";
	
	labelRetourFouilleRapide = contLabelsObjet.addChild(new createjs.Text("", PoliceLabel, "#CC9900"));
	labelRetourFouilleRapide.lineHeight = _LineHeight;
	labelRetourFouilleRapide.textBaseline = _TextBaseline;
	labelRetourFouilleRapide.x = 0;
	labelRetourFouilleRapide.y = txtObjet.y + 40;
	//labelRetourFouilleRapide.text="labelRetourFouilleRapide";

	// Conteneur labels Attaque
	labelRetourGoules = contLabelsAtq.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelRetourGoules.lineHeight = _LineHeight;
	labelRetourGoules.textBaseline = _TextBaseline;
	labelRetourGoules.x = 0;
	labelRetourGoules.y = 0;
	//labelRetourGoules.text="labelRetourGoules";

	// Conteneur labels Mode
	labelRetourMode = contLabelsMode.addChild(new createjs.Text("", PoliceLabel, "#FF0000"));
	labelRetourMode.lineHeight = _LineHeight;
	labelRetourMode.textBaseline = _TextBaseline;
	labelRetourMode.x = 0;
	labelRetourMode.y = 0;
	//labelRetourMode.text="labelRetourMode";

	labelRetourModeG = contLabelsMode.addChild(new createjs.Text("", PoliceLabel, "#FF0000"));
	labelRetourModeG.lineHeight = _LineHeight;
	labelRetourModeG.textBaseline = _TextBaseline;
	labelRetourModeG.x = 0;
	labelRetourModeG.y = labelRetourMode.y + 40;
	//labelRetourModeG.text="labelRetourModeG";

	// ******************************************
	// ** Création des boutons de déplacement ***
	// ******************************************

	var BtnHaut = stage.addChild(new ButtonPad("", ColorPad, _ContMapW, _EpaisseurBpPad));
	BtnHaut.y = _ContMapY;
	BtnHaut.x = _ContMapX;
	BtnHaut.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
	});

	var BtnBas = stage.addChild(new ButtonPad("", ColorPad, _ContMapW, _EpaisseurBpPad));
	BtnBas.y = _ContMapY + _ContMapH - _EpaisseurBpPad;
	BtnBas.x = _ContMapX;
	BtnBas.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});

	var BtnGauche = stage.addChild(new ButtonPad("", ColorPad, _EpaisseurBpPad, _ContMapH));
	BtnGauche.x = _ContMapX;
	BtnGauche.y = _ContMapY;
	BtnGauche.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
	});

	var BtnDroite = stage.addChild(new ButtonPad("", ColorPad, _EpaisseurBpPad, _ContMapH));
	BtnDroite.x = _ContMapX + _ContMapW - _EpaisseurBpPad;
	BtnDroite.y = _ContMapY;
	BtnDroite.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'EST');
	});

	BtnHaut.cursor = BtnBas.cursor = BtnGauche.cursor = BtnDroite.cursor = "pointer";

	// ******************************************
	// ************ Boutons d'action ************
	// ******************************************

	var BtnSaveBD = stage.addChild(new Button("SAVE BD", ColorBtn));
	BtnSaveBD.x = 970;
	BtnSaveBD.y = 590;
	BtnSaveBD.cursor="pointer";
	BtnSaveBD.addEventListener('click', function(event) {
		socket.emit('SAVE_BD_DEBUG_CS');
	});

	var BtnEvents = new createjs.Bitmap("public/Boutons/Historique.png");
	BtnEvents.image.onload = setImg(BtnEvents, AbsBtn, OrdBtn);
	/*BtnEvents.addEventListener('click', function(event) {

		});	*/

	var BtnUtiliser = new createjs.Bitmap("public/Boutons/Utiliser.png");
	//BtnUtiliser.image.onload = setImg(BtnUtiliser, AbsBtn, BtnEvents.y + H);
	BtnUtiliser.y=0;
	contBtnsInvPerso.addChild(BtnUtiliser);
	BtnUtiliser.addEventListener('click', function(event) {
		if (SelectedItemPerso == -1) {
			//alert("Selectionner Item avant de l'utiliser");
		} else {
			socket.emit('PERSONNAGE_USE_CS', SelectedItemPerso);
			SelectedItemPerso = -1;
		}
	});	

	var BtnRamasseObjet = new createjs.Bitmap("public/Boutons/Ramasser.png");
	//BtnRamasseObjet.image.onload = setImg(BtnRamasseObjet, AbsBtn, BtnUtiliser.y + H);
	BtnRamasseObjet.y=0;
	contBtnsInvCase.addChild(BtnRamasseObjet);
	BtnRamasseObjet.addEventListener('click', function (event) {
		if (SelectedItemCase == -1) {
			//alert("Selectionner Item avant de Ramasser");
		} else {
			socket.emit('INV_CASE_CS', "RAMASSER", SelectedItemCase);
			SelectedItemCase = -1;
		}
	});

	var BtnDeposer = new createjs.Bitmap("public/Boutons/Deposer.png");
	//BtnDeposer.image.onload = setImg(BtnDeposer, AbsBtn, BtnRamasseObjet.y + H);
	BtnDeposer.y = BtnRamasseObjet.y + H;
	contBtnsInvCase.addChild(BtnDeposer);
	BtnDeposer.addEventListener('click', function (event) {
		if (SelectedItemPerso == -1) {
			//alert("Selectionner Item avant de Déposer");
		} else {
			socket.emit('INV_CASE_CS', "DEPOSER", SelectedItemPerso);
			SelectedItemPerso = -1;
		}
	});

	var BtnEquiper = new createjs.Bitmap("public/Boutons/Equiper.png");
	//BtnEquiper.image.onload = setImg(BtnEquiper, AbsBtn, BtnDeposer.y + H);
	BtnEquiper.y=BtnUtiliser.y + H;
	contBtnsInvPerso.addChild(BtnEquiper);
	BtnEquiper.addEventListener('click', function (event) {
		if (SelectedItemPerso == -1) {
			//alert("Selectionner Item avant de s'équiper");
		} else {
			socket.emit('INV_PERSONNAGE_CS', "EQUIPER", SelectedItemPerso);
			SelectedItemEquip = -1;
			SelectedItemPerso = -1;

		}

	});

	var BtnDesequiper = new createjs.Bitmap("public/Boutons/Desequiper.png");
	//BtnDesequiper.image.onload = setImg(BtnDesequiper, AbsBtn, BtnEquiper.y + H);
	BtnDesequiper.y=BtnEquiper.y + H;
	contBtnsInvPerso.addChild(BtnDesequiper);
	BtnDesequiper.addEventListener('click', function (event) {
		if (SelectedItemEquip == -1) {
			//alert("Selectionner Item avant de se déséquiper");
		}
		else{
			socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", SelectedItemEquip);
			SelectedItemEquip = -1;
			SelectedItemPerso = -1;
		}
	});

	var BtnAtqGoules = new createjs.Bitmap("public/Boutons/AttaquerZ.png");
	BtnAtqGoules.image.onload = setImg(BtnAtqGoules, AbsBtn, OrdBtn + H);
	BtnAtqGoules.addEventListener('click', function(event) {
		socket.emit('ACTION_ATTAQUE_GOULE_CS');
	});

	var BtnFouilleRapide = new createjs.Bitmap("public/Boutons/FouilleR.png");
	//BtnFouilleRapide.image.onload = setImg(BtnFouilleRapide, AbsBtn, BtnAtqGoules.y + H);
	BtnFouilleRapide.y = BtnDeposer.y + H;
	contBtnsInvCase.addChild(BtnFouilleRapide);
	BtnFouilleRapide.addEventListener('click', function(event) {
		socket.emit('ACTION_FOUILLE_RAPIDE_CS');
	});	

	var BtnListeAllies = new createjs.Bitmap("public/Boutons/Allies.png");
	//BtnListeAllies.image.onload = setImg(BtnListeAllies, AbsBtnD, OrdBtnListe);
	BtnListeAllies.y=0;
	contBtnsListes.addChild(BtnListeAllies);
	BtnListeAllies.addEventListener('click', function(event) {
		liste();
	});	

	var BtnListeEnnemis = new createjs.Bitmap("public/Boutons/Ennemis.png");
	//BtnListeEnnemis.image.onload = setImg(BtnListeEnnemis, AbsBtnD, OrdBtnListe + H);
	BtnListeEnnemis.y=BtnListeAllies.y + H;
	contBtnsListes.addChild(BtnListeEnnemis);
	BtnListeEnnemis.addEventListener('click', function(event) {
		if(ListeMessages != null)
		{
			//alert("Nouveaux messages");
			message(ListeMessages);
		}
		else
		{
			alert("Pas de nouveaux messages");
		}
	});

	BtnListeAllies.cursor=BtnListeEnnemis.cursor=BtnFouilleRapide.cursor=BtnAtqGoules.cursor=BtnEvents.cursor = BtnUtiliser.cursor = BtnRamasseObjet.cursor = BtnDeposer.cursor = BtnEquiper.cursor = BtnDesequiper.cursor ="pointer";// BtnAttaquer.cursor = 
	stage.update();

	// ******************************************
	// *********** INITIALISATION ***************
	// ******************************************

	// AFFICHAGE DE L'IVENTAIRE DE CASE ET PERSO
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
	//socket.emit('INFO_CASE_ALLIES_CS');
	stage.update();
	//Check message en attente (socket.emit)
	
	stage.update();
}

function message(ListeMsg)
{
	contMessage = new createjs.Container();
	contMessage.x = canvas.width/2 - 620/2;
	contMessage.y = canvas.height/2 - 379/2;
	contMessage.height = 379;
	contMessage.width = 620;
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
	labelMessage.y = 5;
	labelMessage.text=ListeMsg;

	var BtnCancelMessage = new createjs.Bitmap("public/Boutons/Annuler.png");
	BtnCancelMessage.x=330;
	BtnCancelMessage.y=330;
	contMessage.addChild(BtnCancelMessage);
	BtnCancelMessage.addEventListener('click', function (event) {
		stage.removeChild(contMessage);
		ListeMessages=null;
		game();
	});	
	
	BtnCancelMessage.cursor="pointer";

	stage.update();
}

function liste()
{
	socket.emit('INFO_CASE_ALLIES_CS');
	socket.emit('INFO_CASE_ENNEMIS_CS');

	contListe = new createjs.Container();
	contListe.x = canvas.width/2 - 620/2;
	contListe.y = canvas.height/2 - 379/2;
	contListe.height = 379;
	contListe.width = 620;
	stage.addChild(contListe);
	shape6 = new createjs.Shape();
	stage.addChild(shape6);
	shape6.graphics.setStrokeStyle(4).beginStroke("#999900").drawRect(
			contListe.x-2, contListe.y-2, contListe.width+2, contListe.height+2);

	// application du background liste au dessus de la map
	//var background_liste = new createjs.Bitmap("public/Background_liste.jpg");
	var background_liste = new createjs.Bitmap("public/blood.jpg");
	background_liste.alpha=0.95;
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
	labelDescribePerso.x = 20;
	labelDescribePerso.y = 280;

	//Conteneur des ALLIES
	contListeAllies = new createjs.Container();
	contListeAllies.x = 20;
	contListeAllies.y = 20;
	contListeAllies.height = 100;
	contListeAllies.width = 580;
	contListe.addChild(contListeAllies);
	shape7 = new createjs.Shape();
	contListe.addChild(shape7);
	shape7.graphics.setStrokeStyle(1).beginStroke("#ffffff").drawRect(
			contListeAllies.x-4, contListeAllies.y-4, contListeAllies.width+4, contListeAllies.height+4);

	//Conteneur des ENNEMIS
	contListeEnnemis = new createjs.Container();
	contListeEnnemis.x = 20;
	contListeEnnemis.y = 160;
	contListeEnnemis.height = 100;
	contListeEnnemis.width = 580;
	contListe.addChild(contListeEnnemis);
	shape8 = new createjs.Shape();
	contListe.addChild(shape8);
	shape8.graphics.setStrokeStyle(1).beginStroke("#ffffff").drawRect(
			contListeEnnemis.x-4, contListeEnnemis.y-4, contListeEnnemis.width+4, contListeEnnemis.height+4);

	// Bouton ANNULER
	/*var BtnCancelListe = contListe.addChild(new Button("Cancel", "#850000"));
	BtnCancelListe.x=330;
	BtnCancelListe.y=340;*/
	var BtnCancelListe = new createjs.Bitmap("public/Boutons/Annuler.png");
	BtnCancelListe.x=330;
	BtnCancelListe.y=330;
	contListe.addChild(BtnCancelListe);
	BtnCancelListe.addEventListener('click', function (event) {
		stage.removeChild(contListe);
		game();
	});

	// Bouton ATTAQUER
	var BtnAttaquerListe = new createjs.Bitmap("public/Boutons/Attaquer.png");
	BtnAttaquerListe.x=480;
	BtnAttaquerListe.y=330;
	contListe.addChild(BtnAttaquerListe);
	BtnAttaquerListe.addEventListener('click', function(event) {
		if (SelectedPerso == -1) {
			alert("Selectionner Ennemi avant d'attaquer !");
		}
		else{
			socket.emit('ACTION_ATTAQUE_CS', SelectedPerso);
			SelectedPerso = -1;
		}
	});
	
	BtnCancelListe.cursor=BtnAttaquerListe.cursor="pointer";

	stage.update();
}

function setImg(img, X, Y) 
{
	stage.addChild(img);	
	img.x = X;
	img.y = Y;
	stage.update();
}

//******************************************
//********* RECEPTION SERVEUR **************
//******************************************

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE POUR ATTAQUER UN AUTRE JOUEUR
 * return 1 si ok
 * erreur : 0 si erreur interne
 * erreur : -1 si joueur n'est plus dans la caase
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
socket.on('ACTION_ATTAQUE_SC', function (codeRetour, degatsI, degatsRecusE, degatsRecusG, nbGoules){
	switch(codeRetour)
	{
		case 0:
			alert("erreur interne");
			break;
		case 1:
			alert("attaque ok");
			break;
		case -1:
			alert("attaque : joueur plu dans la case");
			break;
		case -5:
			alert("attaque ratée à cause des goules");
			break;
		case -10:
			alert("attaque plu de pts d'actions");
			break;
	}
	alert("dagats infligés : "+degatsI);
	alert("dagats recus ennemi : "+degatsRecusE);
	alert("dagats recus goules : "+degatsRecusG);
	alert("nbr goules attaqués: "+nbGoules);
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
});

/******************************************************************************************************************
 * RECEPTION D'UNE DEMANDE DE DEPLACEMENT VERS UNE DIRECTION DONNEE Renvoi
 * la case avec MOVE_PERSONNAGE_SC 
 * return : usersOnline[username].cManager.GetCopieCase() si ok
 * erreur : renvoi 0 si erreur de case
 * erreur : renvoi -1 si impossible de bouger 
 * erreur : -2 si aucun de Pts Mouvement
 * erreur : -3 si trop de goules
 * erreur : -4 si zone sure adverse
 * 
 * 
 */
socket.on('MOVE_PERSONNAGE_SC', function (currentCase) {
	switch(currentCase)
	{
	case 0: txtSalle.text = "";
	txtSalle.text = ("WARNING : ERREUR_CASE");
	break;

	case -1: txtSalle.text = "";
	txtSalle.text = ("Impossible d'aller par là !");
	break;

	case -2: txtSalle.text = "";
	txtSalle.text = ("Vous n'avez plus de points de mouvements !");
	break;

	case -3: txtSalle.text = "";
	txtSalle.text = ("Trop de Zombies dans cette salle !");
	break;

	case -4: txtSalle.text = "";
	txtSalle.text = ("Impossible de pénétrer dans la Maison de l'ennemi!");
	break;

	default: socket.emit('INFO_CASE_CS');
	labelRetourGoules.text="";
	txtSalle.text = "";
	txtSalle.text = ("Déplacement en salle " + currentCase.nom + "");
	socket.emit('INFO_PERSONNAGE_CS');
	break;
	}
	stage.update();
});

/******************************************************************************************************************
 * RECEPTION DE LA REPONSE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM
 * return 1 si arme équipée / déséquipée
 * return 2 si armure équipée / déséquipée
 * erreur : 0 si objet n'est pas dans le sac
 * erreur : -1 si il y a déja une arme d'équipée
 * erreur : -2 si il y a déja une armure d'équipée
 * erreur : -3 si item n'est ni arme ni armure
 * erreur : -4 si l'item a dequiper n'est pas équipé au préalable
 */
socket.on('INV_PERSONNAGE_SC', function (type, currentItem, codeRetour) {
	//alert("retour button ok");

	if (codeRetour == 0) {
		txtObjet.text = "";
		txtObjet.text = ("L'item " + currentItem.id + " n'est plus dans le sac ");
		// quitte la fonction
		return;
	}
	if (type == "EQUIPER") {
		//alert("LOG CODE : " + codeRetour);
		switch (codeRetour) {
		case 0:
			txtObjet.text = "";
			txtObjet.text = ("Item pas dans le sac !");
			//alert("Equipement de l'item " + currentItem.nom + " raté : Item pas dans sac !");
			break;

			// équipage ok
		case 1:
			var imgItem = new createjs.Bitmap(currentItem.imageName);
			imgItem.cursor = "pointer";
			// Si le type de l'item est : ARME
			if (currentItem.type == 1) {
				// Dessin de l'arme équipée
				contArme.removeAllChildren();
				contArme.addChild(imgItem);
				contArme.addEventListener("click", function (event) {
					SelectedItemEquip = currentItem.id;
					alert(SelectedItemEquip);
					stage.update();
				});
			}
			// Si le type de l'item est : ARMURE
			else if (currentItem.type == 2) {
				// Dessin de l'armure équipée
				contArmure.removeAllChildren();
				contArmure.addChild(imgItem);
				contArmure.addEventListener("click", function (event) {
					SelectedItemEquip = currentItem.id;
					alert(SelectedItemEquip);
					stage.update();
				});
			}
			// log
			txtObjet.text = "";
			txtObjet.text = ("Equipement de l'objet ok");

			stage.update();
			socket.emit('INFO_PERSONNAGE_CS');
			break;

		case -1:
			//alert("-1");
			txtObjet.text = "";
			txtObjet.text = ("Arme déja équipée");
			//alert("Equipement de l'item " + currentItem.id + " raté : arme déja équipée");
			break;

		case -2:
			//alert("-2");
			txtObjet.text = "";
			txtObjet.text = ("Armure déja équipée");
			//alert("Equipement de l'item " + currentItem.id + " raté : armure déja équipée");
			break;

		case -3:
			alert("-3");
			txtObjet.text = "";
			txtObjet.text = ("L'objet n'est pas équipable");
			//alert("Equipement de l'item " + currentItem.id + " raté : l'objet n'est pas équipable");
			break;

		}
	} else if (type == "DEQUIPER") {
		if (codeRetour == -4)
		{
			txtObjet.text = "";
			txtObjet.tetx = ("Déséquipement impossible, vous n'en êtes pas équipé");
		} else if (codeRetour == 1) {
			// Si déquipe arme
			// efface l'arme
			contArme.removeAllChildren();
			txtObjet.text = "";
			txtObjet.text = ("Arme déséquipée !");
			socket.emit('INFO_PERSONNAGE_CS');					
		}
		// Si déquipe armure
		else if (codeRetour == 2) {
			// efface armure
			contArmure.removeAllChildren();
			txtObjet.text = "";
			txtObjet.text = ("Armure déséquipée !");
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
 * 
 * ET return id_item
 * 
 * ET degats reçus
 * 
 * ET nbr goules attaquantes
 */
socket.on('INV_CASE_SC', function (type, codeRetour, id_item, DegatsG, RestG) {
	if (type == 'RAMASSER') {
		switch(codeRetour)
		{
		// erreur
		case -3:
			txtObjet.text = "";
			txtObjet.text = ("Erreur inconnue");
			break;
			// poids insufisant
		case -1:
			txtObjet.text = "";
			txtObjet.text = ("Impossible de ramasser l'objet,\npoids max atteint !");
			break;
			// objet pas dans case
		case -2:
			txtObjet.text = "";
			txtObjet.text = ("Impossible de ramasser l'objet,\nplus dans la salle !");
			break;
		case -5:
			txtObjet.text = "";
			txtObjet.text = ("Impossible de ramasser l'objet à cause des Zombies !\n- " + DegatsG + " points de vie !");
			socket.emit('INFO_PERSONNAGE_CS');
			break;
			// ramassage ok
		default:
			txtObjet.text = "";
		txtObjet.text = ("Item ramassé ! Sac : " + codeRetour + " kg\n- " + DegatsG + " points de vie !\n"+ RestG + " Zombies restants");
		socket.emit('INFO_PERSONNAGE_CS');
		socket.emit('INFO_CASE_CS');
		stage.update();
		break;
		}
	}
	stage.update();
	if (type == 'DEPOSER') {
		switch(codeRetour)
		{
		// erreur
		case -3:
			txtObjet.text = "";
			txtObjet.text = ("Déséquipez avant de déposer !");
			break;
		case -4:
			txtObjet.text = "";
			txtObjet.text = ("Erreur interne !");
			break;
			// objet pas dans sac (! pas normal)
		case -2:
			txtObjet.text = "";
			txtObjet.text = ("L'item n'est plus dans le sac ");
			break;
			// dépôt ok
		default:
			txtObjet.text = "";
		txtObjet.text = ("Item déposé !\nSac : " + codeRetour + " kg");
		socket.emit('INFO_CASE_CS');
		socket.emit('INFO_PERSONNAGE_CS');
		stage.update();
		break;
		}
	}
	stage.update();
});

/******************************************************************************************************************
 * RECEPTION DES INFORMATIONS SUR LA CASE
 *
 * @method INFO_CASE_SC
 */
socket.on('INFO_CASE_SC', function(currentCase, nbrAllies, nbrEnnemis) {
	//socket.emit('CHECK_MSG_ATT_CS');	
	this.listeItemsCase = new Array();

	if (currentCase == "ERREUR_CASE")
	{
		//insereMessage("CLIENT :: nom case = " + "ERREUR_CASE");
		txtSalle.text="";
		txtSalle.text=("CLIENT :: nom case = " + "ERREUR_CASE");
	}
	else {

		var ProbCache, ProbFouille;
		ProbCache=(currentCase.probaCache * PersoProbaCache);
		ProbFouille=(currentCase.probaObjet * PersoProbaFouille);

		labelNbAlies.text=("Alliés dans la salle : " + nbrAllies + "");
		labelNbEnnemis.text=("Ennemis dans la salle : " + nbrEnnemis + "");
		labelNbGoules.text=("Zombies dans la salle : " + currentCase.nbrGoules + "");
		labelProbaCache.text=("Proba de Cache :              " + ProbCache + " %     (x " +  PersoProbaCache + ")");
		labelProbaFouille.text=("Proba de Trouver item :       " + ProbFouille + " %     (x " +  PersoProbaFouille + ")");
		labelNomSalle.text="";
		labelNomSalle.text=("Nom salle : "+currentCase.nom+"");
		
		cacheBar.scaleX = (ProbCache/100) * cacheBarWidth;
		fouilleBar.scaleX = (ProbFouille/100) * fouilleBarWidth;
		
		labelObjetCase.text="";
		labelObjetCase.text=("Objets de la case : "+ currentCase.nom + "");

		// CLear de la liste des items de case
		listeItemsCase = new Array();
		contInvCase.removeAllChildren();
		// parcours de la liste des items de la case
		for (var i = 0; i < currentCase.listeItem.length; i++) {

			// mise de l'item dans une variable
			var item = currentCase.listeItem[i];

			// Ajout de l'item à la liste
			listeItemsCase.push(item);

			// Ajout de l'image à l'ihm
			var imgItem = new createjs.Bitmap(item.imageName);

			// ajout d'un texte quand l'user passera la souris dessus
			imgItem.name = i;

			imgItem.cursor = "pointer";

			// Ajout de l'évenement a l'image
			imgItem.addEventListener('mouseover', function(event) {
				var currentItem = listeItemsCase[event.target.name];
				labelDescribeItem.text=("Nom : " + currentItem.nom + " (valeur : " + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
				stage.update();
			},false);

			imgItem.addEventListener('mouseout', function(event){
				labelDescribeItem.text="";
				stage.update();
			},false);

			imgItem.addEventListener("click", function(event){
				var currentItem = listeItemsCase[event.target.name];
				SelectedItemCase=currentItem.id;
				stage.update();
			});

			//Placement de l'image et ajout au conteneur
			//imgItem.image.onload = setImg(imgItem,200+(i+1)*30,50);
			imgItem.x = i * SpaceItem;
			contInvCase.addChild(imgItem);

			contMap.removeChild(map);
			// insertion de la map
			var map = new createjs.Bitmap(currentCase.pathImg);
			// Placement de la map
			map.x = contMap.width/2 - map.image.width/2;
			contMap.addChild(map);

			// Update l'ihm
			stage.update();
		}
	}
	stage.update();
});

/************************************************************************************************************
 * RECEPTION DES INFORMATIONS SUR LE PERSONNAGE
 */
socket.on('INFO_PERSONNAGE_SC', function(currentPerso) {
	
	//socket.emit('CHECK_MSG_ATT_CS');
	
	this.listeItemsPerso = new Array();
	
	// insertion de l'image du Perso
	if(currentPerso.competence=="brute")
	{
		imgPerso = new createjs.Bitmap("public/spritesheets/persos/Brute.gif");
	}
	else if(currentPerso.competence=="chercheur")
	{
		imgPerso = new createjs.Bitmap("public/spritesheets/persos/Chercheur.gif");
	}
	else if(currentPerso.competence=="explorateur")
	{
		imgPerso = new createjs.Bitmap("public/spritesheets/persos/Explorateur.gif");
	}
	else
	{
		imgPerso = new createjs.Bitmap("public/spritesheets/persos/perso.gif");
	}
	contPerso.addChild(imgPerso);

	var PoidsSac=0;
	var PointsAttaque, PointsDefense;
	var currentItem;

	PersoProbaCache=currentPerso.multiProbaCache;
	PersoProbaFouille=currentPerso.multiProbaFouille;

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
		//PointsDefense = currentPerso.getValeurArmure();

	// Mise à jour des labels
	labelPtsAtq.text=("Points d'attaque :  " + PointsAttaque + "");
	labelPtsDef.text=("Points de défense : " + PointsDefense + "");
	labelIdSalle.text=("Salle en cours : " + currentPerso.idSalleEnCours + "");

	// Mise à jour des barres de vie, action, move		
	// Sécurité pour le remplissage de la barre de vie
	if(currentPerso.ptSante<=0)
	{

		//labelPtsVie.text=("Points de vie :         	 	0/" + currentPerso.ptSanteMax);
		labelPtsVie.text=("Points de vie :        " + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
		lifeBar.scaleX = 0;
	}
	else if(currentPerso.ptSante> currentPerso.ptSanteMax)
	{
		labelPtsVie.text=("Points de vie :        " + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
		lifeBar.scaleX = lifeBarWidth;
	}
	else
	{
		labelPtsVie.text=("Points de vie :       " + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
		lifeBar.scaleX = (currentPerso.ptSante/currentPerso.ptSanteMax) * lifeBarWidth;
	}

	// Sécurité pour le remplissage de la barre d'action
	if(currentPerso.ptActions<=0)
	{
		//labelPtsAction.text=("Points d'action :	 	 	    	0/" + currentPerso.ptActionsMax);
		labelPtsAction.text=("Points d'action :	 	 	    " + currentPerso.ptActions + "/" + currentPerso.ptActionsMax);
		actionBar.scaleX = 0;
	}
	else if(currentPerso.ptActions> currentPerso.ptActionsMax)
	{
		labelPtsAction.text=("Points d'action :	 	 	    " + currentPerso.ptActions + "/" + currentPerso.ptActionsMax);
		actionBar.scaleX = actionBarWidth;
	}
	else
	{
		labelPtsAction.text=("Points d'action :	 	 	    " + currentPerso.ptActions + "/" + currentPerso.ptActionsMax);
		actionBar.scaleX = (currentPerso.ptActions/currentPerso.ptActionsMax) * actionBarWidth;
	}

	// Sécurité pour le remplissage de la barre de move
	if(currentPerso.ptDeplacement > currentPerso.ptDeplacementMax)
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
		//BtnFouiller.image.onload = setImg(BtnFouiller, AbsBtnD, OrdBtnMode);
		BtnFouiller.y=0;
		contMode.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		//BtnCacher.image.onload = setImg(BtnCacher, AbsBtnD, BtnFouiller.y + H);
		BtnCacher.y = BtnFouiller.y + H;
		contMode.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		//BtnDefendre.image.onload = setImg(BtnDefendre, AbsBtnD, BtnCacher.y + H);
		BtnDefendre.y = BtnCacher.y + H;
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
		//BtnFouiller.image.onload = setImg(BtnFouiller, AbsBtnD, OrdBtnMode);
		BtnFouiller.y=0;
		contMode.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		//BtnCacher.image.onload = setImg(BtnCacher, AbsBtnD, BtnFouiller.y + H);
		BtnCacher.y = BtnFouiller.y + H;
		contMode.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		//BtnDefendre.image.onload = setImg(BtnDefendre, AbsBtnD, BtnCacher.y + H);
		BtnDefendre.y = BtnCacher.y + H;
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
		//BtnFouiller.image.onload = setImg(BtnFouiller, AbsBtnD, OrdBtnMode);
		BtnFouiller.y=0;
		contMode.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheGreen.png");
		//BtnCacher.image.onload = setImg(BtnCacher, AbsBtnD, BtnFouiller.y + H);
		BtnCacher.y = BtnFouiller.y + H;
		contMode.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		//BtnDefendre.image.onload = setImg(BtnDefendre, AbsBtnD, BtnCacher.y + H);
		BtnDefendre.y = BtnCacher.y + H;
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
		//BtnFouiller.image.onload = setImg(BtnFouiller, AbsBtnD, OrdBtnMode);
		BtnFouiller.y=0;
		contMode.addChild(BtnFouiller);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		//BtnCacher.image.onload = setImg(BtnCacher, AbsBtnD, BtnFouiller.y + H);
		BtnCacher.y = BtnFouiller.y + H;
		contMode.addChild(BtnCacher);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseGreen.png");
		//BtnDefendre.image.onload = setImg(BtnDefendre, AbsBtnD, BtnCacher.y + H);
		BtnDefendre.y = BtnCacher.y + H;
		contMode.addChild(BtnDefendre);
		BtnDefendre.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		BtnDefendre.cursor="not-allowed";
		BtnFouiller.cursor=BtnCacher.cursor="pointer";

		labelBonusArme.text=("(+" + PointsAttaque*0.25 + " points)	");
		labelBonusArmure.text=("(+" + PointsDefense*0.25 + " points)");

		break;
	}



	// CLear de la liste des items de case
	listeItemsPerso = new Array();
	contInvPerso.removeAllChildren();

	var iPositionItemInConteneur=0;

	for (var i = 0; i < currentPerso.sacADos.length; i++) 
	{
		// mise de l'item dans une variable
		var item = currentPerso.sacADos[i];

		// Calcul du poids du sac
		PoidsSac+=item.poids;

		// Ajout de l'item à la liste
		listeItemsPerso.push(item);

		if(!((currentPerso.armeEquipee != null && item.id == currentPerso.armeEquipee.id) || 
				(currentPerso.armureEquipee != null && item.id == currentPerso.armureEquipee.id)) )
		{			
			// Ajout de l'image à l'ihm
			var imgItem = new createjs.Bitmap(item.imageName);

			imgItem.name = i;
			imgItem.cursor = "pointer";

			// Ajout de l'évenement a l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgItem.addEventListener('mouseover', function(event) {
				var currentItem = listeItemsPerso[event.target.name];
				labelDescribeItem.text=("Nom : " + currentItem.nom + " (valeur : " + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
				stage.update();
			},false);

			imgItem.addEventListener('mouseout', function(event){
				labelDescribeItem.text="";
				stage.update();
			},false);

			imgItem.addEventListener("click", function(event){
				var currentItem = listeItemsPerso[event.target.name];
				SelectedItemPerso=currentItem.id;
				stage.update();
			});

			imgItem.x = iPositionItemInConteneur * SpaceItem;
			contInvPerso.addChild(imgItem);

			// position de l'item dans le conteneur
			iPositionItemInConteneur++;

			// Update l'ihm
			stage.update();
		}
	}

	if (currentPerso.armeEquipee != null) {
		// affichage arme équipee
		var imgItemArme = new createjs.Bitmap(currentPerso.armeEquipee.imageName);
		imgItemArme.cursor = "pointer";

		// Dessin de l'arme équipée
		contArme.removeAllChildren();
		contArme.addChild(imgItemArme);

		/*if(PointsAttaque>=0 &&)
		{
			labelBonusArme.text=("(+" + PointsAttaque*0.25 + " points)	");
		}
		else
		{
			labelBonusArme.text=("(-" + PointsDefense*0.25 + " points)");
		}*/

		contArme.addEventListener("click", function (event) {
			SelectedItemEquip = currentPerso.armeEquipee.id;
			stage.update();
		});

		contArme.addEventListener('mouseover', function(event) {
			labelDescribeItem.text=("Nom : " + currentPerso.armeEquipee.nom + " (valeur : " + currentPerso.armeEquipee.valeur + ") " + "\nPoids : " + currentPerso.armeEquipee.poids + "\nDescription : " + currentPerso.armeEquipee.description);
			stage.update();
		},false);

		contArme.addEventListener('mouseout', function(event){
			labelDescribeItem.text="";
			stage.update();
		},false);
	}
	if (currentPerso.armureEquipee != null) {
		// affichage arme équipee
		var imgItemArmure = new createjs.Bitmap(currentPerso.armureEquipee.imageName);
		imgItemArmure.cursor = "pointer";

		// Dessin de l'armure équipée
		contArmure.removeAllChildren();
		contArmure.addChild(imgItemArmure);

		/*if(currentPerso.armureEquipee.valeur >=0)
		{
			labelBonusArmure.text=("(+" + currentPerso.armureEquipee.valeur + " points)");
		}
		else
		{
			labelBonusArmure.text=("(-" + currentPerso.armureEquipee.valeur + " points)");
		}*/

		contArmure.addEventListener("click", function (event) {
			SelectedItemEquip = currentPerso.armureEquipee.id;
			stage.update();
		});

		contArmure.addEventListener('mouseover', function(event) {
			labelDescribeItem.text=("Nom : " + currentPerso.armureEquipee.nom + " (valeur : " + currentPerso.armureEquipee.valeur + ") " + "\nPoids : " + currentPerso.armureEquipee.poids + "\nDescription : " + currentPerso.armureEquipee.description);
			stage.update();
		},false);

		contArmure.addEventListener('mouseout', function(event){
			labelDescribeItem.text="";
			stage.update();
		},false);
	}

	labelInventaire.text="";
	labelInventaire.text=("Inventaire du perso :      "+ PoidsSac + "/" + currentPerso.poidsMax);

	// Affichage barre poids du sac
	sacBar.scaleX = (PoidsSac/currentPerso.poidsMax) * sacBarWidth;
	
	if(currentPerso.listeMsgAtt.length > 0)
	{
		ListeMessages=currentPerso.listeMsgAtt;
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
	switch(codeRetour)
	{
	case 1: 
		//alert("objet utilisé !");
		txtObjet.text="";
		txtObjet.text=("objet utilisé !");
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -1:
		//alert("objet plus dans le sac !");
		txtObjet.text="";
		txtObjet.text=("objet plus dans le sac !");
		break;

	case -2:
		//alert("objet inutilisable !");
		txtObjet.text="";
		txtObjet.text=("objet inutilisable !");
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
 * erreut : -2 si pas de goules dans la salle
 * 
 * ET degats reçus
 * 
 */
socket.on('ACTION_ATTAQUE_GOULE_SC', function (goulesTues, degatsSubis) {
	switch(goulesTues)
	{
	case 2: 
		labelRetourGoules.text="";
		labelRetourGoules.text=("2 Zombies tuées ! -" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 1: 
		labelRetourGoules.text="";
		labelRetourGoules.text=("1 Zombie tuée ! -" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 0:
		labelRetourGoules.text="";
		labelRetourGoules.text=("Attaque de Zombie(s) : erreur interne");
		break;

	case -1:
		labelRetourGoules.text="";
		labelRetourGoules.text=("Attaque de Zombie(s) échouée ! -" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case -2:
		labelRetourGoules.text="";
		labelRetourGoules.text=("Pas de Zombie dans la salle !");
		break;
	}
	socket.emit('INFO_CASE_CS');
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
socket.on('PERSONNAGE_MODE_SC', function (mode, reponse, degatsInfliges, nbGoulesAttaq) 
		{
	switch(reponse)
	{
	case 1: 
		labelRetourMode.text = "";
		labelRetourMode.text = ("Changement de mode ok !");
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case 0 : 
		labelRetourMode.text = "";
		labelRetourMode.text = ("Changement de mode raté !\nErreur interne");
		break;
	case -4 : 
		labelRetourMode.text = "";
		labelRetourMode.text = ("Changement de mode mode raté !\nDéja dans ce mode");
		break;
	case -5: 
		labelRetourMode.text = "";
		labelRetourMode.text = ("Changement de mode raté !\nFaute aux Zombies");
		break;
	case -10:
		labelRetourMode.text = "";
		labelRetourMode.text = ("Changement de mode raté !\nPlus de points d'action");
		break;
	}
	labelRetourModeG.text = "";
	labelRetourModeG.text+=("Dégats infligés : " + degatsInfliges +" !\nAttaqué par " + nbGoulesAttaq+ " Zombies !");

		});


/* ET return éventuels dégats infligés
 * 
 * ET return éventuels item découvert
 * 
 * ET return 1 si objet ajouté au sac, 0 si a la salle
 */
socket.on('ACTION_FOUILLE_RAPIDE_SC', function (reponse, degatsInfliges, item, degatsInfliges, ajouteAuSac) 
		{
	alert("reponse : " + reponse + "degats : " + degatsInfliges);
	/*
			      		switch(reponse)
			      		{
			      			case  1 : 
			      				labelRetourFouilleRapide.text = "Fouille ok ! Objet découvert : " + item.nom;
			      				if (ajouteAuSac == 0) labelRetourFouilleRapide.text += " ! Ajouté à la case";
			      				break;
			      			case  0 : 
			      				labelRetourFouilleRapide.text = "Fouille ok ! Objet découvert : " + item.nom;
			      				labelRetourFouilleRapide.text = ". Mais vous avez été blessé ! " + degatsInfliges;
			      				if (ajouteAuSac == 0) labelRetourFouilleRapide.text += " ! Ajouté à la case";
			      				break;
			      			case -1 : 
			      				labelRetourFouilleRapide.text = "Fouille raté";
			      				break;
			      			case -2 : 
			      				labelRetourFouilleRapide.text = 
			      				break;
			      			case -4 :
			      				labelRetourFouilleRapide.text = 
			  					break;
			      			case -5 : 
			      				labelRetourFouilleRapide.text = 
			      				break;
			      			case -6 :
			      				labelRetourFouilleRapide.text = 
			      				break;
			      			case -7: 
			      				labelRetourFouilleRapide.text = 
			      				break;
			      		}*/
		});

socket.on('INFO_CASE_ALLIES_SC', function (listeAllies){
	//alert("retour ok");
	var i=0;
	var iPositionPersoInConteneur=0;
	
	this.listePersoAllies = new Array();
	contListeAllies.removeAllChildren();
	
	var imgPerso;
	listePersoAllies = new Array();
	
	for(var perso in listeAllies)
	{
		// mise du perso dans une variable
		var persoA = listeAllies[i];
		
		var ModePerso;
		var DescriptionSac;
		var PourcentVie;
		var DescriptionVie;
		var PourcentSac;
		
		this.listePersoAllies.push(persoA);
		
		if(persoA.id.competence=="brute")
		{
			imgPerso = new createjs.Bitmap("public/spritesheets/persos/Brute.gif");
			imgPerso.x = iPositionPersoInConteneur * SpaceItem;
			imgPerso.cursor= "pointer";
		}
		else if(persoA.id.competence=="chercheur")
		{
			imgPerso = new createjs.Bitmap("public/spritesheets/persos/Chercheur.gif");
			imgPerso.x = iPositionPersoInConteneur * SpaceItem;
			imgPerso.cursor= "pointer";
		}
		else if(persoA.id.competence=="explorateur")
		{
			imgPerso = new createjs.Bitmap("public/spritesheets/persos/Explorateur.gif");
			imgPerso.x = iPositionPersoInConteneur * SpaceItem;
			imgPerso.cursor= "pointer";
		}
		imgPerso.name = i;
		
		// Ajout de l'évenement a l'image
		// ajout d'un texte quand l'user passera la souris dessus
		imgPerso.addEventListener('mouseover', function(event) {
			var currentPerso =  listeAllies[event.target.name];
			// Texte de description du Mode
			switch(currentPerso.id.mode)
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
		
			alert("armeEquip : "+currentPerso.id.armeEquipee);
			//alert("arumureEquip : "+currentPerso.id.idArmureEquipee);
			
			if(currentPerso.id.idArmeEquipee!=null && currentPerso.id.idArmureEquipee!=null)
			{
				labelDescribePerso.text=("Competence : "+currentPerso.id.competence+
						"\nMode : "+ModePerso+
						"\nSanté : "+currentPerso.id.ptSante+" / "+currentPerso.id.ptSanteMax+
						"\nSac rempli à : "+currentPerso.id.sacADos+" %"+
						"\nArme Equipee : "+currentPerso.id.armeEquipe+" "+currentPerso.id.armeEquipe.valeur+
						"\nArmure Equipée :"+currentPerso.id.armureEquipe+" "+currentPerso.id.armureEquipe.valeur+"");
			}
			else if(currentPerso.id.idArmeEquipee==null && currentPerso.id.idArmureEquipee==null)
			{
				labelDescribePerso.text=("Competence : "+currentPerso.id.competence+
						"\nMode : "+ModePerso+
						"\nSanté : "+currentPerso.id.ptSante+" / "+currentPerso.id.ptSanteMax+
						"\nSac rempli à : "+currentPerso.id.sacADos+" %"+
						"\nCe joueur n'est pas équipé !");
			}
			else
			{
				labelDescribePerso.text=("Competence : "+currentPerso.id.competence+
						"\nMode : "+ModePerso+
						"\nSanté : "+currentPerso.id.ptSante+" / "+currentPerso.id.ptSanteMax+
						"\nSac rempli à : "+currentPerso.id.sacADos+" %"+
						"\nCe joueur est équipé !");
			}
			stage.update();
		},false);

		imgPerso.addEventListener('mouseout', function(event){
			labelDescribePerso.text="";
			stage.update();
		},false);

		/*imgPerso.addEventListener("click", function(event){
			var currentPerso= listePersoAllies[event.target.name];
			stage.update();
		});*/

		contListeAllies.addChild(imgPerso);

		// position de l'item dans le conteneur
		iPositionPersoInConteneur++;

		i++;

		// Update l'ihm
		stage.update();
	}
	stage.update();
});

socket.on('INFO_CASE_ENNEMIS_SC', function (listeEnn){
	var i=0;
	var iPositionPersoInConteneur=0;
	
	this.listePersoEnnemis = new Array();
	contListeEnnemis.removeAllChildren();
	
	var imgPerso;
	//var currentPerso;
	listePersoEnnemis = new Array();
	
	alert("longueur liste enn = " + listeEnn.length);
	
	for(var i = 0; i < listeEnn.length; i++)
	{
		// mise du perso dans une variable
		var persoE = listeEnn[i];
		
		var ModePerso;
		var DescriptionSac;
		var PourcentVie;
		var DescriptionVie;
		
		this.listePersoEnnemis.push(persoE);
		
		if(persoE.id.competence=="brute")
		{
			imgPerso = new createjs.Bitmap("public/spritesheets/persos/Brute.gif");
			imgPerso.x = iPositionPersoInConteneur * SpaceItem;
			imgPerso.cursor= "pointer";
		}
		else if(persoE.id.competence=="chercheur")
		{
			imgPerso = new createjs.Bitmap("public/spritesheets/persos/Chercheur.gif");
			imgPerso.x = iPositionPersoInConteneur * SpaceItem;
			imgPerso.cursor= "pointer";
		}
		else if(persoE.id.competence=="explorateur")
		{
			imgPerso = new createjs.Bitmap("public/spritesheets/persos/Explorateur.gif");
			imgPerso.x = iPositionPersoInConteneur * SpaceItem;
			imgPerso.cursor= "pointer";
		}
		imgPerso.name = i;
		
		// Ajout de l'évenement a l'image
		// ajout d'un texte quand l'user passera la souris dessus
		imgPerso.addEventListener('mouseover', function(event) {
			var currentPerso =  listeEnn[event.target.name];
			alert("armeEquip : "+currentPerso.id.idArmeEquipee);
			// Calcul du pourcentage de vie
			PourcentVie = currentPerso.id.ptSante / currentPerso.id.ptSanteMax * 100;
			// Texte de Description de la vie
			if(PourcentVie>=0 && PourcentVie<20)
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
			if(currentPerso.id.sacADos>=0 && currentPerso.id.sacADos<20)
			{
					DescriptionSac="";
					DescriptionSac="Ce joueur n'a pas l'air très chargé !";
			}
			else if(currentPerso.id.sacADos>=20 && currentPerso.id.sacADos<40)
			{
				DescriptionSac="";
				DescriptionSac="Ce joueur a l'air peu chargé !";
			}
			else if(currentPerso.id.sacADos>=40 && currentPerso.id.sacADos<60)
			{
				DescriptionSac="";
				DescriptionSac="Ce joueur a l'air chargé !";
			}
			else if(currentPerso.id.sacADos>=60 && currentPerso.id.sacADos<80)
			{
				DescriptionSac="";
				DescriptionSac="Ce joueur a l'air très chargé !";
			}
			else if(currentPerso.id.sacADos>=80 && currentPerso.id.sacADos<=100)
			{
				DescriptionSac="";
				DescriptionSac="Ce joueur a l'air surchargé !";
			}
			
			// Texte de description du Mode
			switch(currentPerso.id.mode)
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
		
		/*alert("armeEquip : "+currentPerso.id.armeEquipe);
		alert("arumureEquip : "+currentPerso.id.armureEquipe);*/
			
			if(currentPerso.id.idArmeEquipee!=null && currentPerso.id.idArmureEquipee!=null)
			{
				labelDescribePerso.text=("Competence : "+currentPerso.id.competence+
						"\nMode : "+ModePerso+
						"\n"+DescriptionVie+
						"\n"+DescriptionSac+
						"\nArme Equipee : "+currentPerso.id.armeEquipe+" "+currentPerso.id.armeEquipe.valeur+
						"\nArmure Equipée :"+currentPerso.id.armureEquipe+" "+currentPerso.id.armureEquipe.valeur+"");
			}
			else if(currentPerso.id.idArmeEquipee==null && currentPerso.id.idArmureEquipee==null)
			{
				labelDescribePerso.text=("Competence : "+currentPerso.id.competence+
						"\nMode : "+ModePerso+
						"\n"+DescriptionVie+
						"\n"+DescriptionSac+
						"\nCe joueur n'est pas équipé !");
			
			}
			else
			{
				labelDescribePerso.text=("Competence : "+currentPerso.id.competence+
						"\nMode : "+ModePerso+
						"\n"+DescriptionVie+
						"\n"+DescriptionSac+
						"\nCe joueur est équipé !");
			}
			stage.update();
		},false);

		imgPerso.addEventListener('mouseout', function(event){
			labelDescribePerso.text="";
			stage.update();
		},false);

		imgPerso.addEventListener("click", function(event){
			var currentPerso =  listeEnn[event.target.name];
			SelectedPerso=currentPerso.id.id;
			//alert(SelectedPerso);
			stage.update();
		});

		contListeEnnemis.addChild(imgPerso);

		// position de l'item dans le conteneur
		iPositionPersoInConteneur++;

		// Update l'ihm
		stage.update();
	}
	stage.update();
	socket.emit('INFO_PERSONNAGE_CS');
});



//Creer bouton tout simple :
//var BtnSaveBD = stage.addChild(new Button("SAVE BD", ColorBtn));