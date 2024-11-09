const { flatRoutes } = require("remix-flat-routes");

module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs",
  flatRoutes: true,
  tailwind: true,
  postcss: true,
  routes: async (defineRoutes) => {
    // Let `flatRoutes` handle all routes within the `routes` folder
    return flatRoutes("routes", defineRoutes);
  },
};
