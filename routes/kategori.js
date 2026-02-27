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
      res.status(500).send("Error");

    }

    res.render("kategori/index", {
      title: "Halaman Kategori",
      kategori: result
    })
  })
});

module.exports = router;