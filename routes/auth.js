const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email", "Please enter valid email").isEmail().trim(),
    body("password", "Please enter password").isLength({ min: 5 }),
  ],
  authController.postLogin
);

// router.post("/signup", authController.postSignup);

router.post(
  "/signup",
  [
    body("email", "Please enter valid email")
      .isEmail()
      .trim()
      .custom((value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
    body("password", "Please enter valid password").not().isEmpty(), //.notEmpty()
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
