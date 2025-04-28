const { OrderModel } = require("../models/orderModel");
const { CartModel } = require("../models/cartModel");

// Get all orders of a specific user
const getOrdersOfUser = async (req, res) => {
  const userId = req.userId; // getting from middleware

  try {
    const allorders = await OrderModel.find({ user: userId }).populate("product");
    res.status(200).json({ order: allorders });
  } catch (err) {
    res.status(500).json({ message: "Server error, please try again!", err: err.message });
  }
};

// Get all orders (admin panel)
const getAdminAllOrders = async (req, res) => {
  try {
    const allorders = await OrderModel.find()
      .populate("product")
      .populate("address")
      .populate("user", "name email role"); // select only name, email, role from user
    res.status(200).json({ order: allorders });
  } catch (err) {
    res.status(500).json({ message: "Server error, please try again!", err: err.message });
  }
};

// Add a new order
const addNewOrder = async (req, res) => {
  const userId = req.userId; // getting from middleware
  const { address, deliveryAt } = req.body;

  try {
    const cartItems = await CartModel.find({ user: userId });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty. Cannot place an order." });
    }

    const ordersData = cartItems.map((item) => ({
      product: item.product._id,
      qty: item.qty,
      address,
      deliveryAt,
      user: userId,
    }));

    await OrderModel.insertMany(ordersData);
    await CartModel.deleteMany({ user: userId });

    res.status(200).json({ message: "Order placed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error, please try again!", err: err.message });
  }
};

// Update an existing order (admin functionality usually)
const updateOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "Order updated successfully.", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error, please try again!", err: err.message });
  }
};

module.exports = {
  getOrdersOfUser,
  addNewOrder,
  updateOrder,
  getAdminAllOrders,
};
