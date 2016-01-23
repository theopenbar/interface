var express = require('express');
var router = express.Router();

/* no longer using because this file is only for serving drinks collection

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
*/

router.get('/', function(req, res) {
    // let's open the drinks collection
    var db = req.db;
    var collection = db.get('drinks');
    collection.find({},function(err, drinks){
        if (err) throw err;
        res.json(drinks);
    });
});

module.exports = router;
