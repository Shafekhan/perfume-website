const { AddressModel } = require("../models/addressModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

// Helper function to get userId from token
const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

// ADD NEW ADDRESS
const addNewAddress = async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
  const data = req.body;
  try {
    const newAddress = await AddressModel.create({ ...data, user: userId });
    res.status(200).json({
      message: "New address added successfully!",
      address: newAddress,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error please try again!", err: err.message });
  }
};

// GET/READ ADDRESS DATA OF A USER
const getAddressOfUser = async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
  try {
    const address = await AddressModel.findOne({ user: userId });
    res.status(200).json({ address });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error please try again!", err: err.message });
  }
};

// UPDATE ADDRESS OF A PARTICULAR USER
const updateAddressOfUser = async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
  const data = req.body;
  const addressId = req.params.addressId;
  try {
    const isAddress = await AddressModel.findOne({ _id: addressId, user: userId });
    if (!isAddress)
      return res.status(404).json({ message: "You are not allowed to update!" });

    const updateAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      { $set: data },
      { new: true }
    );

    res.status(200).json({
      message: "Address updated successfully!",
      address: updateAddress,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error please try again!", err: err.message });
  }
};

module.exports = { addNewAddress, getAddressOfUser, updateAddressOfUser };
