/**
 * @description 失败信息集合，包括 code 和 message
 * @author 一江
 */

module.exports = {
  // 用户名已存在
  registerUserNameExistInfo: {
    success: false,
    code: 10001,
    message: '用户名已存在',
  },
  // 注册失败
  registerFailInfo: {
    success: false,
    code: 10002,
    message: '注册失败，请重试',
  },
  // 用户名不存在
  registerUserNameNotExistInfo: {
    success: false,
    code: 10003,
    message: '用户名未存在',
  },
  // 登录失败
  loginFailInfo: {
    success: false,
    code: 10004,
    message: '登录失败，用户名或密码错误',
  },
  // 未登录
  loginCheckFailInfo: {
    success: false,
    code: 10005,
    message: '您尚未登录',
  },
  // 修改密码失败
  changePasswordFailInfo: {
    success: false,
    code: 10006,
    message: '修改密码失败，请重试',
  },
  // 上传文件过大
  uploadFileSizeFailInfo: {
    success: false,
    code: 10007,
    message: '上传文件尺寸过大',
  },
  // 修改基本信息失败
  changeInfoFailInfo: {
    success: false,
    code: 10008,
    message: '修改基本信息失败',
  },
  // json schema 校验失败
  jsonSchemaFileInfo: {
    success: false,
    code: 10009,
    message: '数据格式校验错误',
  },
  // 删除用户失败
  deleteUserFailInfo: {
    success: false,
    code: 10010,
    message: '删除用户失败',
  },
  // 添加关注失败
  addFollowerFailInfo: {
    success: false,
    code: 10011,
    message: '添加关注失败',
  },
  // 取消关注失败
  deleteFollowerFailInfo: {
    success: false,
    code: 10012,
    message: '取消关注失败',
  },
  // 创建微博失败
  createBlogFailInfo: {
    success: false,
    code: 11001,
    message: '创建微博失败，请重试',
  },
  // 删除微博失败
  deleteBlogFailInfo: {
    success: false,
    code: 11002,
    message: '删除微博失败，请重试',
  },
};
