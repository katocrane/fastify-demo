const articleService = require("../services/articleService");

async function routes(fastify, options) {
  fastify.get("/articles", async (request, reply) => {
    try {
      const articles = await articleService.getArticles();
      reply.send(articles);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.post("/articles", async (request, reply) => {
    try {
      const article = await articleService.createArticle(request.body);
      reply.send(article);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  // ... 其他文章相关的路由
}

module.exports = routes;
