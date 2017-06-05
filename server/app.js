var express = require('express');
    path = require('path'),
    fs = require('fs'),
    request = require('request-promise'),
    bodyParser = require('body-parser')
    mkdirp = require('mkdirp');

/**
 * 
 * @param {String} userId The user's facebook userID
 * @param {String} albumId The album id to download
 * @param {String} photoId The photo id 
 * @param {String} uri The photo's link
 * 
 * @return {Promise} Promise from `request-promise`
 */
var download = function(userId, albumId, photoId, uri){
  return request.head(uri, function(err, res, body){
    const filename = photoId;

    let extention = '.jpg';
    let dir = 'public/imports/' + userId;

    // TODO Add other files type extensions
    switch (res.headers['content-type']) {
        case 'image/jpeg':
            extention = '.jpg';
            break;
        default:
            extention = '.jpg';
            break;
    }

    // First check that the user folder exists
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    dir = dir.concat('/', albumId);

    // Then check that the album folder exists
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    // Get the file and write it to desired path
    request(uri)
    .pipe(
        fs.createWriteStream(dir.concat('/', filename, extention))
    );
  });
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    });
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '..', 'build')));
    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
    });
}

/**
 * @description Imports a facebook album
 * 
 * @param {String} accessToken AccessToken to use for graph API
 * @param {String} albumId Album id to import
 * @param {String} userId The user's facebook userID
 * 
 */
app.post('/import/photo/', (req, res) => {
    const accessToken = req.body.accessToken;
    const userId = req.body.userId;
    const albumId = req.body.albumId;
    const photoId = req.body.photoId;

    const options = {
        method: 'GET',
        uri: `https://graph.facebook.com/v2.8/${photoId}?fields=name,images`,
        qs: {
            access_token: accessToken
        }
    };

    request(options)
    .then(function(fbRes) {
        jsonRes = JSON.parse(fbRes);
        console.log(jsonRes);

        download(userId, albumId, jsonRes.id, jsonRes.images[0].source)
        .then(function() {
            res.json(jsonRes);
        });
    })
});

module.exports = app;
