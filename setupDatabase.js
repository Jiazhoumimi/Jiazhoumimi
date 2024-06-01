const mysql = require('mysql2/promise');

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zhoumi0710', // 替换为正确的 MySQL root 用户密码
        port: 3306 // 默认端口是3306，如果你的MySQL使用其他端口，请修改
    });

    // 创建数据库
    await connection.query(`CREATE DATABASE IF NOT EXISTS db666`);
    // 选择使用刚创建的数据库
    await connection.query(`USE db666`);

    // 创建 users 表
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 创建 profiles 表
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS profiles (
            profile_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            birthday DATE NOT NULL,
            zodiac_sign ENUM('Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces') NOT NULL,
            height DECIMAL(5, 2) NOT NULL,
            weight DECIMAL(5, 2) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            beauty_budget DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    `);

    // 创建 bookings 表
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        appointment_type ENUM('Eyelash', 'Manicure', 'Laser', 'Injection', 'Laser Hair Removal', 'Hair', 'SPA', 'Massage', 'GP', 'Therapist') NOT NULL,
        appointment_date DATETIME NOT NULL,
        salon_name VARCHAR(255) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        times INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
    `);

    // 创建 notes 表
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS notes (
            diary_id INT AUTO_INCREMENT PRIMARY KEY,
            diary_name VARCHAR(255) NOT NULL,
            candidate VARCHAR(255) NOT NULL,
            channel ENUM('Dating App', 'Social Media', 'Friends', 'Family', 'School', 'Work Place', 'Travel', 'Other') NOT NULL,
            zodiac_sign ENUM('Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces') NOT NULL,
            date_purpose ENUM('Hang Out', 'Fun Casual Date', 'Short Term Relationship', 'Long Term Relationship', 'Life Partner') NOT NULL,
            date DATE NOT NULL,
            place VARCHAR(255) NOT NULL,
            times_of_date INT NOT NULL,
            reflection TEXT NOT NULL,
            cost DECIMAL(10, 2) NOT NULL,
            next_date ENUM('Yes', 'No', 'Unknown') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database setup completed!');
    await connection.end();
}

setupDatabase().catch(err => {
    console.error('Error setting up the database:', err);
});
