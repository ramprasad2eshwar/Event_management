const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Registration failed', details: err });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // console.log('Login Request:', req.body); // Debugging

        const user = await User.findOne({ email });

        if (!user) {
            // console.log('User not found'); // Debugging
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('User Found:', user); // Debugging

        if (!(await user.comparePassword(password))) {
            // console.log('Password mismatch'); // Debugging
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, "secretforsecure", { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        // console.error('Login Error:', err);
        res.status(400).json({ error: 'Login failed', details: err.message });
    }
});

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user || !(await user.comparePassword(password))) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (err) {
//         res.status(400).json({ error: 'Login failed', details: err });
//     }
// });

module.exports = router;
