const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isSignedIn,
  isAdmin,
} = require("../controllers/auth");

const { getUserById } = require("../controllers/user");

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByUser, // ✅ New route to get products by specific user
} = require("../controllers/product");

// Params
router.param("userId", getUserById);
router.param("productId", getProductById);

// Routes
router.get("/products", getAllProducts);
router.get("/products/by/:userId", isSignedIn, isAuthenticated, getProductsByUser);

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);

module.exports = router;
