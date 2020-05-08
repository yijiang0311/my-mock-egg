module.exports=(app)=>({
  // 'get /': async ctx=>{
  //   console.log(app.$controller);
  //   ctx.body='哈哈哈'
  // },
  // 'get /list': async ctx=>{
  //   ctx.body=[1,2]
  // },
  'get /': app.$controller.home.index,
  'get /list': app.$controller.home.list,
  // 'get /list': async app=>{
  //   app.ctx.body=[1,2]
  // }
})