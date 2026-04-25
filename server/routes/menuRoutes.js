const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
// GET all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single menu item
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID" });
  }
});

// POST new menu item
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: "Error creating item" });
  }
});
// DELETE menu item
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
});
// UPDATE menu item
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: "Error updating menu item" });
  }
});
module.exports = router;
