// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
var oPersonnageDB = require('../persistance/Personnage_BD');
var oUtilisateur = require('../model/object/Utilisateur');
var EventLog    = require('../model/EventLog');

/**
 * UTILISATEUR : COMMUNICATION SERVEUR <-> BD
 * 
 * @class Utilisateur_BD
 */
function Utilisateur_BD() {
	if (false === (this instanceof Utilisateur_BD)) {
		return new Utilisateur_BD();
	}
};

/**
 * ENVOI UN UTILISATEUR POUR METTRE A JOUR CES PROPRIETES
 * retourn -1 si l'utilisateur n'est pas trouvé
 * retourn le nouvel utilisateur si tout est ok
 * @method SetUtilisateur
 */
 
Utilisateur_BD.SetUtilisateur = function(utilisateurToSave,callbackSetUtilisateur) {
	var Utilisateurmodel = mongoose.model('Utilisateur'); 
	Utilisateurmodel.find({_id : utilisateurToSave.id},function (err, NewUser)
	{
		if (err)
		{
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw (err);
		}
		
		if (typeof NewUser[0] === "undefined")
		{
			callbackSetUtilisateur(-1);	
		}
		else
		{
			NewUser[0].pseudo				= utilisateurToSave.pseudo;
			NewUser[0].email 				= utilisateurToSave.email;
			NewUser[0].personnage 			= utilisateurToSave.idPersonnage;
			NewUser[0].numEquipe 			= utilisateurToSave.numEquipe;
			NewUser[0].idSession			= utilisateurToSave.idSession;
			NewUser[0].compteConfirme		= utilisateurToSave.compteConfirme;
			
			NewUser[0].save(function (err)
			{
			if (err)
			{
				EventLog.error(err);
				// enlève l'exception pour empecher que le serveur plante //throw err;
			}
			//EventLog.log('UTILISATEUR_BD : Mis à jour de l\'utilisateur : ['+NewUser[0].id+"-"+NewUser[0].pseudo+"]");
			
			callbackSetUtilisateur(new oUtilisateur(
				NewUser[0]._id,			NewUser[0].pseudo,				NewUser[0].email,				NewUser[0].pass,
				NewUser[0].numEquipe,		NewUser[0].personnage, 		NewUser[0].idSession, 			NewUser[0].compteConfirme));
			});
		}
	});
},

/**
 * RENVOIE UN UTILISATEUR AVEC SON ID PASSE EN PARAMETRE
 * retourn un utilisateur si ok
 * retourn -1 l'utilisateur n'est pas trouvé
 * @method GetUtilisateur
 */
Utilisateur_BD.GetUtilisateur = function(idUtilisateur, callbackGetUtilisateur) {
	
	var Utilisateurmodel = mongoose.model('Utilisateur');
		
	Utilisateurmodel.find({_id : idUtilisateur},function (err, NewUser)
	{
		if (err)  
		{
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw err;
		}
		
		if (typeof NewUser[0] === "undefined")
		{
			EventLog.log("Get Utilisateur : undefined");
			callbackGetUtilisateur(idUtilisateur, -1);	
		}
		else
		{
			//EventLog.log("Appel du callBack avec un utilisateur -- " + NewUser[0].scoreByMeutre);
			var user = new oUtilisateur(
					NewUser[0]._id,				NewUser[0].pseudo,				NewUser[0].email,				//NewUser[0].pass,
					NewUser[0].numEquipe,		NewUser[0].personnage,			NewUser[0].idSession,
					NewUser[0].compteConfirme);
			EventLog.log("UTILISATEUR_BD : Chargement de l'utilisateur : ["+NewUser[0].id+"-"+NewUser[0].pseudo+"]");
			callbackGetUtilisateur(idUtilisateur, user);
		}
	});
	
},

Utilisateur_BD.GetUtilisateurByIdInscription = function(idInscri, callbackGetUtilisateur) {
	
	var Utilisateurmodel = mongoose.model('Utilisateur');
		
	Utilisateurmodel.find({idInscription : idInscri},function (err, NewUser)
	{
		if (err)  
		{
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw err;
		}
		
		if (typeof NewUser[0] === "undefined")
		{
			EventLog.log("Get Utilisateur : undefined");
			callbackGetUtilisateur(-1);	
		}
		else
		{
			callbackGetUtilisateur(1, NewUser[0]._id);
		}
	});
	
},

Utilisateur_BD.deleteUser = function(idUser, callbackDelete)
{
	var UtilisateurModel = mongoose.model('Utilisateur');
	
	UtilisateurModel.find({_id : idUser}, function(err, users)
	{
		if(err)
		{
			callbackDelete(-1);
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw err;
		}
		
		if(user[0])
		{
			UtilisateurModel.remove({_id : idUser}, function(err)
			{
				if(err)
				{
					EventLog.error(err);
					callbackDelete(-1);
					// enlève l'exception pour empecher que le serveur plante //throw err;
				}
				callbackDelete(1);
			});
		}
		else
		{
			callbackDelete(-1);
		}
	});
},

/**
 * AJOUTE UN UTILISATEUR DANS LA BASE DE DONNEES
 * Renvoi le user si inscription ok
 * Renvoi 0 si erreur
 * Renvoi -1 si pseudo deja pris
 * Renvoi -2 si email deja pris
 * @method Inscription
 */
