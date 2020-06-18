module.exports = (options) => {
  return async (ctx, next) => {
    console.log('这里是中间件');
    next();
  };
};
