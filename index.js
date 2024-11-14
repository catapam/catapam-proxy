const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const app = express();

// Environment variables for dynamic configuration
const TARGET = process.env.TARGET;
const PATH_SOURCE = process.env.PATH_SOURCE;
const PATH_DEST = process.env.PATH_DEST;
const PROXY_URL = process.env.PROXY_URL || `http://localhost:${process.env.PORT || 5000}`;

// Proxy middleware
app.use(
    `/${PATH_SOURCE}`,
    createProxyMiddleware({
        target: `https://${TARGET}`, // Use dynamic target
        changeOrigin: true,
        pathRewrite: {
            [`^/${PATH_SOURCE}`]: PATH_DEST, // Use dynamic path rewriting
        },
        headers: { // Set appropriate headers
            Host: TARGET,
            'X-Forwarded-For': (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            'Cache-Control': (req) => req.headers['cache-control'] || 'no-cache',
        },
        proxyTimeout: 5000, // Optional: Set a timeout
        selfHandleResponse: true, // Intercept response to modify it

        onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            // Convert the response buffer to a string
            let responseBody = responseBuffer.toString('utf8');

            // Replace target URL with proxy URL in the response body
            responseBody = responseBody.replace(new RegExp(`https://${TARGET}`, 'g'), PROXY_URL);

            // Return the modified response
            return responseBody;
        }),
    })
);

// Fallback route
app.get('*', (req, res) => {
    res.status(200).send('This is not in WP Engine');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
