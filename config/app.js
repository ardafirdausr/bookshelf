require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || 'localhost',
};
