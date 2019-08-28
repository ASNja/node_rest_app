var express = require('express');
var router = express.Router();

/* GET userlist. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({}, {}, function(e, docs) {
        res.json(docs);
    });
});

/* POST to adduser. */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


/* DELETE to deleteuser. */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id': userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
    });
});

// ///////////////////////////////////////////

// / GET ONE V1
// router.get('/:id', function(req, res) {
//     var db = req.db;
//     var collection = db.get('userlist');
//     var userToGet = req.params.id;
//     collection.find({ '_id': userToGet }, function(e, docs) {
//         res.json(docs);
//         console.log(res.json(docs));
//     });
// });


// /// GET ONE V2
// router.get('/:id', function(req, res) {
//     var db = req.db;
//     var collection = db.get('userlist');
//     collection.find({}, { projection: { _id: 0, username: 1, age: 1 } }).toArray(function(err, result) {
//         res.json(result) // TEST 
//         console.log(result);
//     });
// });




module.exports = router;