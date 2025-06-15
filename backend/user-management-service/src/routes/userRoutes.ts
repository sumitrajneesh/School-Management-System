// src/routes/userRoutes.ts
import { Router } from 'express';
import {
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword
} from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddleware';

const router = Router();

// Protected routes (require token)
router.get('/profile', protect, getUserProfile); // Get own profile

// Admin-only routes
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.get('/:id', protect, authorizeRoles('admin'), getUserById);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

// User or Admin routes
router.put('/:id', protect, updateUser); // Update user profile (user can update their own, admin can update any)
router.put('/:id/password', protect, updatePassword); // Update password (user can update their own, admin can update any)


export default router;