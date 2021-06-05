const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    res.status(200).render('welcome', {active: 'home'});
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
    res.status(200).render('profile', {active: 'profile', user: req.user});
})

router.post('/profile', ensureAuthenticated, (req, res, next) => {
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

            user.save()
            .then((value) => {
                console.log(value);
                res.status(301).redirect('/profile');
            })
            .catch(error);
        }
    });
})

router.get('/about', (req, res, next) => {
    res.status(200).render('about', {active: 'about'});
});

router.get('/contact', (req, res, next) => {
    res.status(200).render('contact', {active: 'contact'});
});

router.post('/contact', (req, res, next) => {
    const {subject, message, firstname, lastname, email} = req.body;
    const errors = []
    const smtpTrans = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        logger: true,
        //debug: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOpts = {
        from: email,
        to: process.env.MAIL_USER,
        subject: subject,
        text: `First name: ${firstname}\nLast name: ${lastname}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    };

    smtpTrans.sendMail(mailOpts, (error, response) => {
        let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress.replace('::ffff:', '');
        if(error) {
            errors.push({msg: 'There was an issue with sending your contact form. Please try again.'});
            console.log(ip + ' - Error with sending contact form: ' + error);
            res.status(500).render('contact', {errors: errors, active: 'contact'});
        } else {
            console.log(ip + ' - Contact form successfully sent from ' + email);
            if(req.isAuthenticated()) {
                res.status(200).send({authenticated: true});
            } else {
                res.status(200).send({authenticated: false});
            }
        }
    });
});

module.exports = router;