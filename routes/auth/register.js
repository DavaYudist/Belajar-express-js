var express = require('express');
var router = express.Router();
var model_users = require('../../model/model_users');

router.post('/register', async function(req, res, next){
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }
  try{
    const existingUser = await model_users.getByEmail(email);
    if (existingUser){
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
    await model_users.registrasiUser(email, password);
    res.status(201).json({ message: 'Registrasi berhasil' });
  }catch(error){
    res.status(500).json({ message: 'Error server' });
  }
});

module.exports = router;