const mongoose = require("mongoose");
require("dotenv").config();

const base_url = process.env.MONGO_URL;

const connectDatabase = async () => {
  try {
    await mongoose.connect(base_url);
  } catch (err) {
    throw new Error("Failed to connect to MongoDB: " + err.message);
  }
};

module.exports = connectDatabase;
