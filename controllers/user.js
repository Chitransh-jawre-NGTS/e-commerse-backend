const User = require("../models/user");
const Order = require("../models/order");

// ✅ Fetch user by ID
exports.getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "No user found in database" });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Error fetching user" });
  }
};

// ✅ Return sanitized user profile
exports.getUser = (req, res) => {
  const { profile } = req;
  if (!profile) {
    return res.status(400).json({ error: "User not found" });
  }

  profile.salt = undefined;
  profile.encry_password = undefined;
  profile.createdAt = undefined;
  profile.updatedAt = undefined;

  return res.json(profile);
};

// ✅ Update user details
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );

    updatedUser.salt = undefined;
    updatedUser.encry_password = undefined;
    return res.json(updatedUser);
  } catch (err) {
    return res.status(400).json({ error: "Failed to update user in the database" });
  }
};

// ✅ Get user's order history
exports.userPurchaseList = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.profile._id })
      .populate("user", "_id name");
    
    if (!orders || orders.length === 0) {
      return res.status(400).json({ error: "No orders found for this user" });
    }

    return res.json(orders);
  } catch (err) {
    return res.status(400).json({ error: "Failed to retrieve orders" });
  }
};

// ✅ Push order into user's purchase list
exports.pushOrderInPurchaseList = async (req, res, next) => {
  let purchases = [];

  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  try {
    await User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { purchases: { $each: purchases } } },
      { new: true }
    );
    next();
  } catch (err) {
    return res.status(400).json({ error: "Unable to save purchase list" });
  }
};
