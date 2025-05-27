const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const db = require{'./db'}

const PORT = 5000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

db.createTable();

// Utility: Hash password with SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Routes

app.get('/', (req, res) => {
  res.render('home', {});
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

  // Use your own DB method
  db.addUser(username, userHandle, hashed, null, null, (err) => {
    if (err) {
      return res.render('register', { error: 'Registration failed: ' + err.message });
    }
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { userHandle, password } = req.body;
  const hashed = hashPassword(password);

  // Raw sqlite3 query (or you can write a getUserByHandle function)
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./dwitter.db');

  db.get("SELECT * FROM userData WHERE userHandle = ?", [userHandle], (err, row) => {
    if (err) {
      db.close();
      return res.render('login', { error: 'Database error' });
    }

    if (!row || row.password !== hashed) {
      db.close();const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
  secret: 'secret-key-1234', // Change this to a secure key
  resave: false,
  saveUninitialized: true
}));

// Hash function using built-in crypto
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Routes
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

  const db = new sqlite3.Database('./dwitter.db');
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

  const db = new sqlite3.Database('./dwitter.db');
  const sql = `SELECT * FROM userData WHERE userHandle = ? AND password = ?`;

  db.get(sql, [userHandle, hashed], (err, user) => {
    if (err) {
      console.error(err);
      return res.render('login', { error: 'Something went wrong' });
    }

    if (user) {
      req.session.user = {
        id: user.userID,
        username: user.username,
        userHandle: user.userHandle
      };
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  });

  db.close();
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

// Example protected route
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('profile', { user: req.session.user });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

      return res.render('login', { error: 'Invalid credentials' });
    }

    db.close();
    // Auth successful
    res.redirect('/');
  });
});

app.get('/notis', (req, res) => {
  res.render('notis', {});
});

// Start server
app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
