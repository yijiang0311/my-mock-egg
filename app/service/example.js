const BaseService = require('../core/_base_service');

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

class ExampleService extends BaseService {
  async getList() {
    const { model } = this.app;
    // const all = await model.user.findAll();
    //scope用法：将返回的表字段按规则去掉一些，比如去掉create_at字段
    const all = await model.User.scope('bh').findAll();
    return all;
  }
  async detail(id) {
    //ctx,service,model只能通过this.app获取到，此时通过this获取为undefiend
    //其他的，比如config 可以this.config或者this.app.config
    const { ctx, model } = this.app;
    // await delay(400);
    const one = await model.User.scope('bh').findOne({
      where: {
        id,
      },
    });
    return one;
  }

  async new({ username, email }) {
    const { model, ctx } = this.app;
    const res = await model.User.create({
      username,
      email,
    });
    return res;
  }
  async update({ username, email, id }) {
    const { model } = this.app;
    try {
      const res = await model.User.update(
        {
          username,
          email,
        },
        {
          where: {
            id,
          },
        }
      );
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ExampleService;
