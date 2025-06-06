const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 5; //we can change this later idt it matters for our use tho

const db = require('./db');
const { hash } = require('crypto');

const PORT = 5000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

db.createTable();

app.use(session({
  secret: 'secret-key-1234', // change
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

//routes
app.get('/', (req, res) => {
  db.getRecentPosts((err, posts) => {
    if (err) {
      console.error(err);
      return res.render('home', { loggedIn: !!req.session.user, posts: [] });
    }

    console.log('Posts from DB:', posts);
    res.render('home', {
      loggedIn: !!req.session.user,
      posts
    });
  });
});

app.post('/', (req, res) => {
  res.render('home', { loggedIn: !!req.session.user });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const {username, password, confirm_password} = req.body;
  if(password !== confirm_password){
    return res.render('register', { error: 'Passwords dont match' });
  }
  try{
    const hashedPassword = await hashPassword(password);
    console.log("eeeeee"+ hashedPassword)
    db.addUser(username, hashedPassword);
    res.redirect('/login');
  }
  catch (err){
    console.error(err);
    res.render('register', { error: 'Error registering user' });
  }
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  if (req.session.user) {
    return res.redirect('/');
  }
  db.getUser(username, async (err, user) => {
    if(err){
      return res.render('login', { error: 'Database error' });
    }
    //if(user) console.log('Hashed password from DB:', user.password);
    //console.log("yumyumyumyumyum " + password)
    if(!user || !(await comparePassword(password, user.password))){
      //console.log("burpburpburp")
      return res.render('login', { error: 'Invalid credentials' });
    }


    req.session.user = {
      id: user.userID,
      username: user.username,
      userHandle: user.userHandle,
    };
    //console.log("sucessfull loginnnnn");
    res.redirect('/');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
  if (err) console.error('log out error:', err);
    res.redirect('/');
  });
});

app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  posts = db.getPostsByPoster(req.session.user.userID, (err, pr) => {
    if (err) {
      console.error(err);
      return res.render('home', { loggedIn: !!req.session.user, posts: [] });
    }

    if(pr){
      res.render('profile', { user: req.session.user, pr});
    }
  })

  res.render('profile', { user: req.session.user, posts: []});
});

app.get('/notis', (req, res) => {
  res.render('notis');
});

app.get('/dm', (req, res) => {
  res.render('dm');
});

app.get('/create', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('create');
});

app.post('/create', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { post, mediaUrl, profileImageUrl} = req.body;
  console.log("someones trying to post " + post)


  console.log("Post submitted: ", post);
  console.log("Media URL: ", mediaUrl);

  if(mediaUrl){
    db.addPost(post, mediaUrl, profileImageUrl, null, null, req.session.user.username, null);
  }
  else{
    if (!post || post.trim() == ' ') {
      return res.render('create', { error: 'Nothing to post!' });
    }
    db.addPost(post, null, profileImageUrl, null, null, req.session.user.username, null);
  }

  res.redirect('/');
});


//helpies
function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
