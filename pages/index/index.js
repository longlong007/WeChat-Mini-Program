// index.js
// 首页逻辑文件

// Page()函数用于注册一个页面
// 接收一个对象参数，指定页面的初始数据、生命周期函数、事件处理函数等
Page({
  /**
   * 页面的初始数据
   * data是页面第一次渲染时用的初始值
   * 可以通过 this.data 来访问数据
   */
  data: {
    message: 'Hello World',
    userInfo: {
      name: '开发者',
      level: '初级'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   * 页面加载时触发，一个页面只会调用一次
   * 可以在这个函数中获取页面参数（如：options.id）
   */
  onLoad(options) {
    console.log('页面加载', options);
    // 可以在这里进行数据请求等操作
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 页面渲染完成后触发
   * 如果页面的数据请求较慢，可以在这个函数中显示加载完成的状态
   */
  onReady() {
    console.log('页面初次渲染完成');
  },

  /**
   * 生命周期函数--监听页面显示
   * 页面显示时触发（从后台进入前台）
   */
  onShow() {
    console.log('页面显示');
  },

  /**
   * 生命周期函数--监听页面隐藏
   * 页面隐藏时触发（从前台进入后台）
   */
  onHide() {
    console.log('页面隐藏');
  },

  /**
   * 生命周期函数--监听页面卸载
   * 页面卸载时触发（如：navigateBack、redirectTo、reLaunch）
   */
  onUnload() {
    console.log('页面卸载');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: 'Hello World 微信小程序',
      path: '/pages/index/index'
    };
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('用户下拉刷新');
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('页面上拉触底');
  },

  /**
   * 点击事件的处理函数示例
   * 在wxml中通过 bindtap="handleTap" 绑定
   */
  handleTap() {
    console.log('按钮被点击');
    wx.showToast({
      title: '点击成功',
      icon: 'success'
    });
  }
});
