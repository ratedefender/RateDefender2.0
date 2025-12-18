const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { configureSecurityHeaders, apiLimiter } = require('./security');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

// 1. Setup Security
configureSecurityHeaders(app);

app.use(bodyParser.json());
app.use(express.static(__dirname));

// 2. API Routes
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
    // Basic auth check would go here if you added a token system
    const { ads_enabled } = req.body;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ ads_enabled }));
    res.json({ success: true });
});

// 3. Serve Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app; // For Vercel/Render