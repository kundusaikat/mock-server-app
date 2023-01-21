const cors = require("cors");
const connect = require("./Config/db");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./Models/User.model");
const CalRouter = require("./Routes/cal.route");
const authorization = require("./middlewares/authorization");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const isUser = await UserModel.findOne({ email });
  console.log(isUser)
  if (isUser) {
    res.send({ msg: "Users already exists" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({ msg: "Something went wrong" });
      }
      const new_user = new UserModel({ username, email, password: hash });
      console.log(new_user)
      try {
        await new_user.save();
        res.send({ msg: "Signup Successfull" });
      } catch (error) {
        res.send({ msg: "Something went wrong" });
      }
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hash_pass = user.password;
  const user_id = user._id;
  bcrypt.compare(password, hash_pass, function (err, result) {
    if (err) {
      res.send({ msg: "Something went wrong" });
    }
    if (result) {
      const token = jwt.sign({ user_id }, process.env.SECRET_KEY);
      res.send({ msg: "login successfull", token });
    } else {
      res.send({ msg: "login failed,try again" });
    }
  });
});
app.post("/profile", authorization, async (req, res) => {
  let _id = req.body.user_id;
  let user = await UserModel.find(_id);
  res.send(user);
});

app.use(authorization);
app.use("/user", CalRouter);


app.listen(process.env.PORT, async (req, res) => {
  try {
    await connect;
    console.log("Connected on port http://localhost:8080");
  } catch (error) {
    console.log("connection failed");
    console.log(error);
  }
});
