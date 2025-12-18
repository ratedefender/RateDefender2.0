const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Import our security and config rules
const { configureSecurityHeaders, apiLimiter } = require('./security');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

// 1. RUN SECURITY RULES
configureSecurityHeaders(app);

app.use(bodyParser.json());
app.use(express.static(__dirname));

// 2. API ROUTES
app.get('/api/settings', apiLimiter, (req, res) => {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) {
            fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ ads_enabled: false }));
        }
        const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: "Failed to load settings" });
    }
});

app.post('/api/login', apiLimiter, (req, res) => {
    const { password } = req.body;
    if (password === config.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid Password" });
    }
});

app.post('/api/settings', apiLimiter, (req, res) => {
    const { ads_enabled } = req.body;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ ads_enabled }));
    res.json({ success: true });
});

// 3. SERVE FRONTEND
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. START SERVER
app.listen(PORT, () => {
    console.log(`🚀 SUCCESS: Server running on http://localhost:${PORT}`);
});

module.exports = app;