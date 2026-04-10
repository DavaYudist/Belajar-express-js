var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const ModelUsers = require('../model/model_users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'jokowi', 
    wapres: 'pria solo',
    isLoggedIn: req.session.userId ? true : false
  });
});

router.get('/informasi', function(req, res, next) {
  res.render('informasi', { 
    judul: 'Halaman Informasi',
    isLoggedIn: req.session.userId ? true : false
  });
});

router.get('/login', function(req, res, next) {
  res.render('auth/login', { isLoggedIn: req.session.userId ? true : false });
});
router.get('/register', function(req, res, next) {
  res.render('auth/register', { isLoggedIn: req.session.userId ? true : false });
});

router.post('/register', async function(req, res, next) {
  let { email, password } = req.body;
  try {
    let enkripsi = bcrypt.hashSync(password, 10);
    let data = {
      email, 
      password: enkripsi
    }
    await ModelUsers.store(data);
    req.flash('success', 'Data berhasil ditambahkan');
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'Gagal mendaftar');
    res.redirect('/register');
  }
});
router.post('/login', async function(req, res, next) {
  let { email, password } = req.body;
  try {
    let data = await ModelUsers.login(email);
    if (data.length > 0) {
      let enkripsi = data[0].password;
      let cek = bcrypt.compareSync(password, enkripsi);
      if (cek) {
        req.session.userId = data[0].id_users;
        req.flash('success', 'Login berhasil');
        req.session.user = data[0];
        res.redirect('/users');
      } else {
        req.flash('error', 'Password salah');
        res.redirect('/login');
      }
    } else {
      req.flash('error', 'Email tidak ditemukan');
      res.redirect('/login');
    }
  } catch (err) {
    req.flash('error', 'Terjadi kesalahan sistem');
    res.redirect('/login');
  }
});
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;