const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
require('./src/config/passport')(passport);
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const expressEjsLayout = require('express-ejs-layouts');

var favicon = require('serve-favicon');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

mongoose.connect('mongodb+srv://'+process.env.DB_USERNAME+':'+process.env.DB_PASSWORD+'@'+process.env.DB_URL+'/'+process.env.DB_NAME+'?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('ATLAS - Connected'))
.catch((error) => console.log(error));

app.set('view engine', 'ejs');
app.use(expressEjsLayout);
app.use(express.urlencoded({extended : false}));

app.use(morgan('common'));

app.use(express.static(path.join(__dirname, 'src')));
app.set('views', path.join(__dirname, '/src/views'));
app.use(favicon(path.join(__dirname, 'favicon.ico')));

const indexRoutes = require('./src/routes/index');
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.notes = '';
    res.locals.user = req.user;
    next();
})

// Routing & redirections
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/favicon.ico', (req, res, next) => {
    res.status(404);
}) 

module.exports = app;