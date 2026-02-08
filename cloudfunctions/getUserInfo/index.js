// 云函数入口文件
// 获取用户详细信息

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取数据库引用
const db = cloud.database();

/**
 * 云函数主入口
 * @param {Object} event 触发云函数时传递的参数
 * @param {Object} context 触发云函数时的上下文信息
 */
exports.main = async (event, context) => {
  // 获取用户ID（从云函数上下文中获取）
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  try {
    // 从数据库查询用户信息
    const userResult = await db.collection('users').where({
      openid: openid
    }).get();

    // 如果用户不存在，创建新用户
    if (userResult.data.length === 0) {
      const newUser = {
        openid: openid,
        nickname: event.nickname || '微信用户',
        avatar: event.avatar || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      };

      await db.collection('users').add({
        data: newUser
      });

      return {
        success: true,
        message: '用户创建成功',
        data: newUser
      };
    }

    // 更新最后登录时间
    await db.collection('users').where({
      openid: openid
    }).update({
      data: {
        lastLoginAt: new Date()
      }
    });

    // 返回用户信息
    return {
      success: true,
      message: '获取用户信息成功',
      data: {
        ...userResult.data[0],
        isNewUser: false
      }
    };

  } catch (error) {
    console.error('获取用户信息失败:', error);
    return {
      success: false,
      message: '获取用户信息失败',
      error: error.message
    };
  }
};
