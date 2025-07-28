const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList
} = require('../controllers/user');

const {
  isAuthenticated,
  isSignedIn,
  isAdmin
} = require('../controllers/auth');

// Middleware to extract user from :userId param
router.param("userId", getUserById);

// Get user details
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// Update user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// Get purchase list (order history)
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
