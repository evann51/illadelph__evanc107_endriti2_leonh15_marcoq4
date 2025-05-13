const sqlite3 = require('sqlite3').verbose();

function createTable(){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
  });
  db.run("CREATE TABLE IF NOT EXISTS userData (userID INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)");
  db.close();
};

function addUser(username, password){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
  });
  var num = [];
  db.all("SELECT userID FROM userData;", (err, column) => {
    if (err) {
    console.error(err.message);
    }
    num = column;
    console.log("All columns:" + num);
  });
  db.run("INSERT INTO userData (userID, username, password) VALUES (?, ?, ?)", (Object.keys(num).length, username, password));
  db.close()
};

function allUserData(){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
  });
  db.all("SELECT * FROM userData", (err, rows) => {
    if (err) {
    console.error(err.message);
    }
    let allRows = rows;
    console.log("All rows:", allRows)
  });
}

createTable();
addUser("Tyson", "Brandt");
allUserData()
