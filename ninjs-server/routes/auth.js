const User = require("../models/User");
const Role = require("../models/Role");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require("md5");

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);

  try {
    let user = await User.findOne({ email, password });

    if (!user) {
      // return res.status(400).send({ message: "Failed! Username is already in use!" });
      res.status(400).send({ message: "Username or password is incorrect!" });
      return;
    }

    function generateAccessToken(user) {
      // expires after half and hour (1800 seconds = 30 minutes)
      return jwt.sign(user, "secretkey", { expiresIn: "180m" });
    }
    const token = generateAccessToken({ user: user });

    let userRole = await Role.findById(user.role_id).exec();

    if (userRole.roleName == "admin") {
      res.json({ token: token, user: user, role: "admin" });
    } else if (userRole.roleName == "company") {
      res.json({ token: token, user: user, role: "company" });
    } else {
      res.json({ token: token, user: user, role: "user" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
