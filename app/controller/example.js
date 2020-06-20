const BaseController = require('../core/_base_controller');

class ExampleController extends BaseController {
  async index(app) {
    const { ctx, service } = this;
    const list = await service.example.getList();
    this.success(list);
  }
  async detail() {
    const { app, service, ctx, config } = this;
    const id = ctx.params.id;
    const all = await service.example.detail(id);
    this.success(all);
  }
  async new() {
    const { ctx, service } = this;
    const { username, email } = ctx.request.body;
    console.log(username, email);
    const res = await service.example.new({ username, email });
    if (res) {
      this.success(res);
    }
  }
  async update() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const { username, email } = ctx.request.body;
    console.log(username, email);
    const res = await service.example.update({ username, email, id });
    this.success(res);
  }
}

module.exports = ExampleController;
