const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDatabase = require("./config/db");
const { userRouter } = require("./routers/userRouter");
const { cartRouter } = require("./routers/cartRouter");
const { productRouter } = require("./routers/productRouter");
const { addressRouter } = require("./routers/addressRouter");
const { Authentication } = require("./middleware/authentication");
const { orderRouter } = require("./routers/orderRouter");
const paymentRouter = require("./routers/paymentRouter");
const PORT = process.env.PORT;

const app = express();

// CORS configuration for Vite frontend server
const corsOptions = {
  origin: "http://localhost:5173", // Vite dev server
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true, 
};

app.use(cors(corsOptions));

// Middleware for JSON parsing
app.use(express.json());

// Test route to ensure server is running
app.get("/", (req, res) => {
  res.status(200).json("Welcome to homepage..");
});

// HANDLING ROUTERS
app.use("/user", userRouter);
app.use("/cart", Authentication, cartRouter);
app.use("/product", productRouter);
app.use("/address", Authentication, addressRouter);
app.use("/order", Authentication, orderRouter);
app.use("/payment", paymentRouter);

// LISTENING TO SERVER
app.listen(PORT, async () => {
  try {
    console.log("connecting with database...");
    await connectDatabase();
    console.log("connected with database.");
    console.log(`server running at port:${PORT}`);
  } catch (err) {
    console.log({
      message: "unable to connect with database",
      err: err.message,
    });
  }
});