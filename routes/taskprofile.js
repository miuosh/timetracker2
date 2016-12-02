var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Task = require('../models/taskprofile');

var query = require('./taskprofile.query');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

/*
 GET all profiles
*/
router.get('/', function(req, res) {
  var getProfilePromise = query.getProfiles();

  getProfilePromise.then(function(data) {
    res.status(200);
    res.send(data);
  })
  .catch(function(err) {
    res.status(400);
    res.send(JSON.stringify(err));
  });

});
/*
 GET profile of given ID
*/
router.get('/:id', function(req, res) {
  var getProfilePromise = query.getProfile(req.params.id);

  getProfilePromise.then(function(data) {
    res.status(200);
    res.send(data);
  })
  .catch(function(err) {
    res.status(400);
    res.send(JSON.stringify(err));
  });
});

/*
  POST - add new TaskProfile
*/

router.post('/', isAuthenticated, function(req, res) {
    var profile = req.body;
    console.log(profile);
    var addProfilePromise = query.addProfile(profile);

    addProfilePromise.then(function(data) {
      res.status(200);
      res.send(data);
    })
    .catch(function(err) {
      res.status(400);
      res.send(JSON.stringify(err));
    });
});
/*
  POST - edit existing profile
*/
router.post('/:id', isAuthenticated, function(req, res) {
    var profile = req.body;
    var id = req.params.id;
    var editProfilePromise = query.editProfile(id,profile);

    editProfilePromise.then(function(data) {
      res.status(200);
      res.send(data);
    })
    .catch(function(err) {
      res.status(400);
      res.send(JSON.stringify(err));
    });
});
/*
  DELETE - remove existing TaskProfile
*/
router.delete('/:id', isAuthenticated, function(req, res) {
    var removeProfilePromise = query.removeProfile(req.params.id);

    removeProfilePromise.then(function(data) {
      res.status(200);
      res.send(data);
    })
    .catch(function(err) {
      res.status(400);
      res.send(JSON.stringify(err));
    });
});


module.exports = router;
