const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});
var DB_FILE = "dwitter.db";

function createTable(){
  let db = sqlite3.connect(DB_FILE, check_same_thread=False);
  let c = db.cursor();
  c.execute('''
    CREATE TABLE IF NOT EXISTS userData (
      userID INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL)
    ''');
  this.db.commit();
  this.db.close();
};

function addUser(username, password){
  let db = sqlite3.connect(DB_FILE, check_same_thread=False);
  let c = db.cursor();
  c.execute("SELECT userID FROM userData;");
  let num = c.fetchall();
  c.execute("INSERT INTO userData (userID, username, password) VALUES (?, ?, ?)", (Object.keys(num).length, username, password));

  this.db.commit()
  this.db.close()
};

let output = createTable();
console.log(output);
