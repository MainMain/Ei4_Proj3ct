
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('accueil', { title: 'Express' });
};


exports.jeu = function(req, res){
	  res.render('game', { title: 'Express' });
};
