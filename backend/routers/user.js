const express = require("express");
const {
  createUser,
  getUserDetails,
  loginPolicePeople,
  loginPoliceStation,
  loginCitizen,
  getCitizenDetails,
} = require("../controllers/user.js");
const isAuthenticated = require("../middleware/authentication.js");
const citizenAuthen = require("../middleware/citizenAuthen.js");

const userRouter = express.Router();

// for creating user
userRouter.post("/", createUser);

// for loging police people
userRouter.post("/login/police-people", loginPolicePeople);

// for loging police station
userRouter.post("/login/police-station", loginPoliceStation);

// for loging citizen
userRouter.post("/login/", loginCitizen);

// // for updating user infos
// userRouter.put("/update/:id", isAuthenticated, updateUser);

// for getting user infos
userRouter.get("/", isAuthenticated, getUserDetails);
// for getting user infos
userRouter.get("/citizen/", citizenAuthen, getCitizenDetails);

// // for getting user infos
// userRouter.get("/search", isAuthenticated, searchUserChats);

module.exports = userRouter;
