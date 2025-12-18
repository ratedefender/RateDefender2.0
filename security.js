const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// This function defines the security settings
function configureSecurityHeaders(app) {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://pagead2.googlesyndication.com"],
                "style-src": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
                "img-src": ["'self'", "data:", "https://pagead2.googlesyndication.com"],
            },
        },
    }));
    console.log("🛡️ Security headers ready.");
}

// This limits how many times someone can try to login (Anti-Brute Force)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
    message: { success: false, message: "Too many requests, please try again later." }
});

// We export these so server.js can use them
module.exports = { configureSecurityHeaders, apiLimiter };