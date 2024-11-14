const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Load environment variables
const TARGET = process.env.TARGET;
const FORWARDED_HOST = process.env.FORWARDED_HOST;
const PATH_REWRITE = process.env.PATH_REWRITE || '^/';

// Proxy requests to /news without adding /news again
app.use('/news', createProxyMiddleware({
    target: TARGET,                         // Use environment variable for target
    changeOrigin: true,                     // Keep the correct origin
    pathRewrite: { [PATH_REWRITE]: '' },    // Use environment variable for pathRewrite
    headers: {                               // Ensure the X-Forwarded-Host is correct
        'X-Forwarded-Host': FORWARDED_HOST, // Use environment variable for X-Forwarded-Host
    }
}));

// Fallback route for non-proxied requests
app.get('*', (req, res) => {
    res.status(200).send('This is not in WP Engine');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
