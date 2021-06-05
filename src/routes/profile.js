const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/', ensureAuthenticated, (req, res, next) => {
    res.status(200).render('profile', {active: 'profile', user: req.user});
})

router.post('/', ensureAuthenticated, (req, res, next) => {
    User.findById(req.user.id, function(error, user) {
        const {login, firstname, lastname, email} = req.body;
        let errors = [];
        if(!login || !firstname || !lastname || !email) {
            errors.push({msg: "One or more fields are empty"});
        }
        if(errors.length > 0) {
            res.status(500).render('profile', {
                errors: errors,
                login: login,
                firstname: firstname,
                lastname: lastname,
                email: email,
                active: 'profile'
            });
        } else {
            user.login = login;
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;

            user.save(function (error, value) {
                if(error) {
                    errors.push({msg: error});   
                    res.status(500).render('profile', {
                        errors: errors,
                        login: login,
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        active: 'profile'
                    });
                }
                console.log(value);
                res.status(200);
            });
        }
    });
})

module.exports = router;
