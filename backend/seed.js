const mongoose = require("mongoose");
const { ProductModel } = require("./models/productModel");
require("dotenv").config(); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

const seedProducts = [
  {
    title: "Ocean Breeze Perfume",
    imgUrl: "https://example.com/ocean.jpg",
    price: 799,
    brand: "AquaFresh",
  },
  {
    title: "Mystic Rose",
    imgUrl: "https://example.com/rose.jpg",
    price: 1199,
    brand: "Flora",
  },
  {
    title: "Woodland Spice",
    imgUrl: "https://example.com/woodland.jpg",
    price: 999,
    brand: "Earthy",
  },
  {
    title: "Citrus Zest",
    imgUrl: "https://example.com/citrus.jpg",
    price: 699,
    brand: "Zesty",
  },
  {
    title: "Midnight Oud",
    imgUrl: "https://example.com/oud.jpg",
    price: 1499,
    brand: "Royal",
  },
];

const seedDB = async () => {
  await connectDB();
  try {
    await ProductModel.deleteMany();
    const inserted = await ProductModel.insertMany(seedProducts);
    console.log(`Inserted ${inserted.length} products!`);
  } catch (err) {
    console.error("Error inserting seed data", err);
  } finally {
    mongoose.disconnect();
  }
};

seedDB();
