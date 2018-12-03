const mysql = require('mysql');

class MySqlAdapter {
  constructor(host, user, password) {
    const connection = mysql.createConnection({
      host,
      user,
      password,
      database : 'unknownchapters',
    });

    connection.connect((err) => {
      if (err) {
        throw err;
      }

      console.log('Connected to DB...');
    });

    this.connection = connection;
  }

  closeConnection() {
    this.connection.end();
  }

  getAllImages() {
    const query = 'SELECT `path`, `alt` FROM `epk_images` ORDER BY `order` LIMIT 500;';

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        }

        resolve(results.map((item) => ({
          path: item.path,
          alt: item.alt,
        })));
      });
    });
  }

  insertImage(path) {
    const query = `INSERT INTO epk_images (path) VALUES (${path})`;

    this.connection.query(query, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  }
}

module.exports = MySqlAdapter;
