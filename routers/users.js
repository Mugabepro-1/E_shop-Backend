const express = require("express");
const checkAdmin = require("../helpers/checkAdmin");
const {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const router = express.Router();

router.get("/", checkAdmin, getAllUsers);
router.get("/:id", checkAdmin, getUserById);
router.post("/", checkAdmin, createUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/:id", checkAdmin, updateUser);
router.delete("/:id", checkAdmin, deleteUser);

module.exports = router;
