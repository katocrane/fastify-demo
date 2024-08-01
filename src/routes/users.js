const userService = require("../services/userService");
const { SECRET_KEY } = require("../../config/key"); // 导入密钥
const jwt = require("jsonwebtoken");

async function routes(fastify, options) {
  // 注册路由
  // 注册路由
  fastify.post("/users/register", async (request, reply) => {
    try {
      const user = await userService.createUser(request.body); // 创建用户
      return user; // 直接返回用户数据
    } catch (error) {
      if (error.message === "用户名已存在") {
        return reply.code(400).send({
          status: "error",
          message: "用户名已存在",
        });
      } else {
        console.log(error)
        reply.status(500).send({ message: "服务器错误" });
      }
    }
  });

  // 登录路由
  fastify.post("/users/login", async (request, reply) => {
    try {
      const { username, password } = request.body;
      const user = await userService.getUserByUsernameAndPassword(
        username,
        password
      ); // 获取用户

      if (!user) {
        return {
          status: "error",
          message: "用户名或密码错误",
        };
      }

      // 生成 token
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "48h" });

      return {
        status: "success",
        token: token,
        data: user, // 返回用户信息
      };
    } catch (error) {
      console.log(error);
      reply.status(500).send({ message: error });
    }
  });

  // 获取用户信息路由
  fastify.post("/users/info", async (request, reply) => {
    try {
      const user = request.user; // 获取经过验证的用户对象
      return user; // 直接返回用户数据
    } catch (error) {
      reply.status(500).send({ message: "服务器错误" });
    }
  });
  // 获取用户路由
  fastify.post("/users/get", async (request, reply) => {
    try {
      const userId = request.body.id; // 假设请求体中有一个名为 id 的字段
      const user = await userService.getUserById(userId); // 调用 userService 中的方法

      if (!user) {
        return { message: "用户不存在" };
      } else {
        return user; // 返回找到的用户对象
      }
    } catch (error) {
      reply.status(500).send({ message: "服务器错误" }); // 捕获并处理错误
    }
  });
}

module.exports = routes;
