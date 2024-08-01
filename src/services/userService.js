const { User } = require("../utils/database"); // 导入 User 模型
const bcrypt = require('bcrypt');

// 创建用户
// 创建用户
async function createUser(userData) {
  // 检查用户名是否已存在
  const existingUser = await User.findOne({
    where: {
      username: userData.username,
    },
  });

  if (existingUser) {
    throw new Error("用户名已存在"); // 抛出错误
  }

  // 使用 bcrypt 加密密码
  userData.password = await bcrypt.hash(userData.password, 10);
  const createdUser =  await User.create(userData);
  const { password, ...rest } = createdUser.dataValues;
  return rest;
}


// 获取用户
async function getUserById(id) {
  const user = await User.findByPk(id);
  if (user) {
    // 移除密码属性
    const { password, ...rest } = user.dataValues;
    return rest;
  } else {
    return null;
  }
}

   // 获取用户
   async function getUserByUsernameAndPassword(username, password) {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (user) {
      // 使用 bcrypt 比较密码
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        // 移除密码属性
        const { password, ...rest } = user.dataValues;
        return rest;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

module.exports = {
  createUser,
  getUserById,
  getUserByUsernameAndPassword,
};