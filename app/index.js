//setup
const express = require('express');
const app = express();

//template work
const path = require('path');
app.set('view engine', 'ejs');

const PORT = 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  const data = { //change later to whatecver data we need
  };
  res.render('home', data);
});

app.get('/register', (req, res) => {
  const data = { //change later to whatecver data we need
  };
  res.render('register', data);
});

app.get('/inbox', (req, res) => {
  const data = {

  };
})

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
