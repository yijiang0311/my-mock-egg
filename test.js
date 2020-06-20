// const Test = require('./app/controller/test');

function selfish(target) {
  const cache = new WeakMap();
  const handler = {
    get(target, key) {
      console.log('selfish...key', key);
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    },
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

class Test {
  getList() {}
  getList2() {}
}

const logger = selfish(new Test());
logger.getList();

var requireDirectory = require('require-directory');

const visitor = (obj) => {
  console.log(obj);
  return obj;
};
const modules = requireDirectory(module, './app/controller', {
  visit: visitor,
});
console.log(modules);
