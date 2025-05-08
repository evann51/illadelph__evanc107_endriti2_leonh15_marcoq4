const createTable(){
  let db = sqlite3.connect(DB_FILE, check_same_thread=False)
  c = db.cursor()
  c.execute('''
    CREATE TABLE IF NOT EXISTS userData (
      userID INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL)
    ''')
  db.commit()
  db.close()
}
