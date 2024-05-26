const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/food-product',
        createProxyMiddleware({
          // target: 'http://localhost:8080',
          target: 'https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app',
          // target: 'https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev',
          changeOrigin: true,
        })
      );
  app.use(
    '/api/firebase',
    createProxyMiddleware({
      // target: 'http://localhost:8081',
      target: 'https://foodmotion-auth-service-hlfxsphkja-ew.a.run.app',
      // target: 'https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/account',
    createProxyMiddleware({
      // target: 'http://localhost:8082',
      target: 'https://foodmotion-account-service-hlfxsphkja-ew.a.run.app',
      // target: 'https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/recipes',
    createProxyMiddleware({
      // target: 'http://localhost:8083',
      target: 'https://foodmotion-recipes-service-hlfxsphkja-ew.a.run.app',
      // target: 'https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev',
      changeOrigin: true,
    })
  );
  app.use(
    'api/daily-nutrition',
    createProxyMiddleware({
      // target: 'http://localhost:8084',
      target: 'https://foodmotion-daily-nutrition-hlfxsphkja-ew.a.run.app',
      // target: 'https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev',
      changeOrigin: true,
    })
  );

};