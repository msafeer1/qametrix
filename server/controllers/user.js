'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Q = require('q'),
    User = mongoose.model('User');

/**
 * Auth callback
 *//*
exports.authCallback = function(req, res) {
    res.redirect('/');
};

*//**
 * Show login form
 *//*
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

*//**
 * Show sign up form
 *//*
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

*//**
 * Logout
 *//*
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

*//**
 * Session
 *//*
exports.session = function(req, res) {
    res.redirect('/');
};*/

/**
 * Create user
 */
exports.create = function(userObj) {
    var user = new User(userObj),
        message = null,
        createReq = Q.defer();

    user.provider = 'local';

    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Email already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }
            createReq.reject(message);
        } else {
            createReq.resolve(user);
        }
    });

    return createReq.promise;

    /*user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Email already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }

            return res.render('users/signup', {
                message: message,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });*/
};

/**
 * Send User
 *//*

exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

*/
/**
 * Find user by id
 *//*

exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};*/
