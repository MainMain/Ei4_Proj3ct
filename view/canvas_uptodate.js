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
	                {src:"public/Background.jpg", id:"idBackground"},
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
	backgroundPreload = new createjs.Bitmap("public/BackgroundPreload.jpg");
	backgroundPreload.image.onload = setImg(backgroundPreload, 0, 0);

	loadProgressLabel = new createjs.Text("","70px Infected","#850000");
	loadProgressLabel.lineWidth = 600;
	loadProgressLabel.textAlign = "center";
	//Centrer le label en x
	//loadProgressLabel.x = canvas.width/2;
	loadProgressLabel.x = 280;
	loadProgressLabel.y = canvas.height/2 - 150;
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
	loadingBarContainer.x=20;
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
	//loadProgressLabel.text =( progresPrecentage + " / 100 Loaded" );

	stage.update();
}

function handleComplete() {

	/*background = preload.getResult("idBackground");
	map = preload.getResult("idMap");
	perso = preload.getResult("idPerso");*/

	loadProgressLabel.text = "Loading complete click to start";
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
	var H=40;

	// Abscisse des boutons 
	var AbsBtn=0;

	// Ordonnée des boutons
	var OrdBtn=0;

	// Couleur des boutons
	var ColorBtn="#850000";
	var ColorPad="#313131";
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
	
	// Placement label id Salle en cours
	var _labelIdSalleX=150;
	var _labelIdSalleY=150;

	// Placement label Mode Perso
	var _labelModeX = 440 + _EspaceLabelX;
	var _labelModeY = 0;

	// Placement Conteneur ItemCase
	var _ContItemCaseX = _labelModeX;
	var _ContItemCaseY = h-75;

	// Dimension Conteneur ItemCase
	var _ContItemCaseH = 200;
	var _ContItemCaseW = 200;

	// Placement label ItemCase
	var _labelItemCaseX = _ContItemCaseX;
	var _labelItemCaseY = _ContItemCaseY - 20;

	// Placement label Arme
	var _labelArmeX = _labelModeX;
	var _labelArmeY = _labelModeY + _EspaceLabelY;

	// Placement label Armure
	var _labelArmureX = _labelModeX;
	var _labelArmureY = _labelArmeY + _EspaceLabelY;

	// Placement label ItemPerso
	var _labelItemPersoX = _labelModeX;
	var _labelItemPersoY = _labelArmureY + _EspaceLabelY;

	// Placement Conteneur ItemPerso
	var _ContItemPersoX = _labelModeX;
	var _ContItemPersoY = _labelItemPersoY + _EspaceLabelY;

	// Dimension Conteneur ItemPerso
	var _ContItemPersoH = 200;
	var _ContItemPersoW = 200;

	// Placement label Points de vie
	var _labelPtsVX = 160;
	var _labelPtsVY = 0;

	// Placement label Points d'action
	var _labelPtsAX = _labelPtsVX;
	var _labelPtsAY = _labelPtsVY + _EspaceLabelY;

	// Placement label Points de mouvements
	var _labelPtsMX = _labelPtsVX;
	var _labelPtsMY= _labelPtsAY + _EspaceLabelY;

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

	// Placement Conteneur ArmeEquip
	var _ContArmeX = _labelArmeX + 120;
	var _ContArmeY = _labelArmeY;

	// Dimension Conteneur ArmeEquip
	var _ContArmeH = 200;
	var _ContArmeW = 200;

	// Placement Conteneur ArmureEquip
	var _ContArmureX = _labelArmureX + 135;
	var _ContArmureY = _labelArmureY;

	// Dimension Conteneur ArmureEquip
	var _ContArmureH = 200;
	var _ContArmureW = 200;
	
	// Placement Conteneur Map (en fonction de la taille de l'image !!)
	var _ContMapX = w/2 - 379/2;
	var _ContMapY = h/2 - 379/2;
	
	// Dimension Conteneur Map
	var _ContMapH = 379;
	var _ContMapW = 379;

	// label.lineHeight
	var _LineHeight = 15;

	// label.textBaseline
	var _TextBaseline = "top";

	// application du background
	var background = new createjs.Bitmap("public/Background.jpg");
	background.image.onload = setImg(background, 0, 0);

	/*// insertion de la map (virtuelle) pour regler les boutons
	var map = new createjs.Bitmap("public/map/0-0.png");
	// Placement de la map
	var _MapX = w/2 - map.image.width/2;
	var _MapY = h/2 - map.image.height/2;
	//map.image.onload = setImg(map, _MapX, _MapY);*/

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

	var contInvPerso = new createjs.Container();
	contInvPerso.x = _ContItemPersoX;
	contInvPerso.y = _ContItemPersoY;
	contInvPerso.height = _ContItemPersoH;
	contInvPerso.width = _ContItemPersoW;
	stage.addChild(contInvPerso);

	var contArme = new createjs.Container();
	contArme.x = _ContArmeX;
	contArme.y = _ContArmeY;
	contArme.height = _ContArmeH;
	contArme.width = _ContArmeW;
	stage.addChild(contArme);

	var contArmure = new createjs.Container();
	contArmure.x = _ContArmureX;
	contArmure.y = _ContArmureY;
	contArmure.height = _ContArmureH;
	contArmure.width = _ContArmureW;
	stage.addChild(contArmure);
	
	var contMap = new createjs.Container();
	contMap.x = _ContMapX;
	contMap.y = _ContMapY;
	contMap.height = _ContMapH;
	contMap.width = _ContMapW;
	stage.addChild(contMap);
	
	var contPerso = new createjs.Container();
	contPerso.x = w/2 - 32/2;
	contPerso.y = h/2 - 32/2;
	contPerso.height = 32;
	contPerso.width = 32;
	stage.addChild(contPerso);
	
	// insertion du Perso
	var imgPerso = new createjs.Bitmap("public/persos/perso.gif");
	// Placement du perso
	/*var _PersoX = w/2 - imgPerso.image.width/2;
	var _PersoY = h/2 - imgPerso.image.height/2;
	imgPerso.image.onload = setImg(imgPerso, _PersoX, _PersoY);*/
	contPerso.addChild(imgPerso);
	//contMap.addChild(contPerso);

	// ******************************************
	// ** Création des barres du perso 			*
	// ******************************************

	// Barre de vie
	lifeBarContainer = new createjs.Container();

	lifeBarHeight = 10;
	lifeBarWidth = 100;
	lifeBarColor = createjs.Graphics.getRGB(0,150,0);
	lifeBarFrameColor = createjs.Graphics.getRGB(0,0,0);

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
	actionBarFrameColor = createjs.Graphics.getRGB(0,0,0);

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
	moveBarFrameColor = createjs.Graphics.getRGB(0,0,0);

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
	sacBarFrameColor = createjs.Graphics.getRGB(0,0,0);

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
	//********** Déclaration des labels *******
	// ******************************************

	var txtSalle, txtObjet, txtCase, txtObjetEquipe, 
	labelObjetCase,	labelInventaire, labelDescribeItem, labelMode,
	labelPtsMove, labelPtsAction, labelPtsVie, labelPoidsSac, labelPtsAtq, labelPtsDef,
	labelBonusArme, labelBonusArmure, labelIdSalle,
	labelNbAlies, labelNbEnnemis, labelNbGoules, labelProbaCache, labelProbaFouille;

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

	labelMode = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelMode.lineHeight = _LineHeight;
	labelMode.textBaseline = _TextBaseline;
	labelMode.x = _labelModeX;
	labelMode.y = _labelModeY;

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
	txtSalle.y = 550;

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

	// ******************************************
	// ** Création des boutons de déplacement ***
	// ******************************************
	/*var BtnHaut = stage.addChild(new ButtonMove("H", ColorPad));
					BtnHaut.y = 10;
					BtnHaut.addEventListener('click', function(event) {
						socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
						});

					var BtnBas = stage.addChild(new ButtonMove("B", ColorPad));
					BtnBas.y = BtnHaut.y + 60;
					BtnBas.addEventListener('click', function(event) {
						socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
						});

					var BtnGauche = stage.addChild(new ButtonMove("G", ColorPad));
					BtnGauche.x = 20;
					BtnGauche.addEventListener('click', function(event) {
						socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
						});

					var BtnDroite = stage.addChild(new ButtonMove("D", ColorPad));
					BtnDroite.x = BtnGauche.x + 60;
					BtnDroite.addEventListener('click', function(event) {
						socket.emit('MOVE_PERSONNAGE_CS', 'EST');
						});*/

	var _EpaisseurBpPad = 20;
	
	var BtnHaut = stage.addChild(new ButtonPad("", ColorPad, _ContMapW, _EpaisseurBpPad));
	BtnHaut.y = _ContMapY - _EpaisseurBpPad;
	BtnHaut.x = _ContMapX;
	BtnHaut.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
	});

	var BtnBas = stage.addChild(new ButtonPad("", ColorPad, _ContMapW, _EpaisseurBpPad));
	BtnBas.y = _ContMapY + _ContMapH;
	BtnBas.x = _ContMapX;
	BtnBas.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});

	var BtnGauche = stage.addChild(new ButtonPad("", ColorPad, _EpaisseurBpPad, _ContMapH));
	BtnGauche.x = _ContMapX - _EpaisseurBpPad;
	BtnGauche.y = _ContMapY;
	BtnGauche.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
	});

	var BtnDroite = stage.addChild(new ButtonPad("", ColorPad, _EpaisseurBpPad, _ContMapH));
	BtnDroite.x = _ContMapX + _ContMapW;
	BtnDroite.y = _ContMapY;
	BtnDroite.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'EST');
	});

	BtnHaut.cursor = BtnBas.cursor = BtnGauche.cursor = BtnDroite.cursor = "crosshair";
	/*BtnHaut.x = BtnBas.x = 50;
					BtnGauche.y = BtnDroite.y = 40;*/


	// ******************************************
	// ************ Boutons d'action ************
	// ******************************************
	var BtnEvents = stage.addChild(new Button("Historique", ColorBtn));
	BtnEvents.y = OrdBtn;
	/*BtnEvents.addEventListener('click', function(event) {

						});	*/

	var BtnUtiliser = stage.addChild(new Button("Utiliser", ColorBtn));
	BtnUtiliser.y = BtnEvents.y + H;
	BtnUtiliser.addEventListener('click', function(event) {
		if (SelectedItemPerso == -1) {
			alert("Selectionner Item avant de l'utiliser");
		} else {
			socket.emit('PERSONNAGE_USE_CS', SelectedItemPerso);
			SelectedItemPerso = -1;
		}
	});	

	var BtnRamasseObjet = stage.addChild(new Button("Ramasser Item", ColorBtn));
	BtnRamasseObjet.y = BtnUtiliser.y + H;
	BtnRamasseObjet.addEventListener('click', function (event) {
		if (SelectedItemCase == -1) {
			alert("Selectionner Item avant de Ramasser");
		} else {
			socket.emit('INV_CASE_CS', "RAMASSER", SelectedItemCase);
			SelectedItemCase = -1;
		}
	});

	var BtnDeposer = stage.addChild(new Button("Déposer Item", ColorBtn));
	BtnDeposer.y = BtnRamasseObjet.y + H;
	BtnDeposer.addEventListener('click', function (event) {
		if (SelectedItemPerso == -1) {
			alert("Selectionner Item avant de Déposer");
		} else {
			socket.emit('INV_CASE_CS', "DEPOSER", SelectedItemPerso);
			SelectedItemPerso = -1;
		}
	});

	var BtnEquiper = stage.addChild(new Button("Équiper Item", ColorBtn));
	BtnEquiper.y = BtnDeposer.y + H;
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

	var BtnDesequiper = stage.addChild(new Button("Déséquiper Item", ColorBtn));
	BtnDesequiper.y = BtnEquiper.y + H;
	BtnDesequiper.addEventListener('click', function (event) {
		socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", SelectedItemEquip);
		SelectedItemEquip = -1;
		SelectedItemPerso = -1;
	});

	var BtnAttaquer = stage.addChild(new Button("Attaquer...", ColorBtn));
	BtnAttaquer.y = BtnDesequiper.y + H;
	/*BtnAttaquer.addEventListener('click', function(event) {

						});	*/

	// Boutons Ajoutés dans INFO_PERSO en fonction du mode

	/* var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
				    BtnFouiller.y = BtnAttaquer.y + H;
				    BtnFouiller.addEventListener('click', function(event) {
				    	socket.emit('PERSONNAGE_MODE_CS', 1);
				    	 socket.emit('INFO_PERSONNAGE_CS');
						});	

				    var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
				    BtnCacher.y = BtnFouiller.y + H;
				    BtnCacher.addEventListener('click', function(event) {
				    	socket.emit('PERSONNAGE_MODE_CS', 2);
				    	 socket.emit('INFO_PERSONNAGE_CS');
						});	

				    var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
				    BtnDefendre.y = BtnCacher.y + H;
				    BtnDefendre.addEventListener('click', function(event) {
				    	socket.emit('PERSONNAGE_MODE_CS', 3);
				    	 socket.emit('INFO_PERSONNAGE_CS');
						});	*/
	
	var BtnAtqGoules = stage.addChild(new Button("Attaquer Goule(s)", ColorBtn));
	BtnAtqGoules.y = BtnAttaquer.y + H;
	BtnAtqGoules.addEventListener('click', function(event) {
		socket.emit('ACTION_ATTAQUE_GOULE_CS');
						});

	var BtnFouilleRapide = stage.addChild(new Button("Fouille rapide", ColorBtn));
	//BtnFouilleRapide.y = BtnDefendre.y + H;
	BtnFouilleRapide.y = BtnAtqGoules.y + H;
	BtnFouilleRapide.addEventListener('click', function(event) {
		socket.emit('ACTION_FOUILLE_RAPIDE_CS');
	});	
	
	

	stage.update();

	//BtnEvents.x = BtnUtiliser.x = BtnRamasseObjet.x = BtnDeposer.x = BtnEquiper.x = BtnDesequiper.x = BtnAttaquer.x = BtnFouiller.x = BtnCacher.x = BtnDefendre.x = AbsBtn;
	BtnEvents.x = BtnUtiliser.x = BtnRamasseObjet.x = BtnDeposer.x = BtnEquiper.x = BtnDesequiper.x = BtnAttaquer.x = AbsBtn;
	BtnEvents.cursor = BtnUtiliser.cursor = BtnRamasseObjet.cursor = BtnDeposer.cursor = BtnEquiper.cursor = BtnDesequiper.cursor = BtnAttaquer.cursor = "crosshair";
	// ******************************************
	// *********** INITIALISATION ***************
	// ******************************************

	// AFFICHAGE DE L'IVENTAIRE DE CASE ET PERSO
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
	stage.update();
	// Check message en attente (socket.emit)

	// ******************************************
	// ********* RECEPTION SERVEUR **************
	// ******************************************

	//******************************************************************************************************************
	// * RECEPTION DU NOUVEL ID SALLE DU PERSONNAGE
	//********************************************
	socket.on('MOVE_PERSONNAGE_SC', function (currentCase) {
		/*if (currentCase == 0) {
			txtSalle.text = "";
			txtSalle.text = ("WARNING : ERREUR_CASE");
		} else if (currentCase == -1) {
			txtSalle.text = "";
			txtSalle.text = ("Impossible d'aller par là !");
		} else if (currentCase == -2) {
			txtSalle.text = "";
			txtSalle.text = ("Vous n'avez plus de points de mouvements !");
		} else if (currentCase == -5) {
			txtSalle.text = "";
			txtSalle.text = ("Déplacement raté à cause des goules !");
		} else {
			socket.emit('INFO_CASE_CS');
			txtSalle.text = "";
			txtSalle.text = ("Déplacement en salle " + currentCase.nom + "");
			//modifieIdSalle(currentCase.nom, currentCase.id);
			socket.emit('INFO_PERSONNAGE_CS');
		}*/
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
			txtSalle.text = "";
			txtSalle.text = ("Déplacement en salle " + currentCase.nom + "");
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		}
		stage.update();
	});

	/******************************************************************************************************************
	 * RECEPTION D'UNE REPONSE POUR LA DEMANDE DE MODIF
	 * D'OBJET DANS LA CASE
	 */
	socket.on('INV_CASE_SC', function (type, id_item, codeRetour) {
		if (type == 'RAMASSER') {
			// erreur
			if (codeRetour == -3) {
				txtObjet.text = "";
				txtObjet.text = ("Erreur inconnue");
			}
			// poids insufisant
			else if (codeRetour == -1) {
				txtObjet.text = "";
				txtObjet.text = ("Impossible de ramasser l'objet : poids max atteint !");
			}
			// objet pas dans case
			else if (codeRetour == -2) {
				txtObjet.text = "";
				txtObjet.text = ("L'objet " + id_item + " n'est plus dans la salle !");
			}
			// ramassage ok
			else {
				txtObjet.text = "";
				txtObjet.text = ("Item ramassé ! Sac : " + codeRetour + " kg");
				socket.emit('INFO_PERSONNAGE_CS');
				socket.emit('INFO_CASE_CS');
				stage.update();
			}
		}
		stage.update();
		if (type == 'DEPOSER') {
			// erreur
			if (codeRetour == -3) {
				txtObjet.text = ("Déséquiper l'objet avant de déposer !");
			}
			else if (codeRetour == -4) {
				txtObjet.text = ("Erreur interne !");
			}
			// objet pas dans sac (! pas normal)
			else if (codeRetour == -2) {
				txtObjet.text = ("L'item " + id_item + " n'est plus dans le sac ");

			}
			// dépôt ok
			else {
				txtObjet.text = "";
				txtObjet.text = ("Item " + id_item + "déposé ! Sac : " + codeRetour + " kg");
				socket.emit('INFO_PERSONNAGE_CS');
				socket.emit('INFO_CASE_CS');
				stage.update();
			}
		}
		stage.update();
	});


	/******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR CHANGER DE MODE
	 * return 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -4 si déja dans ce mode
	 * erreur : -5 si raté à cause goules
	 * 
	 * ET return dégats infligés
	 */
	socket.on('PERSONNAGE_MODE_SC', function (mode, reponse, degatsInfliges) 
			{
		switch(reponse)
		{
		case 1: 
			txtObjetEquipe.text = "";
			txtObjetEquipe.text = ("chgt pour mode " + mode +"  ok !");
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		case 0 : 
			txtObjetEquipe.text = "";
			txtObjetEquipe.text = ("chgt pour mode " + mode +" raté ! : Erreur interne");
			break;
		case -4 : 
			txtObjetEquipe.text = "";
			txtObjetEquipe.text = ("chgt pour mode " + mode +"  raté ! : déja dans ce mode");
			break;
		case -5: 
			txtObjetEquipe.text = "";
			txtObjetEquipe.text = ("chgt pour mode " + mode +"  raté à cause des Goules");
			break;
		}
		txtObjetEquipe.text+=("Dégats infligés : " + degatsInfliges +"");

			});

	/******************************************************************************************************************
	 * RECEPTION DES INFORMATIONS SUR LA CASE
	 *
	 * @method INFO_CASE_SC
	 */
	socket.on('INFO_CASE_SC', function(currentCase) {

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

			labelNbAlies.text=("Aliés dans la salle : " + + "");
			labelNbEnnemis.text=("Ennemis dans la salle : " + + "");
			labelNbGoules.text=("Goules dans la salle : " + currentCase.nbrGoules + "");
			labelProbaCache.text=("Proba de Cache : " + ProbCache + " % (avec multi de " +  PersoProbaCache + ")");
			labelProbaFouille.text=("Proba de Trouver item : " + ProbFouille + " % (avec multi de " +  PersoProbaFouille + ")");


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





	/******************************************************************************************************************

	 * RECEPTION DES INFORMATIONS SUR LA CASE
	 *
	 * @method INFO_CASE_SC
	 */
	/*socket.on('INFO_CASE_SC', function (currentCase) {
				        if (currentCase == "ERREUR_CASE") {
				            //insereMessage("CLIENT :: nom case = " + "ERREUR_CASE");
				            txtCase.text = "";
				            txtCase.text = ("CLIENT :: nom case = " + "ERREUR_CASE");
				        } else {
				            labelObjetCase.text = "";
				            labelObjetCase.text = ("Objets de la case : " + currentCase.nom + "");

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

				                imgItem.addEventListener("click", function (event) {
				                	alert("click item");
				                    var currentItem = listeItemsCase[event.target.name];
				                    SelectedItemCase = currentItem.id;
				                    stage.update();
				                });

				                // Ajout de l'évenement a l'image
				                imgItem.addEventListener('mouseover', function (event) {
				                    var currentItem = listeItemsCase[event.target.name];
				                    SelectedItemCase = currentItem.id;
				                    labelDescribeItem.text = ("Nom : " + currentItem.nom + " (" + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
				                    stage.update();
				                }, false);

				                imgItem.addEventListener('mouseout', function (event) {
				                    labelDescribeItem.text = "";
				                    stage.update();
				                }, false);




				                //Placement de l'image et ajout au conteneur
				                //imgItem.image.onload = setImg(imgItem,200+(i+1)*30,50);
				                imgItem.x = i * SpaceItem;
				                contInvCase.addChild(imgItem);

				                // Update l'ihm
				                stage.update();
				            }
				        }
				        stage.update();
				    });*/

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
		else
		{
			labelPtsAction.text=("Points d'action :	 	 	    	" + currentPerso.ptActions + "/" + currentPerso.ptActionsMax);
			actionBar.scaleX = (currentPerso.ptActions/currentPerso.ptActionsMax) * actionBarWidth;
		}
		// Sécurité pour le remplissage de la barre de move
		if(currentPerso.ptDeplacement > currentPerso.ptDeplacementMax)
		{
			labelPtsMove.text=("Points de mouvement :     " + currentPerso.ptDeplacement + "/" + currentPerso.ptDeplacementMax);
			moveBar.scaleX = currentPerso.ptDeplacementMax;
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
		

		//labelPtsAtq.text=("Points d'attaque :      " + PointsAttaque + "");
		//labelPtsDef.text=("Points de défense :     " + PointsDefense + "");

		stage.removeChild(BtnFouiller, BtnCacher, BtnDefendre);

		switch(currentPerso.mode)
		{
		case 0 :  labelMode.text=("");

		var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
		BtnFouiller.y = BtnAtqGoules.y + H;
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
		BtnCacher.y = BtnFouiller.y + H;
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
		BtnDefendre.y = BtnCacher.y + H;
		BtnDefendre.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});

		BtnFouiller.cursor=BtnCacher.cursor=BtnDefendre.cursor="crosshair";
		labelBonusArme.text=("");
		labelBonusArmure.text=("");

		break;

		case 1 :  labelMode.text="";
		labelMode.text=("Mode Fouille activé");

		var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorGreen));
		BtnFouiller.y = BtnAtqGoules.y + H;
		BtnFouiller.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 1);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
		BtnCacher.y = BtnFouiller.y + H;
		BtnCacher.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 2);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
		BtnDefendre.y = BtnCacher.y + H;
		BtnDefendre.addEventListener('click', function(event) {
			socket.emit('PERSONNAGE_MODE_CS', 3);
			socket.emit('INFO_PERSONNAGE_CS');
		});	

		BtnFouiller.cursor="not-allowed";
		BtnCacher.cursor=BtnDefendre.cursor="crosshair";

		labelBonusArme.text=("");
		labelBonusArmure.text=("");

		break;

		case 2 :  
			labelMode.text="";
			labelMode.text=("Mode Caché activé");

			var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
			BtnFouiller.y = BtnAtqGoules.y + H;
			BtnFouiller.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 1);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			var BtnCacher = stage.addChild(new Button("Mode Caché", ColorGreen));
			BtnCacher.y = BtnFouiller.y + H;
			BtnCacher.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 2);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
			BtnDefendre.y = BtnCacher.y + H;
			BtnDefendre.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 3);
				socket.emit('INFO_PERSONNAGE_CS');
			});

			BtnCacher.cursor="not-allowed";
			BtnFouiller.cursor=BtnDefendre.cursor="crosshair";

			labelBonusArme.text=("");
			labelBonusArmure.text=("");

			break;

		case 3 :  
			labelMode.text="";
			labelMode.text=("Mode Défense activé");

			var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
			BtnFouiller.y = BtnAtqGoules.y + H;
			BtnFouiller.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 1);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
			BtnCacher.y = BtnFouiller.y + H;
			BtnCacher.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 2);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorGreen));
			BtnDefendre.y = BtnCacher.y + H;
			BtnDefendre.addEventListener('click', function(event) {
				socket.emit('PERSONNAGE_MODE_CS', 3);
				socket.emit('INFO_PERSONNAGE_CS');
			});	

			BtnDefendre.cursor="not-allowed";
			BtnFouiller.cursor=BtnCacher.cursor="crosshair";

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
		
		for (var i = 0; i < currentPerso.sacADos.length; i++) {


			// mise de l'item dans une variable
			var item = currentPerso.sacADos[i];

			// Calcul du poids du sac
			PoidsSac+=item.poids;
			

			// Ajout de l'item à la liste
			listeItemsPerso.push(item);
			
			if(!((currentPerso.armeEquipee != null && item.id == currentPerso.armeEquipee.id) || 
					(currentPerso.armureEquipee != null && item.id == currentPerso.armureEquipee.id)) )
			{
				
				// Ajout de l'item à la liste
				//listeItemsPerso.push(item);
				
				// Ajout de l'image à l'ihm
				var imgItem = new createjs.Bitmap(item.imageName);

				// ajout d'un texte quand l'user passera la souris dessus
				imgItem.name = i;
				imgItem.cursor = "pointer";

				// Ajout de l'évenement a l'image
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

				//imgItem.image.onload = setImg(imgItem,10+(i+1)*SpaceItem,400);
				imgItem.x = iPositionItemInConteneur * SpaceItem;
				contInvPerso.addChild(imgItem);

				//inc 
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
				idSelectedItemEquip = currentPerso.armeEquipee.id;
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
				idSelectedItemEquip = currentPerso.armureEquipee.id;
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
	 * RECEPTION DE LA REPONSE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM
	 * Retours (voir server.js) :
	 * return 1 si ok
	 * erreur : 0 si objet n'est pas dans le sac
	 * erreur : -1 si il y a déja une arme d'équipée
	 * erreur : -2  si il y a déja une armure d'équipée
	 * erreur : -3 si item n'est ni arme ni armure
	 */
	/*socket.on('INV_PERSONNAGE_SC', function(type, currentItem, codeRetour) {
						alert("retour button ok");

						if (codeRetour == 0) {
							txtObjetEquipe.text="";
							txtObjetEquipe.tetx=("L'item " + currentItem.id + " n'est plus dans le sac ");
							// quitte la fonction
							return; 
						}
						if (type == "EQUIPER") {
							switch(codeRetour) {
								case 0 : 
									txtObjetEquipe.text="";
									txtObjetEquipe.text=("Equipement de l'item " + currentItem.id + " raté : Item pas dans sac !");
									//alert("Equipement de l'item " + currentItem.id + " raté : Item pas dans sac !");
									break;
								case 1 : 
									txtObjetEquipe.text="";
									txtObjetEquipe.text=("Equipement de l'item " + currentItem.id + " ok !");

									var imgItem = new createjs.Bitmap(currentItem.imageName);

									// Si le type de l'item est : ARME
									if(SelectedItemType==1)
										{
										// Dessin de l'arme équipée
										contArme.removeAllChildren();
										contArme.addChild(imgItem);
										contArme.addEventListener("click", function(event){
											SelectedItemEquip = currentItem;
											stage.update();
											});
										}
									// Si le type de l'item est : ARMURE
									else if(SelectedItemType==2)
										{
										// Dessin de l'armure équipée
										contArmure.removeAllChildren();
										contArmure.addChild(imgItem);
										contArmure.addEventListener("click", function(event){
											SelectedItemEquip = currentItem;
											stage.update();
											});
										}
									stage.update();
									break;
								case -1 : 
									txtObjetEquipe.text="";
									txtObjetEquipe.text=("Equipement de l'item " + currentItem.id + " raté : arme déja équipée");
									//alert("Equipement de l'item " + currentItem.id + " raté : arme déja équipée");
									break;
								case -2 : 
									txtObjetEquipe.text="";
									txtObjetEquipe.text=("Equipement de l'item " + currentItem.id + " raté : armure déja équipée");
									//alert("Equipement de l'item " + currentItem.id + " raté : armure déja équipée");
									break;
								case -3 : 
									txtObjetEquipe.text="";
									txtObjetEquipe.text=("Equipement de l'item " + currentItem.id + " raté : armure déja équipée");
									//alert("Equipement de l'item " + currentItem.id + " raté : armure déja équipée");
									break;
							}
						} 
						else if (type == "DEQUIPER") 
						{

							if (codeRetour == -4) 
							{
								txtObjetEquipe.text="";
								txtObjetEquipe.tetx=("Impossible de se déséquiper de l'item " + currentItem.id + ", vous n'en êtes pas équipé");
							}
							else
							{
								// Si déquipe arme
								if(SelectedItemType==1)
								{
									// efface l'arme
									contArme.removeAllChildren();
								}
								// Si déquipe armure
								else if(SelectedItemType==2)
								{
									// efface armure
									contArmure.removeAllChildren();
								}
								txtObjetEquipe.text="";
								txtObjetEquipe.text=("Item " + currentItem.id + "déséquipé !");
							}
						}
						stage.update();

						// RAFRAICHISSEMENT DE LA CASE ET DU PERSO
					});*/

	//stage.update();


	/******************************************************************************************************************
	 * RECEPTION DE LA REPONSE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM
	 * Retours (voir server.js) :
	 * return 1 si ok
	 * erreur : 0 si objet n'est pas dans le sac
	 * erreur : -1 si il y a déja une arme d'équipée
	 * erreur : -2  si il y a déja une armure d'équipée
	 * erreur : -3 si item n'est ni arme ni armure
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
				alert("Equipement de l'item " + currentItem.nom + " raté : Item pas dans sac !");
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
						alert("------ ID = " + currentItem.id);
						SelectedItemEquip = currentItem.id;
						stage.update();
						alert("SelectedItemEquip = " + SelectedItemEquip);
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
						alert("SelectedItemEquip = " + SelectedItemEquip);
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
			}
			// Si déquipe armure
			else if (codeRetour == 2) {
				// efface armure
				contArmure.removeAllChildren();
			}
			txtObjetEquipe.text = "";
			txtObjetEquipe.text = ("Item de type" + currentItem.type + " déséquipé !");
			socket.emit('INFO_PERSONNAGE_CS');	
		}
		stage.update();
		// RAFRAICHISSEMENT DE LA CASE ET DU PERSO
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
				      				txtObjetEquipe.text = "Fouille ok ! Objet découvert : " + item.nom;
				      				if (ajouteAuSac == 0) txtObjetEquipe.text += " ! Ajouté à la case";
				      				break;
				      			case  0 : 
				      				txtObjetEquipe.text = "Fouille ok ! Objet découvert : " + item.nom;
				      				txtObjetEquipe.text = ". Mais vous avez été blessé ! " + degatsInfliges;
				      				if (ajouteAuSac == 0) txtObjetEquipe.text += " ! Ajouté à la case";
				      				break;
				      			case -1 : 
				      				txtObjetEquipe.text = "Fouille raté";
				      				break;
				      			case -2 : 
				      				txtObjetEquipe.text = 
				      				break;
				      			case -4 :
				      				txtObjetEquipe.text = 
				  					break;
				      			case -5 : 
				      				txtObjetEquipe.text = 
				      				break;
				      			case -6 :
				      				txtObjetEquipe.text = 
				      				break;
				      			case -7: 
				      				txtObjetEquipe.text = 
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