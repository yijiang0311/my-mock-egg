'use strict';

/**
 * BaseContextClass is a base class that can be extended,
 * it's instantiated in context level,
 */
class BaseContextClass {
  /**
   * @class
   * @param {Context} ctx - context instanc
   */
  constructor(application) {
    /**
     * @member {Application} BaseContextClass#app
     */
    this.app = application;
    /**
     * @member {Context} BaseContextClass#ctx
     */
    this.ctx = application.ctx;
    /**
     * @member {Config} BaseContextClass#config
     */
    this.config = application.config;
    /**
     * @member {Service} BaseContextClass#service
     */
    this.service = application.service;
  }
}

module.exports = BaseContextClass;
