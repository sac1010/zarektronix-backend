const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.signUp);
router.get('/verify/:token', userController.verifyEmail);

module.exports = router;
