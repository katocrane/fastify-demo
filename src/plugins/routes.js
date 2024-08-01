const userRoutes = require("../routes/users");
const articleRoutes = require("../routes/articles");

async function routesPlugin(fastify, options) {
  fastify.register(userRoutes);
  fastify.register(articleRoutes);
}

module.exports = routesPlugin;
