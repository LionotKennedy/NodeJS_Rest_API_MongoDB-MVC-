const express = require("express");
const {
  addUsers,
  getAllUsers,
  getUsers,
  updateUsers,
  deleteUsers,
} = require("../controllers/UserController");
const { upload } = require("../config/multer");
const router = express.Router();

router.route("/addUser").post(upload.single("photo"), addUsers);
router.route("/allUser").get(getAllUsers);
router.route("/getUser/:id").get(getUsers);
router.route("/updateUser/:id").put(upload.single("photo"), updateUsers);
router.route("/deleteUser/:id").delete(deleteUsers);

module.exports = router;
