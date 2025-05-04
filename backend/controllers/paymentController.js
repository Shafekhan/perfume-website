const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  console.log("Received create-order amount:", amount);

  try {
    const options = {
      amount: amount, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,

    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

module.exports = { createRazorpayOrder };