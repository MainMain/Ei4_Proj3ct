
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('accueil', { title: 'Express' });
};


exports.jeu = function(req, res){
	  res.render('game', { title: 'Express' });
};


exports.classement = function(req, res){
	  res.render('classement', { title: 'Express' });
};


exports.chatEquipe = function(req, res){
	  res.render('chat-equipe', { title: 'Express' });
};


exports.chatGeneral = function(req, res){
	  res.render('chat-equipe', { title: 'Express' });
};


exports.regles = function(req, res){
	  res.render('regles', { title: 'Express' });
};

exports.sessiontest = function(req, res){

	  res.render('session-test', { title: 'Express' });
};

