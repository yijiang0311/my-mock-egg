const BaseController = require('../core/_base-controller');

class Test extends BaseController {
  // constructor(app) {
  //   super(app);
  //   this.ctx = this.app;
  //   console.log('Test............app', app);
  //   console.log('Test............ctx', this.ctx);
  // }
  async index(app) {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async detail() {
    const { app, service, ctx, config } = this;
    const id = ctx.params.id;
    const all = await service.test.getAll();
    console.log('all......', all);
    app.ctx.body = {
      id,
      all,
    };
  }
}

module.exports = Test;
