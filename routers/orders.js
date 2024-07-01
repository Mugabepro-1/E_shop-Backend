const express = require("express");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getTotalSales,
  getOrderCount,
  getUserOrders,
} = require("../controllers/order");

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.get("/get/totalsales", getTotalSales);
router.get("/get/count", getOrderCount);
router.get("/get/userorders/:userid", getUserOrders);

module.exports = router;
