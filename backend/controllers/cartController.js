const { CartModel } = require("../models/cartModel");

// Add new item to cart
const addNewItemToCart = async (req, res) => {
  const { product, qty = 1 } = req.body;
  const userId = req.userId; 

  try {
    const isProductPresentInCart = await CartModel.findOne({
      product: product,
      user: userId,
    });

    if (isProductPresentInCart) {
      return res.status(409).json({ message: "Already in cart!" });
    }

    const newCartItem = new CartModel({
      user: userId,
      product: product,
      qty: qty,
    });

    await newCartItem.save();

    return res.status(200).json({ message: "Added to cart" });
  } catch (err) {
    console.error("Error in addNewItemToCart:", err);
    res.status(500).json({ message: "Server error, please try again!", error: err.message });
  }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
  const userId = req.userId; 
  const cartId = req.params.cartId;

  try {
    const isItemPresent = await CartModel.findOne({ user: userId, _id: cartId });

    if (!isItemPresent) {
      return res.status(404).json({ message: "Item not found or unauthorized!" });
    }

    await CartModel.deleteOne({ user: userId, _id: cartId });

    return res.status(200).json({ message: "Deleted Successfully!" });
  } catch (err) {
    console.error("Error in deleteCartItem:", err);
    res.status(500).json({ message: "Server error, please try again!", error: err.message });
  }
};

// Update quantity of cart item
const updateQtyOfCartItem = async (req, res) => {
  const userId = req.userId; 
  const cartId = req.params.cartId;
  const { qty } = req.body;

  try {
    const isItemPresent = await CartModel.findOne({ user: userId, _id: cartId });

    if (!isItemPresent) {
      return res.status(404).json({ message: "Item not found or unauthorized!" });
    }

    const updatedCart = await CartModel.findOneAndUpdate(
      { user: userId, _id: cartId },
      { $set: { qty: qty } },
      { new: true }
    );

    return res.status(200).json({ message: "Updated Successfully!", cart: updatedCart });
  } catch (err) {
    console.error("Error in updateQtyOfCartItem:", err);
    res.status(500).json({ message: "Server error, please try again!", error: err.message });
  }
};

// Get all cart items of a user
const getCartItems = async (req, res) => {
  const userId = req.userId; 

  try {
    const cartItems = await CartModel.find({ user: userId }).populate("product");

    const responseObject = {
      message: "Your cart items",
      cart: cartItems,
    };

    if (cartItems.length > 0) {
      responseObject.deliveryDate = getEstimatedDeliveryDate(new Date(), 5);
    }

    return res.status(200).json(responseObject);
  } catch (err) {
    console.error("Error in getCartItems:", err);
    res.status(500).json({ message: "Server error, please try again!", error: err.message });
  }
};

module.exports = {
  addNewItemToCart,
  deleteCartItem,
  updateQtyOfCartItem,
  getCartItems,
};

function getEstimatedDeliveryDate(currentDate, businessDays) {
  const date = new Date(currentDate);
  let count = 0;

  while (count < businessDays) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      count++;
    }
  }

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
}
