const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            User.findOne({email : email})
            .then((user) => {
                if(!user) {
                    return done(null, false, {
                        message: 'This email is not registered in our database'
                    });
                }
                bcrypt.compare(password, user.password, (error, isMatch) => {
                    if(error) throw error;
                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: 'Incorrect password'
                        });
                    }
                })
            })
            .catch((error) => {
                console.log(error);
            })
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(error, user) {
            done(error, user);
        });
    });
}