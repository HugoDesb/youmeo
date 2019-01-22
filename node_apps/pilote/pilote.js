
var express = require('express');
var path = require('path');
var generator = require('generate-password');
var requestJSON = require('request-json');
var bodyParser = require('body-parser');

var app = express();
var port = 8095;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));


var clientUser = requestJSON.createClient('https://user-silo-youmeo.herokuapp.com/');    
var clientPlaylist = requestJSON.createClient('https://playlist-silo-youmeo.herokuapp.com/');  
var clientSearch = requestJSON.createClient('https://search-silo-youmeo.herokuapp.com/');  
var clientLog = requestJSON.createClient('https://log-silo-youmeo.herokuapp.com/');
var clientTodo = requestJSON.createClient('https://todo-silo-youmeo.herokuapp.com/');

app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    //Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");

    //Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-requested-with,content-type");

    next();

});


/***
 * =====================================================================================
 * 
 *                                  USER SILO
 * 
 * =====================================================================================
 */

/**
 * ---------------------------------------------------- GET
 * 
 * Récupérer les Utilisateurs
 * 
 * SSI user_id est admin
 */
app.get('/api/admin/users/:user_id', function(request,response){
    if(!request.params.user_id){
        response.send({
            success:false,
            errorSet:['USER_ID_NOT_PROVIDED']
        });
    }else{
        let data = {
            user_id:request.params.user_id
        };
        clientUser.post('/silo/isAdmin',data, function(err, res, body) {
            if(err){
                throw err;
            }
            if(body.isAdmin){
                clientUser.post('/silo/getAllUsers',{}, function(err2, res2, body2){
                    if(err2){
                        throw err2;
                    }
                    response.send(body2)
                })
            }else{
                response.send({
                    success:false, 
                    errorSet:['USER_ID_NOT_ADMIN']
                })
            }
        });
        /*
        dataUserLayer.isAdmin(req.params.user_id, function(isAdmin){
            if(isAdmin){
                dataUserLayer.getAllUsers(function(data){
                    res.send(data);
                });
            }else{
                res.send({
                    success:false, 
                    errorSet:['USER_ID_NOT_ADMIN']
                })
            }
        });
        */
    }
});

/**
 * ---------------------------------------------------- POST
 * 
 * Création du compte
 */
app.post('/api/users', function (request, response) {
    if(!request.body.firstname || !request.body.lastname || !request.body.email || !request.body.password){
        response.send({
            success:false,
            errorSet:['ONE_OR_MORE_FIELD_IS_EMPTY']
        });
    }else{
        var data = {
            firstname:request.body.firstname,
            lastname:request.body.lastname,
            email:request.body.email,
            password:request.body.password
        };

        clientUser.post('/silo/addAccount', data, function(err, res, body){
            response.send({
                success: body.success,
                user_id:body.user_id
            })
        });

        /*
        dataUserLayer.addAccount(user, function(success, user_id){
            res.send({ success:success, user_id:user_id});
        });
        */
    }
});

/**
 * ---------------------------------------------------- PUT
 * 
 * Modifie le mdp, 
 * 
 * SI password fourni, change le mdp,
 * SINON génère password et l'envoie par mail
 */
app.put('/api/users', function(request,response){
    if(!request.body.email){
        response.send({
            success:false,
            errorSet:['EMAIL_FIELD_IS_EMPTY']
        });
    }else{
        if(!request.body.password){
            //generate password
            password = generator.generate({
                length: 10,
                numbers: true
            });
        }else{
            password = request.body.password;
        }

        let data = {
            password: password,
            email: request.body.email
        }

        clientUser.post('/silo/updatePassword/', data, function(err, res, body){
            if(body.success){
                //send success
                response.send({
                    success:true
                });
            }else{
                response.send({
                    success:false,
                    errorSet:['EMAIL_INCORRECT']
                });
            }
        })
        /*
        dataUserLayer.updatePassword(data, function(success){
            if(success){
                //send success
                res.send({
                    success:true
                });
            }else{
                res.send({
                    success:false,
                    errorSet:['EMAIL_INCORRECT']
                });
            }
        })
        */
    }
});

/**
 * ---------------------------------------------------- DELETE
 * 
 * Supprime le compte associé au user_id
 */
app.delete('/api/users/:user_id', function(request, response){
    if(!request.params.user_id){
        response.send({
            success: false,
            errorSet :['USER_ID_FIELD_IS_EMPTY']
        });
    }else{
        let data = {
            user_id: request.params.user_id
        }

        clientUser.post('/silo/deleteAccount', data, function(err, res, body){
            if(body.success){
                res.send({success:body.success});
            }else{
                res.send({
                    success:body.success,
                    errorSet:['WRONG_USER_ID']
                });
            }
        });
        /*
        dataUserLayer.deleteAccount(req.body.user_id,function(success){
            if(success){
                res.send({success:success});
            }else{
                res.send({
                    success:success,
                    errorSet:['WRONG_USER_ID']
                });
            }
        });
        */
    }
});

