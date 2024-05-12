const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/food-product',
        createProxyMiddleware({
          // target: 'http://localhost:8080',
          target: 'https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app',
          changeOrigin: true,
        })
      );
  app.use(
    '/api/firebase',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/account',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
    })
  );

};