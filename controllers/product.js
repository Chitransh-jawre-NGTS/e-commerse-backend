const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

// ✅ Middleware: get product by ID
exports.getProductById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate("category");
    if (!product) return res.status(400).json({ error: "Product not found" });

    req.product = product;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Failed to fetch product" });
  }
};

// ✅ Create product
exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    if (err) return res.status(400).json({ error: "Problem with image" });

    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ error: "Please include all fields" });
    }

    fields.createdBy = req.profile._id;

    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        return res.status(400).json({ error: "File too large", message:"file size is too large" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    try {
      const savedProduct = await product.save();
      res.json(savedProduct);
    } catch (saveErr) {
      res.status(400).json({ error: "Unable to save product in DB" });
    }
  });
};

// ✅ Get a single product (excluding photo)
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// ✅ Serve product photo
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// ✅ Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await req.product.deleteOne();
    res.json({ message: "Product deleted successfully", deleted });
  } catch (err) {
    return res.status(400).json({ error: "Unable to delete product" });
  }
};

// ✅ Update product
exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    if (err) return res.status(400).json({ error: "Problem with image" });

    let product = _.extend(req.product, fields);

    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        return res.status(400).json({ error: "File too large" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    try {
      const updated = await product.save();
      res.json(updated);
    } catch (saveErr) {
      res.status(400).json({ error: "Unable to update product" });
    }
  });
};

// ✅ Get all products (for home/shop page)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select("-photo");

    const formatted = products.map((p) => ({
      id: p._id,
      title: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      brand: p.brand || "Generic",
      category: p.category || "Other",
      images: [`http://localhost:8080/api/product/photo/${p._id}`],
    }));

    res.json({ products: formatted });
  } catch (err) {
    return res.status(400).json({ error: "No products found" });
  }
};

// ✅ Get all unique categories
exports.getAllUniqueCategories = async (req, res) => {
  try {
    const category = await Product.distinct("category", {});
    res.json(category);
  } catch (err) {
    return res.status(400).json({ error: "No category found" });
  }
};

// ✅ Get products created by specific user
exports.getProductsByUser = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.params.userId }).select("-photo");
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return res.status(500).json({ error: "Server error fetching products" });
  }
};

// ✅ Update stock after order
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.product.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err) => {
    if (err) return res.status(400).json({ error: "Bulk operation failed" });
    next();
  });
};
