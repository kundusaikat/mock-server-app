const connection = require("./Config/db");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const UserModel = require("./Models/User.model");
const JobModel = require("./Models/job.models");
const { Router } = require("express");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome HomePAge");
});

//Signup User
app.post("/signup", async (req, res) => {
  const { fullname, email, password, role } = req.body;
  const isUser = await UserModel.findOne({ email });
  // res.send(req.body)
  if (isUser) {
    res.send({ msg: "Users already exists" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({ msg: "Something went wrong  " });
      }
      const new_user = new UserModel({ fullname, email, password: hash, role });
      try {
        await new_user.save();
        res.send({ msg: "Signup Successfull" });
      } catch (error) {
        res.send({ msg: "Something went wrong" });
      }
    });
  }
});

//Login User
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

// GET JOB
// /jobs?search=Masai
// /jobs?location=Mumbai
app.get("/jobs", async (req, res) => {
  const { company, location, contract } = req.query;
  if (company != undefined) {
    const Jobs = await JobModel.find({ company: company });
    res.send(Jobs);
  } else if (location != undefined) {
    const Jobs = await JobModel.find({ location: location });
    res.send(Jobs);
  } else if (contract != undefined) {
    const Jobs = await JobModel.find({ contract: contract });
    res.send(Jobs);
  } else {
    const Jobs = await JobModel.find({});
    res.send(Jobs);
  }
  // app.use("/jobs",jobs)
});

//JOB POST
app.post("/admin", async (req, res) => {
  const addjobs = new JobModel(req.body);
  await addjobs.save();
  res.send("added");
});

app.listen(process.env.PORT || 8080, async () => {
  try {
    await connection;
    console.log("Database Connected");
  } catch (error) {
    console.log("Not able to connect with Database");
    console.log(error);
  }
  console.log(`Server started at ${process.env.PORT}`);
});
