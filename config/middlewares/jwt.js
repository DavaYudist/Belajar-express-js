var jwt = require("jsonwebtoken");


function verifyToken(req, res, next){
  const token = req.get('authorization')?.replace('Bearer ', '');
  if (!token){
    return res.status(403).json({ message: 'Token tidak ditemukan,' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err){
      return res.status(403).json({ message: 'Token tidak valid' });
    }
    req.decoded = decoded;
    next();
  });
}

module.exports = verifyToken;