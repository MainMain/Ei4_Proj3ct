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
var PersoProbaCache=1;
var PersoProbaFouille=1;

var background, backgroundPreload, map, perso;

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
	                {src:"public/Background.jpg", id:"idBackground"},   
	                {src:"public/Background_1.jpg", id:"idBackground_1"}, 
	                {src:"public/Background_11.jpg", id:"idBackground_11"},      
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
	                {src:"public/map/0-0.png", id:"0-0"},
	                {src:"public/map/0-1.png", id:"0-1"},
	                {src:"public/map/0-2.png", id:"0-2"},
	                {src:"public/map/0-4.png", id:"0-4"},
	                {src:"public/map/1-1.png", id:"1-1"},
	                {src:"public/map/1-2.png", id:"1-2"},
	                {src:"public/map/2-0.png", id:"2-0"},
	                {src:"public/map/2-1.png", id:"2-1"},
	                {src:"public/map/2-2.png", id:"2-2"},
	                {src:"public/persos/perso.gif", id:"idPerso"},
	                {src:"public/spritesheets/armes/0.png", id:"0"},
	                {src:"public/spritesheets/armes/1.png", id:"1"},
	                {src:"public/spritesheets/armes/2.png", id:"2"},
	                {src:"public/spritesheets/armes/3.png", id:"3"},
	                {src:"public/spritesheets/armes/4.png", id:"4"},
	                {src:"public/spritesheets/armes/5.png", id:"5"},
	                {src:"public/spritesheets/armes/6.png", id:"6"},
	                {src:"public/spritesheets/armes/7.png", id:"7"},
	                {src:"public/spritesheets/armes/8.png", id:"8"},
	                {src:"public/spritesheets/armes/9.png", id:"9"},
	                {src:"public/spritesheets/armes/10.png", id:"10"},
	                {src:"public/spritesheets/armes/11.png", id:"11"},
	                {src:"public/spritesheets/armes/12.png", id:"12"},
	                {src:"public/spritesheets/armes/13.png", id:"13"},
	                {src:"public/spritesheets/armes/14.png", id:"14"},
	                {src:"public/spritesheets/armes/15.png", id:"15"},
	                {src:"public/spritesheets/armes/16.png", id:"16"},
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

