// 1. Dependencies
const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();
const connectDb = require('./config/db');
// Import User model
const User = require('./models/Signup');

// 2. Instantiations
const app = express();
const port = 5000;

// 3. Configuration
// Set templating engine to pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
connectDb();

// 4. Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Express session configuration
app.use(expressSession({
  secret: 'thisIsMyPractiseProject',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global variable to make the logged user available to all pug templates.
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next();
})


// 5. Routes
app.use('/', require('./routes/productRoutes'));
app.use('/', require('./routes/authRoutes'));

// logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/dashboard');
    }

    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Handling non-existent routes
app.use((req, res) => {
  res.status(404).send('Oops! Route not found');
});

// 6. Bootstrap Server
app.listen(port, () => console.log(`listening on port ${port}`));