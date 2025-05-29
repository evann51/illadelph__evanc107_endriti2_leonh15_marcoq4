const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const crypto = require('crypto');

const db = require('./db');

const PORT = 5000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

db.createTable();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

app.use(session({
  secret: 'secret-key-1234', // change
  resave: false,
  saveUninitialized: true
}));

//routes
app.get('/', (req, res) => {
  res.render('home', { loggedIn: !!req.session.user });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  var { username, password, confirm_password } = req.body;
  console.log(username)
  db.addUser(username, username, password);
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  var { username, password } = req.body;
  var hashed = hashPassword(password);
  console.log(username);
  var ID = db.getID(username);
  console.log("yummy: " + ID);
  var correctPass = db.getPassword(ID);
  if (correctPass == password){
    console.log(correctPass);
    console.log(password);
    req.session.user = {
      id: user.UserID,
      username: user.username,
      userHandle: user.userHandle
    };

    res.redirect('/');
  }
  else{
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('profile', { user: req.session.user });
});

app.get('/notis', (req, res) => {
  res.render('notis');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
