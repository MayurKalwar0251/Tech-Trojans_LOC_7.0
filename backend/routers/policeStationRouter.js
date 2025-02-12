const express = require("express");
const {
  createPoliceStation,
  addPoliceMembers,
  makeIncharge,
  getCasesByStation,
  getPoliceStationBySimilarLocationName,
  createPoliceStationsFromArray,
} = require("../controllers/policeStation.js");
const isAuthenticated = require("../middleware/authentication.js");

const policeStationRouter = express.Router();

// for creating user
policeStationRouter.post("/create", createPoliceStation);
policeStationRouter.post("/add_police_members/:stationId", addPoliceMembers);
policeStationRouter.post("/make_incharge/:stationId", makeIncharge);

// policeStationRouter.get(
//   "/checkDupPoliceStation",
//   getPoliceStationBySimilarLocationName
// );
policeStationRouter.get("/:stationId", getCasesByStation);

policeStationRouter.post("/createAll", createPoliceStationsFromArray);

module.exports = policeStationRouter;
