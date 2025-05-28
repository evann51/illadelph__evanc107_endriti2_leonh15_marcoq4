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
  const { username, userHandle, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.render('register', { error: 'Passwords do not match' });
  }

  const hashed = hashPassword(password);

  const db = new sqlite3.Database('./dwitter.db'); // marco fix this plz
  const sql = `INSERT INTO userData (username, userHandle, password) VALUES (?, ?, ?)`;

  db.run(sql, [username, userHandle, hashed], function(err) {
    if (err) {
      console.error(err);
      return res.render('register', { error: 'Username or handle may already be taken.' });
    }
    res.redirect('/login');
  });

  db.close();
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { userHandle, password } = req.body;
  const hashed = hashPassword(password);

  db.getUserByHandle(userHandle, (err, user) => {
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
