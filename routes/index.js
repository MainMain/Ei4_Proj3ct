
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('accueil', { title: 'Express' });
};


exports.jeu = function(req, res){
	  res.render('jeu', { title: 'Express' });
};


exports.classement = function(req, res){
	  res.render('classement', { title: 'Express' });
};


exports.contact = function(req, res){
	  res.render('contact', { title: 'Express' });
};
