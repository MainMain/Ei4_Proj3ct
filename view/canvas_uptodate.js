var canvasElement;
var stage, output;
var context;

var mouseTarget; // the display object currently under the mouse, or being dragged
var dragStarted; // indicates whether we are currently in a drag operation
var offset;

onload = initialize;
var listeItemsCase;
var listeItemsPerso;
var idSelectedItemCase = -1;
var idSelectedItemPerso = -1;
var idSelectedItemEquip = -1;

function initialize() {

	// ******************************************
	// ********** Connexion au serveur  *********
	// ******************************************
	
	var socket = io.connect('http://localhost:8080');
	
	// ************************************************
    // * Récupération du canvas et création contexte **
    // ************************************************
	
    canvasElement = document.getElementById("myCanvas");
    stage = new createjs.Stage(canvasElement);
    
    // enabled mouse over / out events
    stage.enableMouseOver(20);
    context = canvasElement.getContext("2d");

    // enable touch interactions if supported on the current device:
    //createjs.Touch.enable(stage);

    // Teste la présence de HTML5 et de drag & drop
    /*if (Modernizr.draganddrop) {
    	
    	} else {
    	  alert("! Vous devez passez en HTML5 !");
    	}*/

    // application du background
    var background = new createjs.Bitmap("public/Background.jpg");
    background.image.onload = setImg(background, 0, 0);

    // insertion de la map
    var map = new createjs.Bitmap("public/images/map.png");
    map.image.onload = setImg(map, 170, 130);
    
    // ******* ATTRIBUTS *************************
	// ** Création de la liste des items de case * 
	// *******************************************
	
	this.listeItemsCase = new Array();
	this.listeItemsPerso = new Array();

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
    BtnUtiliser.addEventListener('click', function(event) {
    	 if (idSelectedItemPerso == -1) {
             alert("Selectionner Item avant de l'utiliser");
         } else {
             socket.emit('PERSONNAGE_USE_CS', idSelectedItemPerso);
             idSelectedItemPerso = -1;
         }
		});	

    var BtnRamasseObjet = stage.addChild(new Button("Ramasser Item", ColorBtn));
    BtnRamasseObjet.y = BtnUtiliser.y + H;
    BtnRamasseObjet.addEventListener('click', function (event) {
        if (idSelectedItemCase == -1) {
            alert("Selectionner Item avant de Ramasser");
        } else {
            socket.emit('INV_CASE_CS', "RAMASSER", idSelectedItemCase);
            idSelectedItemCase = -1;
        }
    });

    var BtnDeposer = stage.addChild(new Button("Déposer Item", ColorBtn));
    BtnDeposer.y = BtnRamasseObjet.y + H;
    BtnDeposer.addEventListener('click', function (event) {
        if (idSelectedItemPerso == -1) {
            alert("Selectionner Item avant de Déposer");
        } else {
            socket.emit('INV_CASE_CS', "DEPOSER", idSelectedItemPerso);
            idSelectedItemPerso = -1;
        }
    });

    var BtnEquiper = stage.addChild(new Button("Équiper Item", ColorBtn));
    BtnEquiper.y = BtnDeposer.y + H;
    BtnEquiper.addEventListener('click', function (event) {
    	//alert("click button");
        if (idSelectedItemPerso == -1) {
            alert("Selectionner Item avant de s'équiper");
        } else {
            // Bugg dans la demande au serveur au bout de plusieurs fois

            //alert("Demande serveur (avant)");
            socket.emit('INV_PERSONNAGE_CS', "EQUIPER", idSelectedItemPerso);
            idSelectedItemEquip = -1;
            idSelectedItemPerso = -1;
            //alert("Demande serveur (apres)");
        }

    });

    var BtnDesequiper = stage.addChild(new Button("Déséquiper Item", ColorBtn));
    BtnDesequiper.y = BtnEquiper.y + H;
    BtnDesequiper.addEventListener('click', function (event) {
        socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", idSelectedItemEquip);
        idSelectedItemEquip = -1;
        idSelectedItemPerso = -1;
    });

    var BtnAttaquer = stage.addChild(new Button("Attaquer...", ColorBtn));
    BtnAttaquer.y = BtnDesequiper.y + H;
    /*BtnAttaquer.addEventListener('click', function(event) {
		
		});	*/

    var BtnFouiller = stage.addChild(new Button("Mode Fouille", ColorBtn));
    BtnFouiller.y = BtnAttaquer.y + H;
    BtnFouiller.addEventListener('click', function(event) {
    	socket.emit('PERSONNAGE_MODE_CS', 1);
		});	

    var BtnCacher = stage.addChild(new Button("Mode Caché", ColorBtn));
    BtnCacher.y = BtnFouiller.y + H;
    BtnCacher.addEventListener('click', function(event) {
    	socket.emit('PERSONNAGE_MODE_CS', 2);
		});	

    var BtnDefendre = stage.addChild(new Button("Mode Defense", ColorBtn));
    BtnDefendre.y = BtnCacher.y + H;
    BtnDefendre.addEventListener('click', function(event) {
    	socket.emit('PERSONNAGE_MODE_CS', 3);
		});	
    
    var BtnFouilleRapide = stage.addChild(new Button("Fouille rapide", ColorBtn));
    BtnFouilleRapide.y = BtnDefendre.y + H;
    BtnFouilleRapide.addEventListener('click', function(event) {
    	socket.emit('ACTION_FOUILLE_RAPIDE_CS');
		});	

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

    //******************************************************************************************************************
    // * RECEPTION DU NOUVEL ID SALLE DU PERSONNAGE
    //********************************************
    socket.on('MOVE_PERSONNAGE_SC', function (currentCase) {
        if (currentCase == 0) {
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
                txtObjet.text = ("Item déposé ! Sac : " + codeRetour + " kg");
                socket.emit('INFO_PERSONNAGE_CS');
                socket.emit('INFO_CASE_CS');
                stage.update();
            }
        }
        stage.update();
    });

    /******************************************************************************************************************

     * RECEPTION DES INFORMATIONS SUR LA CASE
     *
     * @method Reception
     */
    socket.on('INFO_CASE_SC', function (currentCase) {
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
                	//alert("click item");
                   var currentItem = listeItemsCase[event.target.name];
                    idSelectedItemCase = currentItem.id;
                    stage.update();
                });

                // Ajout de l'évenement a l'image
                imgItem.addEventListener('mouseover', function (event) {
                    var currentItem = listeItemsCase[event.target.name];
                    idSelectedItemCase = currentItem.id;
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
    });

    /******************************************************************************************************************
     * RECEPTION DES INFORMATIONS SUR LE PERSONNAGE
     */
    socket.on('INFO_PERSONNAGE_SC', function (currentPerso) {
        labelPtsVie.text = "Points de vie : " + currentPerso.ptSante + "/" + currentPerso.ptSanteMax;
        labelPtsAction.text = "Points d'action :	" + currentPerso.ptActions + "/" + currentPerso.ptActionsMax;
        labelPtsMove.text = "Points de mouvement :" + currentPerso.ptDeplacement + "/" + currentPerso.ptDeplacementMax;

        labelInventaire.text = "";
        labelInventaire.text = "Inventaire du perso :";

        // CLear de la liste des items de case
        listeItemsPerso = new Array();
        contInvPerso.removeAllChildren();

        for (var i = 0; i < currentPerso.sacADos.length; i++) {

            // mise de l'item dans une variable
            var item = currentPerso.sacADos[i];

            // Ajout de l'item à la liste
            listeItemsPerso.push(item);

            // Ajout de l'image à l'ihm
            var imgItem = new createjs.Bitmap(item.imageName);

            // ajout d'un texte quand l'user passera la souris dessus
            imgItem.name = i;
            imgItem.cursor = "pointer";

            // Ajout de l'évenement a l'image
            imgItem.addEventListener('mouseover', function (event) {
                var currentItem = listeItemsPerso[event.target.name];
                labelDescribeItem.text =  ("Nom : " + currentItem.nom + " (" + currentItem.valeur + ") " + "\nPoids : " + currentItem.poids + "\nDescription : " + currentItem.description);
                stage.update();
            }, false);

            imgItem.addEventListener('mouseout', function (event) {
                labelDescribeItem.text = "";
                stage.update();
            }, false);

            imgItem.addEventListener("click", function (event) {
                var currentItem = listeItemsPerso[event.target.name];
                idSelectedItemPerso = currentItem.id;
                stage.update();
            });

            //imgItem.image.onload = setImg(imgItem,10+(i+1)*SpaceItem,400);
            imgItem.x = i * SpaceItem;
            contInvPerso.addChild(imgItem);
        }
        if (currentPerso.armeEquipee != null) {
            // affichage arme équipee
            var imgItemArme = new createjs.Bitmap(currentPerso.armeEquipee.imageName);
            imgItemArme.cursor = "pointer";

            // Dessin de l'arme équipée
            contArme.removeAllChildren();
            contArme.addChild(imgItemArme);
            contArme.addEventListener("click", function (event) {
                idSelectedItemEquip = currentPerso.armeEquipee.id;
                stage.update();
            });
        }
        if (currentPerso.armureEquipee != null) {
            // affichage arme équipee
            var imgItemArmure = new createjs.Bitmap(currentPerso.armureEquipee.imageName);
            imgItemArmure.cursor = "pointer";

            // Dessin de l'armure équipée
            contArmure.removeAllChildren();
            contArmure.addChild(imgItemArmure);
            contArmure.addEventListener("click", function (event) {
                idSelectedItemEquip = currentPerso.armureEquipee.id;
                stage.update();
            });
        }
        // Update l'ihm
        stage.update();

    });

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
                        idSelectedItemEquip = currentItem.id;
                        stage.update();
                    });
                }
                // Si le type de l'item est : ARMURE
                else if (currentItem.type == 2) {
                    // Dessin de l'armure équipée
                    contArmure.removeAllChildren();
                    contArmure.addChild(imgItem);
                    contArmure.addEventListener("click", function (event) {
                        idSelectedItemEquip = currentItem.id;
                        stage.update();
                    });
                }
                stage.update();


                // log
                txtObjetEquipe.text = "";
                txtObjetEquipe.text = ("Equipement de l'item " + currentItem.nom + " ok !");

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

        }
        stage.update();
        // RAFRAICHISSEMENT DE LA CASE ET DU PERSO
    });
    
    
    /********************************************************************************
     * RECEPTION DE LA REPONSE POUR LE CHANGEMENT DE MODE
     * return 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -4 si déja dans ce mode
	 * erreur : -5 si blessé
	 * erreur : -6 si changement de mode raté
	 * erreur : -7 si blessé et changement de mode raté
     * 
     * ET return dégats infligés
     */
     socket.on('PERSONNAGE_MODE_SC', function (mode, reponse, degatsInfliges) 
     	{
     		switch(reponse)
     		{
     			case 1: txtObjetEquipe.text = ("chgt pour mode " + mode +"  ok !");
     				break;
     			case 0 : txtObjetEquipe.text = ("chgt pour mode " + mode +" raté ! : Erreur interne");
     				break;
     			case -4 : txtObjetEquipe.text = ("chgt pour mode " + mode +"  raté ! : déja dans ce mode");
 					break;
     			case -5: txtObjetEquipe.text = ("chgt pour mode " + mode +"  ok  mais blessé : " + degatsInfliges);
     				break;
     			case -6 : txtObjetEquipe.text = ("chgt pour mode " + mode +" raté !");
     				break;
     			case -7: txtObjetEquipe.text = ("chgt pour mode " + mode +" raté et blessé : "+ degatsInfliges);
     				break;
     		}
     	});

    /********************************************************************************
     * RECEPTION DE LA REPONSE POUR LA FOUILLE RAPIDE
     * 
     * Attention : cette méthode rafraichie automatiquement l'affichage !
     * 
	 * return : 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -1 si fouille rate
	 * erreur : -2 si fouille rate et blessé
	 * erreur : -5 si fouille ok mais blessé
	 * erreur : -6 si action raté
	 * erreur : -7 si blessé et action raté
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

	/************************************************************************************************************
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
