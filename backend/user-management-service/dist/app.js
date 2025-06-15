"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to database
(0, db_1.default)();
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'User Management Service is Up and Running!' });
});
// Route Mounts
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
// Basic Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { error: err }), // Show error details in dev
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map