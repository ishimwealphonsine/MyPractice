// 1. Dependencies
const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();
const connectDb = require('./config/db');
// Import User model
const User = require('./models/User');

// 2. Instantiations
const app = express();
const port = 4000;

// 3. Configuration
// Set templating engine to pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
connectDb();

// 4. Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Logging middleware to log the time of each request
app.use((req, res, next) => {
  console.log('A new request received at ' + Date.now());
  next();
});

// Express session configuration
app.use(expressSession({
  secret: 'thisIsMyNyondoStockProject',
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
app.use('/', require('./routes/indexRoutes'));
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/adminRoutes'));
app.use('/', require('./routes/storeRoutes'));
app.use('/', require('./routes/salesRoutes'));

// Handling non-existent routes
app.use((req, res) => {
  res.status(404).send('Oops! Route not found');
});

// 6. Bootstrap Server
app.listen(port, () => console.log(`listening on port ${port}`));