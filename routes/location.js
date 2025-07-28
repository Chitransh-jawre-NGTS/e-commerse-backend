const express = require('express');
const router = express.Router();
const { parser } = require("../utils/cloudinary");
const upload = require('../middleware/upload'); // Import the upload middleware
const { getNearbyRentals , createRental, getRentalById, deleteProduct } = require('../controllers/rental-Controlers/location')

router.get('/nearby-rentals', getNearbyRentals);
router.post("/create-rental", parser.single("image"), createRental);
router.get('/nearby-rentals/:id', getRentalById);
router.delete('/nearby-rentals/:id', deleteProduct);


module.exports = router;
