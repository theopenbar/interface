var express = require('express');
var router = express.Router();

// open drinks collection and pass json data and length to next function
function getDatabase(req, res, next) {
    // let's open the drinks collection
    var db = req.db;
    var collection = db.get('drinks');
    collection.find({},function(e,result){
        req.json = JSON.stringify(result, undefined, 2);
        req.length = result.length;
        //console.log(req.json);
        //console.log(req.length);
        return next();
    });
}

// query the database for any drinks that contain 'cola'
function queryDatabase(req, res) {
    // let's open the drinks collection
    // we actually don't need to do this here, because we have the whole database
    // stored in req.json right now, but let's do it for the learning experience
    var db = req.db;
    var collection = db.get('drinks');
    collection.find({ "recipe.cola": { $exists: true } },function(e,result){
        req.json2 = JSON.stringify(result, undefined, 2);
        req.length2 = result.length;
        res.render('drinks', {json: req.json, length: req.length, json2: req.json2, length2: req.length2})
    });
}

router.get('/', getDatabase, queryDatabase);

module.exports = router;
