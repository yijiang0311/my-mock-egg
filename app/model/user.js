const bcrypt = require('bcryptjs');
const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../core/mysql');
// https://blog.csdn.net/adley_app/article/details/94384100
//后面可以加入 nodejs RSA 与 jsencrypt 实现前端加密 后端解密功能
// const NodeRSA = require('node-rsa');

class User extends Model {
  static async verifyEmailPassword(email, plainPwd) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new global.errors.AuthFailed('用户不存在');
    }
    //同步
    // const isAuth = bcrypt.compareSync(plainPwd,user.password)
    //异步
    const isAuth = await bcrypt.compare(plainPwd, user.password);
    if (!isAuth) {
      throw new global.errors.AuthFailed('密码错误');
    }
    return user;
  }
}

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nickname: Sequelize.STRING,
    username: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(128),
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      set(val) {
        //同步
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(val, salt);
        this.setDataValue('password', hash);
        //异步 async
        // const self =this
        // bcrypt.genSalt(10,function(err,salt){
        //   bcrypt.hash(val,salt,function(err,hash){
        //     if(!err){
        //       console.log(err,hash);
        //       self.setDataValue('password',hash)
        //       console.log(self);
        //       //log 出来的是有password的，但是数据库password ===null
        //     }
        //   })
        // })
      },
    },
    openid: {
      type: Sequelize.STRING(128),
      unique: true,
    },
  },
  { sequelize, modelName: 'users' }
);

module.exports = User;
