const BaseController = require('../core/_base_controller');
const { validate, params } = require('../core/my-decorator');

class ExampleController extends BaseController {
  async index(app) {
    const { ctx, service } = this;
    const list = await service.example.getList();
    this.success(list);
  }
  @params({
    id: 'id',
  })
  async detail() {
    const { app, service, ctx, config } = this;
    const id = ctx.params.id;
    const all = await service.example.detail(id);
    this.success(all);
  }
  @validate({ body: { username: 'string', email: 'email' } })
  async new() {
    const { ctx, service } = this;
    // ctx.validate({ username: 'string', email: 'email' });
    const { username, email } = ctx.request.body;
    try {
      const res = await service.example.new({ username, email });
      this.success(res);
    } catch (error) {
      console.error(error.message, error.errors);
      const err0 = error.errors[0];
      this.registerFailed(error.message);
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
