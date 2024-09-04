const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy requests to /news to the WP Engine site
app.use('/news', createProxyMiddleware({
    target: 'https://catapam.wpengine.com', // Target your WP Engine site
    changeOrigin: true,                     // Needed for virtual hosted sites
    // No need to rewrite path since /news should map directly
}));

// Fallback route for non-proxied requests
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
