const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Zhoumi0710', // 替换为你的数据库密码
    database: 'db666' // 确保数据库已创建
  }
});

module.exports = db;
