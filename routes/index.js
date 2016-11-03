var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
//res.send('hello world');

var root = join(__dirname, '/..');
	root = join(root, '/public/');
	var message = req.flash('message');
	//res.send({message : message});
	res.sendFile('index.html', { root: root, message: message} );
});



module.exports = router;
