var canvasElement;
var stage;
var context;
onload = initialize;	

function initialize() {

	//**********Connexion au serveur*********
	
	var socket = io.connect('http://localhost:8080');
	
	//**********Récupération du canvas et création contexte**********
	canvasElement = document.getElementById("myCanvas");
    stage = new createjs.Stage(canvasElement);
	context = canvasElement.getContext("2d");
	
	/*var arme=[
	  		{id: "0", path: "public/spritesheets/armes/0.png"},
			{id: "1", path :"public/spritesheets/armes/1.png"},
			{id: "2", path: "public/spritesheets/armes/2.png"},
			{id: "3", path :"public/spritesheets/armes/3.png"}
	 	 ];
	*/
	var background = new createjs.Bitmap("public/Background.jpg");
    background.image.onload = setImg(background,0,0);
    stage.update();
	var arme0 = new createjs.Bitmap("public/spritesheets/armes/0.png");
	var arme1 = new createjs.Bitmap("public/spritesheets/armes/1.png");
	var arme2 = new createjs.Bitmap("public/spritesheets/armes/2.png");
	var arme3 = new createjs.Bitmap("public/spritesheets/armes/3.png");
	var arme4 = new createjs.Bitmap("public/spritesheets/armes/4.png");
	var arme5 = new createjs.Bitmap("public/spritesheets/armes/5.png");
	var arme6 = new createjs.Bitmap("public/spritesheets/armes/6.png");
	var arme7 = new createjs.Bitmap("public/spritesheets/armes/7.png");
	var arme8 = new createjs.Bitmap("public/spritesheets/armes/8.png");
   
	
	//**********Déclaration des labels*******
	var demandeDeplacement, txtSalle, txtObjet, txtCase, txtObjetCase, 
	txtPerso, txtListeObjet, txtObjetPerso, txtInventaire, txtDeposer,
	txtObjetEquipe, labelObjetCase;
	
	labelObjetCase = stage.addChild(new createjs.Text("", "18px monospace", "#fff"));
	labelObjetCase.lineHeight = 15;
	labelObjetCase.textBaseline = "top";
	labelObjetCase.x = 200;
	labelObjetCase.y = 20;
	
	
	demandeDeplacement = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	demandeDeplacement.lineHeight = 15;
	demandeDeplacement.textBaseline = "top";
	demandeDeplacement.x = 10;
	demandeDeplacement.y = 150;
	
	txtSalle = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtSalle.lineHeight = 15;
	txtSalle.textBaseline = "top";
	txtSalle.x = 10;
	txtSalle.y = 170;
	
	txtObjet = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtObjet.lineHeight = 15;
	txtObjet.textBaseline = "top";
	txtObjet.x = 10;
	txtObjet.y = 190;
	
	txtCase = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtCase.lineHeight = 15;
	txtCase.textBaseline = "top";
	txtCase.x = 400;
	txtCase.y = 190;
	
	txtObjetCase = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtObjetCase.lineHeight = 15;
	txtObjetCase.textBaseline = "top";
	txtObjetCase.x = txtCase.x;
	txtObjetCase.y = txtCase.y + 20;
	
	txtObjetEquipe = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtObjetEquipe.lineHeight = 15;
	txtObjetEquipe.textBaseline = "top";
	txtObjetEquipe.x = 10;
	txtObjetEquipe.y = txtObjet.y + 40;
	
	txtObjetPerso = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtObjetPerso.lineHeight = 15;
	txtObjetPerso.textBaseline = "top";
	txtObjetPerso.x = 10;
	txtObjetPerso.y = txtObjet.y + 40;
	
	txtInventaire = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtInventaire.lineHeight = 15;
	txtInventaire.textBaseline = "top";
	txtInventaire.x = 700;
	txtInventaire.y = txtObjet.y + 20;
	
	//**********Création des boutons*********
	var BtnInfoCase = stage.addChild(new Button("Info Case", "#A9A9A9"));
	BtnInfoCase.y = 10;
	BtnInfoCase.x=800;
	BtnInfoCase.addEventListener('click', function(event) {
		socket.emit('INFO_CASE_CS');
		});
	
	
	var BtnInfoPerso = stage.addChild(new Button("Info Perso", "#A9A9A9"));
	BtnInfoPerso.y = BtnInfoCase.y;
	BtnInfoPerso.x = BtnInfoCase.x+200;
	BtnInfoPerso.addEventListener('click', function(event) {
		socket.emit('INFO_PERSONNAGE_CS');
		});	
	
	
	var BtnRamasseObjet = stage.addChild(new Button("Ramasser Objet", "#A9A9A9"));
	BtnRamasseObjet.y = BtnInfoPerso.y + 60;
	BtnRamasseObjet.addEventListener('click', function(event) {
		// exemple : ramsser l'objet d'id 1
		socket.emit('INV_CASE_CS', "RAMASSER", 1);
		});
	
	BtnRamasseObjet.x = BtnInfoPerso.x = 600;

	
	var BtnEquiper = stage.addChild(new Button("Equiper Objet", "#A9A9A9"));
	BtnEquiper.y = BtnRamasseObjet.y;
	BtnEquiper.x=BtnRamasseObjet.x+200;
	BtnEquiper.addEventListener('click', function(event) {
		//alert("click");
		socket.emit('INV_PERSONNAGE_CS');
		});
	
	var BtnDesequiper = stage.addChild(new Button("Desequiper Objet", "#A9A9A9"));
	BtnDesequiper.y = BtnEquiper.y+ 60;
	BtnDesequiper.x=800;
	BtnDesequiper.addEventListener('click', function(event) {
		socket.emit('INV_PERSONNAGE_CS', "DESEQUIPER", 3);
		});	
	
	var BtnHaut = stage.addChild(new Button("H", "#A9A9A9"));
	BtnHaut.y = 20;
	BtnHaut.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'NORD');
		//alert("Go Up !");
		//console.log("Haut");
		demandeDeplacement.text = "Demande d'aller vers le haut";
		});
		
	var BtnBas = stage.addChild(new Button("B", "#A9A9A9"));
	BtnBas.y = BtnHaut.y + 80;
	BtnBas.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'SUD');
		//alert("Go Down !");
		demandeDeplacement.text = "Demande d'aller vers le bas";
		});
	
	var BtnGauche = stage.addChild(new Button("G", "#A9A9A9"));
	BtnGauche.x = 10;
	BtnGauche.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'OUEST');
		//alert("Go Left !");
		demandeDeplacement.text = "Demande d'aller vers la gauche";
		});
	
	var BtnDroite = stage.addChild(new Button("D", "#A9A9A9"));
	BtnDroite.x = BtnGauche.x + 80;
	BtnDroite.addEventListener('click', function(event) {
		socket.emit('MOVE_PERSONNAGE_CS', 'EST');
		//alert("Go Right !");
		demandeDeplacement.text = "Demande d'aller vers la droite";
		});
	
	BtnHaut.x = BtnBas.x = 50;
	BtnGauche.y = BtnDroite.y = 60;
	
	 
	
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
			modifieIdSalle(currentCase.nom, currentCase.id);
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
	 */
	socket.on('INFO_CASE_SC', function(currentCase) {
		if (currentCase == "ERREUR_CASE")
		{
			//insereMessage("CLIENT :: nom case = " + "ERREUR_CASE");
			txtCase.text="";
			txtCase.text=("CLIENT :: nom case = " + "ERREUR_CASE");
		}
		else {
			//insereMessage("CLIENT :: nom case = " + currentCase.nom);
			txtCase.text="";
			txtCase.text=("CLIENT :: nom case = " + currentCase.nom + "");
			
			//insereMessage("****LISTE DES OBJETS DE LA CASE ****");
			txtObjetCase.text="****LISTE DES OBJETS DE LA CASE ****";
			labelObjetCase.text="Objets de la case :";
			for(var x=0; x<9; x++){
				/*var lien="public/spritesheets/armes/"+x".png";
				var arme = new createjs.Bitmap(lien);
				arme.image.onload = setImg(arme,200,50+(x+1)*10);*/
			}
			arme0.image.onload = setImg(arme0,200,50);
			arme1.image.onload = setImg(arme1,200+30,50);
			arme2.image.onload = setImg(arme2,200+60,50);
			arme3.image.onload = setImg(arme3,200+90,50);
			arme4.image.onload = setImg(arme4,200+120,50);
			arme5.image.onload = setImg(arme5,200+150,50);
			arme6.image.onload = setImg(arme6,200+180,50);
			arme7.image.onload = setImg(arme7,200+210,50);
			arme8.image.onload = setImg(arme8,200+240,50);
			
			for (var i = 0; i < currentCase.listeItem.length; i++) {
				txtListeObjet = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
				txtListeObjet.lineHeight = 15;
				txtListeObjet.textBaseline = "top";
				txtListeObjet.x = txtObjetCase.x;
				txtListeObjet.y = txtObjetCase.y + (i+1)*20;
				//insereMessage(" Objet id = " + currentCase.listeItem[i].id + " - " + currentCase.listeItem[i].nom);
				txtListeObjet.text="";
				txtListeObjet.text=(" Objet id = " + currentCase.listeItem[i].id + " - " + currentCase.listeItem[i].nom +"");
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
	txtObjetPerso.text="";
	txtObjetPerso.text=("****LISTE DES OBJETS  DU PERSO (" + currentPerso.sacADos.length + ")****");
		for (var i = 0; i < currentPerso.sacADos.length; i++) {
			//insereMessage(" Objet id = " + currentPerso.sacADos[i].id + " - " + currentPerso.sacADos[i].nom);
			txtPerso = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
			txtPerso.lineHeight = 15;
			txtPerso.textBaseline = "top";
			txtPerso.x = txtObjetPerso.x;
			txtPerso.y = txtObjetPerso.y + (i+1)*20;
			txtPerso.text=(" Objet id = " + currentPerso.sacADos[i].id + " - " + currentPerso.sacADos[i].nom + "");
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