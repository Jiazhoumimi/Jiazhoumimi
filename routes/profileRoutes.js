// profileRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// 中间件：验证 JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// 创建用户资料
router.post('/', authenticateToken, async (req, res) => {
    const { name, birthday, zodiac_sign, height, weight, phone, beauty_budget } = req.body;
    const user_id = req.user.userId;

    if (!name || !birthday || !zodiac_sign || !height || !weight || !phone || !beauty_budget) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingProfile = await db('profiles').where({ user_id }).first();
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists for this user' });
        }

        await db('profiles').insert({
            user_id,
            name,
            birthday,
            zodiac_sign,
            height,
            weight,
            phone,
            beauty_budget
        });

        res.status(201).json({ message: 'Profile created successfully' });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ message: 'Error creating profile' });
    }
});

// 获取用户资料
router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.userId;

    try {
        const profile = await db('profiles').where({ user_id }).first();
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

module.exports = router;
