const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy requests to /news without adding /news again
app.use('/news', createProxyMiddleware({
    target: 'https://catapam.wpengine.com',  // Directly target WP Engine root
    changeOrigin: true,                      // Keep the correct origin
    pathRewrite: { '^/news': '' },           // Strip /news from the Heroku request path
    headers: {                               // Ensure the X-Forwarded-Host is correct
        'X-Forwarded-Host': 'catapam.wpengine.com',
    }
}));

// Fallback route for non-proxied requests
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
