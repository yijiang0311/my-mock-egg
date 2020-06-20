/**
 * @description supertest server
 * @author 一江
 */

const request = require('supertest');
const server = require('../app').app.callback();

module.exports = request(server);
