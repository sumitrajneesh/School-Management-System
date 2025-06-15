import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';

// Helper function to generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({ message: 'User with this username already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      role: role || 'student', // Default role to 'student' if not provided
    });

    await user.save();

    // Generate token and respond
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check for user by email, and select password too
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Respond with user data and token (without password)
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};