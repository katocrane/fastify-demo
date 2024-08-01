const fastify = require("fastify")({
  logger: {
    level: "info", // 调整日志级别
    prettifier: require("pino-pretty"), // 使用 pino-pretty 格式化日志输出
    serializers: {
      req: req => ({
        请求方法: req.method,
        请求地址: req.url,
        请求头部: req.headers
      }),
      res: res => ({
        响应状态码: res.statusCode,
      }),
    }
  }
});

const routesPlugin = require("./plugins/routes");
const responseMiddleware = require("./middlewares/responseMiddleware");
const os = require("os");
const corsConfig = require("../config/cors");
const fastifyCors = require("@fastify/cors");
const authMiddleware = require('./middlewares/authMiddleware');

fastify.addHook('preHandler', authMiddleware); // 注册中间件
fastify.addHook("onSend", responseMiddleware);
fastify.register(routesPlugin);
fastify.register(fastifyCors, {
  origin: corsConfig.allowedOrigins,
});

const getNetworkAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      const { family, address, internal } = iface;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
  return "localhost";
};

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    const localAddress = "http://localhost:3000";
    const networkAddress = `http://${getNetworkAddress()}:3000`;

    console.log("\n服务器成功启动! \n");
    console.log(`  本地地址:          ${localAddress}`);
    console.log(`  网络地址:          ${networkAddress}`);
    console.log("\n要停止服务器, 请按 CTRL+C。\n");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
