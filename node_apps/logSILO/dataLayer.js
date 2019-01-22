
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");


var app = express();
var port = 8390;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));   


app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    //Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");

    //Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-requested-with,content-type");

    next();

});


var Schema = mongoose.Schema;


mongoose.connect('mongodb://hugopuissant:bla1bla1@ds161144.mlab.com:61144/youmeo', function (err) {
    if(err){
        throw err;
    }else{
        console.log('mongo connected');
    }
});

//declare schema USER
var LogSchema = Schema({
    user_id: {type: String, unique:true},
    date : Date,
    type:String,
    value: String
});

var typesPossibles= ['SEARCH', 'CONNEXION', 'PLAYBACK']


//Init model
var LogModel = mongoose.model('logs', LogSchema);


/***
 * =====================================================================================
 * 
 *                                 PRIVATE FUNCTIONS
 * 
 * =====================================================================================
 */

function getMonthlyPlaybacksCount(user_id, cb){
    
    LogModel.count({user_id:user_id, type:typesPossibles[2],  date:{
        $lte:new Date(),
        $gte: new Date(new Date().setDate(new Date().getDate()-31))
    }},
    function(err, data){
        if(err){
            throw err;
        }else{
            cb(data);
        }
    });
}

function getLastLogin(user_id, cb){
    LogModel.findOne({user_id:user_id, type:typesPossibles[1]},'date',{sort:{date:-1}},function(err,data){
        if(err){
            throw err;
        }else{
            if(data){
                cb({success: true,date:data.date});
            }else{
                cb({success:false, errorSet:['UNKNOWN_USER_ID']});
            }
        }
    })
}
/***
 * =====================================================================================
 * 
 *                                 EXPORT FUNCTIONS
 * 
 * =====================================================================================
 */

module.exports = {

    /**
     * Renvoie toutes les stats utilisateurs des recherches
     * @param {*} cb 
     */
    getAllSearches: function(cb){
        LogModel.find({type:typesPossibles[0]}, 'user_id date value',{sort:{user_id:1}},function(err, data){
            if(err){
                throw err
            }else{
                if(data){
                    let array = [];
                    data.forEach(element => {
                        array.push({
                            user_id:element.user_id,
                            date:element.date,
                            query:element.value
                        });
                    });
                    cb({
                        success:true,
                        data:array
                    });
                }else{
                    cb({
                        success: false,
                        errorSet:['NO_RESULTS']
                    })
                }
                
            }
        });
    },

    /**
     * Renvoie toutes les stats de recherche de l'utilisateur
     * @param {*} user_id 
     * @param {*} cb 
     */
    getAllSearchesForUser: function(user_id,cb){
        LogModel.find({type:typesPossibles[0], user_id:user_id}, 'date value',function(err, data){
            if(err){
                throw err
            }else{
                if(data){
                    let array = [];
                    data.forEach(element => {
                        array.push({
                            date:element.date,
                            query:element.value
                        });
                    });
                    cb({
                        success:true,
                        data:array
                    });
                }else{
                    cb({
                        success: false,
                        errorSet:['NO_RESULTS']
                    });
                }
            }
        });
    },

    /**
     * Renvoie un object contenant les lectures et derière connxion d'un utilisateur
     * @param {*} user_id 
     * @param {*} cb 
     */
    getStatsForUser: function(user_id, cb){
        getMonthlyPlaybacksCount(user_id, function(monthly){
            getLastLogin(user_id, function(lastlogin){
                cb({
                    success : lastlogin.success,
                    playbacks_monthly_count:monthly,
                    last_login:lastlogin.date
                });
            });
        });
    },


    addEntry: function(line, cb){
        var logLineToAdd = new LogModel({
            user_id:line.user_id,
            date: new Date(),
            type:line.type,
            value:line.value
        });
        logLineToAdd.save(function(err){
            if(err){
                throw err;
            }else{
                cb({success:true});
            }
        });
    }
};


/***
 * =====================================================================================
 * 
 *                                 ACCESS ENDPOINTS
 * 
 * =====================================================================================
 */

 // GET ALL SEARCHES
app.post('/silo/getAllSearches', function(request, response){
    module.exports.getAllSearches(function(res){
       response.send(res);
    })
});

// GET ALL SEARCH FOR USER
app.post('/silo/getAllSearchesForUser', function(request, response){
    module.exports.getAllSearchesForUser(request.body.user_id, function(res){
        response.send(res);
    })
});

// GET STATS FOR USER
app.post('/silo/getStatsForUser', function(request, response){
    module.exports.getStatsForUser(request.body.user_id, function(res){
        response.send(res);
    })
});

// ADD VIDEO LOG
app.post('/silo/addVideo', function(request, response){
    let line = {
        user_id : request.body.user_id,
        type : 'PLAYBACK',
        value : request.body.value
    }
    module.exports.addEntry(line, function(res){
        response.send(res);
    })
})

// ADD SEARCH LOG
app.post('/silo/addSearch', function(request, response){
    let line = {
        user_id : request.body.user_id,
        type : 'SEARCH',
        value : request.body.value
    }
    module.exports.addEntry(line, function(res){
        response.send(res);
    })
})

// ADD CONNECT LOG
app.post('/silo/addConnect', function(request, response){
    let line = {
        user_id : request.body.user_id,
        type : 'CONNEXION'
    }
    module.exports.addEntry(line, function(res){
        response.send(res);
    })
})

/***
 * =====================================================================================
 * 
 *                                 START SERVER
 * 
 * =====================================================================================
 */
if(process.env.PORT !== undefined){
    port= process.env.PORT;
}
console.log("Server started port " + port);
app.listen(port);
