/**
 * @description 工具函数库
 * @author 一江
 */

/**
 * 判断一个对象是不是类class的形式
 * @param {object} target 任何js数据类型
 */
function isClass(target) {
  return typeof target == 'function' && target.toString().startsWith('class');
}

/**
 * selfish函数解决class里面的方法被提取出来单独使用的时候this的指向问题
 * @param {class} target 类
 */
function selfish(target) {
  const cache = new WeakMap();
  const handler = {
    get(target, key) {
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

module.exports = {
  isClass,
  selfish,
};
