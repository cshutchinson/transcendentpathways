var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var Musician = require('../models/Musician');
var Facility = require('../models/Facility');
var secrets = require('../config/secrets');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      if (user.accountType==='Admin'){
        res.redirect(req.session.returnTo || '/homeAdmin');
      } else if (user.accountType==='Musician'){
        res.redirect(req.session.returnTo || '/homeMusician');
      } else if (user.accountType==='Facility'){
        res.redirect(req.session.returnTo || '/homeFacility');
      } else {
        res.redirect(req.session.returnTo || '/');
      }
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/signup', {
    title: 'Create Account'
  });
};
exports.getSignupMusician = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/signupMusician', {
    title: 'Create Musician Account'
  });
};
exports.getSignupFacility = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/signupFacility', {
    title: 'Create Facility Account'
  });
};
exports.getMusicianDetails = function(req, res){
  if(!req.user) return res.redirect('/');
  res.render('account/musicianDetails', {
    title: 'Musician - Performer Details'
  });
};
exports.getFacilityDetails = function(req, res){
  if(!req.user) return res.redirect('/');
  res.render('account/facilityDetails', {
    title: 'Facility Details'
  });
};
exports.postMusicianDetails = function(req, res, next){
  var musician = new Musician({
    performerName: req.body.performerName || '',                   // Not sure if   || ''  is needed
    userIds: req.user._id || '',
    contactName: req.body.contactName || '',
    address1: req.body.address1 || '',
    address2: req.body.address2 || '',
    city: req.body.city || '',
    state: req.body.state || '',
    zipcode: req.body.zipcode || '',
    phone: req.body.phone || '',
    instruments: req.body.instruments || '',
    website: req.body.website || '',
    picture: req.body.picture || '',
    biography: req.body.biography || ''
  });
  musician.save(function(err) {
    if (err) return next(err);
    res.redirect('/homeMusician');
  });
};
exports.postFacilityDetails = function(req, res, next){
  var facility = new Facility({
    facilityName: req.body.facilityName || '',
    userIds: req.user._id || '',
    address1: req.body.address1 || '',
    address2: req.body.address2 || '',
    city: req.body.city || '',
    state: req.body.state || '',
    zipcode: req.body.zipcode || '',
    contactName: req.body.contactName || '',
    contactPhone: req.body.contactPhone || '',
    contactEmail: req.body.contactEmail || '',
    buildingName: req.body.buildingName || '',
    locationName: req.body.locationName || '',
    roomSize: req.body.roomSize || '',
    securityNeeded: req.body.securityNeeded || '',
    waiverNeeded: req.body.waiverNeeded || '',
    patientNumber: req.body.patientNumber || ''
  });
  facility.save(function(err) {
    if (err) return next(err);
    res.redirect('/homeFacility');
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.assert('accountType', 'Account type is not valid').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
    accountType: req.body.accountType
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      if(req.body.accountType==='Musician') {
        res.redirect('/signupMusician');
      } else if (req.body.accountType==='Facility'){
        res.redirect('/signupFacility');
      } else {
        res.redirect('/home');
      }
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        if(req.body.accountType==='Musician' && !existingUser) {
          res.redirect('/musicianDetails');
        } else if (req.body.accountType==='Facility' && !existingUser){
          res.redirect('/facilityDetails');
        } else {
          res.redirect('/home');
        }
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/account');
    });
  });
};


exports.getUpdateMusicianDetails = function(req, res) {

  Musician.findOne( { userIds : { $all : [ req.user._id ] } }, function(err, musician) {

    if (musician === null) return null;

    res.render('account/updateMusicianDetails', {
      title: 'Update Musician Details',
      performerName: musician._doc.performerName,
      address1: musician._doc.address1,
      address2: musician._doc.address2,
      city: musician._doc.city,
      state: musician._doc.state,
      zipcode: musician._doc.zipcode,
      phone: musician._doc.phone,
      instruments: musician._doc.instruments,
      website: musician._doc.website,
      picture: musician._doc.picture,
      biography: musician._doc.biography
    });
  });
};


exports.postUpdateMusicianDetails = function(req, res, next) {
  Musician.findOne( { userIds : { $all : [ req.user._id ] } }, function(err, musician) {

    if (err) return next(err);   // added to prevent crash, should change this to proper error

    musician.performerName = req.body.performerName || '';
    musician.address1 = req.body.address1 || '';
    musician.address2 = req.body.address2 || '';
    musician.city = req.body.city || '';
    musician.state = req.body.state || '';
    musician.zipcode = req.body.zipcode || '';
    musician.phone = req.body.phone || '';
    musician.instruments = req.body.instruments || '';
    musician.website = req.body.website || '';
    musician.picture = req.body.picture || '';
    musician.biography = req.body.biography || '';

    musician.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Musician Details Updated for ' + musician.performerName });
      res.redirect('/account');
    });
  });
};



exports.getUpdateFacilityDetails = function(req, res) {

  Facility.findOne( { userIds : { $all : [ req.user._id ] } }, function(err, facility) {

    if (facility === null) return null;   // added to prevent crash, should change this to proper error

    res.render('account/updateFacilityDetails', {
      title: 'Update Facility Details',
      facilityName: facility._doc.facilityName,
      address1: facility._doc.address1,
      address2: facility._doc.address2,
      city: facility._doc.city,
      state: facility._doc.state,
      zipcode: facility._doc.zipcode,
      contactName: facility._doc.contactName,
      contactPhone: facility._doc.contactPhone,
      contactEmail: facility._doc.contactEmail,
      buildingName: facility._doc.buildingName,
      locationName: facility._doc.locationName,
      roomSize: facility._doc.roomSize,
      securityNeeded: facility._doc.securityNeeded,
      waiverNeeded: facility._doc.waiverNeeded,
      patientNumber: facility._doc.patientNumber
    });
  });
};

exports.postUpdateFacilityDetails = function(req, res, next) {
  Facility.findOne( { userIds : { $all : [ req.user._id ] } }, function(err, facility) {

    if (err) return next(err);

    facility.facilityName = req.body.facilityName || '';
    facility.address1 = req.body.address1 || '';
    facility.address2 = req.body.address2 || '';
    facility.city = req.body.city || '';
    facility.state = req.body.state || '';
    facility.zipcode = req.body.zipcode || '';
    facility.contactName = req.body.contactName || '';
    facility.contactPhone = req.body.contactPhone || '';
    facility.contactEmail = req.body.contactEmail || '';
    facility.buildingName = req.body.buildingName || '';
    facility.locationName = req.body.locationName || '';
    facility.roomSize = req.body.roomSize || '';
    facility.securityNeeded = req.body.securityNeeded || '';
    facility.waiverNeeded = req.body.waiverNeeded || '';
    facility.patientNumber = req.body.patientNumber || '';


    facility.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Facility Details Updated for ' + facility.facilityName });
      res.redirect('/account');
    });
  });
};






/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.password = req.body.password;

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) return next(err);
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'tp@example.com',
        subject: 'Your Transcendent Pathways Scheduler password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'tp@example.com',
        subject: 'Reset your password on Transcendent Pathways Scheduler',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};