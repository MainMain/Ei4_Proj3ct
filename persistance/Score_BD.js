// includes
var oScore = require('../model/Object/Score');
var oDatabase = require('../model/database');
var mongoose = require('mongoose');

function Score_BD() {
   /* if (false === (this instanceof Score_BD)) {
        return new Score_BD();
    }*/
};


Score_BD.GetIds = function(callback)
{
	var Scoremodel = mongoose.model('Score'); 
	var tabId = new Array();
	
	Scoremodel.find({}, function(err, score)
	{
		if(err)
		{
			throw err;
		}
		for(var i in score)
		{
			tabId[i] = score[i]._id;
		}
		callback(tabId);
	});
},


Score_BD.GetScoreById = function(idScore, callbackGetScore) {
	
	var Scoremodel = mongoose.model('Score');
		
	Scoremodel.find({_id : idScore},function (err, Score)
	{
		if (err)  
		{
			throw err;
		}
		
		if (typeof Score[0] === "undefined")
		{
			console.log("Get Score : undefined");
			callbackGetScore(idScore, -1);	
		}
		else
		{
			var score = new oScore(
				Score[0]._id,				Score[0].idUser,			Score[0].idSession,				
				Score[0].nbrMeurtres,		Score[0].nbrFoisTue,		Score[0].scoreByMeutre,
				Score[0].scoreByODD,		Score[0].nbrGoulesTues,		Score[0].listeVictimes,
				Score[0].listeBourreaux
				);
			//console.log("SCORE_BD : Chargement du score : ["+Score[0].idUser+"-"+Score[0].idSession+"]");
			callbackGetScore(idScore, score);
		}
	});
	
},

Score_BD.SetScore = function (scoreToSave, callbackSetScore)
{
    var ScoreModel = mongoose.model('Score');
    var newScore = ScoreModel();

    ScoreModel.find({_id: scoreToSave.id}, function (err, newScore) 
    {
    	console.log("---> BD : id score to save " + scoreToSave.id);
    	
        if (err) 
        {
            console.log("SCORE_BD : SetScore() : erreur ! ");
            throw err;
        }

        if (typeof newScore[0] === "undefined") {
            console.log("SCORE_BD : SetScore() : undefined ! ");
            callbackSetPersonnage(-1);
        } 
        else 
        {
        	ScoreModel.update({_id: scoreToSave.id}, 
        	{
        		idUser			: scoreToSave.idUser,
        		idSession		: scoreToSave.idSession,
        		nbrMeurtres		: scoreToSave.nbrMeurtres,
        		nbrFoisTue		: scoreToSave.nbrFoisTue,
        		scoreByMeutre	: scoreToSave.scoreByMeutre,
        		scoreByODD		: scoreToSave.scoreByODD,
        		nbrGoulesTues	: scoreToSave.nbrGoulesTues,
        		listeVictimes	: scoreToSave.listeVictimes,
        		listeBourreaux	: scoreToSave.listeBourreaux,
            },
            function (err) 
            {
            	if (err)
                {
                	throw err;
                }
					
                console.log("SCORE_BD : Mis à jour du score : ["+scoreToSave.id+"]");
				callbackSetPersonnage(1);
            });
        }

    });
},

Score_BD.Creation = function (idUser, idSession) {

    var ScoreModel = mongoose.model('Score');
    var newScore = new ScoreModel();

	newScore.idUser			= idUser;
	newScore.idSession		= idSession;
	newScore.nbrMeurtres	= 0;
	newScore.nbrFoisTue		= 0;
	newScore.scoreByMeutre	= 0;
	newScore.scoreByODD		= 0;
	newScore.nbrGoulesTues	= 0;
	newScore.listeVictimes	= new Array();
	newScore.listeBourreaux	= new Array();

	newScore.save(function (err) {
        if (err) {
            throw err;
        }
        
        console.log('BASE DE DONNEES : Creation dun score !');
       // callback(); // rappel
    });
    return newScore;
},


module.exports = Score_BD;
