var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'jokowi', wapres: 'pria solo' });
});


router.get('/informasi', function(req, res, next) {
  res.render('informasi', { judul: 'Halaman Informasi' });
});

module.exports = router;