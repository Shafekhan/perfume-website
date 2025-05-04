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
    title: "Bin Shaikh",
    imgUrl: "https://www.ahmedalmaghribi.co.in/wp-content/uploads/2021/10/Artboard-58-3.png",
    price: 4500,
    brand: "Ahmed Al Maghribi",
  },
  {
    title: "Oud & Roses",
    imgUrl: "https://www.ahmedalmaghribi.co.in/wp-content/uploads/2021/10/Artboard-74-min.png",
    price: 3000,
    brand: "Ahmed Al Maghribi",
  },
  {
    title: "Kaaf",
    imgUrl: "https://www.ahmedalmaghribi.co.in/wp-content/uploads/2022/03/Artboard-42.png",
    price: 1800,
    brand: "Ahmed Al Maghribi",
  },
  {
    title: "Hawas",
    imgUrl: "https://fragstalk.in/wp-content/uploads/2021/03/Rasasi-hawas-for-Men-100-ml.png",
    price: 3000,
    brand: "Rasasi",
  },
  {
    title: "Asad",
    imgUrl: "https://fragstalk.in/wp-content/uploads/2022/07/Lattafa-Asad-Perfume-100ML-EDP.png",
    price: 1800,
    brand: "Lattafa",
  },
  {
    title: "Asad Bourbon",
    imgUrl: "https://fragstalk.in/wp-content/uploads/2025/02/Lattafa-Asad-Bourbon.png",
    price: 1800,
    brand: "Lattafa",
  },
  {
    title: "Khamrah",
    imgUrl: "https://fragstalk.in/wp-content/uploads/2022/11/Khamrah-Lattafa-100Ml-EDP-For-Men-and-Women.png",
    price: 2300,
    brand: "Lattafa",
  },
  {
    title: "Khamrah Qahwa",
    imgUrl: "https://fragstalk.in/wp-content/uploads/2024/01/Lattafa-Khamrah-Qahwa.png",
    price: 2400,
    brand: "Lattafa",
  },
  {
    title: "Wisal Dhahab",
    imgUrl: "https://fragstalk.in/wp-content/uploads/2024/09/Ajmal-Wisal-Dhahab-1.png",
    price: 2700,
    brand: "Ajmal",
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
