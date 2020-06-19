const BaseService = require('../core/_base_service');

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

class TestService extends BaseService {
  async getAll() {
    //ctx,service只能通过this.app获取到，此时通过this获取为undefiend
    //其他的，比如config 可以this.config或者this.app.config
    const { ctx } = this.app;
    console.log('getall');
    await delay(400);
    return [1, 2, 3, 4];
  }
  async getList() {
    console.log('getlist');
    const all = await app.model.user.findAll();
    console.log(all);
    return all;
  }
}

module.exports = TestService;
