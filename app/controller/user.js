const user = {
  index: async (app) => {
    console.log("all");
    const all = await app.$service.user.getList();
    app.ctx.body = all;
  },
  detail:async app=>{
    const id = app.ctx.params.id
    console.log(id);
    app.ctx.body={
      id
    }
  }
};

module.exports = user;
