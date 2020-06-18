const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const user = (app) => ({
  async getAll() {
    console.log('getall');
    await delay(1000);
    return [1, 2, 3, 4];
  },
  async getList() {
    console.log('getlist');
    const all = await app.model.user.findAll();
    console.log(all);
    return all;
  },
});

module.exports = user;
