var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('drinks');
    collection.find({},function(e,docs){
        //var json = JSON.stringify(docs, undefined, 2)
        //var json_parsed = JSON.parse(docs);

        var drinks = [];
        docs.forEach(function(item, index) {
            //console.log(item.name);
            drinks.push(item.name);
            //console.log("\n");
        });

        //console.log(json_parsed["56a290c55d08dd13939871d8"].name);
        res.render('userlist', {
            "drinks" : drinks
        });
    });
});

module.exports = router;
