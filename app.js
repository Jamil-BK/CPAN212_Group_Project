const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false
}));

// Share user with all views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});

// Routes
app.use('/movies', movieRoutes);
app.use('/', authRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('home', { title: 'Welcome' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Export Express app (NOT serverless)
module.exports = app;
