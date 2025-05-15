const sqlite3 = require('sqlite3').verbose();

function createTable(){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.run("CREATE TABLE IF NOT EXISTS userData (userID INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)");
    db.close();
  });
};

function addUser(username, password){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    let num = 0;

    db.all("SELECT userID FROM userData;", (err, column) => {
      if (err) {
      console.error(err.message);
      }
      if (column != null) {
        num = Object.keys(column).length;
      }
      //console.log("Column: " + Object.keys(column).length);
      //console.log("Variable num: " + num);
      db.run("INSERT INTO userData (userID, username, password) VALUES (?, ?, ?)", [num, username, password], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log("A row has been inserted with rowid ${this.lastID}");
      });
    });
    db.close();
  });
};

function allUserData(){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all("SELECT * FROM userData", (err, rows) => {
      if (err) {
      console.error(err.message);
      }
      let allRows = rows;
      console.log("All rows:", allRows)
    });
    db.close();
  });
}

createTable();
//addUser("Tyson", "Brandt");
//addUser("Israel", "Armani");
allUserData();
