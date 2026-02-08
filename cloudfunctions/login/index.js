// 云函数入口文件
// 每个云函数都是一个独立的Node.js环境

const cloud = require('wx-server-sdk');

// 初始化云开发环境
// 这里的环境ID需要与app.js中保持一致
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
  // 获取用户信息
  const wxContext = cloud.getWXContext();

  console.log('登录云函数被调用');
  console.log('用户OpenID:', wxContext.OPENID);
  console.log('用户AppID:', wxContext.APPID);

  // 返回用户信息
  return {
    success: true,
    message: '登录成功',
    data: {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID || '',
      // 生成简单的会话Token（实际项目中建议使用JWT）
      token: 'session_' + Date.now()
    }
  };
};
