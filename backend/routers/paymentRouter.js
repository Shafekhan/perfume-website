const express = require("express");
const router = express.Router();
const { createRazorpayOrder } = require("../controllers/paymentController");
const { Authentication } = require("../middleware/authentication");


router.post("/razorpay/create-order", Authentication, createRazorpayOrder);


module.exports = router;
