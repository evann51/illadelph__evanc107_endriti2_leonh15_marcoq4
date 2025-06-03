const sqlite3 = require('sqlite3').verbose();

//Mutator Methods
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
      });
    });
    db.close();
  });
};

function changeUsername(ID, newUsername) {
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.run(`UPDATE userData SET username = ? WHERE userID = ?`, [newUsername, ID], function(err){
      if (err) {
        return console.error(err.message);
      }
      console.log(`Username with user ID ${ID} has been changed`);
    });
  });
}

function changePassword(ID, newPassword) {
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.run(`UPDATE userData SET password = ? WHERE userID = ?`, [newPassword, ID], function(err){
      if (err) {
        return console.error(err.message);
      }
      console.log(`Username with user ID ${ID} has been changed`);
    });
  });
}

function changeProfilePicture(ID, newProfilePicture) {
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.run(`UPDATE userData SET profilePicture = ? WHERE userID = ?`, [newProfilePicture, ID], function(err){
      if (err) {
        return console.error(err.message);
      }
      console.log(`Username with user ID ${ID} has been changed`);
    });
  });
}

function changeProfileBanner(ID, newProfileBanner) {
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.run(`UPDATE userData SET profileBanner = ? WHERE userID = ?`, [newProfileBanner, ID], function(err){
      if (err) {
        return console.error(err.message);
      }
      console.log(`Username with user ID ${ID} has been changed`);
    });
  });
}

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

//Accessor Methods for User Data
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
      console.log("User Data:", allRows);
    });
    db.close();
  });
}

function getUsername(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT username FROM userData where userID = ${ID}`, (err, user) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("Username for ID " + ID + ": " + JSON.stringify(user[0].username));
        fin = JSON.stringify(user[0].username);
        return fin;
      }
    })
  });
}

function getUserID(username){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT userID FROM userData where username = ${username}`, (err, user) => {
      if (err) {
        console.log("one");
        console.error(err.message);
      } else{
        console.log("two");
        console.log("ID for username " + username + ": " + JSON.stringify(user[0].userID));
        fin = JSON.stringify(user[0].userID);
        return fin;
      }
    })
  });
}

function getUserHandle(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT userHandle FROM userData where userID = ${ID}`, (err, user) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("User handle for ID " + ID + ": " + JSON.stringify(user[0].userHandle));
        return JSON.stringify(username[0].userHandle);
      }
    })
  });
}

function getPassword(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT password FROM userData where userID = ${ID}`, (err, user) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("User password for ID " + ID + ": " + JSON.stringify(user[0].password));
        fin = JSON.stringify(user[0].password);
        return fin;
      }
    })
  });
}

function getProfilePicture(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT profilePicture FROM userData where userID = ${ID}`, (err, user) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("User PFP for ID " + ID + ": " + JSON.stringify(user[0].profilePicture));
        fin = JSON.stringify(user[0].profilePicture);
        return fin;
      }
    })
  });
}

function getProfileBanner(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT profileBanner FROM userData where userID = ${ID}`, (err, user) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("User banner for ID " + ID + ": " + JSON.stringify(user[0].profileBanner));
        fin = JSON.stringify(user[0].profileBanner);
        return fin;
      }
    })
  });
}

//Accessor Methods for Dweet Data
function allDweetData(){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all("SELECT * FROM dweetData", (err, rows) => {
      if (err) {
      console.error(err.message);
      }
      let allRows = rows;
      console.log("Post Data:", allRows);
    });
    db.close();
  });
}

function getPost(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT post FROM dweetData where dweetID = ${ID}`, (err, dweet) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("Post for ID " + ID + ": " + JSON.stringify(dweet[0].post));
        fin = JSON.stringify(dweet[0].post);
        return fin;
      }
    })
  });
}

function getmedia0(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT media0 FROM dweetData where dweetID = ${ID}`, (err, dweet) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("Media0 for ID " + ID + ": " + JSON.stringify(dweet[0].media0));
        fin = JSON.stringify(dweet[0].media0);
        return fin;
      }
    })
  });
}

function getmedia1(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT media1 FROM dweetData where dweetID = ${ID}`, (err, dweet) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("Media1 for ID " + ID + ": " + JSON.stringify(dweet[0].media1));
        fin = JSON.stringify(dweet[0].media1);
        return fin;
      }
    })
  });
}

function getmedia2(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT media0 FROM dweetData where dweetID = ${ID}`, (err, dweet) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("Media2 for ID " + ID + ": " + JSON.stringify(dweet[0].media2));
        fin = JSON.stringify(dweet[0].media2);
        return fin;
      }
    })
  });
}

function getmedia3(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT media3 FROM dweetData where dweetID = ${ID}`, (err, dweet) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("Media3 for ID " + ID + ": " + JSON.stringify(dweet[0].media3));
        fin = JSON.stringify(dweet[0].media3);
        return fin;
      }
    })
  });
}

function getPoster(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT poster FROM dweetData where dweetID = ${ID}`, (err, dweet) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("Poster for ID " + ID + ": " + JSON.stringify(dweet[0].poster));
        fin = JSON.stringify(dweet[0].poster);
        return fin;
      }
    })
  });
}

function getPostRepliedTo(ID){
  const db = new sqlite3.Database('./dwitter.db', (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the database');
    }
    db.all(`SELECT postRepliedTo FROM dweetData where dweetID = ${ID}`, (err, dweet) => {
      if (err) {
        console.error(err.message);
      } else{
        console.log("Post Replied To for ID " + ID + ": " + JSON.stringify(dweet[0].postRepliedTo));
        fin = JSON.stringify(dweet[0].postRepliedTo);
        return fin;
      }
    })
  });
}

function testerMethod(){
  createTable();
  addUser("Tyson", "spark_of_humanity", "Brandt", "tysonbrandt.jpg", "");
  addUser("Elli", "dawarden", "Verdandi", "krow.png", "timeaftertime.jpg");
  //addPost("New phone. who dis?", null, null, null, null, 0, null);
  //addPost("This isn't a new phone, idiot.", "facepalm.gif", null, null, null, 1, 0);
  allUserData();
  //allDweetData();
  //getUsername(0);
  //getPost(0);
  getUserID("Tyson");
  //changeUsername(0, "Tyson")
}

testerMethod();

module.exports = {
  createTable,
  addUser,
  addPost,
  changeUsername,
  changePassword,
  changeProfilePicture,
  changeProfileBanner,
  allUserData,
  getUsername,
  getUserHandle,
  getPassword,
  getProfilePicture,
  getProfileBanner,
  allDweetData,
  getPost,
  getmedia0,
  getmedia1,
  getmedia2,
  getmedia3,
  getPoster,
  getPostRepliedTo,
  getID
};
