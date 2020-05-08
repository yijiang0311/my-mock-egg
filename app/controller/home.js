const index = async app=>{
  app.ctx.body= {a:1}
}
const list = async app=>{
  app.ctx.body= {b:1}
}

module.exports={
  index,
  list
}

