const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Environment variables for dynamic configuration
const TARGET = process.env.TARGET;
const PATH = process.env.PATH;

// Helper function to rewrite paths to match NGINX rules
function customPathRewrite(path, req) {
    return path.replace(/^\/PATH\/?/, '/')
               .replace(/^\/PATH\/(wp-(?:content|includes|admin))\/(.*)/, '/$1/$2')
               .replace(/^\/PATH\/([a-z-]+\.[a-z]+)$/, '/$1')
               .replace(/^\/PATH\/([^/]*)\/?$/, '/$1/')
               .replace(/^\/PATH\/([^/]*)\/([^/]*)\/?$/, '/$1/$2/')
               .replace(/^\/PATH\/([^/]*)\/([^/]*)\/([^/]*)\/?$/, '/$1/$2/$3/')
               .replace(/^\/PATH\/([^/]*)\/([^/]*)\/([^/]*)\/([^/]*)\/?$/, '/$1/$2/$3/$4/')
               .replace(/^\/PATH\/([^/]*)\/([^/]*)\/([^/]*)\/([^/]*)\/([^/]*)\/?$/, '/$1/$2/$3/$4/$5/');
}

// Proxy middleware
app.use('/advice', createProxyMiddleware({
    target: TARGET,                       // Use dynamic target
    changeOrigin: true,
    pathRewrite: customPathRewrite,       // Use custom path rewrite function
    headers: {                            // Set appropriate headers
        'Host': process.env.TARGET,
        'X-Forwarded-For': (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        'Cache-Control': req => req.headers['cache-control'] || 'no-cache',
    },
    proxyTimeout: 5000,                   // Optional: Set a timeout
}));

// Fallback route
app.get('*', (req, res) => {
    res.status(200).send('This is not in WP Engine');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
