const Parameter = require('parameter');
const { ParameterException } = require('../../core/lib/http-exception');
const parameter = new Parameter({
  validateRoot: true,
});
function log(target, name, descriptor) {
  var oldValue = descriptor.value;
  descriptor.value = function () {
    console.log(`装饰器 log Calling ${name} with`);
    return oldValue.apply(this, arguments);
  };
  return descriptor;
}
const validate = (rule) => (target, name, descriptor) => {
  const oldValue = descriptor.value;
  descriptor.value = function () {
    const { body, query } = arguments[0].request;
    const { params } = arguments[0];
    check(rule.body, body);
    check(rule.query, query);
    check(rule.params, params);
    return oldValue.apply(this, arguments);
  };
  return descriptor;
};

function check(rule, data = {}) {
  if (rule) {
    const errors = parameter.validate(rule, data);
    if (errors) {
      const message = Array.isArray(errors)
        ? JSON.stringify(errors)
        : errors.toString();
      throw new ParameterException(message);
    }
  }
}

const body = (rule) => validate({ body: rule });
const query = (rule) => validate({ query: rule });
const params = (rule) => validate({ params: rule });

module.exports = {
  validate,
  body,
  query,
  params,
};
