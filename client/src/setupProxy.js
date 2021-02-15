const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/data",
    createProxyMiddleware({
      target: "http://172.20.10.3:5000",
      changeOrigin: true,
    })
  );
};
