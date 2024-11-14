// Proxy setup created by Matheus Andrade

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
        changeOrigin: true,
        router: {
            [`/${PATH_SOURCE}`]: `https://${TARGET}`,
        },
        logLevel: 'debug',
        headers: {
            Host: TARGET,
            'X-Forwarded-For': (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            'Cache-Control': (req) => req.headers['cache-control'] || 'no-cache',
        },
        proxyTimeout: 5000,
        selfHandleResponse: true,

        onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            let responseBody = responseBuffer.toString('utf8');

            const targetUrlPattern = new RegExp(`https?:\/\/(www\.)?${TARGET}`, 'g');
            responseBody = responseBody.replace(targetUrlPattern, PROXY_URL);

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
