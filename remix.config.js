const { flatRoutes } = require("remix-flat-routes");

module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs",
  tailwind: true,
  postcss: true,
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
};
