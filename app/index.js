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
  const hashedPassword = hashPassword(password);
  db.addUser(username, username, hashedPassword);
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const hashed = hashPassword(password);

  db.getUserID(username, (err, user) => {
    if (err) {
      return res.render('login', { error: 'Database error' });
    }

    if (!user || user.password !== hashed) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.userID,
      username: user.username,
      userHandle: user.userHandle
    };

    res.redirect('/');
  });



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
