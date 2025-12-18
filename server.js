// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { configureSecurityHeaders, apiLimiter } = require('./security');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;
const SETTINGS_FILE = 'settings.json';

// const SECURE_ADMIN_PASSWORD = 'YOUR_SUPER_SECURE_PASSWORD'; // <-- DELETE THIS LINE

const SECURE_ADMIN_PASSWORD = config.ADMIN_PASSWORD; // <-- NEW: Load password securely

// ... (rest of server.js remains the same)
module.exports = app;