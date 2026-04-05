const connection = require("../config/database");

class model_mahasiswa {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM mahasiswa ORDER BY id_mahasiswa DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async getId(id_mahasiswa) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM mahasiswa WHERE id_mahasiswa = ?",
        [id_mahasiswa],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async checkNrp(nrp, currentId = null) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM mahasiswa WHERE nrp = ?";
      let params = [nrp];

      if (currentId) {
        query += " AND id_mahasiswa != ?";
        params.push(currentId);
      }

      connection.query(query, params, (err, rows) => {
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
      connection.query(
        "INSERT INTO mahasiswa (nrp, nama, jenis_kelamin, foto_mahasiswa) VALUES (?, ?, ?, ?)",
        [data.nrp, data.nama, data.jenis_kelamin, data.foto_mahasiswa],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async update(id_mahasiswa, data) {
    return new Promise((resolve, reject) => {
      // Create dynamically the update query based on provided data
      let query = "UPDATE mahasiswa SET nrp = ?, nama = ?, jenis_kelamin = ?";
      let params = [data.nrp, data.nama, data.jenis_kelamin];

      if (data.foto_mahasiswa) {
        query += ", foto_mahasiswa = ?";
        params.push(data.foto_mahasiswa);
      }
      
      query += " WHERE id_mahasiswa = ?";
      params.push(id_mahasiswa);

      connection.query(
        query,
        params,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async delete(id_mahasiswa) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM mahasiswa WHERE id_mahasiswa = ?",
        [id_mahasiswa],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = model_mahasiswa;
