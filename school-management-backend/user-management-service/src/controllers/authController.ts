// src/controllers/authController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken'; // <--- Make sure 'Secret' is NOT imported here
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';
import asyncHandler from '../utils/asyncHandler';

// Helper function to generate JWT token
const generateToken = (id: string) => {
  // Pass JWT_SECRET directly. It is typed as 'string' from config/jwt.ts,
  // which is what jwt.sign expects for a basic HMAC secret.
  return jwt.sign({ id }, JWT_SECRET, { // <--- THIS LINE IS THE KEY. NO 'as Secret' HERE.
    expiresIn: JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  let user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  user = await User.findOne({ username });
  if (user) {
    res.status(400);
    throw new Error('User with this username already exists');
  }

  const newUser = new User({
    username,
    email,
    password,
    role: role || 'student',
  });

  await newUser.save();

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    token: generateToken(newUser._id.toString()),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  const user: (IUser & { password?: string }) | null = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  });
});