var express = require('express');
var router = express.Router();

var join = require('path').join;

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	console.log('not authenticated');
	var message = req.flash('message');
	res.redirect('/login');
};

var getRoot = function() {
	var root = join(__dirname, '/..');
	root = join(root, '/public/');
	return root;
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', isAuthenticated, function(req, res) {
		var message = req.flash('message');
		var root = join(__dirname, '/..');
		root = join(root, '/public/');
		var message = req.flash('message');
		res.sendFile('index.html', { root: root, message: message} );

	});

	/* GET Login Page */
	router.get('/login', function(req, res){
		var root = join(__dirname, '/..');
		root = join(root, '/public/');
		var message = req.flash('message');
		console.log('Flash message: ' + message);
		//res.send({message : message});
		res.sendFile('login.html', { root: root, message: message} );

	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		//res.render('register',{message: req.flash('message')});
		var root = join(__dirname, '/..');
		root = join(root, '/public/');
		var message = req.flash('message');
		//res.send({message : message});
		res.sendFile('register.html', { root: root, message: message} );

	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		//res.render('tasks', { user: req.user });
		var root = join(__dirname, '/..');
		root = join(root, '/public/');
		res.sendFile('home.html', { root: root});
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}
