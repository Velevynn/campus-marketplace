// middleware.js

const jwt = require('jsonwebtoken');

const secretKey = 'YourSecretKey';

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) return res.status(403).send({ message: "Token is required" });
  
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(401).send({ message: "Invalid Token" });
      req.user = decoded;
      next();
    });
};

module.exports = { verifyToken };
