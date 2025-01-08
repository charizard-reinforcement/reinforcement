// server/routes/userRoutes.js
import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const router = express.Router();

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
    });
  } catch (err) {
    next({
      log: `Error in login route: ${err}`,
      status: 500,
      message: { err: 'Failed to login' },
    });
  }
});

// Register route
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password,
      email,
      firstName,
      lastName,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    next({
      log: `Error in register route: ${err}`,
      status: 500,
      message: { err: 'Failed to register user' },
    });
  }
});

export default router;