function start() {
	// ******* ATTRIBUTS *************************
	// ** Création de la liste des items de case * 
	// *******************************************

	this.listeItemsCase = new Array();
	this.listeItemsPerso = new Array();

	// ******************************************
	// ********** Connexion au serveur  *********
	// ******************************************

	var socket = io.connect('http://localhost:8080');

	// ******************************************
	// ** Réglages mise en forme (partie Design)*
	// ******************************************

	// Espacement des boutons
	var H=50;

	// Abscisse des boutons 
	var AbsBtn=0;
	var AbsBtnD=950;

	// Ordonnée des boutons
	var OrdBtn=0;
	var OrdBtnMode=300;
	var OrdBtnListe = 150;

	// Couleur des boutons
	var ColorBtn="#850000";
	//var ColorPad="#313131";

	var ColorPad=createjs.Graphics.getRGB(0,0,0,0.01);
	var ColorGreen="#008000";

	// Police des labels
	var PoliceLabel="14px monospace";

	// Couleur des labels
	var ColorLabel = "#fff";
	var ColorLabelBonus = ColorGreen;

	// Espacement des labels
	var _EspaceLabelX = 300;
	var _EspaceLabelY = 20;

	// Espacement items
	var SpaceItem = 30;

	// Placement label Mode Perso
	var _labelModeX = 440 + _EspaceLabelX;
	var _labelModeY = 0;

	// Placement Conteneur ItemCase
	var _ContItemCaseX = _labelModeX;
	var _ContItemCaseY = h-75;

	// Dimension Conteneur ItemCase
	var _ContItemCaseH = 32;
	var _ContItemCaseW = 350;

	// Placement label ItemCase
	var _labelItemCaseX = _ContItemCaseX;
	var _labelItemCaseY = _ContItemCaseY - 20;

	// Placement label Arme
	var _labelArmeX = _labelModeX;
	//var _labelArmeY = _labelModeY + _EspaceLabelY +5;
	var _labelArmeY = 15;

	// Placement label Armure
	var _labelArmureX = _labelModeX + 180;
	//var _labelArmureY = _labelArmeY + _EspaceLabelY+10;
	var _labelArmureY = _labelArmeY;

	// Placement label ItemPerso
	var _labelItemPersoX = _labelModeX;
	var _labelItemPersoY = _labelArmureY + _EspaceLabelY+10;

	// Placement Conteneur ItemPerso
	var _ContItemPersoX = _labelModeX;
	var _ContItemPersoY = _labelItemPersoY + _EspaceLabelY+5;

	// Dimension Conteneur ItemPerso
	var _ContItemPersoH = 32;
	var _ContItemPersoW = 350;

	// Placement label Points de vie
	var _labelPtsVX = 160;
	var _labelPtsVY = 0;

	// Placement label Points d'action
	var _labelPtsAX = _labelPtsVX;
	var _labelPtsAY = _labelPtsVY + _EspaceLabelY;

	// Placement label Points de mouvements
	var _labelPtsMX = _labelPtsVX;
	var _labelPtsMY = _labelPtsAY + _EspaceLabelY;
	
	// Placement label id Salle en cours
	var _labelIdSalleX = _labelPtsVX;
	var _labelIdSalleY = _labelPtsMY + _EspaceLabelY;

	// Placement label Points d'Attaque
	var _labelPtsAtqX = _labelPtsVX + _EspaceLabelX;
	var _labelPtsAtqY = _labelPtsVY;

	// Placement label Points de Défense
	var _labelPtsDefX = _labelPtsVX + _EspaceLabelX;
	var _labelPtsDefY = _labelPtsAtqY +_EspaceLabelY;

	// Placement label Poids du Sac
	var _labelPoidsSacX = _labelPtsVX + _EspaceLabelX;
	var _labelPoidsSacY = _labelPtsDefY + _EspaceLabelY; 

	// Placement label Description Item
	var _labelDescribeItemX = _ContItemCaseX;
	var _labelDescribeItemY = _ContItemCaseY + 30;

	// Placement label Nombre d'Aliés
	var _labelNbAliesX = 350;
	var _labelNbAliesY = _labelItemCaseY;

	// Placement label Nombre d'Ennemis
	var _labelNbEnnemisX = _labelNbAliesX;
	var _labelNbEnnemisY = _labelNbAliesY + _EspaceLabelY;

	// Placement label Nombre de Goules
	var _labelNbGoulesX = _labelNbAliesX;
	var _labelNbGoulesY = _labelNbEnnemisY + _EspaceLabelY;

	// Placement label Probabilité de Cache
	var _labelProbaCacheX = _labelNbAliesX;
	var _labelProbaCacheY = _labelNbGoulesY + _EspaceLabelY;

	// Placement label Probabilité de Fouille
	var _labelProbaFouilleX = _labelNbAliesX;
	var _labelProbaFouilleY = _labelProbaCacheY + _EspaceLabelY;

	// Placement label Retour Goules
	var _labelRetourGoulesX = 10;
	var _labelRetourGoulesY = 570;
	
	// Placement label Choix Mode
	var _labelChoixModeX = AbsBtnD+5;
	var _labelChoixModeY = OrdBtnMode-20;
	
	// Placement Conteneur ArmeEquip
	var _ContArmeX = _labelArmeX + 125;
	var _ContArmeY = _labelArmeY-3;

	// Dimension Conteneur ArmeEquip
	var _ContArmeH = 30;
	var _ContArmeW = 30;

	// Placement Conteneur ArmureEquip
	var _ContArmureX = _labelArmureX + 135;
	var _ContArmureY = _labelArmureY-3;

	// Dimension Conteneur ArmureEquip
	var _ContArmureH = 30;
	var _ContArmureW = 30;

	// Placement Conteneur Map (en fonction de la taille de l'image !!)
	var _ContMapX = w/2 - 620/2;
	var _ContMapY = h/2 - 379/2;

	// Dimension Conteneur Map
	var _ContMapH = 379;
	var _ContMapW = 620;

	// label.lineHeight
	var _LineHeight = 15;

	// label.textBaseline
	var _TextBaseline = "top";

	// application du background
	var background = new createjs.Bitmap("public/Background_11.jpg");
	background.image.onload = setImg(background, 0, 0);

	//*********** Fin de la partie design **************
	// ******************************************
	
	// ******************************************
	// ** creation des conteneurs               *
	// ******************************************

	var contInvCase = new createjs.Container();
	contInvCase.x = _ContItemCaseX;
	contInvCase.y = _ContItemCaseY;
	contInvCase.height = _ContItemCaseH;
	contInvCase.width = _ContItemCaseW;
	stage.addChild(contInvCase);
	var shape = new createjs.Shape();
	stage.addChild(shape);
	shape.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(_ContItemCaseX-4, _ContItemCaseY-4, _ContItemCaseW+4, _ContItemCaseH+4);
	
	var contInvPerso = new createjs.Container();
	contInvPerso.x = _ContItemPersoX;
	contInvPerso.y = _ContItemPersoY;
	contInvPerso.height = _ContItemPersoH;
	contInvPerso.width = _ContItemPersoW;
	stage.addChild(contInvPerso);
	var shape1 = new createjs.Shape();
	stage.addChild(shape1);
	shape1.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(_ContItemPersoX-4, _ContItemPersoY-4, _ContItemPersoW+4, _ContItemPersoH+4);

	var contArme = new createjs.Container();
	contArme.x = _ContArmeX;
	contArme.y = _ContArmeY;
	contArme.height = _ContArmeH;
	contArme.width = _ContArmeW;
	stage.addChild(contArme);
	var shape2 = new createjs.Shape();
	stage.addChild(shape2);
	shape2.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(_ContArmeX-4, _ContArmeY-4, _ContArmeW+4, _ContArmeH+4);

	var contArmure = new createjs.Container();
	contArmure.x = _ContArmureX;
	contArmure.y = _ContArmureY;
	contArmure.height = _ContArmureH;
	contArmure.width = _ContArmureW;
	stage.addChild(contArmure);
	var shape3 = new createjs.Shape();
	stage.addChild(shape3);
	shape3.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(_ContArmureX-4, _ContArmureY-4, _ContArmureW+4, _ContArmureH+4);

	var contMap = new createjs.Container();
	contMap.x = _ContMapX;
	contMap.y = _ContMapY;
	contMap.height = _ContMapH;
	contMap.width = _ContMapW;
	stage.addChild(contMap);
	var shape4 = new createjs.Shape();
	stage.addChild(shape4);
	shape4.graphics.setStrokeStyle(4).beginStroke("#850000").drawRect(_ContMapX-2, _ContMapY-2, _ContMapW+2, _ContMapH+2);

	var contPerso = new createjs.Container();
	contPerso.x = w/2 - 32/2;
	contPerso.y = h/2 - 32/2;
	contPerso.height = 32;
	contPerso.width = 32;
	stage.addChild(contPerso);

	// insertion du Perso
	var imgPerso = new createjs.Bitmap("public/persos/perso.gif");
	contPerso.addChild(imgPerso);

	// ******************************************
	// ** Création des barres du perso 			*
	// ******************************************

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
	lifeBarContainer.x = 340;
	lifeBarContainer.y = 0 ;
	stage.addChild(lifeBarContainer);

	// Barre d'action

	actionBarContainer = new createjs.Container();

	actionBarHeight = 10;
	actionBarWidth = 100;
	actionBarColor = createjs.Graphics.getRGB(89,0,0);
	actionBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	actionBar = new createjs.Shape();
	actionBar.graphics.beginFill(actionBarColor).drawRect(0, 0, 1, actionBarHeight).endFill();

	frameActionBar = new createjs.Shape();
	paddingActionBar = 3;
	frameActionBar.graphics.setStrokeStyle(1).beginStroke(actionBarFrameColor).drawRect(-paddingActionBar/2, -paddingActionBar/2, actionBarWidth+paddingActionBar, actionBarHeight+paddingActionBar);

	actionBarContainer.addChild(actionBar, frameActionBar);
	actionBarContainer.x = 340;
	actionBarContainer.y = lifeBarContainer.y + _EspaceLabelY;
	stage.addChild(actionBarContainer);

	// Barre de mouvement

	moveBarContainer = new createjs.Container();

	moveBarHeight = 10;
	moveBarWidth = 100;
	moveBarColor = createjs.Graphics.getRGB(0,0,204);
	moveBarFrameColor = createjs.Graphics.getRGB(255,255,255);

	moveBar = new createjs.Shape();
	moveBar.graphics.beginFill(moveBarColor).drawRect(0, 0, 1, moveBarHeight).endFill();

	frameMoveBar = new createjs.Shape();
	paddingMoveBar = 3;
	frameMoveBar.graphics.setStrokeStyle(1).beginStroke(moveBarFrameColor).drawRect(-paddingMoveBar/2, -paddingMoveBar/2, moveBarWidth+paddingMoveBar, moveBarHeight+paddingMoveBar);

	moveBarContainer.addChild(moveBar, frameMoveBar);
	moveBarContainer.x = 340;
	moveBarContainer.y = actionBarContainer.y + _EspaceLabelY;
	stage.addChild(moveBarContainer);

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
	sacBarContainer.x = 310 +  _EspaceLabelX;
	sacBarContainer.y = _labelPoidsSacY;
	stage.addChild(sacBarContainer);
	
	// ******************************************
	// ********** Zones de Boutons	      *******
	// ******************************************
	
	var shapeMode = new createjs.Shape();
	stage.addChild(shapeMode);
	shapeMode.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(AbsBtnD-4, OrdBtnMode-4, 145, 155);

	// ******************************************
	//********** Déclaration des labels *******
	// ******************************************

	var txtSalle, txtObjet, txtCase, txtObjetEquipe, labelRetourFouilleRapide,
	labelObjetCase,	labelInventaire, labelDescribeItem, labelMode, labelRetourMode,
	labelPtsMove, labelPtsAction, labelPtsVie, labelPoidsSac, labelPtsAtq, labelPtsDef,
	labelBonusArme, labelBonusArmure, labelIdSalle, labelNomSalle, labelRetourGoules,
	labelNbAlies, labelNbEnnemis, labelNbGoules, labelProbaCache, labelProbaFouille,
	labelChoixMode;

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

	labelRetourGoules = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelRetourGoules.lineHeight = _LineHeight;
	labelRetourGoules.textBaseline = _TextBaseline;
	labelRetourGoules.x = _labelRetourGoulesX;
	labelRetourGoules.y = _labelRetourGoulesY;

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

	/*labelMode = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelMode.lineHeight = _LineHeight;
	labelMode.textBaseline = _TextBaseline;
	labelMode.x = _labelModeX;
	labelMode.y = _labelModeY;*/

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

	labelPtsVie = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsVie.lineHeight = _LineHeight;
	labelPtsVie.textBaseline = _TextBaseline;
	labelPtsVie.x = _labelPtsVX;
	labelPtsVie.y = _labelPtsVY;

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

	labelPoidsSac = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPoidsSac.lineHeight = _LineHeight;
	labelPoidsSac.textBaseline = _TextBaseline;
	labelPoidsSac.x = _labelPoidsSacX;
	labelPoidsSac.y = _labelPoidsSacY;

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

	txtSalle = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtSalle.lineHeight = _LineHeight;
	txtSalle.textBaseline = _TextBaseline;
	txtSalle.x = 10;
	txtSalle.y = 500;

	txtObjet = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtObjet.lineHeight = _LineHeight;
	txtObjet.textBaseline = _TextBaseline;
	txtObjet.x = txtSalle.x;
	txtObjet.y = txtSalle.y -20;

	txtCase = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtCase.lineHeight = _LineHeight;
	txtCase.textBaseline = _TextBaseline;
	txtCase.x = 400;
	txtCase.y = 190;

	txtObjetEquipe = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtObjetEquipe.lineHeight = _LineHeight;
	txtObjetEquipe.textBaseline = _TextBaseline;
	txtObjetEquipe.x = 10;
	txtObjetEquipe.y = txtSalle.y - 40;
	
	labelRetourFouilleRapide = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelRetourFouilleRapide.lineHeight = _LineHeight;
	labelRetourFouilleRapide.textBaseline = _TextBaseline;
	labelRetourFouilleRapide.x = 10;
	labelRetourFouilleRapide.y = txtSalle.y + 60;
	
	labelRetourMode = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelRetourMode.lineHeight = _LineHeight;
	labelRetourMode.textBaseline = _TextBaseline;
	labelRetourMode.x = 10;
	labelRetourMode.y = txtSalle.y+20;
	
	labelRetourModeG = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelRetourModeG.lineHeight = _LineHeight;
	labelRetourModeG.textBaseline = _TextBaseline;
	labelRetourModeG.x = 10;
	labelRetourModeG.y = txtSalle.y+40;


	// ******************************************
	// ** Création des boutons de déplacement ***
	// ******************************************
	var _EpaisseurBpPad = 50;

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
	BtnSaveBD.x = 150;
	BtnSaveBD.y = 350;
	BtnSaveBD.addEventListener('click', function(event) {
		socket.emit('SAVE_BD_DEBUG_CS');
	});
	
	//var testBtn = new createjs.Bitmap("public/ButtonGreen.png");
	//testBtn.image.onload = setImg(testBtn, 150, 250);

	/*var BtnEvents = stage.addChild(new Button("Historique", ColorBtn));
	BtnEvents.y = OrdBtn;*/
	var BtnEvents = new createjs.Bitmap("public/Boutons/Historique.png");
	BtnEvents.image.onload = setImg(BtnEvents, AbsBtn, OrdBtn);
	/*BtnEvents.addEventListener('click', function(event) {

						});	*/

	/*var BtnUtiliser = stage.addChild(new Button("Utiliser", ColorBtn));
	BtnUtiliser.y = BtnEvents.y + H;*/
	var BtnUtiliser = new createjs.Bitmap("public/Boutons/Utiliser.png");
	BtnUtiliser.image.onload = setImg(BtnUtiliser, AbsBtn, BtnEvents.y + H);
	BtnUtiliser.addEventListener('click', function(event) {
		if (SelectedItemPerso == -1) {
			alert("Selectionner Item avant de l'utiliser");
		} else {
			socket.emit('PERSONNAGE_USE_CS', SelectedItemPerso);
			SelectedItemPerso = -1;
		}
	});	

	/*var BtnRamasseObjet = stage.addChild(new Button("Ramasser Item", ColorBtn));
	BtnRamasseObjet.y = BtnUtiliser.y + H;*/
	var BtnRamasseObjet = new createjs.Bitmap("public/Boutons/Ramasser.png");
	BtnRamasseObjet.image.onload = setImg(BtnRamasseObjet, AbsBtn, BtnUtiliser.y + H);
	BtnRamasseObjet.addEventListener('click', function (event) {
		if (SelectedItemCase == -1) {
			alert("Selectionner Item avant de Ramasser");
		} else {
			socket.emit('INV_CASE_CS', "RAMASSER", SelectedItemCase);
			SelectedItemCase = -1;
		}
	});

	/*var BtnDeposer = stage.addChild(new Button("Déposer Item", ColorBtn));
	BtnDeposer.y = BtnRamasseObjet.y + H;*/
	var BtnDeposer = new createjs.Bitmap("public/Boutons/Deposer.png");
	BtnDeposer.image.onload = setImg(BtnDeposer, AbsBtn, BtnRamasseObjet.y + H);
	BtnDeposer.addEventListener('click', function (event) {
		if (SelectedItemPerso == -1) {
			alert("Selectionner Item avant de Déposer");
		} else {
			socket.emit('INV_CASE_CS', "DEPOSER", SelectedItemPerso);
			SelectedItemPerso = -1;
		}
	});

	/*var BtnEquiper = stage.addChild(new Button("Équiper Item", ColorBtn));
	BtnEquiper.y = BtnDeposer.y + H;*/
	var BtnEquiper = new createjs.Bitmap("public/Boutons/Equiper.png");
	BtnEquiper.image.onload = setImg(BtnEquiper, AbsBtn, BtnDeposer.y + H);
	BtnEquiper.addEventListener('click', function (event) {
		//alert("click button");
		if (SelectedItemPerso == -1) {
			alert("Selectionner Item avant de s'équiper");
		} else {
			socket.emit('INV_PERSONNAGE_CS', "EQUIPER", SelectedItemPerso);
			SelectedItemEquip = -1;
			SelectedItemPerso = -1;

		}

	});

	/*var BtnDesequiper = stage.addChild(new Button("Déséquiper Item", ColorBtn));
	BtnDesequiper.y = BtnEquiper.y + H;*/
	var BtnDesequiper = new createjs.Bitmap("public/Boutons/Desequiper.png");
	BtnDesequiper.image.onload = setImg(BtnDesequiper, AbsBtn, BtnEquiper.y + H);
	BtnDesequiper.addEventListener('click', function (event) {
		if (SelectedItemEquip == -1) {
			alert("Selectionner Item avant de se déséquiper");
		}
		else{
			socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", SelectedItemEquip);
			SelectedItemEquip = -1;
			SelectedItemPerso = -1;
		}

	});

	/*var BtnAttaquer = stage.addChild(new Button("Attaquer...", ColorBtn));
	BtnAttaquer.y = BtnDesequiper.y + H;*/
	var BtnAttaquer = new createjs.Bitmap("public/Boutons/Attaquer.png");
	BtnAttaquer.image.onload = setImg(BtnAttaquer, AbsBtn, BtnDesequiper.y + H);
	/*BtnAttaquer.addEventListener('click', function(event) {

						});	*/

	/*var BtnAtqGoules = stage.addChild(new Button("Attaquer Goule(s)", ColorBtn));
	BtnAtqGoules.y = BtnAttaquer.y + H;*/
	var BtnAtqGoules = new createjs.Bitmap("public/Boutons/AttaquerZ.png");
	BtnAtqGoules.image.onload = setImg(BtnAtqGoules, AbsBtn, BtnAttaquer.y + H);
	BtnAtqGoules.addEventListener('click', function(event) {
		socket.emit('ACTION_ATTAQUE_GOULE_CS');
	});

	/*var BtnFouilleRapide = stage.addChild(new Button("Fouille rapide", ColorBtn));
	BtnFouilleRapide.y = BtnAtqGoules.y + H;*/
	var BtnFouilleRapide = new createjs.Bitmap("public/Boutons/FouilleR.png");
	BtnFouilleRapide.image.onload = setImg(BtnFouilleRapide, AbsBtn, BtnAtqGoules.y + H);
	BtnFouilleRapide.addEventListener('click', function(event) {
		socket.emit('ACTION_FOUILLE_RAPIDE_CS');
	});	
	
	var BtnListeAllies = new createjs.Bitmap("public/Boutons/Allies.png");
	BtnListeAllies.image.onload = setImg(BtnListeAllies, AbsBtnD, OrdBtnListe);
	/*BtnListeAllies.addEventListener('click', function(event) {
		
	});	*/
	
	var BtnListeEnnemis = new createjs.Bitmap("public/Boutons/Ennemis.png");
	BtnListeEnnemis.image.onload = setImg(BtnListeEnnemis, AbsBtnD, OrdBtnListe + H);
	/*BtnListeAllies.addEventListener('click', function(event) {
		
	});	*/

	//BtnEvents.x = BtnUtiliser.x = BtnRamasseObjet.x = BtnDeposer.x = BtnEquiper.x = BtnDesequiper.x = BtnAttaquer.x = AbsBtn;
	BtnFouilleRapide.cursor=BtnAtqGoules.cursor=BtnEvents.cursor = BtnUtiliser.cursor = BtnRamasseObjet.cursor = BtnDeposer.cursor = BtnEquiper.cursor = BtnDesequiper.cursor = BtnAttaquer.cursor = "pointer";
	stage.update();
	
	// ******************************************
	// *********** INITIALISATION ***************
	// ******************************************

	// AFFICHAGE DE L'IVENTAIRE DE CASE ET PERSO
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
	//socket.emit('INFO_CASE_ALLIES_CS');
	stage.update();
	// Check message en attente (socket.emit)

	// ******************************************
	// ********* RECEPTION SERVEUR **************
	// ******************************************

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
		txtSalle.text = ("Trop de Goules dans cette salle !");
		break;

		case -4:
			txtSalle.text = "";
			txtSalle.text = ("Impossible de pénétrer dans la Maison de l'ennemi!");
			break;

		default:
			socket.emit('INFO_CASE_CS');
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
			txtObjetEquipe.text = "";
			txtObjetEquipe.text = ("L'item " + currentItem.id + " n'est plus dans le sac ");
			// quitte la fonction
			return;
		}
		if (type == "EQUIPER") {
			//alert("LOG CODE : " + codeRetour);
			switch (codeRetour) {
			case 0:
				//alert("0");
				txtObjetEquipe.text = "";
				txtObjetEquipe.text = ("Equipement de l'item " + currentItem.nom + " raté : Item pas dans sac !");
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
						stage.update();
					});
				}
				// log
				txtObjetEquipe.text = "";
				txtObjetEquipe.text = ("Equipement de l'item " + currentItem.nom + " ok !");

				stage.update();
				socket.emit('INFO_PERSONNAGE_CS');
				break;

			case -1:
				//alert("-1");
				txtObjetEquipe.text = "";
				txtObjetEquipe.text = ("Equipement de l'item " + currentItem.nom + " raté : arme déja équipée");
				//alert("Equipement de l'item " + currentItem.id + " raté : arme déja équipée");
				break;

			case -2:
				//alert("-2");
				txtObjetEquipe.text = "";
				txtObjetEquipe.text = ("Equipement de l'item " + currentItem.nom + " raté : armure déja équipée");
				//alert("Equipement de l'item " + currentItem.id + " raté : armure déja équipée");
				break;

			case -3:
				//alert("-3");
				txtObjetEquipe.text = "";
				txtObjetEquipe.text = ("Equipement de l'item " + currentItem.nom + " raté : l'objet n'est pas équipable");
				//alert("Equipement de l'item " + currentItem.id + " raté : l'objet n'est pas équipable");
				break;

			}
		} else if (type == "DEQUIPER") {
			if (codeRetour == -4) {
				txtObjetEquipe.text = "";
				txtObjetEquipe.tetx = ("Impossible de se déséquiper de l'item " + currentItem.id + ", vous n'en êtes pas équipé");
			} else if (codeRetour == 1) {
				// Si déquipe arme
				// efface l'arme
				contArme.removeAllChildren();
				txtObjetEquipe.text = "";
				txtObjetEquipe.text = ("Arme déséquipée !");
				socket.emit('INFO_PERSONNAGE_CS');					
			}
			// Si déquipe armure
			else if (codeRetour == 2) {
				// efface armure
				contArmure.removeAllChildren();
				txtObjetEquipe.text = "";
				txtObjetEquipe.text = ("Armure déséquipée !");
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
	 */
	socket.on('INV_CASE_SC', function (type, codeRetour, id_item, DegatsG) {
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
					txtObjet.text = ("Impossible de ramasser l'objet : poids max atteint !");
					break;
					// objet pas dans case
				case -2:
					txtObjet.text = "";
					txtObjet.text = ("L'objet " + id_item + " n'est plus dans la salle !");
					break;
				case -5:
					txtObjet.text = "";
					txtObjet.text = ("Impossible de ramasser l'objet à cause des Zombies ! - " + DegatsG + " points de vie !");
					// ramassage ok
					break;
				default:
					txtObjet.text = "";
					txtObjet.text = ("Item ramassé ! Sac : " + codeRetour + " kg\n- " + DegatsG + " points de vie");
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
					txtObjet.text = ("Déséquiper l'objet avant de déposer !");
					break;
				case -4:
					txtObjet.text = "";
					txtObjet.text = ("Erreur interne !");
					break;
					// objet pas dans sac (! pas normal)
				case -2:
					txtObjet.text = "";
					txtObjet.text = ("L'item " + id_item + " n'est plus dans le sac ");
					break;
					// dépôt ok
				default:
					txtObjet.text = "";
					txtObjet.text = ("Item " + id_item + "déposé ! Sac : " + codeRetour + " kg");
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

		if (currentCase == "ERREUR_CASE")
		{
			//insereMessage("CLIENT :: nom case = " + "ERREUR_CASE");
			txtCase.text="";
			txtCase.text=("CLIENT :: nom case = " + "ERREUR_CASE");
		}
		else {

			var ProbCache, ProbFouille;
			ProbCache=(currentCase.probaCache * PersoProbaCache);
			ProbFouille=(currentCase.probaObjet * PersoProbaFouille);
			
			labelNbAlies.text=("Aliés dans la salle : " + nbrAllies + "");
			labelNbEnnemis.text=("Ennemis dans la salle : " + nbrEnnemis + "");
			labelNbGoules.text=("Goules dans la salle : " + currentCase.nbrGoules + "");
			labelProbaCache.text=("Proba de Cache : " + ProbCache + " % (avec multi de " +  PersoProbaCache + ")");
			labelProbaFouille.text=("Proba de Trouver item : " + ProbFouille + " % (avec multi de " +  PersoProbaFouille + ")");
			labelNomSalle.text="";
			labelNomSalle.text=("Nom salle : "+currentCase.nom+"");

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
					labelDescribeItem.text=("Nom : " + currentItem.nom + " (" + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
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

		var PoidsSac=0;
		var PointsAttaque, PointsDefense;
		var currentItem;

		PersoProbaCache=currentPerso.multiProbaCache;
		PersoProbaFouille=currentPerso.multiProbaFouille;

		if(currentPerso.armeEquipee != null)
		{
			PointsAttaque = currentPerso.multiPtsAttaque * currentPerso.armeEquipee.valeur ;
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

		// Mise à jour des labels
		labelPtsAtq.text=("Points d'attaque :  " + PointsAttaque + "");
		labelPtsDef.text=("Points de défense : " + PointsDefense + "");
		labelIdSalle.text=("Salle en cours : " + currentPerso.idSalleEnCours + "");

		// Mise à jour des barres de vie, action, move		
		// Sécurité pour le remplissage de la barre de vie
		if(currentPerso.ptSante<=0)
		{

			//labelPtsVie.text=("Points de vie :         	 	0/" + currentPerso.ptSanteMax);
			labelPtsVie.text=("Points de vie :         	 	" + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
			lifeBar.scaleX = 0;
		}
		else if(currentPerso.ptSante> currentPerso.ptSanteMax)
		{
			labelPtsVie.text=("Points de vie:         	 	" + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
			lifeBar.scaleX = lifeBarWidth;
		}
		else
		{
			labelPtsVie.text=("Points de vie :         	 	" + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
			lifeBar.scaleX = (currentPerso.ptSante/currentPerso.ptSanteMax) * lifeBarWidth;
		}
		
		// Sécurité pour le remplissage de la barre d'action
		if(currentPerso.ptActions<=0)
		{
			//labelPtsAction.text=("Points d'action :	 	 	    	0/" + currentPerso.ptActionsMax);
			labelPtsAction.text=("Points d'action :	 	 	    	" + currentPerso.ptActions + "/" + currentPerso.ptActionsMax);
			actionBar.scaleX = 0;
		}
		else if(currentPerso.ptActions> currentPerso.ptActionsMax)
		{
			labelPtsAction.text=("Points d'action :	 	 	    	" + currentPerso.ptActions + "/" + currentPerso.ptActionsMax);
			actionBar.scaleX = actionBarWidth;
		}
		else
		{
			labelPtsAction.text=("Points d'action :	 	 	    	" + currentPerso.ptActions + "/" + currentPerso.ptActionsMax);
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

		stage.removeChild(BtnFouiller, BtnCacher, BtnDefendre);

		switch(currentPerso.mode)
		{
		case 0 :  labelMode.text=("");

		/*var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
		BtnFouiller.x = AbsBtnD;
		BtnFouiller.y = OrdBtnMode;*/
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
		BtnFouiller.image.onload = setImg(BtnFouiller, AbsBtnD, OrdBtnMode);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		/*var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
		BtnCacher.x = AbsBtnD;
		BtnCacher.y = BtnFouiller.y + H;*/
		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		BtnCacher.image.onload = setImg(BtnCacher, AbsBtnD, BtnFouiller.y + H);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		/*var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
		BtnDefendre.x = AbsBtnD;
		BtnDefendre.y = BtnCacher.y + H;*/
		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		BtnDefendre.image.onload = setImg(BtnDefendre, AbsBtnD, BtnCacher.y + H);
		BtnDefendre.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});

		BtnFouiller.cursor=BtnCacher.cursor=BtnDefendre.cursor="crosshair";
		labelBonusArme.text=("");
		labelBonusArmure.text=("");

		break;

		case 1 :  /*labelMode.text="";
		labelMode.text=("Mode Fouille activé");*/

		/*var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorGreen));
		BtnFouiller.x = AbsBtnD;
		BtnFouiller.y = OrdBtnMode;*/
		var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleGreen.png");
		BtnFouiller.image.onload = setImg(BtnFouiller, AbsBtnD, OrdBtnMode);
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		/*var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
		BtnCacher.x = AbsBtnD;
		BtnCacher.y = BtnFouiller.y + H;*/
		var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
		BtnCacher.image.onload = setImg(BtnCacher, AbsBtnD, BtnFouiller.y + H);
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		/*var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
		BtnDefendre.x = AbsBtnD;
		BtnDefendre.y = BtnCacher.y + H;*/
		var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
		BtnDefendre.image.onload = setImg(BtnDefendre, AbsBtnD, BtnCacher.y + H);
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
			/*labelMode.text="";
			labelMode.text=("Mode Caché activé");*/

			/*var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
			BtnFouiller.x = AbsBtnD;
			BtnFouiller.y = OrdBtnMode;*/
			var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
			BtnFouiller.image.onload = setImg(BtnFouiller, AbsBtnD, OrdBtnMode);
			BtnFouiller.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 1);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			/*var BtnCacher = stage.addChild(new Button("Mode Caché", ColorGreen));
			BtnCacher.x = AbsBtnD;
			BtnCacher.y = BtnFouiller.y + H;*/
			var BtnCacher = new createjs.Bitmap("public/Boutons/CacheGreen.png");
			BtnCacher.image.onload = setImg(BtnCacher, AbsBtnD, BtnFouiller.y + H);
			BtnCacher.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 2);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			/*var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
			BtnDefendre.x = AbsBtnD;
			BtnDefendre.y = BtnCacher.y + H;*/
			var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseRed.png");
			BtnDefendre.image.onload = setImg(BtnDefendre, AbsBtnD, BtnCacher.y + H);
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
			/*labelMode.text="";
			labelMode.text=("Mode Défense activé");*/

			/*var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
			BtnFouiller.x = AbsBtnD;
			BtnFouiller.y = OrdBtnMode;*/
			var BtnFouiller = new createjs.Bitmap("public/Boutons/FouilleRed.png");
			BtnFouiller.image.onload = setImg(BtnFouiller, AbsBtnD, OrdBtnMode);
			BtnFouiller.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 1);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			/*var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
			BtnCacher.x = AbsBtnD;
			BtnCacher.y = BtnFouiller.y + H;*/
			var BtnCacher = new createjs.Bitmap("public/Boutons/CacheRed.png");
			BtnCacher.image.onload = setImg(BtnCacher, AbsBtnD, BtnFouiller.y + H);
			BtnCacher.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 2);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			/*var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorGreen));
			BtnDefendre.x = AbsBtnD;
			BtnDefendre.y = BtnCacher.y + H;*/
			var BtnDefendre = new createjs.Bitmap("public/Boutons/DefenseGreen.png");
			BtnDefendre.image.onload = setImg(BtnDefendre, AbsBtnD, BtnCacher.y + H);
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

		labelInventaire.text="";
		labelInventaire.text="Inventaire du perso :";

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
					currentItem = listeItemsPerso[event.target.name];
					labelDescribeItem.text=("Nom : " + currentItem.nom + " (" + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
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
				labelDescribeItem.text=("Nom : " + currentPerso.armeEquipee.nom + " (" + currentPerso.armeEquipee.valeur + ") " + "\nPoids : " + currentPerso.armeEquipee.poids + "\nDescription : " + currentPerso.armeEquipee.description);
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
				labelDescribeItem.text=("Nom : " + currentPerso.armureEquipee.nom + " (" + currentPerso.armureEquipee.valeur + ") " + "\nPoids : " + currentPerso.armureEquipee.poids + "\nDescription : " + currentPerso.armureEquipee.description);
				stage.update();
			},false);

			contArmure.addEventListener('mouseout', function(event){
				labelDescribeItem.text="";
				stage.update();
			},false);
		}

		// Affichage label poids du sac
		labelPoidsSac.text=("Poids du sac :        " + PoidsSac + "/" + currentPerso.poidsMax);

		// Affichage barre poids du sac
		sacBar.scaleX = (PoidsSac/currentPerso.poidsMax) * sacBarWidth;

		// Update l'ihm
		stage.update();
	});

	/**************************************************************************************
	 * RECEPTION Suite à une DEMANDE POUR UTILISER UN ITEM
	 * return 1 si ok
	 * erreur : 0 si objet n'est pas dans le sac
	 * erreur : -1 si objet pas utilisable
	 */
	//socket.on('PERSONNAGE_USE_SC', );

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
			labelRetourGoules.text=("2 Goules tuées ! -" + degatsSubis + " points de vie");
			socket.emit('INFO_PERSONNAGE_CS');
			break;

		case 1: 
			labelRetourGoules.text="";
			labelRetourGoules.text=("1 Goule tuée ! -" + degatsSubis + " points de vie");
			socket.emit('INFO_PERSONNAGE_CS');
			break;

		case 0:
			labelRetourGoules.text="";
			labelRetourGoules.text=("Attaque de Goule(s) : erreur interne");
			break;

		case -1:
			labelRetourGoules.text="";
			labelRetourGoules.text=("Attaque de Goule(s) échouée ! -" + degatsSubis + " points de vie");
			socket.emit('INFO_PERSONNAGE_CS');
			break;

		case -2:
			labelRetourGoules.text="";
			labelRetourGoules.text=("Pas de Goule dans la salle !");
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
	socket.on('PERSONNAGE_MODE_SC', function (mode, reponse, degatsInfliges, nbGoulesRest) 
	{
		switch(reponse)
		{
		case 1: 
			labelRetourMode.text = "";
			labelRetourMode.text = ("chgt pour mode " + mode +"  ok !");
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		case 0 : 
			labelRetourMode.text = "";
			labelRetourMode.text = ("chgt pour mode " + mode +" raté ! : Erreur interne");
			break;
		case -4 : 
			labelRetourMode.text = "";
			labelRetourMode.text = ("chgt pour mode " + mode +"  raté ! : déja dans ce mode");
			break;
		case -5: 
			labelRetourMode.text = "";
			labelRetourMode.text = ("chgt pour mode " + mode +"  raté à cause des Goules");
			break;
		case -10:
			labelRetourMode.text = "";
			labelRetourMode.text = ("chgt pour mode " + mode +"  raté ! Plu de points d'action");
			break;
		}
		labelRetourModeG.text = "";
		labelRetourModeG.text+=("Dégats infligés : " + degatsInfliges +" !\n Il reste " + nbGoulesRest + " goules dans la salle");

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

	stage.update();
}

function setImg(img, X, Y) {
	stage.addChild(img);
	img.x = X;
	img.y = Y;
	stage.update();
}