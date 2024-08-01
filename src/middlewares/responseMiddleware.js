async function responseMiddleware(request, reply, payload) {
  // 首先确保 payload 存在和有效
  if (!payload) {
    return {
      status: "error",
      message: "Empty response payload",
    };
  }

  // 尝试解析响应体数据为 JSON
  let data;
  try {
    data = JSON.parse(payload.toString());
  } catch (error) {
    data = payload.toString(); // 解析失败时，将 payload 当做字符串处理
  }

  // 根据响应状态码返回不同格式的数据
  if (reply.statusCode < 400) {
    return JSON.stringify({
      status: "success",
      data: data,
    });
  } else {
    return JSON.stringify({
      status: "error",
      message: data?.message,
    });
  }
}

module.exports = responseMiddleware;
