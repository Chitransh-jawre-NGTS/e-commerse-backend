const Store = require("../../models/rental/store.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validateGSTIN } = require("../../utils/validateGSTIN");


exports.sellerLogin = async (req, res) => {
  console.log("hit properly");
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const admin = await Store.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Check if seller is approved
    if (!admin.isApproved) {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Check if seller is approved
    if (!admin.isApproved) {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: "seller",
      user: {
        id: admin._id,
        email: admin.email,
        phone: admin.contact,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sellerRegister = async (req, res) => {
  const { name, email, contact, password, gstNumber } = req.body;

  // Validate GST
  const gstData = validateGSTIN(gstNumber);

  if (!gstData || gstData.status !== "Active") {
    return res.status(400).json({ message: "Seller not verified via GST" });
  }

  try {
    const store = new Store({
      name,
      email,
      contact,
      password: hasshedPassword,
      gstNumber,
      address: gstData.address,
    });

    await store.save();
    res.status(201).json({ message: "Store registered successfully", store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.approveStore = async (req, res) => {
  console.log("API hit properly");
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    store.isApproved = true;
    await store.save();

    res.status(200).json({ message: "Store approved by admin" });
  } catch (err) {
    console.error("Approve store error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
