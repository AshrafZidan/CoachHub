process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = {
  '/api': {
    target: 'https://backend.coachinghub.ae',
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    logLevel: 'debug',
    onProxyReq: function (proxyReq, req) {
      console.log('→ PROXY:', req.method, '→', proxyReq.path);
    },
    onProxyRes: function (proxyRes, req) {
      console.log('← RESPONSE:', proxyRes.statusCode, req.url);
    }
  }
};