var canvasElement;
var stage, output;
var context;

var mouseTarget;        // the display object currently under the mouse, or being dragged
var dragStarted;        // indicates whether we are currently in a drag operation
var offset;

onload = initialize;	
var listeItemsCase;
var listeItemsPerso;
var SelectedItemCase=-1;
var SelectedItemPerso=-1;
var SelectedItemEquip=-1;

function initialize() {

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
	var OrdBtn=110;
	
	// Couleur des boutons
	var ColorBtn="#9F0000";
	var ColorPad="#313131";
	
	// Police des labels
	var PoliceLabel="14px monospace";
	
	// Couleur des labels
	var ColorLabel = "#fff";
	
	// Espacement items
	var SpaceItem = 30;
	
	// Placement Conteneur ItemCase
	var _ContItemCaseX = 500;
	var _ContItemCaseY = 550;
	
	// Dimension Conteneur ItemCase
	var _ContItemCaseH = 200
	var _ContItemCaseW = 200;
	
	// Placement label ItemCase
	var _labelItemCaseX = _ContItemCaseX;
	var _labelItemCaseY = _ContItemCaseY - 20;
	
	// Placement label Mode Perso
	var _labelModeX = _ContItemCaseX;
	var _labelModeY = 10;
	
	// Placement label Arme
	var _labelArmeX = _ContItemCaseX;
	var _labelArmeY = _labelModeY + 20;
	
	// Placement label Armure
	var _labelArmureX = _ContItemCaseX;
	var _labelArmureY = _labelArmeY + 20;
	
	// Placement label ItemPerso
	var _labelItemPersoX = _ContItemCaseX;
	var _labelItemPersoY = _labelArmureY + 20;
	
	// Placement Conteneur ItemPerso
	var _ContItemPersoX = _ContItemCaseX;
	var _ContItemPersoY = _labelItemPersoY + 20;
	
	// Dimension Conteneur ItemPerso
	var _ContItemPersoH = 200;
	var _ContItemPersoW = 200;
	
	// Placement label Points de vie
	var _labelPtsVX = 160;
	var _labelPtsVY = 10;
	
	// Placement label Points d'action
	var _labelPtsAX = _labelPtsVX;
	var _labelPtsAY = _labelPtsVY + 20;
	
	// Placement label Points de mouvements
	var _labelPtsMX = _labelPtsVX;
	var _labelPtsMY= _labelPtsAY + 20;
	
	// Placement label Points d'Attaque
	var _labelPtsAtqX = _labelPtsVX;
	var _labelPtsAtqY = _labelPtsMY + 20;
	
	// Placement label Points de Défense
	var _labelPtsDefX = _labelPtsVX;
	var _labelPtsDefY = _labelPtsAtqY +20;
	
	// Placement label Poids du Sac
	var _labelPoidsSacX = _labelPtsVX;
	var _labelPoidsSacY = _labelPtsDefY + 20; 
	
	// Placement label Description Item
	var _labelDescribeItemX = 500;
	var _labelDescribeItemY = 600;
	
	// Placement label Nombre d'Aliés
	var _labelNbAliesX = 270;
	var _labelNbAliesY = _labelItemCaseY;
	
	// Placement label Nombre d'Ennemis
	var _labelNbEnnemisX = _labelNbAliesX;
	var _labelNbEnnemisY = _labelNbAliesY + 20;
	
	// Placement label Nombre de Goules
	var _labelNbGoulesX = _labelNbAliesX;
	var _labelNbGoulesY = _labelNbAliesY + 40;
	
	// Placement label Probabilité de Cache
	var _labelProbaCacheX = _labelNbAliesX;
	var _labelProbaCacheY = _labelNbAliesY + 60;
	
	// Placement label Probabilité de Fouille
	var _labelProbaFouilleX = _labelNbAliesX;
	var _labelProbaFouilleY = _labelNbAliesY + 80;
	
	// Placement Conteneur ArmeEquip
	var _ContArmeX = _ContItemCaseX + 120;
	var _ContArmeY = _labelArmeY;
	
	// Dimension Conteneur ArmeEquip
	var _ContArmeH = 200;
	var _ContArmeW = 200;
	
	// Placement Conteneur ArmureEquip
	var _ContArmureX = _ContItemCaseX + 135;
	var _ContArmureY = _labelArmureY;
	
	// Dimension Conteneur ArmureEquip
	var _ContArmureH = 200;
	var _ContArmureW = 200;
	
	// label.lineHeight
	var _LineHeight = 15;
	
	// label.textBaseline
	var _TextBaseline = "top";
	
	//*********** Fin de la partie design **************
	// ******************************************
	
	// ************************************************
	// * Récupération du canvas et création contexte **
	// ************************************************
	canvasElement = document.getElementById("myCanvas");
    stage = new createjs.Stage(canvasElement);
    // enabled mouse over / out events
    stage.enableMouseOver(20);
	context = canvasElement.getContext("2d");
	
	// enable touch interactions if supported on the current device:
    createjs.Touch.enable(stage);
	
    // application du background
	var background = new createjs.Bitmap("public/Background.jpg");
    background.image.onload = setImg(background,0,0);
  
    // insertion de la map
    var map = new createjs.Bitmap("public/images/map.png");
    map.image.onload = setImg(map, 170, 130);
	
    // creation des conteneurs
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
	
	
    // Teste la présence de HTML5 et de drag & drop
    /*if (Modernizr.draganddrop) {
    	
    	} else {
    	  alert("! Vous devez passez en HTML5 !");
    	}*/
    
    
    // ******************************************
	//********** Déclaration des labels *******
    // ******************************************
    
	var txtSalle, txtObjet, txtCase, txtObjetEquipe, 
	labelObjetCase,	labelInventaire, labelDescribeItem, labelMode,
	labelPtsMove, labelPtsAction, labelPtsVie, labelPoidsSac, labelPtsAtq, labelPtsDef,
	labelNbAlies, labelNbEnnemis, labelNbGoules, labelProbaCache, labelProbaFouille;
	
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
	labelNbAlies.text="Aliés dans la salle : ?";
	
	labelNbEnnemis = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelNbEnnemis.lineHeight = _LineHeight;
	labelNbEnnemis.textBaseline = _TextBaseline;
	labelNbEnnemis.x = _labelNbEnnemisX;
	labelNbEnnemis.y = _labelNbEnnemisY;
	labelNbEnnemis.text="Ennemis dans la salle : ?";
	
	labelNbGoules = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelNbGoules.lineHeight = _LineHeight;
	labelNbGoules.textBaseline = _TextBaseline;
	labelNbGoules.x = _labelNbGoulesX;
	labelNbGoules.y = _labelNbGoulesY;
	labelNbGoules.text="Goules dans la salle : ?";
	
	labelProbaCache = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelProbaCache.lineHeight = _LineHeight;
	labelProbaCache.textBaseline = _TextBaseline;
	labelProbaCache.x = _labelProbaCacheX;
	labelProbaCache.y = _labelProbaCacheY;
	labelProbaCache.text="Proba de Cache : ? %";
	
	labelProbaFouille = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelProbaFouille.lineHeight = _LineHeight;
	labelProbaFouille.textBaseline = _TextBaseline;
	labelProbaFouille.x = _labelProbaFouilleX;
	labelProbaFouille.y = _labelProbaFouilleY;
	labelProbaFouille.text="Proba de Trouver item : ? %";
	
	txtSalle = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtSalle.lineHeight = _LineHeight;
	txtSalle.textBaseline = _TextBaseline;
	txtSalle.x = 10;
	txtSalle.y = 620;
	
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
	var BtnHaut = stage.addChild(new ButtonMove("H", ColorPad));
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
		});
	
	BtnHaut.x = BtnBas.x = 50;
	BtnGauche.y = BtnDroite.y = 40;
	
	// ******************************************
	// ************ Boutons d'action ************
	// ******************************************
	var BtnEvents = stage.addChild(new Button("Historique", ColorBtn));
	BtnEvents.y = OrdBtn;
	/*BtnEvents.addEventListener('click', function(event) {
		
		});	*/
	
	var BtnUtiliser = stage.addChild(new Button("Utiliser", ColorBtn));
	BtnUtiliser.y = BtnEvents.y + H;
	/*BtnUtiliser.addEventListener('click', function(event) {
		
		});	*/
	
	var BtnRamasseObjet = stage.addChild(new Button("Ramasser Item", ColorBtn));
	BtnRamasseObjet.y = BtnUtiliser.y + H;
	BtnRamasseObjet.addEventListener('click', function(event) {
		// exemple : ramsser l'objet d'id 1
		if(SelectedItemCase==-1)
			{
				alert("Selectionner Item avant de Ramasser")
			}
		else
			{
				socket.emit('INV_CASE_CS', "RAMASSER", SelectedItemCase);
				SelectedItemCase=-1;
			}	
		});
	
	var BtnDeposer = stage.addChild(new Button("Déposer Item", ColorBtn));
	BtnDeposer.y = BtnRamasseObjet.y + H;
	BtnDeposer.addEventListener('click', function(event) {
		if(SelectedItemPerso==-1)
		{
			alert("Selectionner Item avant de Déposer")
		}
		else
		{
			socket.emit('INV_CASE_CS', "DEPOSER", SelectedItemPerso);
			SelectedItemPerso=-1;
		}	
		});
	
	var BtnEquiper = stage.addChild(new Button("Équiper Item", ColorBtn));
	BtnEquiper.y = BtnDeposer.y + H;
	BtnEquiper.addEventListener('click', function(event) {
		alert("click button");
		if(SelectedItemPerso==-1)
		{
			alert("Selectionner Item avant de s'équiper");
		}
		else
		{
			// Bugg dans la demande au serveur au bout de plusieurs fois
			
			alert("Demande serveur (avant)");
			socket.emit('INV_PERSONNAGE_CS', "EQUIPER", SelectedItemPerso);
			alert("Demande serveur (apres)");
		}
		
		});
	
	var BtnDesequiper = stage.addChild(new Button("Déséquiper Item", ColorBtn));
	BtnDesequiper.y = BtnEquiper.y + H;
	BtnDesequiper.addEventListener('click', function(event) {
		socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", SelectedItemEquip);
		});
	
	var BtnAttaquer = stage.addChild(new Button("Attaquer...", ColorBtn));
	BtnAttaquer.y = BtnDesequiper.y + H;
	/*BtnAttaquer.addEventListener('click', function(event) {
		
		});	*/
	
	var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
	BtnFouiller.y = BtnAttaquer.y + H;
	/*BtnFouiller.addEventListener('click', function(event) {
		
		});	*/
	
	var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
	BtnCacher.y = BtnFouiller.y + H;
	/*BtnCacher.addEventListener('click', function(event) {
		
		});	*/
	
	var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
	BtnDefendre.y = BtnCacher.y + H;
	/*BtnDefendre.addEventListener('click', function(event) {
		
		});	*/
	
	stage.update();

	BtnEvents.x = BtnUtiliser.x = BtnRamasseObjet.x = BtnDeposer.x = BtnEquiper.x = BtnDesequiper.x = BtnAttaquer.x = BtnFouiller.x = BtnCacher.x = BtnDefendre.x = AbsBtn;
	
	// ******************************************
	// *********** INITIALISATION ***************
	// ******************************************
	 
	// AFFICHAGE DE L'IVENTAIRE DE CASE ET PERSO
	socket.emit('INFO_PERSONNAGE_CS');
	socket.emit('INFO_CASE_CS');
	stage.update();
	
	// ******************************************
	// ********* RECEPTION SERVEUR **************
	// ******************************************
	
	/*
	 * RECEPTION DU NOUVEL ID SALLE DU PERSONNAGE
	 */
	socket.on('MOVE_PERSONNAGE_SC', function(currentCase) {
		if (currentCase == "ERREUR_CASE")
			{
			txtSalle.text="";
			txtSalle.text=("CLIENT : nom salle = " + "ERREUR_CASE");
			}
		else if (currentCase == "ERREUR_MOVE")
		{
			txtSalle.text="";
			txtSalle.text=("Impossible d'aller par là !");

		}
		else {
			socket.emit('INFO_CASE_CS');
			txtSalle.text="";
			txtSalle.text=("Déplacement en salle " + currentCase.nom + "");
			//modifieIdSalle(currentCase.nom, currentCase.id);
			socket.emit('INFO_PERSONNAGE_CS');
		}
		stage.update();
	});

	/*
	 * RECEPTION D'UN REPONSE POUR LA DEMANDE DE MODIF
	 * D'OBJET DANS LA CASE
	 */
	socket.on('INV_CASE_SC', function(type, id_item, codeRetour) {
		if (type == 'RAMASSER') {
			// erreur
			if (codeRetour == -3) {
				txtObjet.text="";
				txtObjet.text=("Erreur inconnue");
			}
			// poids insufisant
			else if (codeRetour == -1) {
				txtObjet.text="";
				txtObjet.text=("Impossible de ramasser l'objet : poids max atteint !");
			}
			// objet pas dans case
			else if (codeRetour == -2) {
				txtObjet.text="";
				txtObjet.text=("L'objet " + id_item + " n'est plus dans la salle !");
			}
			// ramassage ok
			else {
				txtObjet.text="";
				txtObjet.text=("Item ramassé ! Sac : " + codeRetour +" kg");
				socket.emit('INFO_PERSONNAGE_CS');
				socket.emit('INFO_CASE_CS');
			}
		}
			stage.update();
		if (type == 'DEPOSER') {
			// erreur
			if (codeRetour == -3) {
				txtObjet.text=("Erreur inconnue");
			}
			// objet pas dans sac (! pas normal)
			else if (codeRetour == -2) {
				txtObjet.text=("L'item " + id_item + " n'est plus dans le sac ");
				
			}
			// dépôt ok
			else {
				txtObjet.text=("Item déposé ! Sac : " + codeRetour + " kg");
				socket.emit('INFO_PERSONNAGE_CS');
				socket.emit('INFO_CASE_CS');
				stage.update();
			}
		}
			stage.update();
	});

	/*
	 * RECEPTION DES INFORMATIONS SUR LA CASE
	 * 
	 * @method Reception
	 */
	socket.on('INFO_CASE_SC', function(currentCase) {
		if (currentCase == "ERREUR_CASE")
		{
			//insereMessage("CLIENT :: nom case = " + "ERREUR_CASE");
			txtCase.text="";
			txtCase.text=("CLIENT :: nom case = " + "ERREUR_CASE");
		}
		else {
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
					labelDescribeItem.text=("Nom : " + currentItem.nom + " (" + currentItem.valeur + ") " + "\nDescription : " + currentItem.description);
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
								
				// Update l'ihm
				stage.update();
			}
		}
		stage.update();
	});

	/*
	 * RECEPTION DES INFORMATIONS SUR LE PERSONNAGE
	 */
	socket.on('INFO_PERSONNAGE_SC', function(currentPerso) {
		
		var PoidsSac=0;
		
		labelPtsVie.text=("Points de vie :							" + currentPerso.ptSante + "/" + currentPerso.ptSanteMax);
		labelPtsAction.text=("Points d'action :	 			" + currentPerso.ptActions + "/" + currentPerso.ptActionsMax);
		labelPtsMove.text=("Points de mouvement : " + currentPerso.ptDeplacement + "/" + currentPerso.ptDeplacementMax);
		//labelMode.text=("Mode du Perso :" + currentPerso.mode + "");
		labelMode.text=("Mode du Perso :" +  + "");
		labelPtsAtq.text=("Points d'attaque :      " +  + "");
		labelPtsDef.text=("Points de défense :     " +  + "");
		
		
			labelInventaire.text="";
			labelInventaire.text="Inventaire du perso :";
	
		// CLear de la liste des items de case
			listeItemsPerso = new Array();
			contInvPerso.removeAllChildren();
		
			for (var i = 0; i < currentPerso.sacADos.length; i++) {
				
				// mise de l'item dans une variable
				var item = currentPerso.sacADos[i];
				
				// Ajout de l'item à la liste
				listeItemsPerso.push(item);
				
				// Calcul du poids du sac
				PoidsSac+=item.poids;
				
				// Ajout de l'image à l'ihm
				var imgItem = new createjs.Bitmap(item.imageName);
				
				// ajout d'un texte quand l'user passera la souris dessus
				imgItem.name = i;
				imgItem.cursor = "pointer";
				
				// Ajout de l'évenement a l'image
				imgItem.addEventListener('mouseover', function(event) {
					var currentItem = listeItemsPerso[event.target.name];
					labelDescribeItem.text=("Nom : " + currentItem.nom + " (" + currentItem.valeur + ") " + "\nDescription : " + currentItem.description);
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
				imgItem.x = i * SpaceItem;
				contInvPerso.addChild(imgItem);
				
				// Update l'ihm
				stage.update();
			}
			
			// Affichage label poids du sac
			labelPoidsSac.text=("Poids du sac :        " + PoidsSac + "/" + currentPerso.poidsMax);
			
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
	socket.on('INV_PERSONNAGE_SC', function(type, currentItem, codeRetour) {
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
	});
	
	stage.update();
}

function setImg(img,X,Y) {
    stage.addChild(img);
    img.x = X;
    img.y = Y;
    stage.update();
}
