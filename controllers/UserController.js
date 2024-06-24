const fs = require("fs");
const path = require("path");
const { User } = require("../models/User");
const customer = require("../config/connexion");
const { ObjectID } = require("mongodb");

// ################### ADD USERS ######################
const addUsers = async (req, res) => {
  try {
    // console.log('Request Body:', req.body); // Add this line to log the request body
    var nom = req.body.name;
    var adresse = req.body.address;
    var telephone = req.body.phone;
    var photo = req.file ? req.file.filename : null; // Récupérer le nom du fichier photo

    let user = new User(nom, adresse, telephone, photo);
    // console.log(`name=${nom}, adresse=${adresse}, phone=${telephone}, photo=${photo}`);
    let result = await customer.config().collection("users").insertOne(user);
    res.json({
      status: 200,
      message: "Added successfully...",
      resultats: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error,
      status: 500,
    });
  }
};
// ################### ENDING ######################

// ################### GET ALL USERS FROM DATABASE ######################
const getAllUsers = async (req, res) => {
  try {
    let cursor = customer.config().collection("users").find();
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.json({
        status: 200,
        data_number: result.length,
        message: "Fetched all data successfully...",
        data: result,
      });
    } else {
      res.json({
        status: 204,
        message: "Users not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: error,
    });
  }
};
// ################### ENDING ######################

// ################### GET AN USER FROM DATABASE ######################
const getUsers = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let cursor = customer.config().collection("users").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.json({
        status: 200,
        data_number: result.length,
        message: "Data fetched...",
        data: result[0],
      });
    } else {
      res.json({
        status: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: error,
    });
  }
};
// ################### ENDING ######################

const updateUsers = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let nom = req.body.name;
    let adress = req.body.address;
    let telephone = req.body.phone;
    let photo = req.file ? req.file.filename : null; // Récupérer le nom du fichier photo si présent

    let updateData = { name: nom, address: adress, phone: telephone };
    if (photo) {
      updateData.photo = photo;

      // Récupérer l'utilisateur existant
      let user = await customer
        .config()
        .collection("users")
        .findOne({ _id: id });
      if (user && user.photo) {
        // Supprimer l'ancienne photo
        fs.unlink(path.join(__dirname, "../uploads", user.photo), (err) => {
          if (err) console.error("Failed to delete image:", err);
        });
      }
    }

    let result = await customer
      .config()
      .collection("users")
      .updateOne({ _id: id }, { $set: updateData });
    if (result.modifiedCount == 1) {
      res.json({
        status: 200,
        message: "Update have been successfully...",
      });
    } else {
      res.json({
        status: 400,
        message: "Failed update user",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: error,
    });
  }
};

// ################### ENDING ######################

// ################### DELETE USER FROM DATABASE ######################

const deleteUsers = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);

    let user = await customer.config().collection("users").findOne({ _id: id });
    if (!user) {
      return res.json({
        status: 404,
        message: "User not found",
      });
    }

    let result = await customer
      .config()
      .collection("users")
      .deleteOne({ _id: id });
    if (result.deletedCount == 1) {
      if (user.photo) {
        fs.unlink(path.join(__dirname, "../uploads", user.photo), (err) => {
          if (err) console.error("Failed to delete image:", err);
        });
      }
      res.json({
        status: 200,
        message: "Deleted successfully...",
      });
    } else {
      res.json({
        status: 404,
        message: "Failed delete user",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: error,
    });
  }
};

// ################### ENDING ######################

module.exports = { addUsers, getAllUsers, getUsers, updateUsers, deleteUsers };
