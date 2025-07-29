require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");// Import the upload middleware

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ✅ Important: Handle OPTIONS requests (CORS preflight)
app.options("*", cors());

// ✅ MongoDB Connection
const DB = process.env.DATABASE;
mongoose.connect(DB)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.error("DB CONNECTION ERROR:", err));

// ✅ Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const location = require("./routes/location");
const gstRoutes = require("./routes/gstRoutes");
// const { registerSeller } = require('./controllers/auth');




// Rental Routes




app.use("/api", location);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", gstRoutes)



// ✅ Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
