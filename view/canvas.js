var canvas;
var stage, w, h, output;
var context;

var mouseTarget; // the display object currently under the mouse, or being dragged
var dragStarted; // indicates whether we are currently in a drag operation
var offset;

var SelectedItemCase = -1;
var SelectedItemPerso = -1;
var SelectedItemPersoType = -1;
var SelectedItemEquip = -1;
var SelectedPerso = -1;
var PersoProbaCache=1;
var PersoProbaFouille=1;

var PageItemPerso=0;
var PageItemPersoDead=0;
var PageItemCase=0;

var PagePersoEnn=0;
var PagePersoAllies=0;
var PageMessage=0;

var background, backgroundPreload, map, perso;

//Espacement items
var SpaceItem = 32;

var SpacePerso = 64;

//Police des labels
var PoliceLabel="14px Consolas";

//label.lineHeight
var _LineHeight = 15;
//label.textBaseline
var _TextBaseline = "top";

var BtnPageItemPersoRight, BtnPageItemPersoLeft, BtnPageItemCaseRight, BtnPageItemCaseLeft, BtnPageItemPersoDeadRight, BtnPageItemPersoDeadLeft;

//******************************************
//*  Réglages mise en forme (partie Design)*
//******************************************

//Espacement des boutons
var H=45;

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
var _EspaceLabelX = 265;
var _EspaceLabelY = 20;

//Placement Conteneur ItemCase
var _ContItemCaseX = 750;
var _ContItemCaseY = 530;

//Dimension Conteneur ItemCase
var _ContItemCaseH = 40;
var _ContItemCaseW = 330;

//Placement label ItemCase
var _labelItemCaseX = _ContItemCaseX + 180;
var _labelItemCaseY = _ContItemCaseY - 20;

//Placement label Arme
var _labelArmeX = 750;
var _labelArmeY = 5;

//Placement label Armure
var _labelArmureX = _labelArmeX + 180;
//var _labelArmureY = _labelArmeY + _EspaceLabelY+10;
var _labelArmureY = _labelArmeY;

//Placement label ItemPerso
var _labelItemPersoX = _labelArmeX;
var _labelItemPersoY = _labelArmureY 	+ _EspaceLabelY + 15;

//Placement Conteneur ItemPerso
var _ContItemPersoX = _labelItemPersoX;
var _ContItemPersoY = _labelItemPersoY + _EspaceLabelY-5;

//Dimension Conteneur ItemPerso
var _ContItemPersoH = 40;
var _ContItemPersoW = 330;

//------------------- Zone 1 : 1/2 barres perso -----------------------------------------------------

//Placement label Points de vie
var _labelPtsVX = 200;
var _labelPtsVY = _labelArmeY;

//Placement label Points de faim
var _labelPtsFX = _labelPtsVX;
var _labelPtsFY = _labelPtsVY + _EspaceLabelY;

//Placement label Points d'Attaque
var _labelPtsAtqX = _labelPtsVX;
var _labelPtsAtqY = _labelPtsFY + _EspaceLabelY;

//Placement label Points de Défense
var _labelPtsDefX = _labelPtsAtqX +_EspaceLabelX;
var _labelPtsDefY = _labelPtsAtqY;

//------------------ Zone 2 : 2/2 barres perso -------------------------------------------------------

//Placement label Points d'action
var _labelPtsAX = _labelPtsVX + _EspaceLabelX;
var _labelPtsAY = _labelPtsVY;

//Placement label Points de mouvements
var _labelPtsMX = _labelPtsAX;
var _labelPtsMY = _labelPtsAY + _EspaceLabelY;

//------------------ Zone 9 : Infos Case -------------------------------------------------------

//Placement label Description Item
var _labelDescribeItemX = _ContItemCaseX;
var _labelDescribeItemY = _ContItemCaseY + 40;

//Placement label Nombre d'Aliés
var _labelNbAlliesX  = 175;
var _labelNbAlliesXY = 530;

//Placement label Nombre d'Ennemis
var _labelNbEnnemisX = _labelNbAlliesX ;
var _labelNbEnnemisY = _labelNbAlliesXY + _EspaceLabelY;

//Placement label Nombre de Goules
var _labelNbGoulesX = _labelNbAlliesX ;
var _labelNbGoulesY = _labelNbEnnemisY + _EspaceLabelY;

// Placement label description case
var _labelDescribeCaseX=_labelNbAlliesX;
var _labelDescribeCaseY=_labelNbGoulesY + _EspaceLabelY;

//------------------ Zone 8 : Proba de la case -------------------------------------------------------

//Placement label Probabilité de Cache
var _labelProbaCacheX = _labelNbAlliesX + 240;
var _labelProbaCacheY = _labelNbAlliesXY ;

//Placement label Probabilité de Fouille
var _labelProbaFouilleX = _labelProbaCacheX ;
var _labelProbaFouilleY = _labelProbaCacheY + _EspaceLabelY;

//Placement label id Salle en cours
var _labelIdSalleX = _labelProbaCacheX;
var _labelIdSalleY = _labelProbaCacheY + 2*_EspaceLabelY;

//-----------------------------------------------------------------------------------

//Placement label Retour Goules
var _labelActionX = 10;
var _labelActionY = 580;

//------------------ Zone 13 : Modes-------------------------------------------------------

//Placement Conteneur des _labelProbaCacheYboutons de mode
var _ContModeX = 20;
var _ContModeY = 330;
var _ContModeW = 140;
var _ContModeH = 3*H;

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
var _ContBtnsListesX = _ContModeX;
var _ContBtnsListesY = 510;
var _ContBtnsListesW = 140;
var _ContBtnsListesH = 2*H;

//Placement du label nombre de nouveaux messages
var _labelNombreNouvMsgX=_ContBtnsListesX + 150;
var _labelNombreNouvMsgY=_ContBtnsListesY + 20;

//Placement label Choix Mode
var _labelBtnsListesX = _ContBtnsListesX+2;
var _labelBtnsListesY = _ContBtnsListesY-20;

//------------------------- Zone 5 : Btns Inv Perso ---------------------------------------
//Placement Conteneur des Boutons perso
var _ContBtnsInvPersoX = 945;
var _ContBtnsInvPersoY = 140;
var _ContBtnsInvPersoW = 140;
var _ContBtnsInvPersoH = 3*H;

//Placement label Choix Mode
var _labelBtnsInvPersoX = _ContBtnsInvPersoX-5;
var _labelBtnsInvPersoY = _ContBtnsInvPersoY-20;

//------------------------- Zone 6 : Btns Inv Case ---------------------------------------
//Placement Conteneur des Boutons case
var _ContBtnsInvCaseX = _ContBtnsInvPersoX ;
var _ContBtnsInvCaseY = 310;
var _ContBtnsInvCaseW = 140;
var _ContBtnsInvCaseH = 4*H;

