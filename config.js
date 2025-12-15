require('dotenv').config();

const config = {
  // Use process.env to read the variable from the .env file
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
};

module.exports = config;