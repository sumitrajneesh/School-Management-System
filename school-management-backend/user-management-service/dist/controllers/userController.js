"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // User is attached to req.user by the protect middleware
    res.json(req.user);
};
exports.getUserProfile = getUserProfile;
// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().select('-password'); // Exclude password
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching users', error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user', error: error.message });
    }
};
exports.getUserById = getUserById;
// @desc    Update user profile (User themselves or Admin)
// @route   PUT /api/users/:id
// @access  Private (User or Admin)
const updateUser = async (req, res) => {
    const { username, email, role } = req.body; // Password update should be a separate endpoint for security
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the requesting user is modifying their own profile OR if they are an admin
        if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }
        // Prevent non-admins from changing roles
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can change user roles' });
        }
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (role && req.user.role === 'admin')
            user.role = role; // Only admin can update role
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    }
    catch (error) {
        console.error(error);
        // Handle unique constraint errors for username/email
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }
        res.status(500).json({ message: 'Server error updating user', error: error.message });
    }
};
exports.updateUser = updateUser;
// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Prevent an admin from deleting themselves (optional but good practice)
        if (req.user._id.toString() === user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete own account' });
        }
        await User_1.default.deleteOne({ _id: req.params.id }); // Using deleteOne for Mongoose 6+
        res.json({ message: 'User removed' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting user', error: error.message });
    }
};
exports.deleteUser = deleteUser;
// @desc    Update user password
// @route   PUT /api/users/:id/password
// @access  Private (User or Admin)
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }
    try {
        const user = await User_1.default.findById(req.params.id).select('+password'); // Select password to compare
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the requesting user is modifying their own profile OR if they are an admin
        if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this user\'s password' });
        }
        // If not admin, verify current password
        if (req.user.role !== 'admin' && !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ message: 'Invalid current password' });
        }
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }
        user.password = newPassword; // Mongoose pre-save hook will hash this
        await user.save();
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating password', error: error.message });
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=userController.js.map