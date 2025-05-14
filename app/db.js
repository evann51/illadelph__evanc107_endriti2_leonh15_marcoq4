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
  var num = 0;
  db.all("SELECT userID FROM userData;", (err, column) => {
    if (err) {
    console.error(err.message);
    }
    num = Object.keys(column).length;
    console.log("All columns:" + Object.keys(column).length);
  });
  db.run("INSERT INTO userData (userID, username, password) VALUES (?, ?, ?)", [Object.keys(num).length, username, password], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log("A row has been inserted with rowid ${this.lastID}");
  });
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
//addUser("Israel", "Armani")
allUserData();
