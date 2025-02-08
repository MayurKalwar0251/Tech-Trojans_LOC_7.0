const express = require("express");
const {
  createPoliceStation,
  addPoliceMembers,
  makeIncharge,
  getCasesByStation,
} = require("../controllers/policeStation.js");
const isAuthenticated = require("../middleware/authentication.js");

const policeStationRouter = express.Router();

// for creating user
policeStationRouter.post("/create", createPoliceStation);
policeStationRouter.post("/add_police_members/:stationId", addPoliceMembers);
policeStationRouter.post("/make_incharge/:stationId", makeIncharge);

policeStationRouter.get("/:stationId", getCasesByStation);

module.exports = policeStationRouter;
