# 🌸 Online Perfume Store with MetaMask Authentication and Hybrid Checkout

An advanced e-commerce perfume platform built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with **MetaMask-based blockchain authentication**. This project is designed to bridge modern web2 and web3 experiences in online shopping.

---

## 🧾 Abstract

This project introduces a web-based perfume e-commerce application combining traditional authentication and modern blockchain wallet login using **MetaMask**. Users can securely log in with either their email/password or Ethereum wallet (MetaMask). The site features a complete product browsing and checkout experience using **Razorpay** for INR payments, while future updates will support NFT-based perfume products and crypto transactions.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Email/password authentication using JWT
  - MetaMask login for web3 wallet-based authentication

- 🛍️ **E-commerce Functionality**
  - Browse perfumes by category
  - Product details, add to cart, wishlist
  - Checkout and order confirmation

- 💳 **Payment System**
  - Razorpay integration for secure INR-based checkout
  - Crypto checkout planned for future implementation

- 📦 **Order & Cart Management**
  - Add/remove items to cart
  - View order history per user

- 🧑‍💼 **Admin Dashboard**
  - Manage products, users, and orders

---

## 🧱 Tech Stack

### 🌐 Frontend
- React.js + Vite
- Chakra UI
- Redux Toolkit
- React Router
- Web3.js / Ethers.js for MetaMask integration

### 🔧 Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication
- Razorpay Payment Gateway

---

## 📁 Project Structure

project-root/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── config/
│
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── redux/
│ ├── routes/
│ └── App.jsx
│
└── README.md

yaml
Copy
Edit

---

## 🛠️ Setup Instructions

### 🔌 Prerequisites

- Node.js and npm
- MongoDB (local or cloud)
- MetaMask extension in browser

---

### ⚙️ Backend Setup

```bash
cd backend
npm install
npm run dev
Create a .env file in /backend with the following:

ini
Copy
Edit
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_SECRET=<your-razorpay-secret>
🌐 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Make sure MetaMask is installed in your browser and set to a valid Ethereum network.

🔗 MetaMask Authentication
On login page, user can click “Login with MetaMask”

Ethereum address is used to identify the user

Ethers.js is used to request wallet access and sign a message

Authenticated wallet users are stored in MongoDB as web3 users

📃 License
This project is open-source under the MIT License.