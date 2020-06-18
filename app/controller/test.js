class User {
  constructor() {
    this.a = 'zkwssssss';
  }
  async index(app) {
    console.log('test index....');
    // const all = await app.service.user.getList();
    app.ctx.body = [1, 2, 3, 4];
  }
  async detail(app) {
    const id = app.ctx.params.id;
    // console.log(id);
    // console.log(this);
    // const a = this.a;
    app.ctx.body = {
      id,
    };
  }
}

module.exports = new User();
