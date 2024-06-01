// knexMiddleware.js
const db = require('./db');

const knexMiddleware = (req, res, next) => {
  req.db = db;
  next();
};

module.exports = knexMiddleware;
