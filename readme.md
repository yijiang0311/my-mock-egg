<!--
 * @Author: zyi
 * @Date: 2020-05-07 15:30:19
 * @LastEditTime: 2020-05-07 15:31:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /my-mock-egg/readme.md
 -->
 # 自己动手从koa2实现MVC分层架构 【类egg】

### ⽬标是创建约定⼤于配置、开发效率⾼、可维护性强的项⽬架构
 # 路由处理规范：
    所有路由，都要放在routes⽂件夹中 若导出路由对象，使⽤ 动词+空格+路径 作为key，值是操作⽅法 若导出函数，则函数返回第⼆条约定格式的对象

  将 controller, service,model,挂载到全局app上，middleware,schedule按配置需要加载

框架已经搭好了，往里面写业务代码就行了