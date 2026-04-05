const connection = require("../config/database");

class model_produk {
  static async getAll() {
    return new Promise((resolve, reject) => {
      // Menggunakan JOIN untuk mengambil nama_kategori
      const sql = `
            SELECT produk.*, kategori.nama_kategori 
            FROM produk 
            LEFT JOIN kategori ON produk.id_kategori = kategori.id_kategori
        `;
      connection.query(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  static async store(data) {
    return new Promise((resolve, reject) => {
      // Query disesuaikan dengan kolom yang kamu minta sebelumnya
      connection.query(
        "INSERT INTO produk (nama_produk, harga, id_kategori, gambar_produk) VALUES (?, ?, ?, ?)",
        [data.nama_produk, data.harga, data.id_kategori, data.gambar_produk],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      );
    });
  }
  static async getId(id_produk) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM produk WHERE id_produk = ?",
        [id_produk],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      );
    });
  }
  static async update(id_produk, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE produk SET nama_produk = ?, harga = ?, id_kategori = ? WHERE id_produk = ?",
        [data.nama_produk, data.harga, data.id_kategori, id_produk],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      );
    });
  }

  static async delete(id_produk) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM produk WHERE id_produk = ?",
        [id_produk],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      );
    });
  }
}

module.exports = model_produk;
