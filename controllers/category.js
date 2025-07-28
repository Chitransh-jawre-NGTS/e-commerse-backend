const Category = require("../models/category");

exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,cate) => {
        if(err){
            return res.status(400).json({
                error : "category not found in database"
            })
        }
        req.category = cate;
        next();
    })
}

// controllers/category.js
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const allowed = ["Clothes", "Toys"];

  if (!allowed.includes(name)) {
    return res.status(400).json({ error: "Only 'Clothes' and 'Toys' categories are allowed" });
  }

  try {
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(200).json(existing); // Already exists
    }

    const category = new Category({ name });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Failed to create category", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getCategory = (req,res) => {
    res.json(req.category)
}


exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    return res.status(400).json({
      error: "NO categories found in DB"
    });
  }
};


exports.updateCategory = async (req,res) => {

    try {
        const categorys = await Category.find();
        res.json(categorys);
    } catch (err) {
        return res.status(400).json({
            error:"no categries found in db"
        });
    }
  
}

exports.removeCategory = async (req,res) => {
    try {
        const category = await category.find();
        res.json(category)
    } catch (err) {
        return res.status(400).json({
            error:"no categories found"
        })
    }
}