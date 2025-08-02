// adminRoutes.js
const express = require("express");
const { getAllPendingSellers, approveSeller } = require("../controllers/adminControllers");
const router = express.Router();

// Route to get all pending sellers
router.get("/sellers/pending", getAllPendingSellers);

// Route to approve a seller
router.put("/sellers/approve/:sellerId", approveSeller);

module.exports = router;
