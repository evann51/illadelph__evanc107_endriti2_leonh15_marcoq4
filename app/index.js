const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 5; //we can change this later idt it matters for our use tho

const db = require('./db');
const aipi = require('./api');
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
  if (!req.session.user) return res.redirect('/login');

  db.getPostsByPoster(req.session.user.userID, (err, pr) => {
    if (err) {
      console.error(err);
      return res.render('home', { loggedIn: !!req.session.user, posts: [] });
    }
    res.render('profile', { user: req.session.user, posts: pr || [] });
  });
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

  const { post, mediaUrl, profileImageUrl } = req.body;

  if (!post || post.trim() === '') {
    return res.render('create', { error: 'Nothing to post!' });
  }

  if (mediaUrl) {
    db.addPost(post, mediaUrl, profileImageUrl, null, null, req.session.user.username, null);
  } else {
    db.addPost(post, null, profileImageUrl, null, null, req.session.user.username, null);
  }

  setTimeout(() => {
    db.getMostRecentPost((err, recentPost) => {
      if (err || !recentPost) {
        console.error('Failed to get most recent post after adding');
        return;
      }
      scheduleBotReply(recentPost.dweetID);
    });
  }, 100);

  res.redirect('/');
});


app.get("/post", (req, res) => {
  return res.redirect('/')
})

app.get('/post/:id', (req, res) => {
  const postId = req.params.id;

  db.getPost(postId, (err, post) => {
    if (err || !post) {
      return res.status(404).send('Post not found');
    }

    db.getAllReplies(postId, (err, replies) => {
      if (err) {
        return res.status(500).send('Error loading replies');
      }

      replies.sort((a, b) => a.dweetID - b.dweetID);

      // console.log("Post:", post);
      res.render('post', { post, replies, user: req.session.user });
    });
  });
});



app.post('/post/:id', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const postId = req.params.id;
  const {post, mediaUrl,profileImageUrl } = req.body;
  console.log("eeeePOSTPOSTPOST" + postId)
  if(mediaUrl){
    db.addPost(post,mediaUrl,profileImageUrl,null,null,req.session.user.username,postId, (err) => {
      if (err) {
        return res.status(500).send('Error saving reply');
      }
      res.redirect(`/post/${postId}`);
    });
  }
  else{
    db.addPost(post,null,profileImageUrl,null,null,req.session.user.username,postId, (err) => {
      console.log("e")
      if (err) {
        return res.status(500).send('Error saving reply');
      }

      res.redirect(`/post/${postId}`);
    });
  }
  res.redirect('/')
});


//helpies
function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

//ai work
function scheduleBotReply(originalPostId) {
  const delayMs = Math.floor(Math.random() * (28000 - 8000 + 1)) + 8000;

  setTimeout(async () => {
    try {
      db.getPost(originalPostId, async (err, post) => {
        if (err || !post) {
          console.error('Original post not found for bot reply');
          return;
        }

        const randomNum = Math.floor(Math.random() * 6) + 1;
        const botReply = await generateAIReply(post, randomNum);

        const botUser = generateBotUsername();
        const botProfileImageUrl = `https://github.com/identicons/${botUser.substring(0, 5)}.png`;
        

        db.addPost(
          botReply,
          null,
          botProfileImageUrl,
          null,
          null,
          botUser,
          originalPostId,
          (err) => {
            if (err) {
              console.error('Error saving bot reply:', err);
            } else {
              console.log('Bot replied to post WHAHAHAHAH', originalPostId);
            }
          }
        );
      });
    } catch (e) {
      console.error('Error generating bot reply:', e);
    }
  }, delayMs);
}

async function generateAIReply(post, who) {
  return aipi.main(who, post);
}

function generateBotUsername() {
  const adjectives = [
    'Yummy', 'Happy', 'Silly', 'Brave', 'Clever', 'Witty', 'Zesty', 'Fuzzy', 'Sunny', 'Jolly'
  ];

  const nouns = [
    'Tacos', 'Panda', 'Nuggets', 'Burrito', 'Pineapple', 'Pickle', 'Cupcake', 'Otter', 'Muffin', 'Koala'
  ];

  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number

  return `${randomAdj}${randomNoun}${randomNumber}`;
}


// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
