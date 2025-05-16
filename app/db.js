const sqlite3 = require('sqlite3').verbose();

function createTable(){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.run("CREATE TABLE IF NOT EXISTS userData (userID INTEGER PRIMARY KEY, username TEXT NOT NULL, userHandle TEXT UNIQUE NOT NULL, password TEXT NOT NULL, profilePicture TEXT, profileBanner TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS dweetData (dweetID INTEGER PRIMARY KEY, post TEXT NOT NULL, media0 TEXT, media1 TEXT, media2 TEXT, media3 TEXT, poster INTEGER NOT NULL, postRepliedTo INTEGER)");
    db.all("PRAGMA table_info(dweetData)", [], (err, rows) =>{
      if (err) {
        console.error(err.message);
      }
      if (rows.length > 0) {
        const columnNames = Object.keys(rows).length;
        console.log(columnNames);
      }
    })
    db.close();
  });
};

function addUser(username, userHandle, password, profilePicture, profileBanner){
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
      db.run("INSERT INTO userData (userID, username, userHandle, password, profilePicture, profileBanner) VALUES (?, ?, ?, ?, ?, ?)", [num, username, userHandle, password, profilePicture, profileBanner], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log("A row has been inserted with rowid ${this.lastID}");
      });
    });
    db.close();
  });
};

function addPost(post, media0, media1, media2, media3, poster, postRepliedTo){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    let num = 0;

    db.all("SELECT dweetID FROM dweetData;", (err, column) => {
      if (err) {
      console.error(err.message);
      }
      if (column != null) {
        num = Object.keys(column).length;
      }
      //console.log("Column: " + Object.keys(column).length);
      //console.log("Variable num: " + num);
      db.run("INSERT INTO dweetData (dweetID, post, media0, media1, media2, media3, poster, postRepliedTo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [num, post, media0, media1, media2, media3, poster, postRepliedTo], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log("A row has been inserted with rowid ${this.lastID}");
      });
    });
    db.close();
  });
}

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

function testerMethod(){
  createTable();
  //addUser("Tyson", "spark_of_humanity", "Brandt", "tysonbrandt.jpg", "");
  //addUser("Elli", "dawarden", "Gandr", "krow.png", "timeaftertime.jpg");
  //addPost("New phone. who dis?", null, null, null, null, 0, null);
  //addPost("This isn't a new phone, idiot.", "facepalm.gif", null, null, null, 1, 0);
  allUserData();
}

testerMethod();
