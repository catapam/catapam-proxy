const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy requests to /news to the WP Engine site
app.use('/news', createProxyMiddleware({
    target: 'https://catapam.wpengine.com',
    changeOrigin: true,
    pathRewrite: {
        '^/news': '/news', // Rewrites the path
    },
}));

// Default route for non-proxied requests
app.get('*', (req, res) => {
    res.send('This route is not proxied.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