/**
 * ---------------------------------------------------- POST
 * 
 * Connecte l'utilisateur et renvoie son user_id
 * 
 */
app.post('/api/users/connect', function (request,response){
    if(!request.body.email || !request.body.password){
        response.send({
            success: false,
            errorSet:['ONE_OR_MORE_FIELD_IS_EMPTY']
        });
    }else{
        let data1 = {
            email : request.body.email,
            password : request.body.password
        }
        clientUser.post('/silo/getUserId', data1, function(err, res, body){
            if(body.success){
                let data2 = {
                    user_id :request.params.user_id,
                    value:request.params.query
                }
                //LOG ENTRY
                clientLog.post('/silo/addConnect', data2, function(err2, response2, body2){
                    if(err){
                        console.log("log connect failed");
                    }
                });
                response.send(body);
            }else{
                response.send({
                    success: false,
                    errorSet:['EMAIL_OR_PASSWORD_INCORRECT']
                });
            }
        });
    }
});

/**
 * ---------------------------------------------------- GET
 * 
 * Obtient le profil de l'utilisateur demandé
 */
app.get('/api/users/:user_id', function(request, response){
    if(!request.params.user_id){
        response.send({
            success: false,
            errorSet :['USER_ID_FIELD_IS_EMPTY']
        });
    }else{
        let data = {
            user_id : request.params.user_id
        }
        clientUser.post('/silo/getUserObject', data, function(err, res, body){
            if(body.success){
                response.send(body.data[0]);
            }else{
                response.send({
                    success:body.success,
                    errorSet:['WRONG_USER_ID']
                });
            }
        });
        /*
        dataUserLayer.getUserObject(request.params.user_id,function(res){
            if(res.success){
                console.log('loooooool3');
                console.log(res)
                response.send(res.data[0]);
            }else{
                console.log('loooooool4');
                response.send({
                    success:res.success,
                    errorSet:['WRONG_USER_ID']
                });
            }
        });
        */
    }
});

/**
 * ---------------------------------------------------- POST
 * 
 * Change la valeur demandée
 */
app.put('/api/users/:user_id', function(req, res){
    if(!req.params.user_id || !req.body.user_id || !req.body.value || !req.body.field){
        res.send({
            success: false,
            errorSet:['ONE_OR_MORE_FIELD_IS_EMPTY']
        });
    }else{
        let dataToInsert = {
            user_id : req.params.user_id,
            field: req.body.field,
            value: req.body.value,
        }
        if((req.body.field == 'firstname' || req.body.field == 'lastname' 
            || req.body.field == 'email' || req.body.field == 'password')
            && req.params.user_id == req.body.user_id){
            
            clientUser.post('/silo/changeValue', dataToInsert, function(err, response, body){
                if(body.success){
                    res.send({success: true});
                }else{
                    res.send({
                        success: false,
                        errorSet:['UNKNOWN_ERROR']
                    });
                }
            });
        }else if(req.body.field == 'active' || req.body.field == 'admin'){
            clientUser.post('/silo/isAdmin',{user_id: req.params.user_id}, function(err, res, body) {
                if(err){
                    throw err;
                }
                if(body.isAdmin){
                    clientUser.post('/silo/changeValue',{}, function(err2, res2, body2){
                        if(err2){
                            throw err2;
                        }
                        if(body2.success){
                            res.send({success: true});
                        }else{
                            res.send({
                                success: false,
                                errorSet:['UNKNOWN_ERROR']
                            });
                        }
                    });
                }else{
                    res.send({
                        success:false, 
                        errorSet:['UNKNOWN_ERROR']
                    });
                }
            });
        }else{
            res.send({
                success:false, 
                errorSet:['WRONG_USER_ID']
            });
        }
    }
});
            


/***
 * =====================================================================================
 * 
 *                                  PLAYLIST SILO
 * 
 * =====================================================================================
 */

/**
 * ---------------------------------------------------- GET
 * 
 * Obtient les playlist de l'utilisateur
 */
app.get('/api/playlist/:userId', function(req, res){
    if(!req.params.userId){
        res.send({
            success : false,
            errorSet:['NO_USER_ID']
        });
    }else{
        let data = {user_id: req.params.userId}
        clientPlaylist.post('/silo/getPlaylistsForUser', data, function(err, response, body){
            res.send({
                success:true,
                data:body.data
            });
        })
        /*
        dataPlaylistLayer.getPlaylistsForUser(req.params.userId, function(data){
            res.send({
                success:true,
                data:data
            });
        });
        */
    }
});

