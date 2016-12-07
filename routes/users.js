var express = require('express');
var router = express.Router();
var passport = require('passport');

var Account = require('../models/account.js');

var TaskProfile = require('../models/taskprofile');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

router.post('/register', function(req, res) {

  Account.register(new Account({
     username: req.body.username,
     email: req.body.email
   }), req.body.password , function(err, account) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        err: err
      });
    }

    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });// #authenticate
  }); //# callback
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.get('/username', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({

    });
  }
  res.status(200).json({
    username: req.user.username
  });
})


router.get('/ping', function(req, res) {
  res.status(200).send("pong!");
})


router.get('/settings/', isAuthenticated, function(req, res) {
    var accountPromise = Account.find({ "_id" : req.user._id }).exec();

    accountPromise.then(function(data) {
      var account = data[0];
      res.status(200);
      res.send(account.config);
    })
    .catch(function(err) {
      res.status(400).json({
        msg: "Cannot get user settings"
      });
    });
});


router.post('/settings/', isAuthenticated, function(req, res) {
    var accountPromise = Account.find({ "_id": req.user._id }).exec();

    var config = req.body;
    if(config.profile.name != undefined ||  typeof config.profile.name === 'string') {

      accountPromise.then(function(data) {
        var account = data[0];
        account.config.profile = config.profile.name;
        return account.save();
      })
      .then(function(data) {
        res.status(200).json({
          msg: "Settings saved successfully!"
        });
      })
      .catch(function(err) {
        res.status(400).json({
          msg: "Cannot save user settings"
        });
      });

    } else {
      res.status(400).json({
        msg : 'Invalid data'
      })
    }


});

module.exports = router;
