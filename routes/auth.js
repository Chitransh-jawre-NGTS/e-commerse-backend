const express = require("express");
const router = express.Router();
const { check } = require('express-validator');
const { signout, signup, signin} = require("../controllers/auth");
const { sellerLogin,  sellerRegister } = require("../controllers/rental-Controlers/authControler");

router.get("/signout", signout);

router.post("/signup", [
  check("name", "name is required field").isLength({ min: 3 }),
  check("email", "email is necessary").isEmail(),
  check("password", "password is important").isLength({ min: 5 })
], signup);

router.post("/signin", [
  check("email", "email is necessary").isEmail(),
  check("password", "password is important").isLength({ min: 3 })
], signin);

router.post("/seller/login", sellerLogin);
router.post("/seller/register", sellerRegister);



module.exports = router;
