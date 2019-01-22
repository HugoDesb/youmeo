
var express = require('express');
var path = require('path');
var uuidv4 = require("uuid/v4");
var generator = require('generate-password');

var bodyParser = require('body-parser');

var app = express();
var port = 8290;

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


///////////////////////////    VIMEO const
let Vimeo = require('vimeo').Vimeo;

const client_id_vimeo = 'e2b3b14e1c2eed9d0af9d095857abad6ae603b7b';
const client_secret_vimeo = 'NoVQlmHrloTBs0iccZs02761zixPTXoaJ47K/YwY/jH7wm2rBIvyhpndphymgnpNmRg2+MolIMY/AD3oAu0Thq8loJPDvy9bgSHG4uwpVkuauYGtegtm+v1SXkG5H5Ki';
const access_token_vimeo = '21ad90ce75d7732a04fed86386e8f902';

const clientVimeo = new Vimeo(client_id_vimeo, client_secret_vimeo, access_token_vimeo);

///////////////////////////    YOUTUBE const

const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyDWbulPnxsPpzF01_pykyGX1jNzI84DINM',
});

const PLATFORM_YOUTUBE = 1;
const PLATFORM_VIMEO = 0;


/***
 * =====================================================================================
 * 
 *                                 PRIVATE FUNCTIONS
 * 
 * =====================================================================================
 */

async function privateSearchYoutube(maxResults, query, cb){
  const result =  await youtube.search.list({
      part: 'id,snippet',
      q: query,
      maxResults: maxResults,
      type: "video"
  });
  cb(result.data.items);
}

async function privateGetOneYoutube(videoId, cb){
  const result =  await youtube.videos.list({
      part: 'id,snippet',
      type: 'video',
      id: videoId,
  });
  cb(result.data.items[0]);
}

async function privateSearchVimeo(maxResults, query, cb){
  console.log("SILO RECHERCHE : " + maxResults)
  clientVimeo.request({
    method: 'GET',
    path: '/videos',
    query: {
      page: 1,
      per_page: maxResults,
      query: query,
      sort: 'relevant',
      direction: 'asc'
    }
  }, function (error, body, status_code, headers) {
    if (error) {
      console.log(error);
    }else{
      cb(body);
    }
  });
} 

async function privateGetOneVimeo(videoId, cb){
  clientVimeo.request({
    method: 'GET',
    path: '/videos/'+videoId,
  }, function (error, body, status_code, headers) {
    if (error) {
      throw error;
    }else{
      cb(body);
    }
  });
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
     * Recherche sur les deux plateformes (actuellement)
     * platformID & skip ne soervent a rien pour l'instant
     * @param {{query:string, platform:number, skip:number, resultsMax:number}} request 
     * @param {requestCallback} cb 
     */
    search: function(request,cb){
      console.dir(request);
      let ret = {};

      privateSearchYoutube(request.maxResults, request.query, function(dataYT){
          ret.youtube = dataYT;
          privateSearchVimeo(request.maxResults, request.query, function(dataVIMEO){
            console.log("SEARCH FN: " + request);
            ret.vimeo = dataVIMEO;
            cb(ret);
          })
      })
    },

    /**
     * Obtient la video demandée
     * @param {{videoId:string, platformId:number}} request 
     * @param {requestCallback} cb 
     */
    getOne : function(request, cb){
      if(request.platformId == PLATFORM_YOUTUBE){
        privateGetOneYoutube(request.videoId,function(data){
          cb(data);
        });
      }else{
        privateGetOneVimeo(request.videoId, function(data){
          cb(data);
        });
      }
    }
}


/***
 * =====================================================================================
 * 
 *                                 ACCESS ENDPOINTS
 * 
 * =====================================================================================
 */

// SEARCH
app.post('/silo/search', function(request, response){
  console.dir(request.body);
  module.exports.search(request.body, function(res){
      response.send(res);
  })
});

// GET ONE
app.post('/silo/getOne', function(request, response){
  module.exports.getOne(request.body, function(res){
      response.send(res);
  })
});



////////////////
console.log("Server started port " + port);
if(process.env.PORT !== undefined){
    port= process.env.PORT;
}
app.listen(port);
