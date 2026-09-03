const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../data/users');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // 1. Input Validation
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if user already exists
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // 2. Hash Password (Security Requirement)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Store User
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword, // Storing hash, NOT plain text
            role // e.g., 'Client' or 'Freelancer'
        };
        users.push(newUser);

        // Safely return response without exposing password
        res.status(201).json({
            message: 'User registered successfully.',
            user: { id: newUser.id, username: newUser.username, role: newUser.role }
        });

    } catch (error) {
        // Controlled error response (No stack traces exposed)
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Input Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // 2. Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

module.exports = { registerUser, loginUser };