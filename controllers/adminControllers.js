const Store = require("../models/rental/store.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validateGSTIN } = require("../utils/validateGSTIN");

exports.getAllPendingSellers = async (req, res) => {
  const pending = await Store.find({ isApproved: false });
  res.json(pending);
};

exports.approveSeller = async (req, res) => {
  const { sellerId } = req.params;
  const seller = await Store.findByIdAndUpdate(sellerId, { isApproved: true }, { new: true });
  if (!seller) return res.status(404).json({ message: "Seller not found" });
  res.json({ message: "Seller approved", seller });
};
