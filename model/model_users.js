const connection = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

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

    static async getByEmail(email){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]);
          }
        });
      });
    }

    static async registrasiUser(email, password){
      return new Promise(async (resolve, reject) => {
        try{ 
          const hashPassword = await bcrypt.hash(password, 10);
          connection.query('INSERT INTO users (email, password) VALUES(?, ?)',[email, hashPassword], (err, rows)=>{
            if(err) {
              reject(err);
            }else{
              resolve(rows);
            }
          })
        }catch (error){
          reject(error);
        }
      });
    }

    static async login_jwt(email, password){
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    connection.query(sql, [email], (err, result) => {
      if (err) {
        return reject(400, 'Database error');
      } 
      if (result.length === 0){
        return reject(401, 'Email tidak ditemukan');
      } 
      const user = result[0];
      const isPasswordValid = bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reject(401, 'Password salah');
      }  
      const token = jwt.sign({
        id_users: user.id_users,
        email: user.email,
      }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      })
      resolve(token, user);
    });
  });
}
}




module.exports = model_users;





