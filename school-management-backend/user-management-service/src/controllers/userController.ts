// src/controllers/userController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // <--- Import IUser
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler'; // <--- Import asyncHandler

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  res.json(req.user);
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users: IUser[] = await User.find().select('-password'); // <--- Explicitly type
  res.json(users);
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid User ID format');
  }

  const user: IUser | null = await User.findById(req.params.id).select('-password'); // <--- Explicitly type
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// @desc    Update user profile (User themselves or Admin)
// @route   PUT /api/users/:id
// @access  Private (User or Admin)
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, role } = req.body; // Password update should be a separate endpoint for security

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid User ID format');
  }

  const user: IUser | null = await User.findById(req.params.id); // <--- Explicitly type

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the requesting user is modifying their own profile OR if they are an admin
  if (req.user!._id.toString() !== user._id.toString() && req.user!.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this user');
  }

  // Prevent non-admins from changing roles
  if (role && req.user!.role !== 'admin') {
    res.status(403);
    throw new  Error('Only administrators can change user roles');
  }

  if (username) user.username = username;
  if (email) user.email = email;
  if (role && req.user!.role === 'admin') user.role = role; // Only admin can update role

  try {
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error: any) {
    if (error.code === 11000) { // MongoDB duplicate key error
      res.status(400);
      throw new Error('Username or Email already exists');
    }
    console.error(error);
    res.status(500);
    throw new Error('Server error updating user');
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid User ID format');
  }

  const user: IUser | null = await User.findById(req.params.id); // <--- Explicitly type

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent an admin from deleting themselves (optional but good practice)
  if (req.user!._id.toString() === user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete own account');
  }

  await User.deleteOne({ _id: req.params.id }); // Using deleteOne for Mongoose 6+

  res.json({ message: 'User removed' });
});

// @desc    Update user password
// @route   PUT /api/users/:id/password
// @access  Private (User or Admin)
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid User ID format');
  }

  const user: (IUser & { password?: string }) | null = await User.findById(req.params.id).select('+password'); // <--- Explicitly type

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the requesting user is modifying their own profile OR if they are an admin
  if (req.user!._id.toString() !== user._id.toString() && req.user!.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this user\'s password');
  }

  // If not admin, verify current password
  if (req.user!.role !== 'admin' && !(await user.comparePassword(currentPassword))) {
    res.status(401);
    throw new Error('Invalid current password');
  }

  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters long');
  }

  user.password = newPassword; // Mongoose pre-save hook will hash this
  await user.save();

  res.json({ message: 'Password updated successfully' });
});