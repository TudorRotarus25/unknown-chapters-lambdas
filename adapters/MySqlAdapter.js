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

  getAllImages(basePath) {
    const query = 'SELECT `id`, `path` FROM `epk_images` ORDER BY `order` LIMIT 500;';

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        }

        resolve(results.map((item) => ({
          id: item.id,
          path: basePath + 'images/original/' + item.path,
          thumbnail: basePath + 'images/thumbnails/' + item.path,
        })));
      });
    });
  }

  getAllVisuals(basePath) {
    const query = 'SELECT `id`, `path` FROM `epk_visuals` ORDER BY `order` LIMIT 500;';

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        }

        resolve(results.map((item) => ({
          id: item.id,
          path: basePath + 'visuals/original/' + item.path,
          thumbnail: basePath + 'visuals/thumbnails/' + item.path,
        })));
      });
    });
  }

  getAllPressArticles() {
    const query = 'SELECT `id`, `name`, `link` FROM `press_articles`;';

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        }

        resolve(results.map((item) => ({
          id: item.id,
          name: item.name,
          url: item.link,
        })));
      });
    });
  }

  getAllSingles() {
    const query = 'SELECT `id`, `name`, `release_date` FROM `singles`;';

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        }

        resolve(results.map((item) => ({
          id: item.id,
          name: item.name,
          releaseDate: item['release_date'],
        })));
      });
    });
  }

  insertImage(path) {
    const query = `INSERT INTO epk_images (path) VALUES (${path})`;

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error) => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    });
  }
}

module.exports = MySqlAdapter;
