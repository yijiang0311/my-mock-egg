const { Controller } = require('../../core/lib/index');

class BaseController extends Controller {
  // constructor(app) {
  //   super(app);
  // }
  success(data) {
    this.ctx.body = {
      success: true,
      code: 0,
      data,
    };
  }
  
}

module.exports = BaseController;
