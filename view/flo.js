var stage, holder;
onload = initialize;	

function initialize() {
	console.log("Init");
	//**********Connexion au serveur*********
	
	var socket = io.connect('http://localhost:8080');
	
	//**********Déclaration des labels*******
	var txtSalle, txtObjet, txtPerso, txtCase, txtListeObjet, txtO; 
	
	//**********Création des boutons*********

	var canvasElement = document.getElementById("myCanvas");
	stage = new Stage(canvasElement);
	console.log("Stage");
	
	var BtnInfoCase = stage.addChild(new Button("Info Case", "#A9A9A9"));
	BtnInfoCase.y = 70;
	
	var BtnInfoPerso = stage.addChild(new Button("Info Perso", "#A9A9A9"));
	BtnInfoPerso.y = BtnInfoCase.y + 60;
	
	var BtnRamasseObjet = stage.addChild(new Button("Ramasser Objet", "#A9A9A9"));
	BtnRamasseObjet.y = BtnInfoPerso.y + 60;
	
	BtnRamasseObjet.x = BtnInfoPerso.x = BtnInfoCase.x = 250;
	
	var BtnHaut = stage.addChild(new Button("H", "#A9A9A9"));
	BtnHaut.y = 20;
	BtnHaut.addEventListener('click', function(event) {
		alert("Go Up !");
		});
		
	var BtnBas = stage.addChild(new Button("B", "#A9A9A9"));
	BtnBas.y = BtnHaut.y + 80;
	BtnBas.addEventListener('click', function(event) {
		alert("Go Down !");
		});
	
	var BtnGauche = stage.addChild(new Button("G", "#A9A9A9"));
	BtnGauche.x = 110;
	BtnGauche.addEventListener('click', function(event) {
		alert("Go Left !");
		});
	
	var BtnDroite = stage.addChild(new Button("D", "#A9A9A9"));
	BtnDroite.x = BtnGauche.x + 80;
	BtnDroite.addEventListener('click', function(event) {
		alert("Go Right !");
		});
	
	BtnHaut.x = BtnBas.x = 150;
	BtnGauche.y = BtnDroite.y = 60;
	
	
	/*
	 * RECEPTION DU NOUVEL ID SALLE DU PERSONNAGE
	 */
	socket.on('MOVE_PERSONNAGE_SC', function(currentCase) {
		if (currentCase == "ERREUR_CASE")
			{
			//insereMessage("CLIENT : nom salle = " + "ERREUR_CASE");
			txtSalle = new createjs.Text("CLIENT : nom salle = " + "ERREUR_CASE", "12px Arial", "#ff0000");
			txtSalle.y=200;
			stage.addChild(txtSalle);
			}
		else if (currentCase == "ERREUR_MOVE")
		{
			//insereMessage("CLIENT : nom salle = " + "impossible d'aller par là !");
			txtSalle = new createjs.Text("CLIENT : nom salle = " + "impossible d'aller par là !", "12px Arial", "#ff0000");
			txtSalle.y=200;
			stage.addChild(txtSalle);
		}
		else {
			//insereMessage("CLIENT : nom salle = " + currentCase.nom);
			txtSalle = new createjs.Text("CLIENT : nom salle = " + currentCase.nom, "12px Arial", "#ff0000");
			txtSalle.y=200;
			stage.addChild(txtSalle);
			modifieIdSalle(currentCase.nom, currentCase.id);
		}
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
				txtObjet=new createjs.Text("Erreur inconnue", "12px Arial", "#ff0000");
				txtObjet.y=220;
				stage.addChild(txtObjet);
			}
			// poids insufisant
			else if (codeRetour == -1) {
				//insereMessage("Impossible de ramasser l'objet : poids max atteint");
				txtObjet=new createjs.Text("Impossible de ramasser l'objet : poids max atteint", "12px Arial", "#ff0000");
				txtObjet.y=220;
				stage.addChild(txtObjet);
			}
			// objet pas dans case
			else if (codeRetour == -2) {
				//insereMessage("L'objet " + id_item + " n'est plus dans la salle ");
				txtObjet=new createjs.Text("L'objet " + id_item + " n'est plus dans la salle ", "12px Arial", "#ff0000");
				txtObjet.y=220;
				stage.addChild(txtObjet);
			}
			// ramassage ok
			else {
				//insereMessage("Objet ramassé ! ");
				txtObjet=new createjs.Text("Objet ramassé ! ", "12px Arial", "#ff0000");
				txtObjet.y=220;
				stage.addChild(txtObjet);

				// modifier l'ihm : inventaire du perso et inventaire de case
			}
		}
	});

	/*
	 * RECEPTION DES INFORMATIONS SUR LA CASE
	 */
	socket.on('INFO_CASE_SC', function(currentCase) {
		if (currentCase == "ERREUR_CASE")
		{
			//insereMessage("CLIENT :: nom case = " + "ERREUR_CASE");
			txtCase=new createjs.Text("CLIENT :: nom case = " + "ERREUR_CASE", "12px Arial", "#ff0000");
			txtCase.y=240;
			stage.addChild(txtCase);
		}
		else {
			//insereMessage("CLIENT :: nom case = " + currentCase.nom);
			txtCase=new createjs.Text("CLIENT :: nom case = " + currentCase.nom, "12px Arial", "#ff0000");
			txtCase.y=240;
			stage.addChild(txtCase);
			
			//insereMessage("****LISTE DES OBJETS DE LA CASE ****");
			txtO=new createjs.Text("****LISTE DES OBJETS DE LA CASE ****", "12px Arial", "#ff0000");
			txtO.y=260;
			stage.addChild(txtO);
			
			for (var i = 0; i < currentCase.listeItem.length; i++) {
				//insereMessage(" Objet id = " + currentCase.listeItem[i].id + " - " + currentCase.listeItem[i].nom);
				txtListeObjet=new createjs.Text("****LISTE DES OBJETS DE LA CASE ****", "12px Arial", "#ff0000");
				txtListeObjet.y=260+i*10;
				txtListeObjet.addChild(txtListeObjet);
			}
			//insereMessage("************************************");
		}
	});

	/*
	 * RECEPTION DES INFORMATIONS SUR LE PERSONNAGE
	 */
	socket.on('INFO_PERSONNAGE_SC', function(currentPerso) {
		insereMessage("****LISTE DES OBJETS  DU PERSO (" + currentPerso.sacADos.length + ")****");
		for (var i = 0; i < currentPerso.sacADos.length; i++) {
			//insereMessage(" Objet id = " + currentPerso.sacADos[i].id + " - " + currentPerso.sacADos[i].nom);
			txtPerso=new createjs.Text(" Objet id = " + currentPerso.sacADos[i].id + " - " + currentPerso.sacADos[i].nom, "12px Arial", "#ff0000");
			txtPerso.y=280+i*10;
		}
		//insereMessage("************************************");
	});
			
	stage.update();
}