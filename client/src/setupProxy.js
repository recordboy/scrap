const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/data",
    createProxyMiddleware({
      target: "https://recordboy-scrap.herokuapp.com",
      changeOrigin: true,
    })
  );
};
