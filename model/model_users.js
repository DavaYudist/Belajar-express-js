const connection = require('../config/database');

class model_users {
    static async getAll(){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async store(data){
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO users SET ?', data, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async login(email){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async getById(id){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE id_users = ?', [id], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async update(id, data){
      return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET ? WHERE id_users = ?', [data, id], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    static async delete(id){
      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM users WHERE id_users = ?', [id], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
}


module.exports = model_users;





