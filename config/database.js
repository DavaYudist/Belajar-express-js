let mysql = require('mysql'); //memanggil library MySQL

let connection = mysql.createConnection({//ntuk menyimpan detail konfigurasi server database
   host:        '127.0.0.1',
   user:        'root',
   password:    '',
   database:    'database_express_basic',
   port:        3306
});

connection.connect(function (error) {
   if (error) {
     console.error('Gagal koneksi ke Database:', error.message);
     console.error('Keterangan: Pastikan layanan server MySQL (misalnya di XAMPP/WAMP) sudah berjalan normal.');
   } else {
     console.log('Koneksi ke Database Berhasil!');
   }
});

// Event listener untuk catch error agar Node.js tidak crash (nodemon tidak mati)
connection.on('error', function(err) {
   console.error('Database Event Error:', err.message);
   if (err.code === 'PROTOCOL_CONNECTION_LOST') {
     console.error('Koneksi ke database terputus.');
   } else if (err.code === 'ECONNREFUSED') {
     console.error('Koneksi ditolak.');
   }
});

module.exports = connection;