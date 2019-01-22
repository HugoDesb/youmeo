
var express = require('express');
var path = require('path');
var uuidv4 = require("uuid/v4");
var generator = require('generate-password');

var bodyParser = require('body-parser');

var app = express();
var port = 8190;

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

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//for generate GUID
var uuidv4 = require("uuid/v4");


mongoose.connect('mongodb://hugopuissant:bla1bla1@ds161144.mlab.com:61144/youmeo', function (err) {
    if(err){
        throw err;
    }else{
        console.log('mongo connected');
    }
});

//declare schema USER
var PlaylistSchema = Schema({
    playlist_id: {type: String, unique:true},
    name: String,
    date_created : Date,
    user_id: String,
    videos :[{
        order:Number,
        dateAdded: Date,
        video:{
            platform:String,
            video_id:String,
            title:String,
            uploader : String,
            duration: Number,
            thumbnail_URL:String,
            description:String
        }
    }]
});


//Init model
var PlaylistModel = mongoose.model('playlists', PlaylistSchema);


function computePlaylistDuration(listOfVideos, cb){
    var duration = 0;
    listOfVideos.forEach(vdo => {
        duration += vdo.video.duration;
    });
    cb(duration);
}

function computePlaylistVideoCount(listOfVideos, cb){
    var count = 0;
    if(listOfVideos.length != undefined){
        count = listOfVideos.length;
    }
    cb(count);
}

// GET PLAYLIST FOR USER
app.post('/silo/getPlaylistsForUser', function(request, response){
    module.exports.getPlaylistsForUser(request.body.user_id, function(res){
        response.send(res);
    })
});

// CREATE PLAYLIST
app.post('/silo/createPlaylist', function(request, response){
    module.exports.createPlaylist(request.body, function(res){
        response.send(res);
    })
});

// DELETE PLAYLIST
app.post('/silo/deletePlaylist', function(request, response){
    module.exports.deletePlaylist(request.body, function(res){
        response.send(res);
    })
});

// GET PLAYLIST VIDEOS
app.post('/silo/getPlaylistVideos', function(request, response){
    module.exports.getPlaylistVideos(request.body.playlist_id, function(res){
        response.send(res);
    })
});

// ADD VIDEO
app.post('/silo/addVideo', function(request, response){
    module.exports.addVideo(request.body.playlist_id, request.body.video, function(res){
        response.send(res);
    })
});

// DELETE VIDEO
app.post('/silo/deletevideo', function(request, response){
    module.exports.deletevideo(request.body, function(res){
        response.send(res);
    })
});


// GET PLAYLIST COUNT
app.post('/silo/getPlaylistCount', function(request, response){
    module.exports.getPlaylistCount(request.body.user_id, function(res){
        response.send(res);
    })
});


module.exports = {
    /**
     * Obtient la liste des playlist de l'utilisateur
     * @param {*} user_id 
     * @param {*} cb 
     */
    getPlaylistsForUser: function(user_id,cb){
        PlaylistModel.find({user_id:user_id}, function(err, data){
            if(err){
                throw err;
            }else{
                let ret = [];

                data.forEach(playlist => {
                    computePlaylistDuration(playlist.videos, function(duration){
                        computePlaylistVideoCount(playlist.videos, function(count){
                            ret.push({
                                name:playlist.name,
                                playlist_id:playlist.playlist_id,
                                date_created:playlist.date_created,
                                duration:duration,
                                videos_count:count
                            });
                        });
                    });
                });
                console.log(ret)
                cb(ret);
            }
        })
    },

    /**
     * Crée la playlist
     * @param {*} playlist 
     * @param {*} cb 
     */
    createPlaylist: function(playlist, cb){
        var playlistToAdd = new PlaylistModel({
            playlist_id : uuidv4(),
            name: playlist.name,
            user_id:playlist.user_id,
            date_created:new Date()
        });
        playlistToAdd.save(function(err){
            if(err){
                throw err;
            }else{
                cb({success:true, playlist_id:playlistToAdd.playlist_id});
            }
        });
    },

    /**
     * Supprime la playlist associée au user_id 
     * @param {*} data 
     * @param {*} cb 
     */
    deletePlaylist : function(data, cb){
        PlaylistModel.deleteOne({user_id:data.user_id, playlist_id:data.playlist_id},function(err,res){
            if(err){
                throw err;
            }else{
                if(res.deleteCount == 0){
                    cb(false);
                }else{
                    cb(true);
                }
            }
        });
    },

    /**
     * Obtient la liste des videos
     * @param {*} playlist_id 
     * @param {*} cb 
     */
    getPlaylistVideos : function(playlist_id, cb){
        PlaylistModel.findOne({playlist_id:playlist_id},'videos', function(err, res){
            if(err){
                throw err;
            }else{
                if(res == null){
                    cb({success:false});
                }else{
                    cb({success:true, res});
                }
            }
        });
    },

    /**
     * Ajoute la video dans la playlist
     * @param {*} playlist_id 
     * @param {*} video 
     * @param {*} cb 
     */
    addVideo: function(playlist_id, video, cb){
        PlaylistModel.findOne({playlist_id:playlist_id},'videos', function(err, res){
            if(err){
                throw err;
            }else if(res !=null){
                // console.log('lololollol');
                // console.log(video);
                computePlaylistVideoCount(res, function(count){
                    PlaylistModel.updateOne({playlist_id:playlist_id},
                        {$push : 
                            { videos:{
                                    order: count+1,
                                    dateAdded:new Date(),
                                    video:video
                                }
                            }
                        }, 
                        function(err, doc){
                            if(err){
                                throw err;
                            }else{
                                if(doc.modifiedCount == 0){
                                    cb(false);
                                }else{
                                    cb(true);
                                }
                            }
                    });
                });
            }else{
                cb(false);
            }
        });
    },

    /**
     * Supprime une video de la playlist
     * @param {*} data 
     * @param {*} cb 
     */
    deletevideo : function(data, cb){
        console.log(data)
        PlaylistModel.updateOne({playlist_id:data.playlist_id},{$pull:{videos:{video_id:data.video_id}}},function(err,res){
            if(err){
                throw err;
            }else{
                if(res.deleteCcount == 0){
                    cb(false);
                }else{
                    cb(true);
                }
            }
        });
    },

    /**
     * Renvoie le nombre de playlist de l'utilisateur
     * @param {*} user_id 
     * @param {*} cb 
     */
    getPlaylistCount: function(user_id,cb){
        PlaylistModel.count({user_id:user_id}, function(err, c){
            if(err){
                throw err;
            }else{
                cb({
                    success:true,
                    count:c
                });
            }
            
        });
    }
};


////////////////
console.log("Server started port " + port);
if(process.env.PORT !== undefined){
    port= process.env.PORT;
}
app.listen(port);