/**
 * ---------------------------------------------------- POST
 * 
 * Crée une playlist pour l'utilisateur
 */
app.post('/api/playlist', function(req, res){
    if(!req.body.user_id){
        res.send({
            success : false,
            errorSet:['NO_USER_ID']
        });
    }else if(!req.body.name){
        res.send({
            success : false,
            errorSet:['ONE_OR_MORE_FIELD_IS_EMPTY']
        });
    }else{
        let playlist = {
            name: req.body.name,
            user_id: req.body.user_id
        }
        clientPlaylist.post('/silo/createPlaylist', playlist, function(err, response, body){
            res.send(body);
        });
        /*
        dataPlaylistLayer.createPlaylist(playlist, function(data){
            res.send(data);
        });
        */
    }
});

/**
 * ---------------------------------------------------- DELETE
 * 
 * Supprime une playist
 */
app.delete('/api/playlist/:user_id/:playlist_id', function(req, res){
    if(!req.params.user_id || !req.params.playlist_id){
        res.send({
            success: false,
            errorSet :['ONE_OR_MORE_FIELD_IS_EMPTY']
        });
    }else{
        let data = {
            playlist_id: req.params.playlist_id,
            user_id:req.params.user_id
        }
        clientPlaylist.post('/silo/deletePlaylist', data, function(err, response, body){
            if(body.success){
                res.send({success:body.success});
            }else{
                res.send({
                    success:body.success,
                    errorSet:['WRONG_USER_ID_OR_PLAYLIST_ID']
                });
            }
        });
    }
});

/**
 * ---------------------------------------------------- GET
 * 
 * Obtient les vidéos de la playlist
 */
app.get('/api/:playlist_id/videos', function(req, res){


    if(!req.params.playlist_id){
        res.send({
            success : false,
            errorSet:['NO_PLAYLIST_ID']
        });
    }else{
        let data = {playlist_id: req.params.playlist_id};
        clientPlaylist.post('/silo/getPlaylistVideos', data, function(err, response, body){
            res.send(body);
        });
    }
});

/**
 * ---------------------------------------------------- POST
 * 
 * Ajoute une video a la playlist
 */
app.post('/api/:playlist_id/videos', function(req, res){
    if(!req.params.playlist_id || !req.body.platform || !req.body.video_id){
        res.send({
            success : false,
            errorSet:['ONE_OR_MORE_FIELD_IS_EMPTY']
        });
    }else{

        let getObject = {
            platformId : req.body.platform,
            videoId : req.body.video_id
        }

        clientSearch.post('/silo/getOne',getObject, function(err1, response1, data){
            
            if(getObject.platformId == 1){
                video = {
                    platform: getObject.platformId,
                    video_id: getObject.videoId,
                    title : data.snippet.title,
                    description: data.snippet.description,
                    thumbnail_URL: data.snippet.thumbnails.medium.url
                };
            }else{
                video = {
                    platform: getObject.platformId,
                    video_id: getObject.videoId,
                    title: data.name,
                    description: data.description,
                    thumbnail_URL:  data.pictures.sizes[3].link
                };
            }

            let dataToSend = {
                playlist_id: req.params.playlist_id,
                video: video
            };

            clientPlaylist.post('/silo/addVideo', dataToSend, function(err2, response2, body2){
                res.send({success:body2.success});
            });
        });
    }
});

/**
 * ---------------------------------------------------- DELETE
 * 
 * Supprime une video
 */
app.delete('/api/:playlist_id/:video_id', function(req, res){
    if(!req.params.playlist_id || !req.params.video_id){
        res.send({
            success: false,
            errorSet :['ONE_OR_MORE_FIELD_IS_EMPTY']
        });
    }else{
        let data = {
            playlist_id: req.params.playlist_id,
            video_id:req.params.video_id
        }
        clientPlaylist.post('/silo/deletevideo', data, function(err, response, body){
            if(body.success){
                res.send({success:true});
            }else{
                res.send({
                    success:false,
                    errorSet:['WRONG_VIDEO_ID_OR_PLAYLIST_ID']
                });
            }
        });
    }
});



/***
 * =====================================================================================
 * 
 *                                  LOGS SILO
 * 
 * =====================================================================================
 */

/**
 * ---------------------------------------------------- GET
 * 
 * Obtient l'historique des recherches de tous les utilisateurs
 */
