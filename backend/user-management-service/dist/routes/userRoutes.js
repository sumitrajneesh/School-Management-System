"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Protected routes (require token)
router.get('/profile', authMiddleware_1.protect, userController_1.getUserProfile); // Get own profile
// Admin-only routes
router.get('/', authMiddleware_1.protect, (0, roleMiddleware_1.authorizeRoles)('admin'), userController_1.getAllUsers);
router.get('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorizeRoles)('admin'), userController_1.getUserById);
router.delete('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorizeRoles)('admin'), userController_1.deleteUser);
// User or Admin routes
router.put('/:id', authMiddleware_1.protect, userController_1.updateUser); // Update user profile (user can update their own, admin can update any)
router.put('/:id/password', authMiddleware_1.protect, userController_1.updatePassword); // Update password (user can update their own, admin can update any)
exports.default = router;
//# sourceMappingURL=userRoutes.js.map