const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.status(200).render('login', {active: 'login'});
});

router.get('/register', (req, res, next) => {
    res.status(200).render('register', {active: 'register'});
});

router.post('/logout', ensureAuthenticated, (req, res, next) => {
    console.log('User ' + req.user.login + ' logged out successfully.');
    req.session.destroy();
    req.logout();
    //res.locals.user = null;
    res.status(200).redirect('/');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login'
    }) (req, res, next);
})

router.post('/register', (req, res, next) => {
    const {login, firstname, lastname, email, password, password_confirm} = req.body;
    let errors = [];
    //console.log('Login: ' + login + ' Firstname: ' + firstname + ' Lastname: ' + lastname + ' Email: ' + email + ' Password: ' + password);
    if(!login || !firstname || !lastname || !email || !password || !password_confirm) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if(password != password_confirm) {
        errors.push({msg: 'Passwords do not match'});
    }
    if(password.length < 6) {
        errors.push({msg: 'Password has to be at least 6 characters long'});
    }
    if(errors.length > 0) {
        res.render('register', {
            errors: errors,
            login: login,
            firstname: firstname,
            lastname: lastname,
            email: email,
            active: 'register'
        });
    } else {
        User.findOne({email : email}).exec((error, user) => {
            console.log(user);
            if(user) {
                errors.push({msg: 'There is already an account using this email'});
                res.status(400).render('register', {errors, login, firstname, lastname, email, password, password_confirm, active: 'register'});
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    login: login,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password
                });

                bcrypt.genSalt(10, (error, salt) =>
                bcrypt.hash(user.password, salt,
                    (error, hash) => {
                        if(error) throw error;
                            user.password = hash;
                        user.save()
                        .then(() => {
                            res.status(200);
                        })
                        .catch(value => console.log(value));
                    }));
            }
        });
    }
    
})

module.exports = router;