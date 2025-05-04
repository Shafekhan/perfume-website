const { UserModel } = require("../models/userModel");
const { verifyMessage } = require("ethers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;
const nonces = {}; 


// SIGNUP USER
const signup = async (req, res) => {
  let { email, name, password, role } = req.body;

  try {
    let isUserPresent = (await UserModel.findOne({ email })) || null;
    if (isUserPresent) {
      res.status(403).json({ message: "User already exist." });
    } else {
      const hash = bcrypt.hashSync(password, salt);
      let newUser = new UserModel({ email, name, role, password: hash });
      await newUser.save();
      res.status(200).json({ message: "signup succesfull", user: req.body });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = (await UserModel.findOne({ email })) || null;
    if (!userFound) return res.status(404).json({ message: "User not found!" });

    let isCorrectPassword = bcrypt.compareSync(password, userFound.password);
    if (isCorrectPassword) {
      // generate token
      const token = jwt.sign({ userId: userFound._id }, secret);
      res.status(200).json({
        message: "Login Success",
        user: {
          token,
          name: userFound.name,
          email: userFound.email,
          role: userFound.role,
        },
      });
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong please try again later",
      err: err.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong please try again later",
      err: err.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  const reqId = req.params.reqId;
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: reqId },
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ user: updatedUser, message: "Role update successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong please try again later",
      err: err.message,
    });
  }
};

const getNonce = async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  try {
    const nonce = `Login to PerfumeStore: ${Math.floor(Math.random() * 1000000)}`;
    nonces[walletAddress.toLowerCase()] = nonce; 

    return res.status(200).json({ nonce });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong", err: err.message });
  }
};


// METAMASK LOGIN
const metamaskLogin = async (req, res) => {
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    return res.status(400).json({ message: "Wallet address and signature are required" });
  }

  const nonce = nonces[walletAddress.toLowerCase()];

  if (!nonce) {
    return res.status(400).json({ message: "Nonce not found for wallet address" });
  }

  try {
    const signerAddress = verifyMessage(nonce, signature);

    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ message: "Signature verification failed" });
    }

    delete nonces[walletAddress.toLowerCase()]; 

    let user = await UserModel.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      user = new UserModel({
        name: "Metamask User",
        email: `${walletAddress}@metamaskuser.com`,
        password: "blockchain_auth",
        walletAddress: walletAddress.toLowerCase(),
      });

      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, secret);

    return res.status(200).json({
      message: "Login Success",
      user: {
        token,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    });

  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      err: err.message,
    });
  }
};


module.exports = { signup, login, getAllUser, updateUserRole, metamaskLogin, getNonce };
