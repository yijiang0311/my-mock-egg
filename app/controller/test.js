const BaseController = require('../core/_base-controller');

class Test extends BaseController {
  async index(app) {
    const { ctx, service } = this;
    const list = await service.test.getList();
    ctx.body = {
      list,
    };
  }
  async detail() {
    const { app, service, ctx, config } = this;
    const id = ctx.params.id;
    const all = await service.test.getAll();
    app.ctx.body = {
      id,
      all,
    };
  }
}

module.exports = Test;
