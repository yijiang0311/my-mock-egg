const BaseService = require('../core/_base_service');

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

class UserService extends BaseService {
  /**
   * 获取用户信息
   * @param {id} id
   * @param {username} username
   * @param {password} password
   */
  async getUserInfo({ id, username, password }) {
    const { model } = this.app;
    const whereOpt = {};
    if (!!id) {
      whereOpt.id = id;
    }
    if (!!username) {
      whereOpt.username = username;
    }
    if (!!password) {
      whereOpt.password = password;
    }
    const one = await model.User.scope('bh').findOne({
      where: whereOpt,
    });
    return one;
  }
  async getAll() {
    console.log('getall');
    await delay(1000);
    return [1, 2, 3, 4];
  }
  async getList() {
    console.log('getlist');
    const all = await app.model.user.findAll();
    console.log(all);
    return all;
  }
}

module.exports = UserService;
