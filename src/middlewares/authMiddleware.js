const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config/key');
const userService = require('../services/userService');
const authConfig = require('../../config/noAuth'); // 假设这是你的路由白名单配置文件

async function authMiddleware(request, reply) {
  const route = request.url; // 获取请求 URL
  const method = request.method; // 获取请求方法
  console.log(request)
  // 检查路由是否存在
  const routeExists = request.server.router.routes[method]?.find(r => r.url === route);

  if (!routeExists) {
    // 如果路由不存在，返回404错误
    reply.code(404).send({
      status: 'error',
      message: '路由未找到',
    });
    return;
  }

  // 如果路由存在，检查是否在白名单中
  if (!authConfig.skipAuthRoutes.includes(route)) {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('Token不存在');
      }
      const decoded = jwt.verify(token, SECRET_KEY);
      request.user = await userService.getUserById(decoded.id); // 存储用户信息到请求对象中
    } catch (err) {
      reply.code(401).send({
        status: 'error',
        message: '未授权',
      });
      return;
    }
  }
}

module.exports = authMiddleware;
