const static = require('koa-static')
const {join,resolve} = require('path')

module.exports=static(join(__dirname,'../public'))
// module.exports=static(resolve(__dirname,'../public'))