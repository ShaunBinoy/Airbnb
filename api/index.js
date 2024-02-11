const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const path = require("path");
const Place = require("./models/Place");
const multer = require("multer");
const { log } = require("console");
const fs = require("fs");
const Booking = require("./models/Booking").default;

require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
// const jwtSecret = "afaefewew";
const jwtSecret = process.env.JWT_SECRET || "your-secure-secret";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads/", express.static(__dirname + "/uploads/"));

// app.use("/uploads", express.static(path.join(__dirname, "/uploads/")));

// app.use(
//   "/uploads",
//   express.static("D:/HeadCodes/Front End/Hotel_Booking/api/uploads")
// );

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
// console.log(__dirname + "/uploads");

// console.log(__dirname);
// console.log(process.env.MONGO_URL);
// mongoose.connect("process.env.MONGO_URL");
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000, // Timeout after which Mongoose will stop trying to connect
});

app.get("/users/test", (req, res) => {
  res.json("Test OKkkk");
  // console.log("hello");
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
            .json({
              userDoc: userDoc,
              message: "Login successful",
              name: userDoc.name,
            })
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

app.post("/upload-by-link", async (req, res) => {
  // res.json("Test done");
  // console.log("done");
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

//--------------------------------------------------------------------------------------------------------------------------------------
const photosMiddleWare = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleWare.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", async (req, res) => {
  // res.json("Test OKkkk");
  console.log("Received POST request to /places");
  // console.log("Request Body:", req.body);
  const {
    email,
    address,
    title,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  } = req.body;
  const placeDoc = await Place.create({
    email,
    address,
    title,
    photos: addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  });
  res.json(placeDoc);
});

// app.get("/places", async (req, res) => {
//   // res.json("Test Ok");
//   const userDetails = await Place.find({ email });
//   res.json(userDetails);
// });

app.get("/user-places", async (req, res) => {
  try {
    const { email } = req.query;
    const userDetails = await Place.find(email);
    res.json({ userDetails });
    // console.log(userDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

app.get("/places/:id", async (req, res) => {
  // res.json(req.params);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  // const id = req.params.id;
  const {
    id,
    email,
    address,
    title,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  } = req.body;
  console.log(addedPhotos);
  // const { email } = req.query;
  // const userDetails = await Place.find(email);
  const placeDoc = await Place.findById(id);
  // if (userDetails.email === placeDoc.email) {
  //   placeDoc.update();
  // }
  console.log(placeDoc.addedPhotos);
  placeDoc.set({
    email,
    address,
    title,
    photos: addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  });
  // console.log(placeDoc.photos);
  await placeDoc.save();
  res.json("okk done");
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", (req, res) => {
  const { place, checkIn, checkOut, numberOfGuest, name, phone, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuest,
    name,
    phone,
    price,
  }).then((err, doc) => {
    if (err) throw err;
    res.json(doc);
  });
});

app.listen(4000);
