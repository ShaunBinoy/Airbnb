const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
// const jwtSecret = "afaefewew";
const jwtSecret = process.env.JWT_SECRET || "your-secure-secret";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

console.log(process.env.MONGO_URL);
// mongoose.connect("process.env.MONGO_URL");
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000, // Timeout after which Mongoose will stop trying to connect
});

app.get("/users/test", (req, res) => {
  res.json("Test OKkkk");
  console.log("hello");
});

app.post("/users/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({ userDoc });
  } catch (e) {
    res.status(422).json(e);
  }
});

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const userDoc = await User.findOne({ email });
//   if (userDoc) {
//     const passOk = bcrypt.compareSync(password, userDoc.password);
//     if (passOk) {
//       res.json("Pass Ok");
//     } else {
//       res.json("Pass NOt Ok");
//     }
//   } else {
//     res.json("Not Found");
//   }
// });

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          // res.cookie("token", token);
          // res.status(200).json(userDoc);
          res.cookie("token", token, { httpOnly: true });
          res
            .status(200)
            .json({ userDoc: userDoc, message: "Login successful" })
            .send(userDoc);
        }
      );
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.listen(4000);
