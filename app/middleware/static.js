const koaStatic = require('koa-static');
const { join, resolve } = require('path');

module.exports = (options) => koaStatic(join(__dirname, '../public'));
// module.exports=static(resolve(__dirname,'../public'))
