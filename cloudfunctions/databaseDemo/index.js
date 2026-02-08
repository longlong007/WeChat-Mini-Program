// 云函数入口文件
// 数据库操作演示：增删改查

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取数据库引用
const db = cloud.database();

/**
 * 云函数主入口
 * 根据action参数执行不同的数据库操作
 * @param {Object} event 触发云函数时传递的参数
 * @param {Object} context 触发云函数时的上下文信息
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { action, data } = event;

  console.log('数据库操作云函数被调用');
  console.log('操作类型:', action);
  console.log('用户OpenID:', openid);

  try {
    switch (action) {
      // 1. 添加数据
      case 'add':
        return await handleAdd(openid, data);

      // 2. 查询数据
      case 'query':
        return await handleQuery(openid, data);

      // 3. 更新数据
      case 'update':
        return await handleUpdate(openid, data);

      // 4. 删除数据
      case 'delete':
        return await handleDelete(openid, data);

      // 5. 统计数量
      case 'count':
        return await handleCount(openid, data);

      default:
        return {
          success: false,
          message: '不支持的操作类型'
        };
    }
  } catch (error) {
    console.error('数据库操作失败:', error);
    return {
      success: false,
      message: '数据库操作失败',
      error: error.message
    };
  }
};

/**
 * 添加数据
 */
async function handleAdd(openid, data) {
  const newData = {
    openid: openid,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection('todos').add({
    data: newData
  });

  return {
    success: true,
    message: '添加成功',
    data: {
      _id: result._id
    }
  };
}

/**
 * 查询数据
 */
async function handleQuery(openid, data) {
  const { where, skip = 0, limit = 10, orderBy } = data;

  let query = db.collection('todos').where({
    openid: openid,
    ...where
  });

  // 排序
  if (orderBy) {
    const [field, order] = orderBy.split(' ');
    query = query.orderBy(field, order || 'desc');
  } else {
    query = query.orderBy('createdAt', 'desc');
  }

  // 分页
  query = query.skip(skip).limit(limit);

  const result = await query.get();

  return {
    success: true,
    message: '查询成功',
    data: result.data
  };
}

/**
 * 更新数据
 */
async function handleUpdate(openid, data) {
  const { id, ...updateData } = data;

  if (!id) {
    return {
      success: false,
      message: '缺少文档ID'
    };
  }

  const result = await db.collection('todos').doc(id).update({
    data: {
      ...updateData,
      updatedAt: new Date()
    }
  });

  return {
    success: true,
    message: '更新成功',
    data: {
      updated: result.stats.updated
    }
  };
}

/**
 * 删除数据
 */
async function handleDelete(openid, data) {
  const { id } = data;

  if (!id) {
    return {
      success: false,
      message: '缺少文档ID'
    };
  }

  const result = await db.collection('todos').doc(id).remove();

  return {
    success: true,
    message: '删除成功',
    data: {
      removed: result.stats.removed
    }
  };
}

/**
 * 统计数量
 */
async function handleCount(openid, data) {
  const { where } = data;

  const count = await db.collection('todos').where({
    openid: openid,
    ...where
  }).count();

  return {
    success: true,
    message: '统计成功',
    data: {
      total: count
    }
  };
}
