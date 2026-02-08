// cloud-demo页面逻辑文件
// 演示云函数、云数据库、云存储的基本使用

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo: {
      openid: '',
      nickname: '',
      avatar: ''
    },
    
    // 待办事项相关
    newTodo: '',
    todos: [],
    
    // 图片相关
    tempImagePath: '',
    uploadedImages: [],
    
    // 加载状态
    loading: {
      login: false,
      getUserInfo: false,
      addTodo: false,
      queryTodo: false,
      upload: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('云开发示例页面加载');
    
    // 检查云开发环境是否初始化
    if (!wx.cloud) {
      wx.showModal({
        title: '提示',
        content: '请使用2.2.3或以上的基础库以使用云能力',
        showCancel: false
      });
      return;
    }
    
    // 查询已有的待办事项
    this.queryTodos();
  },

  /**
   * 页面显示时刷新数据
   */
  onShow() {
    if (this.data.userInfo.openid) {
      this.queryTodos();
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.queryTodos();
    wx.stopPullDownRefresh();
  },

  // ==================== 云函数相关 ====================

  /**
   * 调用登录云函数
   */
  callLoginFunction() {
    this.setData({ 'loading.login': true });

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('登录云函数调用成功', res);
        
        if (res.result.success) {
          this.setData({
            'userInfo.openid': res.result.data.openid
          });
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
          
          // 登录成功后查询待办事项
          this.queryTodos();
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('登录云函数调用失败', err);
        wx.showToast({
          title: '调用失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ 'loading.login': false });
      }
    });
  },

  /**
   * 调用获取用户信息云函数
   */
  callGetUserInfo() {
    if (!this.data.userInfo.openid) {
      wx.showToast({
        title: '请先调用登录云函数',
        icon: 'none'
      });
      return;
    }

    this.setData({ 'loading.getUserInfo': true });

    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        nickname: '微信用户',
        avatar: ''
      },
      success: res => {
        console.log('获取用户信息成功', res);
        
        if (res.result.success) {
          this.setData({
            userInfo: {
              ...this.data.userInfo,
              ...res.result.data
            }
          });
          
          wx.showToast({
            title: res.result.message,
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ 'loading.getUserInfo': false });
      }
    });
  },

  // ==================== 云数据库相关 ====================

  /**
   * 输入待办事项
   */
  onInputTodo(e) {
    this.setData({
      newTodo: e.detail.value
    });
  },

  /**
   * 添加待办事项
   */
  addTodo() {
    if (!this.data.newTodo.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    if (!this.data.userInfo.openid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    this.setData({ 'loading.addTodo': true });

    // 调用云函数添加数据（推荐方式，更安全）
    wx.cloud.callFunction({
      name: 'databaseDemo',
      data: {
        action: 'add',
        data: {
          content: this.data.newTodo.trim(),
          completed: false
        }
      },
      success: res => {
        console.log('添加成功', res);
        
        if (res.result.success) {
          this.setData({
            newTodo: ''
          });
          
          // 刷新列表
          this.queryTodos();
          
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('添加失败', err);
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ 'loading.addTodo': false });
      }
    });
  },

  /**
   * 查询待办事项列表
   */
  queryTodos() {
    if (!this.data.userInfo.openid) {
      // 如果未登录，尝试直接查询（用于展示）
      this.setData({ 'loading.queryTodo': true });
      
      wx.cloud.callFunction({
        name: 'databaseDemo',
        data: {
          action: 'query',
          data: {
            limit: 20
          }
        },
        success: res => {
          if (res.result.success) {
            this.processTodos(res.result.data);
          }
        },
        fail: err => {
          console.error('查询失败', err);
        },
        complete: () => {
          this.setData({ 'loading.queryTodo': false });
        }
      });
      return;
    }

    this.setData({ 'loading.queryTodo': true });

    wx.cloud.callFunction({
      name: 'databaseDemo',
      data: {
        action: 'query',
        data: {
          limit: 20
        }
      },
      success: res => {
        console.log('查询成功', res);
        
        if (res.result.success) {
          this.processTodos(res.result.data);
        }
      },
      fail: err => {
        console.error('查询失败', err);
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ 'loading.queryTodo': false });
      }
    });
  },

  /**
   * 处理待办事项数据
   */
  processTodos(data) {
    // 格式化日期
    const todos = data.map(item => {
      let createdAt = '';
      if (item.createdAt) {
        const date = new Date(item.createdAt);
        createdAt = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      }
      
      return {
        ...item,
        createdAt
      };
    });

    this.setData({ todos });
  },

  /**
   * 切换待办事项状态
   */
  toggleTodo(e) {
    const { id, completed } = e.currentTarget.dataset;
    
    wx.cloud.callFunction({
      name: 'databaseDemo',
      data: {
        action: 'update',
        data: {
          id,
          completed
        }
      },
      success: res => {
        if (res.result.success) {
          this.queryTodos();
        }
      },
      fail: err => {
        console.error('更新失败', err);
      }
    });
  },

  /**
   * 删除待办事项
   */
  deleteTodo(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条待办事项吗？',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'databaseDemo',
            data: {
              action: 'delete',
              data: { id }
            },
            success: result => {
              if (result.result.success) {
                this.queryTodos();
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
              }
            },
            fail: err => {
              console.error('删除失败', err);
            }
          });
        }
      }
    });
  },

  // ==================== 云存储相关 ====================

  /**
   * 选择图片
   */
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          tempImagePath: tempFilePath
        });
      }
    });
  },

  /**
   * 上传图片到云存储
   */
  uploadImage() {
    if (!this.data.tempImagePath) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }

    const cloudPath = `images/${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;

    this.setData({ 'loading.upload': true });

    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.tempImagePath,
      success: res => {
        console.log('上传成功', res);
        
        // 添加到已上传列表
        const uploadedImages = [...this.data.uploadedImages, {
          fileID: res.fileID,
          cloudPath: cloudPath
        }];
        
        this.setData({
          uploadedImages,
          tempImagePath: ''
        });
        
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('上传失败', err);
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ 'loading.upload': false });
      }
    });
  },

  /**
   * 清除选中的图片
   */
  clearImage() {
    this.setData({
      tempImagePath: ''
    });
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    
    wx.previewImage({
      urls: [url]
    });
  },

  /**
   * 删除云存储中的图片
   */
  deleteImage(e) {
    const { url } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      success: res => {
        if (res.confirm) {
          // 删除文件
          wx.cloud.deleteFile({
            fileList: [url],
            success: result => {
              console.log('删除成功', result);
              
              // 从列表中移除
              const uploadedImages = this.data.uploadedImages.filter(
                item => item.fileID !== url
              );
              
              this.setData({
                uploadedImages
              });
              
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
            },
            fail: err => {
              console.error('删除失败', err);
            }
          });
        }
      }
    });
  }
});
