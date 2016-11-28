var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Task = require('../models/task');

var query = require('./tasks.query');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};


/**
 *  GET categories
 */

router.get('/categories/', function(req, res) {
    var cat = [ "Instalacja",
        "Konfiguracja",
        "Testy"];


    res.status(200);
    res.send(JSON.stringify(cat));
});

router.get('/projects/', function(req, res) {

})


module.exports = router;
