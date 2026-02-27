let mysql = require('mysql'); //memanggil library MySQL

let connection = mysql.createConnection({//ntuk menyimpan detail konfigurasi server database
   host:        'localhost',
   user:        'root',
   password:    '',
   database:    'database_express_basic'
});

connection.connect(function (error) {
   if (!!error) {
     console.log(error);
   } else {
     console.log('Koneksi ke Database Berhasil!');
   }
});

module.exports = connection;