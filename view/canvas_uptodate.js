var canvasElement;
var stage, output;
var context;

var mouseTarget;        // the display object currently under the mouse, or being dragged
var dragStarted;        // indicates whether we are currently in a drag operation
var offset;

onload = initialize;	
var listeItemsCase;
var listeItemsPerso;

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
	var ColorBtn="#A9A9A9";
	
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
	
	// Placement Conteneur ItemPerso
	var _ContItemPersoX = _ContItemCaseX;
	var _ContItemPersoY = 100;
	
	// Dimension Conteneur ItemPerso
	var _ContItemPersoH = 200;
	var _ContItemPersoW = 200;
	
	// Placement label ItemPerso
	var _labelItemPersoX = _ContItemPersoX;
	var _labelItemPersoY = _ContItemPersoY - 20;
	
	// Placement label Points de vie
	var _labelPtsVX = 160;
	var _labelPtsVY = 10;
	
	// Placement label Points d'action
	var _labelPtsAX = _labelPtsVX;
	var _labelPtsAY = _labelPtsVY + 35;
	
	// Placement label Points de mouvements
	var _labelPtsMX = _labelPtsVX;
	var _labelPtsMY= _labelPtsAY + 35;
	
	// Placement label Arme
	var _labelArmeX = _labelItemPersoX ;
	var _labelArmeY = 10;
	
	// Placement label Armure
	var _labelArmureX = _labelItemPersoX;
	var _labelArmureY = _labelArmeY + 35;
	
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
    /*stage.addChild(background);
    stage.update();   */
    
    // insertion de la map
    var map = new createjs.Bitmap("public/images/map.png");
    map.image.onload = setImg(map, 170, 130);
    /*stage.addChild(map);
    stage.update(); */
	
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
	
    // Teste la présence de HTML5 et de drag & drop
    if (Modernizr.draganddrop) {
    	
    	} else {
    	  alert("! Vous devez passez en HTML5 !");
    	}
    
    // ******************************************
    // Exemple de Mouse Over & Mouse Out
    // ******************************************

    /*BtnInfoCase.addEventListener('mouseover', function(event){
		console.log("mouseover");
	},false);
	BtnInfoCase.addEventListener('mouseout', function(event){
		console.log("out");
	},false);*/
    
    // ******************************************
    // Exemple de drag & drop
    // ******************************************
    
    	// keep tracking the mouse even when it leaves the canvas
    stage.mouseMoveOutside = true; 
    
    /*var DragText = stage.addChild(new createjs.Text("", "18px monospace", ColorLabel));
	DragText.lineHeight = _LineHeight;
	DragText.textBaseline = _TextBaseline;
	DragText.x = 30;
	DragText.y = 500;
    
    var container = new createjs.Container();
    stage.addChild(container);
    
    var circle = new createjs.Shape();
	circle.graphics.beginFill("white").drawCircle(400, 400, 50);
    
	container.addChild(circle);
	circle.cursor = "pointer";
	
	container.addEventListener('mouseover', function(event){
		DragText.text=("Voici une description de l'objet survolé :");
		stage.update();
	},false);
	
	container.addEventListener('mouseout', function(event){
		DragText.text="";
		stage.update();
	},false);
	
	container.on('mousedown', function(evt) {
		circle.cursor = "pointer";
        this.parent.addChild(this);
        this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
	});
	
	container.on("pressmove", function(evt) {
		circle.cursor = "pointer";
        this.x = evt.stageX+ this.offset.x;
        this.y = evt.stageY+ this.offset.y;
        // indicate that the stage should be updated on the next tick:
        stage.update();
	});*/
    
    /*var shape = new createjs.Shape();
    shape.alphs = 0.5;
    shape.graphics.beginFill("#FFFFFF").drawRect(0, 0, canvasElement.width, 110);
    stage.addChild(shape);
    stage.update();*/

	
    // ******************************************
	//********** Déclaration des labels *******
    // ******************************************
    
	var demandeDeplacement, txtSalle, txtObjet, txtCase, txtObjetCase, 
	txtPerso, txtListeObjet, txtObjetPerso, txtInventaire, txtDeposer,
	txtObjetEquipe, labelObjetCase, labelInventaire;
	
	labelObjetCase = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelObjetCase.lineHeight = _LineHeight;
	labelObjetCase.textBaseline = _TextBaseline;
	labelObjetCase.x = _labelItemCaseX;
	labelObjetCase.y = _labelItemCaseY;
	
	labelInventaire = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelInventaire.lineHeight = _LineHeight;
	labelInventaire.textBaseline = _TextBaseline;
	labelInventaire.x = _labelItemPersoX;
	labelInventaire.y = _labelItemPersoY;
	
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
	labelPtsVie.text="Points de vie :							5/10";
	
	labelPtsAction = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsAction.lineHeight = _LineHeight;
	labelPtsAction.textBaseline = _TextBaseline;
	labelPtsAction.x = _labelPtsAX;
	labelPtsAction.y = _labelPtsAY;
	labelPtsAction.text="Points d'action :	 			2/5";
	
	labelPtsMove = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	labelPtsMove.lineHeight = _LineHeight;
	labelPtsMove.textBaseline = _TextBaseline;
	labelPtsMove.x = _labelPtsMX;
	labelPtsMove.y = _labelPtsMY;
	labelPtsMove.text="Points de mouvement : 3/8";
	
	demandeDeplacement = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	demandeDeplacement.lineHeight = _LineHeight;
	demandeDeplacement.textBaseline = _TextBaseline;
	demandeDeplacement.x = 10;
	demandeDeplacement.y = 150;
	
	txtSalle = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtSalle.lineHeight = _LineHeight;
	txtSalle.textBaseline = _TextBaseline;
	txtSalle.x = 10;
	txtSalle.y = 620;
	
	txtObjet = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtObjet.lineHeight = _LineHeight;
	txtObjet.textBaseline = _TextBaseline;
	txtObjet.x = 10;
	txtObjet.y = 190;
	
	txtCase = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtCase.lineHeight = _LineHeight;
	txtCase.textBaseline = _TextBaseline;
	txtCase.x = 400;
	txtCase.y = 190;
	
	txtObjetCase = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtObjetCase.lineHeight = _LineHeight;
	txtObjetCase.textBaseline = _TextBaseline;
	txtObjetCase.x = txtCase.x;
	txtObjetCase.y = txtCase.y + 20;
	
	txtObjetEquipe = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtObjetEquipe.lineHeight = _LineHeight;
	txtObjetEquipe.textBaseline = _TextBaseline;
	txtObjetEquipe.x = 10;
	txtObjetEquipe.y = txtObjet.y + 40;
	
	txtObjetPerso = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtObjetPerso.lineHeight = _LineHeight;
	txtObjetPerso.textBaseline = _TextBaseline;
	txtObjetPerso.x = 10;
	txtObjetPerso.y = txtObjet.y + 40;
	
	txtInventaire = stage.addChild(new createjs.Text("", PoliceLabel, ColorLabel));
	txtInventaire.lineHeight = _LineHeight;
	txtInventaire.textBaseline = _TextBaseline;
	txtInventaire.x = 700;
	txtInventaire.y = txtObjet.y + 20;
	
	// ******************************************
	// ** Création des boutons de déplacement ***
	// ******************************************
	var BtnHaut = stage.addChild(new ButtonMove("H", ColorBtn));
	BtnHaut.y = 10;
	BtnHaut.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
		//alert("Go Up !");
		//console.log("Haut");
		demandeDeplacement.text = "Demande d'aller vers le haut";
		});
		
	var BtnBas = stage.addChild(new ButtonMove("B", ColorBtn));
	BtnBas.y = BtnHaut.y + 60;
	BtnBas.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
		//alert("Go Down !");
		demandeDeplacement.text = "Demande d'aller vers le bas";
		});
	
	var BtnGauche = stage.addChild(new ButtonMove("G", ColorBtn));
	BtnGauche.x = 10;
	BtnGauche.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
		//alert("Go Left !");
		demandeDeplacement.text = "Demande d'aller vers la gauche";
		});
	
	var BtnDroite = stage.addChild(new ButtonMove("D", ColorBtn));
	BtnDroite.x = BtnGauche.x + 60;
	BtnDroite.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'EST');
		//alert("Go Right !");
		demandeDeplacement.text = "Demande d'aller vers la droite";
		});
	
	BtnHaut.x = BtnBas.x = 40;
	BtnGauche.y = BtnDroite.y = 40;
	
	// ******************************************
	// ************ Boutons d'action ***********
	// ******************************************
	
	var BtnEvents = stage.addChild(new Button("Événements passés", ColorBtn));
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
		socket.emit('INV_CASE_CS', "RAMASSER", 1);
		});
	
	var BtnDeposer = stage.addChild(new Button("Déposer Item", ColorBtn));
	BtnDeposer.y = BtnRamasseObjet.y + H;
	/*BtnDeposer.addEventListener('click', function(event) {
		
		});	*/
	
	var BtnEquiper = stage.addChild(new Button("Équiper Item", ColorBtn));
	BtnEquiper.y = BtnDeposer.y + H;
	BtnEquiper.addEventListener('click', function(event) {
		//alert("click");
		socket.emit('INV_PERSONNAGE_CS', "EQUIPER", 1);
		});
	
	var BtnDesequiper = stage.addChild(new Button("Déséquiper Item", ColorBtn));
	BtnDesequiper.y = BtnEquiper.y + H;
	BtnDesequiper.addEventListener('click', function(event) {
		socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", 3);
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
			//insereMessage("CLIENT : nom salle = " + "ERREUR_CASE");
			txtSalle.text="";
			txtSalle.text=("CLIENT : nom salle = " + "ERREUR_CASE");
			}
		else if (currentCase == "ERREUR_MOVE")
		{
			//insereMessage("CLIENT : nom salle = " + "impossible d'aller par là !");
			txtSalle.text="";
			txtSalle.text=("CLIENT : nom salle = " + "impossible d'aller par là !");

		}
		else {
			//insereMessage("CLIENT : nom salle = " + currentCase.nom);
			socket.emit('INFO_CASE_CS');
			txtSalle.text="";
			txtSalle.text=("CLIENT : nom salle = " + currentCase.nom + "");
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
				//insereMessage("Erreur inconnue");
				txtObjet.text="";
				txtObjet.text=("Erreur inconnue");
			}
			// poids insufisant
			else if (codeRetour == -1) {
				//insereMessage("Impossible de ramasser l'objet : poids max atteint");
				txtObjet.text="";
				txtObjet.text=("Impossible de ramasser l'objet : poids max atteint !");
			}
			// objet pas dans case
			else if (codeRetour == -2) {
				//insereMessage("L'objet " + id_item + " n'est plus dans la salle ");
				txtObjet.text="";
				txtObjet.text=("L'objet " + id_item + " n'est plus dans la salle !");
			}
			// ramassage ok
			else {
				//insereMessage("Objet ramassé ! ");
				txtObjet.text="";
				txtObjet.text=("Item ramassé ! Poids total du sac : " + codeRetour);;
				
				// modifier l'ihm : inventaire du perso et inventaire de case
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
				txtObjet.text=("Item déposé ! Poids total du sac : " + codeRetour);

				// modifier l'ihm : inventaire du perso et inventaire de case
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
				
				// Ajout de l'évenement a l'image
				imgItem.addEventListener('mouseover', function(event) {
					var currentItem = listeItemsCase[event.target.name];
					alert("Nom : " + currentItem.nom + " (" + currentItem.valeur + ") " + "\nDescription : " + currentItem.description);
				});	
				
				//Placement de l'image et ajout au conteneur
				//imgItem.image.onload = setImg(imgItem,200+(i+1)*30,50);
				imgItem.x = i * SpaceItem;
				contInvCase.addChild(imgItem);
								
				// Update l'ihm
				stage.update();
			}
			//insereMessage("************************************");
		}
		stage.update();
	});

	/*
	 * RECEPTION DES INFORMATIONS SUR LE PERSONNAGE
	 */
	socket.on('INFO_PERSONNAGE_SC', function(currentPerso) {
			labelInventaire.text="";
			labelInventaire.text="Inventaire du perso :";
	
		// CLear de la liste des items de case
			listeItemsPerso = new Array();
		
			for (var i = 0; i < currentPerso.sacADos.length; i++) {
				
				// mise de l'item dans une variable
				var item = currentPerso.sacADos[i];
				
				// Ajout de l'item à la liste
				listeItemsPerso.push(item);
				
				// Ajout de l'image à l'ihm
				var imgItem = new createjs.Bitmap(item.imageName);
				
				// ajout d'un texte quand l'user passera la souris dessus
				imgItem.name = i;
				
				// Ajout de l'évenement a l'image
				imgItem.addEventListener('mouseover', function(event) {
					var currentItem = listeItemsPerso[event.target.name];
					alert("Nom : " + currentItem.nom + " (" + currentItem.valeur + ") " + "\nDescription : " + currentItem.description);
				});	
				//imgItem.image.onload = setImg(imgItem,10+(i+1)*SpaceItem,400);
				imgItem.x = i * SpaceItem;
				contInvPerso.addChild(imgItem);
				
				// Update l'ihm
				stage.update();
			}
			//insereMessage("************************************");
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
	socket.on('INV_PERSONNAGE_SC', function(type, id_item, codeRetour) {
		alert("retour ok");
		if (codeRetour == 0) {
			txtObjetEquipe.text="";
			txtObjetEquipe.tetx=("L'item " + id_item + " n'est plus dans le sac ");
			// quitte la fonction
			return; 
		}
		if (type == "EQUIPER") {
			switch(codeRetour) {
				case 0 : 
					txtObjetEquipe.text="";
					txtObjetEquipe.tetx=("Equipement de l'item " + idtem + " raté : Item pas dans sac !");
					break;
				case 1 : 
					txtObjetEquipe.text="";
					txtObjetEquipe.tetx=("Equipement de l'item " + idtem + " ok !");
					break;
				case -1 : 
					txtObjetEquipe.text="";
					txtObjetEquipe.tetx=("Equipement de l'item " + idtem + " raté : arme déja équipée");
					break;
				case -2 : 
					txtObjetEquipe.text="";
					txtObjetEquipe.tetx=("Equipement de l'item " + idtem + " raté : armure déja équipée");
					break;
				case -3 : 
					txtObjetEquipe.text="";
					txtObjetEquipe.tetx=("Equipement de l'item " + idtem + " raté : armure déja équipée");
					break;
			}
		} 
		else if (type == "DEQUIPER") 
		{
			if (codeRetour == -4) 
			{
				txtObjetEquipe.text="";
				txtObjetEquipe.tetx=("Impossible de se déséquiper de l'item " + id_item + " vous ne vous en êtes pas équipé");
			}
			else
			{
				txtObjetEquipe.text="";
				txtObjetEquipe.text=("Item " + id_item + "équipé !");
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