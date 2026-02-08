// app.js
// 小程序全局逻辑文件
// 在这里定义小程序的生命周期函数和全局数据

App({
  // 小程序初始化时执行（全局只执行一次）
  onLaunch(options) {
    // 开发者模式下的日志输出
    console.log('小程序初始化完成', options);

    // 初始化云开发环境
    // env 参数填写你的云环境ID
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        // 请替换为你的云环境ID
        // 可以登录微信公众平台，在云开发控制台中查看
        env: 'cloud1-0gxm09652ddd3d4c',
        traceUser: true,
      });
      console.log('云开发环境初始化成功');
    }
  },

  // 小程序启动时执行（每次从后台进入前台都会执行）
  onShow(options) {
    console.log('小程序显示', options);
  },

  // 小程序隐藏时执行（每次从前台进入后台都会执行）
  onHide() {
    console.log('小程序隐藏');
  },

  // 全局错误监听函数
  onError(msg) {
    console.error('小程序发生错误:', msg);
  },

  // 全局数据（可以在所有页面中访问）
  globalData: {
    appName: 'Hello World 小程序',
    version: '1.0.0',
    userInfo: null
  }
});
