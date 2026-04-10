var express = require('express');
var router = express.Router();
const ModelUsers = require('../model/model_users');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    let id = req.session.userId;
    let data = await ModelUsers.getById(id);
    if (data.length > 0) {
      res.render('users/index', {
        title: 'Users home',
        email: data[0].email,
      });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('butuh akses login');
  }
});
router.get('/update-password', async function(req, res, next) {
  try {
    let id = req.session.userId;
    if (!id) {
      return res.redirect('/login');
    }

    let data = await ModelUsers.getById(id);
    if (data && data.length > 0) {
      res.render('users/password', {
        email: data[0].email
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', async function(req, res, next) {
  try {
  let id = req.session.userId;
  let { password } = req.body;
  let enkripsi = await bcrypt.hash(password, 10);
  let Data = { 
    password: enkripsi
  };
  await ModelUsers.update(id, Data);
  req.flash('success', 'Password berhasil diubah');
  res.redirect('/users');
} catch (error) {
  //res.status(500).send('terjadi kesalahan, ulangi kembali');
  return res.redirect('/users/update-password');
}
});



module.exports = router;
