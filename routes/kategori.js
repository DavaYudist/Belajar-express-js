var express = require('express');
const connection = require('../config/database');
var router = express.Router();


/* GET home page. */
router.get("/", function (req, res, next) {
  // Eksekusi query ke database
  const query = "SELECT * FROM kategori";

  connection.query(query, function(err, result){
    if(err){
      console.error("ERORR : ", err);
      return res.status(500).send("Error" + er);

    }

    res.render("kategori/index", {
      title: "Halaman Kategori",
      kategori: result
    })
  })
});

router.get('/create', function(req, res, next) {
    res.render('kategori/create', {
        title: 'Tambah Kategori'
    });
});

router.post('/store', function(req, res, next) {
    const nama_kategori = req.body.nama_kategori;
    const query = "INSERT INTO kategori (nama_kategori) VALUES (?)";
    connection.query(query, [nama_kategori], function(err, result) {
        if (err) {
            console.error("ERROR : ", err);
            return res.status(500).send("Terjadi kesalahan pada database.");
        } 
        res.redirect("/kategori");
    });
});

module.exports = router;