//Placement label Choix Mode
var _labelBtnsInvCaseX = _ContBtnsInvCaseX-5;
var _labelBtnsInvCaseY = _ContBtnsInvCaseY-20;

//------------------ Zone 12 : Map -------------------------------------------------------

//Placement Conteneur Map (en fonction de la taille de l'image !!)
var _ContMapX = 1100/2 - 746/2;
var _ContMapY = 620/2 - 420/2;

//Dimension Conteneur Map
var _ContMapH = 420;
var _ContMapW = 746;

//Placement du dernier message
var _labelDernierMessageX = _ContMapX;
var _labelDernierMessageY = _ContMapY-20;

//------------------- Zone 14 : Labels de retour------------------------------------------------------

var _ContLabelsActionX = 5;
var _ContLabelsActionY = 120;
var _ContLabelsActionW = 165;
var _ContLabelsActionH = 20*9;

//-------------- Déclaration des labels----------------------------------------------

var labelAction, labelObjetCase, labelInventaire, labelDescribeItem,
labelPtsMove, labelPtsAction, labelPtsVie, labelPoidsSac, labelPtsAtq, labelPtsDef,
labelBonusArme, labelBonusArmure, labelIdSalle, labelNbAllies, labelNbEnnemis,
labelNbGoules, labelProbaCache, labelProbaFouille,
labelChoixMode, labelBtnsListes, labelBtnsInvPerso, labelBtnsInvCase, labelPtsFaim, 
labelAlliesListe, labelEnnemisListe, labelDescribePerso, labelMessage, 
labelDernierMessage, labelNombreNouvMsg, labelFichePerso, labelDescribeCase,
labelLancementServeur;

var contInvCase, contInvPerso, contArme, contArmure, contMap, contPerso, contMode,
contBtnsListes, contDead,
contBtnsInvPerso, contBtnsInvCase, contListe, contListeAllies, contListeEnnemis,
contLabelsAction, contMessage;

var shape, shape1, shape2, shape3, shape4, shape6, shape7, shape8, shapeMode,
shapeLabelsAction, shapeMessage, shapeDead;

var _EpaisseurBpPad = 50;

var ListeMessages;

var imgPerso, shapeBtnsListes, shapeBtnsInvPerso, shapeBtnsInvCase, shapeBtnsListes, 
shapeBtnsInvPerso, shapeBtnsInvCase;

var BtnPagePersoAlliesRight, BtnPagePersoAlliesLeft, BtnPagePersoEnnRight, BtnPagePersoEnnLeft,
BtnPageMessageDown, BtnPageMessageUp, BtnCancelListe;

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
		{src:"public/Background_liste.jpg", id:"idBackgroundListe"},   
		{src:"public/Background_1.jpg", id:"idBackground_1"}, 
		{src:"public/Background_11.jpg", id:"idBackground_11"},  
		{src:"public/Background_Dead.jpg", id:"idBackground_Dead"},
		{src:"public/blood.jpg", id:"idBackground_blood"}, 
		{src:"public/Black.png", id:"idBackground_Black"},
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
		{src:"public/Boutons/Utiliser.png", id:"idBtnUtiliser"},
		{src:"public/Boutons/UtiliserGris.png", id:"idBtnUtiliserGris"},
		{src:"public/Boutons/Annuler.png", id:"idBtnAnnuler"},
		{src:"public/Boutons/Zombie.png", id:"idBtnZombie"},
		{src:"public/Boutons/ZombieGris.png", id:"idBtnZombieGris"},
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
		{src:"public/spritesheets/persos/Brute.gif", id:"idPersoBrute"},
		{src:"public/spritesheets/persos/Chercheur.gif", id:"idPersoChercheur"},
		{src:"public/spritesheets/persos/Explorateur.gif", id:"idPersoExplorateur"},
		{src:"public/spritesheets/persos/Brute96.png", id:"idPersoBrute96"},
		{src:"public/spritesheets/persos/Chercheur96.png", id:"idPersoChercheur96"},
		{src:"public/spritesheets/persos/Explorateur96.png", id:"idPersoExplorateur96"},
		{src:"public/spritesheets/persos/Brute64.png", id:"idPersoBrute64"},
		{src:"public/spritesheets/persos/Chercheur64.png", id:"idPersoChercheur64"},
		{src:"public/spritesheets/persos/Explorateur64.png", id:"idPersoExplorateur64"},
		{src:"public/spritesheets/persos/Brute32.png", id:"idPersoBrute32"},
		{src:"public/spritesheets/persos/Chercheur32.png", id:"idPersoChercheur32"},
		{src:"public/spritesheets/persos/Explorateur32.png", id:"idPersoExplorateur32"},
		{src:"public/spritesheets/persos/perso.gif", id:"idPerso"},
		{src:"public/map/0-0.png", id:"0-0"},
		{src:"public/map/0-1.png", id:"0-1"},
		{src:"public/map/0-2.png", id:"0-2"},
		{src:"public/map/0-4.png", id:"0-4"},
		{src:"public/map/1-1.png", id:"1-1"},
		{src:"public/map/1-2.png", id:"1-2"},
		{src:"public/map/2-0.png", id:"2-0"},
		{src:"public/map/2-1.png", id:"2-1"},
		{src:"public/map/2-2.png", id:"2-2"},
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
	backgroundPreload.cursor="wait";

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

function handleProgress() 
{

	loadingBar.scaleX = preload.progress * loadingBarWidth;

	progresPrecentage = Math.round(preload.progress*100);
	loadProgressLabel.text =("Loading Apocalypse");

	stage.update();
}

function handleComplete() 
{

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
		game();
}