app.get('/api/log/historique/:user_id', function(req, res){
    if(!req.params.user_id){
        res.send({
            success : false,
            errorSet:['NO_USER_ID']
        });
    }else{
        let data = {
            user_id:req.params.user_id
        };
        clientUser.post('/silo/isAdmin', data, function(err1, response1, body1){
            if(body1){
                clientLog.post('/silo/getAllSearches', data, function(err2, response2, body2){
                    res.send(body2);
                })
            }else{
                res.send({
                    success : false,
                    errorSet:['NO_AUTHORIZATION']
                });
            }
        });
    }
});

/**
 * ---------------------------------------------------- GET
 * 
 * Obtient l'historique pour l'utilisateur
 */
app.get('/api/log/historique/:user_id', function(req, res){
    if(!req.params.user_id){
        res.send({
            success : false,
            errorSet:['NO_USER_ID']
        });
    }else{
        let data ={user_id: req.params.user_id}
        clientLog.post('/silo/getAllSearchesForUser', data, function(err2, response2, body2){
            res.send(body2);
        })
    }
});

/**
 * ---------------------------------------------------- GET
 * 
 * Obtient les stats utilisateurs
 */
app.get('/api/log/users/:user_id', function(req, res){
    if(!req.params.user_id){
        res.send({
            success: false,
            errorSet :['NO_USER_ID']
        });
    }else{

        let dataIsAdmin = {
            user_id: req.params.user_id
        }
        clientUser.post('/silo/isAdmin', dataIsAdmin, function(err1, response1, retIsAdmin){
            if(retIsAdmin){
                var array = [];
                clientUser.post('silo/getAllUsers', data, function(err, response, bodyusers){
                    bodyusers.data.forEach(userObject => {
                        let userStatObject = {
                            user_id:userObject.user_id,
                            firstname: userObject.firstname,
                            lastname: userObject.lastname,
                            email: userObject.email,
                            is_active: userObject.active,
                            is_admin: userObject.admin
                        }
                        clientPlaylist.post('/silo/getPlaylistCount', userStatObject, function(err3,response3, bodycount){
                            userStatObject.playlist_count = bodycount.count;
                            clientLog.post('/silo/getStatsForUser', userStatObject, function(err4, response4, bodystats){
                                if(bodystats.success){
                                    userStatObject.playbacks_monthly_count = bodystats.playbacks_monthly_count;
                                    userStatObject.last_login = bodystats.last_login;
                                }else{
                                    userStatObject.playbacks_monthly_count = bodystats.playbacks_monthly_count;
                                    userStatObject.last_login = null;
                                }
                                array.push(userStatObject);
                            });
                        });
                    });
                    res.send({
                        success : true,
                        usersStats : array
                    }); 
                });  
            }else{
                res.send({
                    success : false,
                    errorSet:['NO_AUTHORIZATION']
                });
            }
        })
    }
});
                 


/***
 * =====================================================================================
 * 
 *                                  SEARCH
 * 
 * =====================================================================================
 */

 /**
  *  SEARCH
  */
app.get('/api/search/:user_id/:platform_id/:query',function(req,res){
    if(!req.params.query || !req.params.platform_id || !req.params.user_id){
        res.send({
            success : false,
            errorSet:['NO_QUERY']
        })
    }else{

        let searchObject = {
            query:req.params.query,
            platformId:req.params.platform_id,
            skip:null,
            maxResults:10
        }
        clientSearch.post('/silo/search', searchObject, function(err, response, body){
            let data = {
                user_id :req.params.user_id,
                value:req.params.query
            }
            //LOG ENTRY
            clientLog.post('/silo/addSearch', data, function(err2, response2, body2){
                if(err){
                    console.log("log search failed");
                }
            });
            res.send(body);
        });
    }
})

/**
 * GET VIDEO
 */
app.get('/api/video/:user_id/:platformId/:videoId', function(req,res){
    
    if(!req.params.user_id || !req.params.platformId || !req.params.videoId){
        res.send({
            success : false,
            errorSet:['ONE_OR_MORE_FIELD_IS_EMPTY']
        })
    }else{
        let getObject = {
            platformId : req.params.platformId,
            videoId : req.params.videoId
        }
        clientSearch.post('/silo/getOne', getObject, function(err, response, body){
            let data = {
                user_id :req.params.user_id,
                value:req.params.videoId
            }
            //LOG ENTRY
            clientLog.post('/silo/addVideo', data, function(err2, response2, body2){
                if(err){
                    console.log("log playback failed");
                }
            });
            res.send(body);
        });
    }

}); 


/***
 * =====================================================================================
 * 
 *                                  SEARCH
 * 
 * =====================================================================================
 */







////////////////
console.log("Server started port "+ port);
if(process.env.PORT !== undefined){
    port= process.env.PORT;
}
app.listen(port);
