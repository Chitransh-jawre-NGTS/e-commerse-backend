const Store = require("../../models/rental/store.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.adminLogin = async (req, res) => {
  console.log("hit properly");
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Store.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
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



exports.adminRegister = async (req, res) => {
  console.log("api hit properly");
  try {
    const { name, email, contact, password } = req.body;

    if (!name || !email || !contact || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Store.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Store already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStore = new Store({
      name,
      email,
      contact,
      password: hashedPassword,
    });

    await newStore.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