function game() {
	// application du background
	var background = new createjs.Bitmap("public/Background_11.jpg");
	background.image.onload = setImg(background, 0, 0);

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
	/*contPerso.x = w/2 - 32/2;
	contPerso.y = h/2 - 32/2;*/
	contPerso.x = -5;
	contPerso.y = 15;
	contPerso.height = 64;
	contPerso.width = 64;
	stage.addChild(contPerso);
	shapePerso = new createjs.Shape();
	stage.addChild(shapePerso);
	shapePerso.graphics.setStrokeStyle(4).beginStroke("#850000").drawRect(
			2, 2, 173, 96);

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
	contLabelsAction = new createjs.Container();
	contLabelsAction.x = _ContLabelsActionX;
	contLabelsAction.y = _ContLabelsActionY;
	contLabelsAction.height = _ContLabelsActionH;
	contLabelsAction.width = _ContLabelsActionW;
	stage.addChild(contLabelsAction);
	shapeLabelsAction = new createjs.Shape();
	stage.addChild(shapeLabelsAction);
	shapeLabelsAction.graphics.setStrokeStyle(0.2).beginStroke("#ffffff").drawRect(
			_ContLabelsActionX-4, _ContLabelsActionY-4, _ContLabelsActionW+5, _ContLabelsActionH+5);

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
	labelNbAllies.y = _labelNbAlliesXY;

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
	labelAction = contLabelsAction.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelAction.lineHeight = _LineHeight;
	labelAction.textBaseline = _TextBaseline;
	labelAction.x = 0;
	labelAction.y = 0;
	
	labelLancementServeur = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelLancementServeur.lineHeight = _LineHeight;
	labelLancementServeur.textBaseline = _TextBaseline;
	labelLancementServeur.x = 0;
	labelLancementServeur.y = 100;

	// ******************************************
	// ** Création des boutons de déplacement ***
	// ******************************************

	var BtnHaut = stage.addChild(new ButtonPad("", ColorPad, _ContMapW, _EpaisseurBpPad));
	BtnHaut.y = _ContMapY;
	BtnHaut.x = _ContMapX;
	BtnHaut.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
	});

	var Up = stage.addChild(new createjs.Bitmap("public/Boutons/Up.png"));
	Up.x= BtnHaut.x + _ContMapW/2 - Up.image.width/2;
	Up.y= BtnHaut.y;
	Up.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
	});

	var BtnBas = stage.addChild(new ButtonPad("", ColorPad, _ContMapW, _EpaisseurBpPad));
	BtnBas.y = _ContMapY + _ContMapH - _EpaisseurBpPad;
	BtnBas.x = _ContMapX;
	BtnBas.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});

	var Down = stage.addChild(new createjs.Bitmap("public/Boutons/Down.png"));
	Down.x= BtnBas.x + _ContMapW/2 - Down.image.width/2;
	Down.y= BtnBas.y;
	Down.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
	});

	var BtnGauche = stage.addChild(new ButtonPad("", ColorPad, _EpaisseurBpPad, _ContMapH));
	BtnGauche.x = _ContMapX;
	BtnGauche.y = _ContMapY;
	BtnGauche.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
	});

	var Left = stage.addChild(new createjs.Bitmap("public/Boutons/Left.png"));
	Left.x= BtnGauche.x;
	Left.y= BtnGauche.y + _ContMapH/2 - Left.image.height/2;
	Left.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
	});

	var BtnDroite = stage.addChild(new ButtonPad("", ColorPad, _EpaisseurBpPad, _ContMapH));
	BtnDroite.x = _ContMapX + _ContMapW - _EpaisseurBpPad;
	BtnDroite.y = _ContMapY;
	BtnDroite.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'EST');
	});

	var Right = stage.addChild(new createjs.Bitmap("public/Boutons/Right.png"));
	Right.x= BtnDroite.x;
	Right.y= BtnHaut.y + _ContMapH/2 - Right.image.height/2;
	Right.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'EST');
	});

	BtnHaut.cursor = BtnBas.cursor = BtnGauche.cursor = BtnDroite.cursor = "pointer";
	Up.cursor=Down.cursor=Left.cursor=Right.cursor="pointer";

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

	/*var BtnEvents = new createjs.Bitmap("public/Boutons/Historique.png");
	BtnEvents.image.onload = setImg(BtnEvents, AbsBtn, OrdBtn);
	BtnEvents.addEventListener('click', function(event) {

		});	*/

	var BtnFouilleRapide = new createjs.Bitmap("public/Boutons/FouilleR.png");
	BtnFouilleRapide.y = 2* H;
	contBtnsInvCase.addChild(BtnFouilleRapide);
	BtnFouilleRapide.addEventListener('click', function(event) {
		socket.emit('ACTION_FOUILLE_RAPIDE_CS');
	});	


	BtnPageItemPersoRight = stage.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
	BtnPageItemPersoRight.x= _ContItemPersoX + _ContItemPersoW;
	BtnPageItemPersoRight.y= _ContItemPersoY + 5;
	BtnPageItemPersoRight.addEventListener('click', function(event) {
		PageItemPerso++;
		socket.emit('INFO_PERSONNAGE_CS');

	});

	BtnPageItemPersoLeft = stage.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
	BtnPageItemPersoLeft.x= _ContItemPersoX - 30;
	BtnPageItemPersoLeft.y= _ContItemPersoY + 5;
	BtnPageItemPersoLeft.addEventListener('click', function(event) {
		PageItemPerso--;
		socket.emit('INFO_PERSONNAGE_CS');
	});

	BtnPageItemCaseRight = stage.addChild(new createjs.Bitmap("public/Boutons/RArrow.png"));
	BtnPageItemCaseRight.x= _ContItemCaseX  + _ContItemCaseW;
	BtnPageItemCaseRight.y= _ContItemCaseY + 5;
	BtnPageItemCaseRight.addEventListener('click', function(event) {
		PageItemCase++;
		socket.emit('INFO_CASE_CS');

	});

	BtnPageItemCaseLeft = stage.addChild(new createjs.Bitmap("public/Boutons/LArrow.png"));
	BtnPageItemCaseLeft.x= _ContItemCaseX - 30;
	BtnPageItemCaseLeft.y= _ContItemCaseY + 5;
	BtnPageItemCaseLeft.addEventListener('click', function(event) {
		PageItemCase--;
		socket.emit('INFO_CASE_CS');
	});

	BtnPageItemPersoRight.cursor=BtnPageItemPersoLeft.cursor=BtnPageItemCaseRight.cursor=BtnPageItemCaseLeft.cursor="pointer";

	BtnFouilleRapide.cursor="pointer";
	stage.update();

	// ******************************************
	// *********** INITIALISATION ***************
	// ******************************************
	socket.emit('GET_DATE_CS');
	// AFFICHAGE DE L'IVENTAIRE DE CASE ET PERSO
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
	stage.update();
}

