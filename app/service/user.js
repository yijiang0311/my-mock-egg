const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  async register({ username, password, email }) {
    const { model } = this.app;
    //创建失败会抛出异常
    const res = await model.User.create({
      username,
      password,
      email,
    });
    return res;
  }
  async getUserInfo({ id, username, email, password }) {
    const { model } = this.app;
    const whereOpt = {};
    if (!!id) {
      whereOpt.id = id;
    }
    if (!!username) {
      whereOpt.username = username;
    }
    if (!!email) {
      whereOpt.email = email;
    }
    const one = await model.User.scope('bh').findOne({
      where: whereOpt,
    });
    if (!!password && one) {
      //定义数据结构的时候set时对密码进行了加密
      const isAuth = await bcrypt.compare(password, one.password);
      if (!isAuth) {
        return null;
      }
    }
    Reflect.deleteProperty(one.dataValues, 'password');
    Reflect.deleteProperty(one._previousDataValues, 'password');
    return one;
  }
  /**
   *
   * @param {string | number} uid 用户ID
   * @param {Number} scope  用户权限值
   */
  async generateToken(uid, scope) {
    const { config } = this;
    const secretKey = config.secretKeys.JWT_SECRET_KEY;
    const expiresIn = config.secretKeys.JWT_EXPIRES_IN;
    const token = jwt.sign(
      {
        uid,
        scope,
      },
      secretKey,
      {
        expiresIn,
      }
    );
    return token;
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
