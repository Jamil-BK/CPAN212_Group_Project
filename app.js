const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const methodOverride = require('method-override');
const path = require('path');
const serverless = require('serverless-http');
const app = express();

// this is the EJS template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// the middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

// session setup
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));

// make user available in all views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});

// have the routes below with one another
app.use('/movies', movieRoutes);
app.use('/', authRoutes);

// home route
app.get('/', (req, res) => {
  res.render('home', { title: 'Welcome' });
});

// added my own mongodb for the sake of simplicity; feel free to change it. user/pass are in the link
//mongoose.connect('mongodb+srv://dbUser:Password123@cluster0.t4bu3fl.mongodb.net/?appName=Cluster0')
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

module.exports = serverless(app);
