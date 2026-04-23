const connection = require('../config/database');

class model_kategori {
    static async getAll(){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM kategori', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async store(nama_kategori){
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO kategori (nama_kategori) VALUES (?)', [nama_kategori], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async getId(id_kategori){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM kategori WHERE id_kategori = ?', [id_kategori], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async update(id_kategori, data){
      return new Promise((resolve, reject) => {
        connection.query('UPDATE kategori SET ? WHERE id_kategori = ?', [data, id_kategori], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async delete(id_kategori){
      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM kategori WHERE id_kategori = ?', [id_kategori], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
}


module.exports = model_kategori;





