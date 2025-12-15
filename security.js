const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Middleware to configure robust HTTP security headers.
 * @param {object} app - Your Express application instance.
 */
function configureSecurityHeaders(app) {
    // 1. Helmet: Sets various HTTP headers to protect against well-known web vulnerabilities.
    app.use(helmet({
        // Standard recommended settings for modern apps
        contentSecurityPolicy: {
            directives: {
                // IMPORTANT: You MUST update this to allow your AdSense scripts to load.
                // Replace 'YOUR_ADSENSE_DOMAIN.com' with the actual domain.
                'script-src': ["'self'", 'https://cdn.tailwindcss.com', 'https://pagead2.googlesyndication.com'],
                'frame-ancestors': ["'self'"], // Prevents clickjacking
                'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
                'default-src': ["'self'"], 
            },
        },
        // Strict-Transport-Security forces HTTPS connections
        strictTransportSecurity: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
        // Prevent browsers from guessing file types (MIME-sniffing)
        noSniff: true,
    }));

    // 2. X-XSS-Protection is mostly obsolete but harmless to include
    app.use(helmet.xssFilter());
    
    console.log("Security headers (Helmet) configured.");
}

/**
 * Middleware for basic API Rate Limiting.
 * This prevents brute-force attacks and simple Denial-of-Service (DoS) attacks on your APIs.
 * It is applied to the routes that handle communication, like /api/settings and /api/login.
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    }
});

module.exports = {
    configureSecurityHeaders,
    apiLimiter
};