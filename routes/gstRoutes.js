// routes/gstRoutes.js
const express = require('express');
const router = express.Router();
const { verifyGSTIN } = require('../controllers/gstControllers');

router.post('/verify-gstin', verifyGSTIN );

module.exports = router;
