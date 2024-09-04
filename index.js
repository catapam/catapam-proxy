const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy requests to /news to the WP Engine site, no rewrite
app.use('/news', createProxyMiddleware({
    target: 'https://catapam.wpengine.com',   // Target the root WP Engine URL
    changeOrigin: true,                       // Keep origin header for proxy
    // No pathRewrite needed, forward as-is
}));

// Fallback route for non-proxied requests
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