Utilisateur_BD.Inscription = function(pseudoU, passU, emailU, req, res, callbackInscription)
{
 	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	
	var userExiste = true;
	var mailExiste = true;
	var sauvegarde = 0;
	var newUser = new Utilisateurmodel();
	
	newUser.pseudo 				= pseudoU;
	newUser.pass 				= passU;
	newUser.email 				= emailU;
	newUser.numEquipe 			= 0;
	newUser.idSession			= -1;
	newUser.compteConfirme		= false;
	// générer un nbr aléatoire pour confirmer inscription
	newUser.idInscription		=  this.SHA1(this.SHA1(this.SHA1(this.SHA1(pseudoU)))); 
	
	// on cherche si ce pseudo existe déja
	Utilisateurmodel.find({pseudo: pseudoU}, function (err, testuseru)
	{
		// si erreur 
		if (err){
			EventLog.error(err);
			// enlève l'exception pour empecher que le serveur plante //throw err; }		
		}
		// si pseudo pas trouvé
		if(typeof testuseru[0] === "undefined") { userExiste = false; }
		// si pseudo trouvé
		else { userExiste = true; }
		
		// on cherche si cet email existe déja
		Utilisateurmodel.find({email: emailU}, function (err, testusere)
		{
			// si erreur
			if (err) {EventLog.error(err);} // enlève l'exception pour empecher que le serveur plante //throw err; }
			
			// si email pas trouvé
			if(typeof testusere[0] === "undefined") { mailExiste = false; }
			// si email trouvé
			else { mailExiste = true; }
			
			// création des codes d'erreur
			if (userExiste) { sauvegarde = -1; }
			if (mailExiste) { sauvegarde = -2; }
			
			// renvoi des codes d'eeur
			if(sauvegarde == -1 || sauvegarde == -2) { callbackInscription(sauvegarde, req, res); }
			// si c'est ok
			else
			{		
				var PersonnageModel = mongoose.model('Personnage');
				var newPerso = new PersonnageModel();
				
				// crée le perso en BD
				newPerso = oPersonnageDB.Creation();
				
				// log
				EventLog.log('BASE DE DONNEES : ID du perso cree ' + newPerso._id);
				
				// on attribut l'id de personnage crée à l'attribut "personnage" du nouvel user
				newUser.personnage = newPerso._id;
				
				// lance la sauvegarde de l'utilisateur
				newUser.save(function (err)
				{
					if (err)
					{
						EventLog.error(err); // enlève l'exception pour empecher que le serveur plante //throw err;
					}
					EventLog.log('BASE DE DONNEES : Utilisateur inscrit dans la base !');
					
					// renvoi réponse
					callbackInscription(newUser._id, req, res, newUser.idInscription);
				});
			}
		});
	});
},
 
/**
 * Renvoi 1 si le pseudo n'existe pas, 2 si le mot de passe ne coresspond pas au pseudo et 0 si tout est en règle 
 * Renvoi 1 si conexion ok
 * Renvoi 0 si erreur
 * Renvoi -1 si le password ne corespond pas
 * @method Connexion
 */
 
 Utilisateur_BD.Connexion = function (pseudoU, passU, req, res, callbackConnexion)
 {
	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	
	var NewUser = new Utilisateurmodel();
	
	Utilisateurmodel.find({pseudo : pseudoU}, function(err, user)
	{
		if (err)
		{
			EventLog.error(err); // enlève l'exception pour empecher que le serveur plante //throw err;
		}
		
		if(typeof user[0] === "undefined")
		{
			callbackConnexion(-1, req, res);
		}
		else if(user[0].pass != passU)
		{
			callbackConnexion(-1, req, res);
		}
		else if(user[0].compteConfirme == false)
		{
			callbackConnexion(-2, req, res);
			EventLog.log("USER_BD : refus de connexion de l'user = " + user[0].pseudo + " cause : compte non-confirmé");
		}
		else
		{
			EventLog.log("USER_BD : connexion de l'user = " + user[0].pseudo);
			callbackConnexion(user[0].id, req, res);
		}
	});
},
 
 Utilisateur_BD.GetUsersId = function(callback)
 {
	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	var tabId = new Array();
	
	Utilisateurmodel.find({}, function(err, users)
	{
		if(err)
		{
			EventLog.error(err); // enlève l'exception pour empecher que le serveur plante //throw err;
		}
		for(var i in users)
		{
			tabId[i] = users[i].id;
		}
		callback(tabId);
	});
 },

 
 module.exports = Utilisateur_BD;

/**
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
**/
Utilisateur_BD.SHA1 = function (msg) {
  function rotate_left(n,s) {
    var t4 = ( n<<s ) | (n>>>(32-s));
    return t4;
  };
  function lsb_hex(val) {
    var str="";
    var i;
    var vh;
    var vl;
    for( i=0; i<=6; i+=2 ) {
      vh = (val>>>(i*4+4))&0x0f;
      vl = (val>>>(i*4))&0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };
  function cvt_hex(val) {
    var str="";
    var i;
    var v;
    for( i=7; i>=0; i-- ) {
      v = (val>>>(i*4))&0x0f;
      str += v.toString(16);
    }
    return str;
  };
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  };
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
  msg = Utf8Encode(msg);
  var msg_len = msg.length;
  var word_array = new Array();
  for( i=0; i<msg_len-3; i+=4 ) {
    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
    msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
    word_array.push( j );
  }
  switch( msg_len % 4 ) {
    case 0:
      i = 0x080000000;
    break;
    case 1:
      i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
    break;
    case 2:
      i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
    break;
    case 3:
      i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8  | 0x80;
    break;
  }
  word_array.push( i );
  while( (word_array.length % 16) != 14 ) word_array.push( 0 );
  word_array.push( msg_len>>>29 );
  word_array.push( (msg_len<<3)&0x0ffffffff );
  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
    for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
    for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for( i= 0; i<=19; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
    for( i=20; i<=39; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
    for( i=40; i<=59; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
    for( i=60; i<=79; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

  return temp.toLowerCase();
}
