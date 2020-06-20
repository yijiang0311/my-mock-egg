/**
 * @description 测试控制器example
 * @author 一江
 */
const assert = require('assert');
const server = require('../../server');

describe('app/controller/example', () => {
  describe('get /example/1', async () => {
    it('成功时应返回code 0 ', async () => {
      const res = await server.get('/example/1');
      assert(res.body.code === 0);
    });
  });
  describe('post /example/update', async () => {
    it('成功时应返回code 0 ', async () => {
      const res = await (await server.post('/example/1'))
        .set('Accept', 'application/json')
        .send({ name: 'zyi' });
      assert(res.body.code === 0);
    });
  });
});
