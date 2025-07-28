const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ["Clothes", "Toys", "Beauty", "Electronics", "Other"],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      trim: true,
      default: "Generic",
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
