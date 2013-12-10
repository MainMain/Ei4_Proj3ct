var holder;
onload = initialize;	

function initialize() {

	//**********Connexion au serveur*********
	
	var socket = io.connect('http://localhost:8080');
	
	//**********Récupération du canvas et création contexte**********
	var canvasElement = document.getElementById("myCanvas");
    stage = new createjs.Stage(canvasElement);
	var context = canvasElement.getContext("2d");
	
	//**********Déclaration des labels*******
	var demandeDeplacement, txtSalle, txtObjet, txtCase, txtObjetCase, txtPerso, txtListeObjet, txtObjetPerso; 
	
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
	txtCase.x = 600;
	txtCase.y = 170;
	
	txtObjetCase = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtObjetCase.lineHeight = 15;
	txtObjetCase.textBaseline = "top";
	txtObjetCase.x = txtCase.x;
	txtObjetCase.y = txtCase.y + 20;
	
	txtObjetPerso = stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
	txtObjetPerso.lineHeight = 15;
	txtObjetPerso.textBaseline = "top";
	txtObjetPerso.x = 10;
	txtObjetPerso.y = txtObjet.y + 20;
	
	
	
	//**********Création des boutons*********
	var BtnInfoCase = stage.addChild(new Button("Info Case", "#A9A9A9"));
	BtnInfoCase.y = 10;
	BtnInfoCase.addEventListener('click', function(event) {
		socket.emit('INFO_CASE_CS');
		});
	
	
	var BtnInfoPerso = stage.addChild(new Button("Info Perso", "#A9A9A9"));
	BtnInfoPerso.addEventListener('click', function(event) {
		alert("click");
		socket.emit('INFO_PERSONNAGE_CS');
		});	
	BtnInfoPerso.y = BtnInfoCase.y + 60;
	
	var BtnRamasseObjet = stage.addChild(new Button("Ramasser Objet", "#A9A9A9"));
	BtnRamasseObjet.y = BtnInfoPerso.y + 60;
	BtnRamasseObjet.addEventListener('click', function(event) {
		// exemple : ramsser l'objet d'id 1
		socket.emit('INV_CASE_CS', "RAMASSER", 1);
		});
	
	BtnRamasseObjet.x = BtnInfoPerso.x = BtnInfoCase.x = 600;
	
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
				txtObjet.text=("Objet ramassé !");
				
				// modifier l'ihm : inventaire du perso et inventaire de case
			}
			stage.update();
		}
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
			
	stage.update();
}