function message()
{
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
	var Taille = Math.ceil(ListeMessages.length / 20);
	var TailleFinListe =(ListeMessages.length % 20);
	
	for (var j=0; j<Taille; j++)
	{
		var NewListe=new Array();
		
		// Si derniere page
		if(j==Taille-1 && TailleFinListe!=0)
		{
			//Boucle des items liste incomplète
			for (var i=j*20; i<j*20+TailleFinListe; i++)
			{
				if(ListeMessages[i]!=undefined)
				{
					// mise de l'item dans une variable
					var msg = ListeMessages[i];

					// mise de l'item dans une variable
					NewListe.push(msg);
				}
			}
			// ajout de la nouvelle liste au tableau de listes
			TabListe.push(NewListe);  
		}
		else
		{
			//Boucle normale : creation nouvelle liste de 10 items max
			for (var i=j*20; i<(j*20+20); i++)
			{
				if(ListeMessages[i]!=undefined)
				{
					// mise de l'item dans une variable
					var msg = ListeMessages[i];+-

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
	try 
	{
		// instructions à essayer
		labelMessage.text="";
		for (var i = 0; i < TabListeMessage[PageMessage].length ; i++) 
		{
			var message=TabListeMessage[PageMessage][i];
			labelMessage.text+=message;
		}
	}
	catch(e)
	{
		//alert("page inexistante");
	}
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

	// application du background liste au dessus de la map
	// var background_liste = new createjs.Bitmap("public/Background_liste.jpg");
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
	BtnCancelListe = new createjs.Bitmap("public/Boutons/Annuler.png");
	BtnCancelListe.x=600;
	BtnCancelListe.y=365;
	contListe.addChild(BtnCancelListe);
	BtnCancelListe.addEventListener('click', function (event) {
		SelectedPerso=-1;
		stage.removeChild(contListe);
		game();
	});

	BtnPagePersoAlliesRight = new createjs.Bitmap("public/Boutons/Right.png");
	BtnPagePersoAlliesRight.x= contListeAllies.x + contListeAllies.width;
	BtnPagePersoAlliesRight.y= contListeAllies.y + 8; //contListeAllies.height/2 - BtnPagePersoAlliesRight.image.height;
	contListe.addChild(BtnPagePersoAlliesRight);
	BtnPagePersoAlliesRight.addEventListener('click', function(event) {
		PagePersoAllies++;
		socket.emit('INFO_CASE_ALLIES_CS');
	});

	BtnPagePersoAlliesLeft = new createjs.Bitmap("public/Boutons/Left.png");
	BtnPagePersoAlliesLeft.x= contListeAllies.x - BtnPagePersoAlliesLeft.image.width -5;
	BtnPagePersoAlliesLeft.y= contListeAllies.y + 8;
	contListe.addChild(BtnPagePersoAlliesLeft);
	BtnPagePersoAlliesLeft.addEventListener('click', function(event) {
		PagePersoAllies--;
		socket.emit('INFO_CASE_ALLIES_CS');
	});

	BtnPagePersoEnnRight = new createjs.Bitmap("public/Boutons/Right.png");
	BtnPagePersoEnnRight.x= contListeEnnemis.x + contListeEnnemis.w;
	BtnPagePersoEnnRight.y= contListeEnnemis.y + 8;
	contListe.addChild(BtnPagePersoEnnRight);
	BtnPagePersoEnnRight.addEventListener('click', function(event) {
		PagePersoEnnemis++;
		socket.emit('INFO_CASE_ENNEMIS_CS');
	});

	BtnPagePersoEnnLeft = new createjs.Bitmap("public/Boutons/Left.png");
	BtnPagePersoEnnLeft.x= contListeEnnemis.x - BtnPagePersoEnnLeft.image.width - 5;
	BtnPagePersoEnnLeft.y= contListeEnnemis.y +  8;
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

	//Police des labels
	var PoliceDead="30px monospace";
	var ColorDead="#FFFFFF";
	var ColorHour="#000000";

	var Killer; //="un mec";

	/*contDeadLabel = new createjs.Container();
	contDeadLabel.x = 390;
	contDeadLabel.y = 70;
	contDeadLabel.height = 210;
	contDeadLabel.width = 320;
	contDead.addChild(contDeadLabel);
	shapeDeadLabel = new createjs.Shape();
	contDead.addChild(shapeDeadLabel);
	shapeDeadLabel.graphics.setStrokeStyle(5).beginStroke("#FFFFFF").drawRect(
			contDeadLabel.x, contDeadLabel.y, contDeadLabel.width, contDeadLabel.height);*/
	
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

	var labelDeadByWho = contDead.addChild(new createjs.Text("", PoliceDead, ColorDead));
	var labelDeadHour = contDead.addChild(new createjs.Text("", PoliceDead, ColorHour));
	labelDeadHour.x = 450 ;
	labelDeadHour.y = 175;
	labelDeadHour.text=ListeMessages[1];
	
	//alert("ListeMessages[0] : "+ ListeMessages[0]);
	if (ListeMessages[0]!=null && ListeMessages[0] == "Z")
	{
		//alert("Z");
		Killer="Un zombie rôdant dans la salle vous a dévoré !";
	}
	else if(ListeMessages[0]!=null && ListeMessages[0] == "N")
	{
		//alert("N");
		Killer="Un zombie vous a dévoré durant l'attaque de nuit !";
	}
	else if(ListeMessages[0]!=null && ListeMessages[0] == "F")
	{
		//alert("F");
		Killer="Vous êtes mort à cause de la faim !";
	}
	else if(ListeMessages[0]!=null && ListeMessages[0]!="Z" && ListeMessages[0]!="N" && ListeMessages[0]!="F")
	{
		//alert("joueur");
		Killer=(ListeMessages[0]+" vous a tué !");
	}
	else
	{
		Killer="";
	}
	
	//labelDeadByWho.lineHeight = _LineHeight;
	//labelDeadByWho.textBaseline = _TextBaseline;
	labelDeadByWho.x = 20 ;
	labelDeadByWho.y = 20;
	labelDeadByWho.text=Killer;

	// Bouton ANNULER
	var BtnCancelDead = new createjs.Bitmap("public/Boutons/Ok.png");
	BtnCancelDead.x=960;
	BtnCancelDead.y=570;
	contDead.addChild(BtnCancelDead);
	BtnCancelDead.addEventListener('click', function (event) {
		socket.emit('ACCUSE_LECTURE_MSG_CS');
		stage.removeChild(contDead);
		game();
	});

	BtnCancelDead.cursor="pointer";
	
	// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();

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

	try 
	{
		// instructions à essayer
		for (var i = 0; i < TabListe[PageItemPersoDead].length ; i++) 
		{
			var Obj=TabListe[PageItemPersoDead][i];

			// Ajout de l'image à l'ihm
			var imgItem = new createjs.Bitmap(Obj.imageName);

			/*imgItem.name = i;
			imgItem.cursor = "pointer";

			// Ajout de l'évenement a l'image
			// ajout d'un texte quand l'user passera la souris dessus
			imgItem.addEventListener('mouseover', function(event) {
				var currentItem = TabListe[PageItemPersoDead][event.target.name];
				labelDescribeItemDead.text=(currentItem.nom + " (valeur : " + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
				stage.update();
			},false);

			imgItem.addEventListener('mouseout', function(event){
				labelDescribeItemDead.text="";
				stage.update();
			},false);*/

			imgItem.x = 7+(iPositionItemInConteneur * SpaceItem);
			imgItem.y = 4;
			contItemPersoDead.addChild(imgItem);

			// position de l'item dans le conteneur
			iPositionItemInConteneur++;

			stage.update();
		}
	}
	catch(e){
		//alert("Page inexistante");
	}

	stage.update();
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
		stage.update();
	});

	BtnPageMessageUp = new createjs.Bitmap("public/Boutons/Up.png");
	BtnPageMessageUp.x=746/2 - BtnPageMessageUp.image.width/2;
	BtnPageMessageUp.y= 5;
	contMessage.addChild(BtnPageMessageUp);
	BtnPageMessageUp.addEventListener('click', function(event) {
		PageMessage--;
		setbtnMessageVisible(Taille);
		afficherMessage(TabListeMessage);
		stage.update();
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
	if (SelectedPerso != -1)
	{
		// Bouton ATTAQUER
		var BtnAttaquerListe = new createjs.Bitmap("public/Boutons/Attaquer.png");
		BtnAttaquerListe.x=x-150;
		BtnAttaquerListe.y=y;
		contListe.addChild(BtnAttaquerListe);
		BtnAttaquerListe.addEventListener('click', function(event) {
			if (SelectedPerso == -1) {
				alert("Selectionner Ennemi avant d'attaquer !");
			}
			else
			{
				socket.emit('ACTION_ATTAQUE_CS', SelectedPerso);
				SelectedPerso = -1;
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

	if(SelectedItemPerso!=-1 && SelectedItemPersoType>= 4 && SelectedItemPersoType <=7)
	{
		var BtnUtiliser = new createjs.Bitmap("public/Boutons/Utiliser.png");
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

		BtnUtiliser.cursor ="pointer";

		var BtnEquiper = new createjs.Bitmap("public/Boutons/EquiperGris.png");
		BtnEquiper.y=H;
		contBtnsInvPerso.addChild(BtnEquiper);

		BtnEquiper.cursor ="not-allowed";

		var BtnDeposer = new createjs.Bitmap("public/Boutons/Deposer.png");
		BtnDeposer.y =0;
		contBtnsInvCase.addChild(BtnDeposer);
		BtnDeposer.addEventListener('click', function (event) {
			if (SelectedItemPerso == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", SelectedItemPerso);
				SelectedItemPerso = -1;
			}
		});
		BtnDeposer.cursor ="pointer";
	}
	else if(SelectedItemPerso!=-1 && (SelectedItemPersoType==1 || SelectedItemPersoType==2))
	{
		var BtnEquiper = new createjs.Bitmap("public/Boutons/Equiper.png");
		BtnEquiper.y=H;
		contBtnsInvPerso.addChild(BtnEquiper);
		BtnEquiper.addEventListener('click', function (event) {
			if (SelectedItemPerso == -1) {
				//alert("Selectionner Item avant de s'équiper");
			} else {
				socket.emit('INV_PERSONNAGE_CS', "EQUIPER", SelectedItemPerso);
				SelectedItemPerso = -1;
			}
		});

		BtnEquiper.cursor ="pointer";

		var BtnUtiliser = new createjs.Bitmap("public/Boutons/UtiliserGris.png");
		BtnUtiliser.y=0;
		contBtnsInvPerso.addChild(BtnUtiliser);

		BtnUtiliser.cursor ="not-allowed";		

		var BtnDeposer = new createjs.Bitmap("public/Boutons/Deposer.png");
		BtnDeposer.y =0;
		contBtnsInvCase.addChild(BtnDeposer);
		BtnDeposer.addEventListener('click', function (event) {
			if (SelectedItemPerso == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", SelectedItemPerso);
				SelectedItemPerso = -1;
			}
		});
		BtnDeposer.cursor ="pointer";
	}
	else if(SelectedItemPerso!=-1)
	{
		var BtnEquiper = new createjs.Bitmap("public/Boutons/EquiperGris.png");
		BtnEquiper.y=H;
		contBtnsInvPerso.addChild(BtnEquiper);

		BtnEquiper.cursor ="not-allowed";

		var BtnUtiliser = new createjs.Bitmap("public/Boutons/UtiliserGris.png");
		BtnUtiliser.y=0;
		contBtnsInvPerso.addChild(BtnUtiliser);

		BtnUtiliser.cursor ="not-allowed";		

		var BtnDeposer = new createjs.Bitmap("public/Boutons/Deposer.png");
		BtnDeposer.y =0;
		contBtnsInvCase.addChild(BtnDeposer);
		BtnDeposer.addEventListener('click', function (event) {
			if (SelectedItemPerso == -1) {
				//alert("Selectionner Item avant de Déposer");
			} else {
				socket.emit('INV_CASE_CS', "DEPOSER", SelectedItemPerso);
				SelectedItemPerso = -1;
			}
		});
		BtnDeposer.cursor ="pointer";
	}
	else
	{

		var BtnUtiliser = new createjs.Bitmap("public/Boutons/UtiliserGris.png");
		BtnUtiliser.y=0;
		contBtnsInvPerso.addChild(BtnUtiliser);

		var BtnEquiper = new createjs.Bitmap("public/Boutons/EquiperGris.png");
		BtnEquiper.y=H;
		contBtnsInvPerso.addChild(BtnEquiper);

		var BtnDeposer = new createjs.Bitmap("public/Boutons/DeposerGris.png");
		BtnDeposer.y = 0;
		contBtnsInvCase.addChild(BtnDeposer);

		BtnUtiliser.cursor = BtnEquiper.cursor = BtnDeposer.cursor ="not-allowed";
	}
}

function setContEquipement()
{
	if(SelectedItemEquip!=-1)
	{
		var BtnDesequiper = new createjs.Bitmap("public/Boutons/Desequiper.png");
		BtnDesequiper.y=2*H;
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
		BtnDesequiper.cursor="pointer";
	}
	else
	{
		var BtnDesequiper = new createjs.Bitmap("public/Boutons/DesequiperGris.png");
		BtnDesequiper.y=2*H;
		contBtnsInvPerso.addChild(BtnDesequiper);

		BtnDesequiper.cursor="not-allowed";
	}
}


function setContCase()
{
	if(SelectedItemCase!=-1)
	{
		var BtnRamasseObjet = new createjs.Bitmap("public/Boutons/Ramasser.png");
		BtnRamasseObjet.y=H;
		contBtnsInvCase.addChild(BtnRamasseObjet);
		BtnRamasseObjet.addEventListener('click', function (event) {
			if (SelectedItemCase == -1) {
				//alert("Selectionner Item avant de Ramasser");
			} else {
				socket.emit('INV_CASE_CS', "RAMASSER", SelectedItemCase);
				SelectedItemCase = -1;
			}
		});

		BtnRamasseObjet.cursor="pointer";
	}
	else
	{
		var BtnRamasseObjet = new createjs.Bitmap("public/Boutons/RamasserGris.png");
		BtnRamasseObjet.y=H;
		contBtnsInvCase.addChild(BtnRamasseObjet);

		BtnRamasseObjet.cursor="not-allowed";
	}

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
			//dead();
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
		BtnAtqGoules.y = 3*H;
		contBtnsInvCase.addChild(BtnAtqGoules);
		BtnAtqGoules.addEventListener('click', function(event) {
			socket.emit('ACTION_ATTAQUE_GOULE_CS');
		});
		BtnAtqGoules.cursor="pointer";
	}
	else
	{
		var BtnAtqGoules = new createjs.Bitmap("public/Boutons/ZombieGris.png");
		BtnAtqGoules.y = 3*H;
		contBtnsInvCase.addChild(BtnAtqGoules);
		BtnAtqGoules.cursor="not-allowed";
	}
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
	switch(currentCase)
	{
	case 0: labelAction.text = "";
	labelAction.text = ("WARNING : ERREUR_CASE");
	break;

	case -1: labelAction.text = "";
	labelAction.text = ("Impossible d'aller par là !");
	break;

	case -2: labelAction.text = "";
	labelAction.text = ("Plus de points de mouvements !");
	break;

	case -3: labelAction.text = "";
	labelAction.text = ("Trop de Zombies ici !");
	break;

	case -4: labelAction.text = "";
	labelAction.text = ("Maison de l'ennemi !");
	break;

	default: socket.emit('INFO_CASE_CS');
	labelAction.text="";
	labelAction.text = "";
	labelAction.text = ("Déplacement en " + currentCase.nom + "");
	socket.emit('INFO_PERSONNAGE_CS');
	break;
	}
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
	if (codeRetour == 0) {
		labelAction.text = "";
		labelAction.text = ("L'objet " + currentItem.id + " plus dans le sac ");
		SelectedItemEquip=-1;
		// quitte la fonction
		return;
	}
	if (type == "EQUIPER") {
		switch (codeRetour) {
		case 0:
			labelAction.text = "";
			labelAction.text = ("Objet pas dans le sac !");
			SelectedItemPerso=-1;
			break;

			// équipage ok
		case 1:
			labelAction.text = "";
			labelAction.text = ("Arme équipée");
			stage.update();
			socket.emit('INFO_PERSONNAGE_CS');
			break;

		case 2:
			labelAction.text = "";
			labelAction.text = ("Armure équipée");
			stage.update();
			socket.emit('INFO_PERSONNAGE_CS');
			break;

		case -1:
			labelAction.text = "";
			labelAction.text = ("Arme déja équipée");
			SelectedItemPerso=-1;
			break;

		case -2:
			labelAction.text = "";
			labelAction.text = ("Armure déja équipée");
			SelectedItemPerso=-1;
			break;

		case -3:
			labelAction.text = "";
			labelAction.text = ("Objet non équipable");
			SelectedItemPerso=-1;
			break;
		}
		socket.emit('INFO_PERSONNAGE_CS');
	} else if (type == "DEQUIPER") {
		if (codeRetour == -4)
		{
			labelAction.text = "";
			labelAction.tetx = ("Déséquipement impossible car pas équipé");
			SelectedItemEquip=-1;
		} else if (codeRetour == 1) {
			// Si déquipe arme
			// efface l'arme
			contArme.removeAllChildren();
			labelAction.text = "";
			labelAction.text = ("Arme déséquipée");
			socket.emit('INFO_PERSONNAGE_CS');		
			SelectedItemEquip=-1;
		}
		// Si déquipe armure
		else if (codeRetour == 2) {
			// efface armure
			contArmure.removeAllChildren();
			SelectedItemEquip=-1;
			labelAction.text = "";
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
	if (type == 'RAMASSER') {
		switch(codeRetour)
		{
		// erreur
		case -4:
			labelAction.text = "";
			labelAction.text = ("Erreur inconnue");
			SelectedItemCase=-1;
			break;
		case -3:
			labelAction.text = "";
			labelAction.text = ("Erreur inconnue");
			SelectedItemCase=-1;
			break;
			// poids insufisant
		case -1:
			labelAction.text = "";
			labelAction.text = ("Objet trop lourd !");
			SelectedItemCase=-1;
			break;
			// objet pas dans case
		case -2:
			labelAction.text = "";
			labelAction.text = ("Objet plus dans la salle !");
			SelectedItemCase=-1;
			break;
		case -5:
			labelAction.text = "";
			labelAction.text = ("Ramassage impossible à cause des Zombies !");
			if(DegatsG!=0)
			{
				labelAction.text +=("\n- " + DegatsG + " points de vie !");
			}
			SelectedItemCase=-1;
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		case -6:
			labelAction.text = "";
			labelAction.text = ("Ramassage d'ODD impossible ici !");
			SelectedItemCase=-1;
			// ramassage ok
		default:
			labelAction.text = "";
		labelAction.text = ("Objet ramassé");
		if(DegatsG!=0)
		{
			labelAction.text +=("\n- "+ DegatsG + " points de vie !");//\n"+ RestG + " Zombies restants");
		}
		SelectedItemCase=-1;
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
			labelAction.text = "";
			labelAction.text = ("Déséquipez avant de déposer !");
			SelectedItemPerso=-1;
			break;
		case -4:
			labelAction.text = "";
			labelAction.text = ("Erreur interne !");
			SelectedItemPerso=-1;
			break;
		case -2:
			labelAction.text = "";
			labelAction.text = ("Objet plus dans le sac !");
			SelectedItemPerso=-1;
			break;
			// dépôt ok
		default:
			labelAction.text = "";
		labelAction.text = ("Objet déposé");//\nSac : " + codeRetour + " kg");
		if(DegatsG!=0)
		{
			labelAction.text +=("\n- "+ DegatsG + " points de vie !");//\n"+ RestG + " Zombies restants");
		}
		SelectedItemPerso=-1;
		socket.emit('INFO_CASE_CS');
		socket.emit('INFO_PERSONNAGE_CS');
		stage.update();
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
socket.on('INFO_CASE_SC', function(currentCase, nbrAllies, nbrEnnemis, idSousCase) {

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
		//insereMessage("CLIENT :: nom case = " + "ERREUR_CASE");
		labelAction.text="";
		labelAction.text=("CLIENT :: nom case = " + "ERREUR_CASE");
	}
	else {

		var ProbCache, ProbFouille;
		ProbCache=(currentCase.probaCache * PersoProbaCache);
		ProbFouille=(currentCase.probaObjet * PersoProbaFouille);

		labelNbAllies.text=("Alliés dans la salle : " + nbrAllies + "");
		labelNbEnnemis.text=("Ennemis dans la salle : " + nbrEnnemis + "");
		labelNbGoules.text=("Zombies dans la salle : " + currentCase.nbrGoules + "");
		labelProbaCache.text=("Proba de Cache :              " + ProbCache + " %");
		labelProbaFouille.text=("Proba de Trouver item :       " + ProbFouille + " %");
		
		labelDescribeCase.text=currentCase.description;

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
					labelDescribeItem.text=(currentItem.nom + " (valeur : " + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
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
					SelectedItemCase=currentItem.id;
					Select = contInvCase.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
					Select.x=(num-7);
					Select.y=0;

					setContCase();

					stage.update();
				});

				imgItem.x = 7+(iPositionItemInConteneur * SpaceItem);
				imgItem.y = 4;

				contInvCase.addChild(imgItem);

				// position de l'item dans le conteneur
				iPositionItemInConteneur++;

				stage.update();
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
	
	labelFichePerso.text=(classe+"\n"+
			"Zombies : "+currentPerso.goulesMax+"\n"+
			"Attaque x "+currentPerso.multiPtsAttaque+"\n"+
			"Défense x "+currentPerso.multiPtsDefense+"\n"+
			"Cache   x "+currentPerso.multiProbaCache+"\n"+
			"Fouille x "+currentPerso.multiProbaFouille);
		
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

		BtnDefendre.cursor="not-allowed";
		BtnFouiller.cursor=BtnCacher.cursor="pointer";

		labelBonusArme.text=("( + " + PointsAttaque*0.25+" )");
		labelBonusArmure.text=("( + " + PointsDefense*0.25+" )");

		break;
	}
	
	contInvPerso.removeAllChildren();

	// tableau qui contient toutes les listes d'objets
	var TabListe=new Array();

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

	try 
	{
		// instructions à essayer
		for (var i = 0; i < TabListe[PageItemPerso].length ; i++) 
		{
			var Obj=TabListe[PageItemPerso][i];

			if(!((currentPerso.armeEquipee != null && Obj.id == currentPerso.armeEquipee.id) || 
					(currentPerso.armureEquipee != null && Obj.id == currentPerso.armureEquipee.id)) )
			{    
				// Ajout de l'image à l'ihm
				var imgItem = new createjs.Bitmap(Obj.imageName);

				imgItem.name = i;
				imgItem.cursor = "pointer";

				// Ajout de l'évenement a l'image
				// ajout d'un texte quand l'user passera la souris dessus
				imgItem.addEventListener('mouseover', function(event) {
					var currentItem = TabListe[PageItemPerso][event.target.name];
					labelDescribeItem.text=(currentItem.nom + " (valeur : " + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
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
					SelectedItemPerso=currentItem.id;
					SelectedItemPersoType=currentItem.type;
					Select = contInvPerso.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
					Select.x=(num-7);
					Select.y=0;
					// Appel de fonction pour créer les boutons liés au Perso
					setContPerso();
					stage.update();
				});

				imgItem.x = 7+(iPositionItemInConteneur * SpaceItem);
				imgItem.y = 4;
				contInvPerso.addChild(imgItem);

				// position de l'item dans le conteneur
				iPositionItemInConteneur++;

				stage.update();
			}
		}
	}
	catch(e){
		//alert("Page inexistante");
	}

	setContEquipement();

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
			if (SelectEquipement!=null)
			{
				contArme.removeChild(SelectEquipement);
				contArmure.removeChild(SelectEquipement);
			}
			SelectEquipement = contArme.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
			SelectEquipement.x=-7;
			SelectEquipement.y=-7;
			SelectedItemEquip = currentPerso.armeEquipee.id;
			setContEquipement();
			stage.update();
		});

		contArme.addEventListener('mouseover', function(event) {
			labelDescribeItem.text=(currentPerso.armeEquipee.nom + " (valeur : " + currentPerso.armeEquipee.valeur + ") " + "\nPoids : " + currentPerso.armeEquipee.poids + "\nDescription : " + currentPerso.armeEquipee.description);
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
			if (SelectEquipement!=null)
			{
				contArme.removeChild(SelectEquipement);
				contArmure.removeChild(SelectEquipement);
			}
			SelectEquipement = contArmure.addChild(new createjs.Bitmap("public/Boutons/Select.png"));
			SelectEquipement.x=-7;
			SelectEquipement.y=-7;
			SelectedItemEquip = currentPerso.armureEquipee.id;
			setContEquipement();
			stage.update();
		});

		contArmure.addEventListener('mouseover', function(event) {
			labelDescribeItem.text=(currentPerso.armureEquipee.nom + " (valeur : " + currentPerso.armureEquipee.valeur + ") " + "\nPoids : " + currentPerso.armureEquipee.poids + "\nDescription : " + currentPerso.armureEquipee.description);
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
		// inverse la liste des messages
		ListeMessages.reverse();
		labelDernierMessage.text="";
		labelDernierMessage.text=ListeMessages[0];
	}
	else
	{
		labelDernierMessage.text="";
		ListeMessages=null;
	}

	if(ListeMessages!=null && currentPerso.nbrNvMsg >0)
	{
		labelNombreNouvMsg.text="";
		labelNombreNouvMsg.text=("( "+ currentPerso.nbrNvMsg + " )");

		var BtnMessages = new createjs.Bitmap("public/Boutons/Messages.png");
		BtnMessages.y=H;
		contBtnsListes.addChild(BtnMessages);
		BtnMessages.addEventListener('click', function(event) {
			if(ListeMessages != null)
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
	else if(ListeMessages!=null && currentPerso.nbrNvMsg ==0)
	{
		labelNombreNouvMsg.text="";

		var BtnMessages = new createjs.Bitmap("public/Boutons/MessagesVide.png");
		BtnMessages.y=H;
		contBtnsListes.addChild(BtnMessages);
		BtnMessages.addEventListener('click', function(event) {
			if(ListeMessages != null)
			{
				message(ListeMessages);
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
		BtnMessages.y=H;
		contBtnsListes.addChild(BtnMessages);

		BtnMessages.cursor="not-allowed";
	}

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
	switch(codeRetour)
	{
	case 1: 
		labelAction.text="";
		labelAction.text=("Objet utilisé !");
		socket.emit('INFO_PERSONNAGE_CS');
		break;
	case -1:
		labelAction.text="";
		labelAction.text=("Objet plus dans le sac !");
		break;
	case -2:
		labelAction.text="";
		labelAction.text=("Objet inutilisable !");
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
socket.on('PERSONNAGE_MODE_SC', function (mode, reponse, degatsInfliges, nbrGoulesA) 
{
	switch(reponse)
	{
		case 1: 
			labelAction.text = "";
			labelAction.text = ("Changement de mode ok !");
			socket.emit('INFO_PERSONNAGE_CS');
			break;
		case 0 : 
			labelAction.text = "";
			labelAction.text = ("Changement de mode raté !\nErreur interne");
			break;
		case -4 : 
			labelAction.text = "";
			labelAction.text = ("Changement de mode mode raté !\nDéja dans ce mode !");
			break;
		case -5: 
			labelAction.text = "";
			labelAction.text = ("Changement de mode raté !");
			if(degatsInfliges!=0)
			{
				labelAction.text +=("\nMais blessé (" + degatsInfliges + ")"); 
			}
			
			if(nbrGoulesA==1)
			{
				labelAction.text +=("\npar " + nbrGoulesA + " Zombie !");
			}
			else if(nbrGoulesA>1)
			{
				labelAction.text +=("\npar " + nbrGoulesA + " Zombies !");
			}
			break;
		case -10:
			labelAction.text = "";
			labelAction.text = ("Changement de mode raté !\nPoints d'action insuffisants !");
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
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
	
	labelAction.text="";
	
	//alert("reponse : " + reponse + "degats : " + degatsInfliges);
	switch(reponse)
	{
	case  1 : 
		labelAction.text =("Fouille rapide réussie !\n Objet découvert :\n" + item.nom);
		
		if (ajouteAuSac == 0)
		{
			labelAction.text += "\nAjouté à la case !";
		}
		else if (ajouteAuSac == 0)
		{
			labelAction.text += "\nAjouté au sac !";
		}
		
		if(nbrEnnemisDecouverts==1)
		{
			labelAction.text +=("\n" + nbrEnnemisDecouverts + " Ennemi découvert !");
		}
		else if(nbrEnnemisDecouverts>1)
		{
			labelAction.text +=("\n" + nbrEnnemisDecouverts + " Ennemis découverts !");
		}
		
		if(degatsInfliges!=0)
		{
			labelAction.text +=("\nMais blessé (" + degatsInfliges + ")"); 
		}
		
		if(nbrGoulesA==1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " Zombie !");
		}
		else if(nbrGoulesA>1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " Zombies !");
		}
		break;
	case  0 : 
		labelAction.text = "Erreur interne";
		break;
	case -1 : 
		labelAction.text = "Fouille rapide ratée !";
		break;
	case -5 : 
		labelAction.text = "Fouille rapide ratée !";
		if(degatsInfliges!=0)
		{
			labelAction.text +=("\nEt blessé (" + degatsInfliges + ")"); 
		}
		if(nbrGoulesA==1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " Zombie !");
		}
		else if(nbrGoulesA>1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " Zombies !");
		}
		break;
	case -10 :
		labelAction.text = "Points d'action insuffisants !";
		break;
	}
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
	labelAction.text="";
	switch(codeRetour)
	{
	case 0: 
		labelAction.text=("erreur interne");
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
		}
		break;
	case -1:
		labelAction.text=("Ennemi plus ici !");
		break;
	case -5:
		labelAction.text=("Attaque ratée !");
		if(degatsInfliges!=0)
		{
			labelAction.text +=("\nEt blessé (" + degatsRecusG + ")"); 
		}
		if(nbrGoulesA==1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " Zombie !");
		}
		else if(nbrGoulesA>1)
		{
			labelAction.text +=("\npar " + nbrGoulesA + " Zombies !");
		}
		break;
	case -10:
		labelAction.text=("Points d'action insuffisants");
		break;
	}
	stage.update();
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
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
		labelAction.text="";
		labelAction.text=("2 Zombies tuées ! -" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 1: 
		labelAction.text="";
		labelAction.text=("1 Zombie tuée ! -" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case 0:
		labelAction.text="";
		labelAction.text=("Attaque de Zombie(s) : erreur interne");
		break;

	case -1:
		labelAction.text="";
		labelAction.text=("Attaque de Zombie(s) échouée ! -" + degatsSubis + " points de vie");
		socket.emit('INFO_PERSONNAGE_CS');
		break;

	case -2:
		labelAction.text="";
		labelAction.text=("Pas de Zombie dans la salle !");
		break;
	}
	stage.update();
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
				imgPersoAllie.x = iPositionPersoInConteneur * SpacePerso;
				// imgPersoAllie.y = 2;
				imgPersoAllie.cursor= "normal";
			}
			else if(persoA.competence=="chercheur")
			{
				imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Chercheur64.png");
				imgPersoAllie.x = iPositionPersoInConteneur * SpacePerso;
				// imgPersoAllie.y = 2;
				imgPersoAllie.cursor= "normal";
			}
			else if(persoA.competence=="explorateur")
			{
				imgPersoAllie = new createjs.Bitmap("public/spritesheets/persos/Explorateur64.png");
				imgPersoAllie.x = iPositionPersoInConteneur * SpacePerso;
				// imgPersoAllie.y = 2;
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
					labelDescribePerso.text += "\nArme Equipée : " + currentPerso.armeEquipee.nom + " " + currentPerso.armeEquipee.valeur;
				}
				else
				{
					labelDescribePerso.text += "\nPas d'arme équipée";
				}

				if(currentPerso.armureEquipee!=null)
				{
					labelDescribePerso.text += "\nArmure Equipée : " + currentPerso.armureEquipee.nom + " " + currentPerso.armureEquipee.valeur;
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
		stage.update();
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
				imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Brute64.png");
				imgPersoEnnemi.x = iPositionPersoInConteneur * SpacePerso;
				imgPersoEnnemi.y = 2 ; 
				imgPersoEnnemi.cursor= "pointer";
			}
			else if(persoE.competence=="chercheur")
			{
				imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Chercheur64.png");
				imgPersoEnnemi.x = iPositionPersoInConteneur * SpacePerso;
				imgPersoEnnemi.y = 2 ; 
				imgPersoEnnemi.cursor= "pointer";
			}
			else if(persoE.competence=="explorateur")
			{
				imgPersoEnnemi = new createjs.Bitmap("public/spritesheets/persos/Explorateur64.png");
				imgPersoEnnemi.x = iPositionPersoInConteneur * SpacePerso;
				imgPersoEnnemi.y = 2 ; 
				imgPersoEnnemi.cursor= "pointer";
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
					labelDescribePerso.text +=("\nArme Equipée : " + currentPerso.armeEquipee.nom);
				}
				else
				{
					labelDescribePerso.text += "\nPas d'arme équipée";
				}


				if(currentPerso.armureEquipee!=null)
				{
					labelDescribePerso.text +=("\nArmure Equipée :" + currentPerso.armureEquipee.nom);
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
				SelectedPerso=currentPerso.id;
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
	catch(e){
		//alert("Page inexistante");
	}

	stage.update();
	socket.emit('INFO_PERSONNAGE_CS');
		});

socket.on('GET_DATE_SC', function (dateLancementSrv)
	{
		labelLancementServeur.text="";
		labelLancementServeur.text=dateLancementSrv;
	});



//Creer bouton tout simple :
//var BtnSaveBD = stage.addChild(new Button("SAVE BD", ColorBtn));