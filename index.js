const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Fallback route for non-proxied requests
app.get('*', (req, res) => {
    res.status(200).send('This is a test');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
