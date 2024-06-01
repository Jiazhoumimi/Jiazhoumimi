const bcrypt = require('bcrypt');
const db = require('./db'); // 确保路径正确

async function updatePasswords() {
  try {
    // 获取所有用户
    const users = await db('users');

    for (const user of users) {
      // 检查密码是否未哈希（通常哈希密码以 $2b$ 开头）
      if (!user.password.startsWith('$2b$')) {
        // 哈希密码
        const hashedPassword = await bcrypt.hash(user.password, 10);
        // 更新用户密码
        await db('users')
          .where({ user_id: user.user_id })
          .update({ password: hashedPassword });
      }
    }

    console.log('Passwords updated successfully');
  } catch (err) {
    console.error('Error updating passwords:', err);
  } finally {
    db.destroy(); // 关闭数据库连接
  }
}

// 运行更新密码的函数
updatePasswords();
