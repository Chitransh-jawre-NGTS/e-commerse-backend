const fs = require('fs');
const cloudinary = require('../../utils/cloudinary'); // Make sure this is configured
const Rental = require('../../models/rental/userLocation');
exports.getNearbyRentals = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude required' });
  }

  try {
    const rentals = await Rental.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 10000, // 10 km
        }
      }
    });

    res.json(rentals);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (error) {
    console.error("Error fetching rental by ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new rental
exports.createRental = async (req, res) => {
  try {
    const { name, price, duration, title, description, latitude, longitude } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    const newRental = new Rental({
      name,
      price,
      duration,
      description,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      image: req.file.path,
    });

    await newRental.save();
    res.status(201).json(newRental);
  } catch (err) {
    console.error("Error uploading image or saving rental:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// routes/nearby.js or controller
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Rental.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

