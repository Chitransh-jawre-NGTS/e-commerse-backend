const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 32 },
    username: { type: String, required: true, unique: true, trim: true, maxlength: 32 },
    lastName: { type: String, trim: true, maxlength: 32 },
    email: { type: String, required: true, unique: true, trim: true },
    userinfo: { type: String, trim: true },
    encry_password: { type: String, required: true },
    salt: { type: String },
    role: { type: Number, default: 1 },
    purchases: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        description: String,
        category: String,
        quantity: Number,
        amount: Number,
        transaction_id: String,
      },
    ],
  },
  { timestamps: true }
);

// ✅ Add virtual field for password
userSchema.virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  authenticate: function(plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },
  securePassword: function(plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto.createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
