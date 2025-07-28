const { check, validationResult } = require('express-validator');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { expressjwt: expressJwt } = require("express-jwt");
const { validateGSTIN } = require("../utils/validateGSTIN");

// =========================
// ✅ SIGNUP (async version)
// =========================
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      errin: errors.array()[0].param,
    });
  }

  const { name, email, password, username } = req.body;

  if (!password || password.length < 5) {
    return res.status(400).json({ error: "Password must be at least 5 characters" });
  }

  try {
    // check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    // create user object with all required fields
    const user = new User({ name, email, username });
    user.password = password; // virtual field triggers encryption

    const savedUser = await user.save();

    console.log("✅ User created:", savedUser.email);

    res.status(201).json({
      name: savedUser.name,
      email: savedUser.email,
      username: savedUser.username,
      id: savedUser._id,
    });

  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({
      error: "Server error while saving user",
    });
  }
};




// =========================
// ✅ SIGNIN (async version)
// =========================
exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      errin: errors.array()[0].param,
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "USER email doesn't exist",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "EMAIL or PASSWORD not matched",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email: userEmail, role } = user;
    return res.json({ token, user: { _id, name, email: userEmail, role } });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =========================
// ✅ SIGNOUT
// =========================
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout complete",
  });
};

// =========================
// ✅ JWT Middleware
// =========================
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

// =========================
// ✅ Custom Access Middlewares
// =========================
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not admin, ACCESS DENIED",
    });
  }
  next();
};

let sellers = [];

exports.registerSeller = async (req, res) => {
  const { name, email, gstin, password } = req.body;

  if (!validateGSTIN(gstin)) {
    return res.status(400).json({ message: "Invalid or unauthorized GSTIN" });
  }

  const existing = sellers.find(s => s.email === email);
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const seller = {
    id: sellers.length + 1,
    name,
    email,
    gstin,
    password: hashedPassword,
  };
  sellers.push(seller);

  res.status(201).json({ message: "Seller registered", sellerId: seller.id });
};

exports.loginSeller = async (req, res) => {
  const { email, password } = req.body;
  const seller = sellers.find(s => s.email === email);
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  const match = await bcrypt.compare(password, seller.password);
  if (!match) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.status(200).json({ message: "Login successful", sellerId: seller.id });
};


exports.registerrentalstore = async( res,req) => {
  try {
    const { name, email, gstin, password } = req.body;

    if (!validateGSTIN(gstin)) {
      return res.status(400).json({ message: "Invalid or unauthorized GSTIN" });
    }

    const existing = sellers.find(s => s.email === email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const seller = {
      id: sellers.length + 1,
      name,
      email,
      gstin,
      password: hashedPassword,
    };
    sellers.push(seller);

    res.status(201).json({ message: "Seller registered", sellerId: seller.id });
  } catch (error) {
    console.error("Error registering rental store:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}