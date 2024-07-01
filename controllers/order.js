const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const mongoose = require("mongoose");

const getAllOrders = async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  if (!orderList) {
    return res.status(500).json({ success: false });
  }
  res.send(orderList);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: { path: "category" } },
    });
  if (!order) {
    return res.status(500).json({ success: false });
  }
  res.send(order);
};

const createOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress: req.body.shippingAddress,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order) {
    return res.status(400).send("The order cannot be created");
  }
  res.send(order);
};

const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) return res.status(400).send("This order cannot be updated");
  res.send(order);
};

const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (order) {
    await order.orderItems.map(async (orderItem) => {
      await OrderItem.findByIdAndDelete(orderItem);
    });

    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } else {
    return res
      .status(404)
      .json({ success: false, message: "The order was not deleted" });
  }
};

const getTotalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
  ]);
  if (!totalSales) {
    return res.status(400).send("Could not get the total sales");
  }
  res.send({ totalSales: totalSales.pop().totalSales });
};

const getOrderCount = async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    return res.status(400).send("Could not get the order count");
  }
  res.send({ orderCount: orderCount });
};

const getUserOrders = async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: { path: "category" } }
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    return res.status(500).json({ success: false });
  }
  res.send(userOrderList);
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getTotalSales,
  getOrderCount,
  getUserOrders,
};
