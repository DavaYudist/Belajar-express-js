var express = require('express');
var router = express.Router();
var model_users = require('../../model/model_users');

router.post('/', async function(req, res, next){
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }
  try{
    const result = await model_users.login_jwt(email, password);
    res.json(result);
  }catch(error){
    res.status(500).json({ message: 'Error server' });
  }
});

module.exports = router;