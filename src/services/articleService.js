const { Article, User } = require("../utils/database");

const createArticle = async (data) => {
  return await Article.create(data);
};

const getArticles = async () => {
  return await Article.findAll({
    include: {
      model: User,
      attributes: ["username"],
    },
  });
};

const getArticleById = async (id) => {
  return await Article.findByPk(id, {
    include: {
      model: User,
      attributes: ["username"],
    },
  });
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
};
