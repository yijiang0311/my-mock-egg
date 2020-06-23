const Parameter = require('parameter');
const { ParameterException } = require('./http-exception');
const parameter = new Parameter({
  validateRoot: false,
});

module.exports = (ctx) => (rule, data) => {
  if (!data) {
    if (ctx.method === 'GET' || ctx.method === 'HEAD') {
      data = ctx.query;
    } else {
      data = ctx.request.body;
    }
  }

  const errors = parameter.validate(rule, data);
  if (errors) {
    const message = Array.isArray(errors)
      ? JSON.stringify(errors)
      : errors.toString();
    throw new ParameterException(message);
  }
};
