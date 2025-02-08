const mongoose = require("mongoose");
const PoliceStation = require("../models/policeStationSchema");
const PoliceMember = require("../models/policeMember");

const createPoliceStation = async (req, res) => {
  try {
    const { name, location, longitude, latitude, contactNumber } = req.body;

    // Validate request body
    if (!name || !location || !longitude || !latitude || !contactNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Create a new police station
    const newStation = new PoliceStation({
      name,
      location,
      longitude,
      latitude,
      contactNumber,
    });

    await newStation.save();
    return res.status(201).json({
      success: true,
      message: "Police Station created",
      station: newStation,
    });
  } catch (error) {
    console.error("Error creating police station:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const addPoliceMembers = async (req, res) => {
  try {
    const { policeMemberId } = req.body;
    const { stationId } = req.params;

    // Validate policeMemberId
    if (!policeMemberId) {
      return res
        .status(400)
        .json({ success: false, message: "Police Member ID is required" });
    }

    // Check if police station exists
    const station = await PoliceStation.findById(stationId);
    if (!station) {
      return res
        .status(404)
        .json({ success: false, message: "Police Station not found" });
    }

    // Check if police member exists
    const member = await PoliceMember.findById(policeMemberId);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Police Member not found" });
    }

    // Add police member to the station
    if (!station.policeMembers.includes(policeMemberId)) {
      station.policeMembers.push(policeMemberId);
      await station.save();
    }

    return res.status(200).json({
      success: true,
      message: "Police Member added to station",
      station,
    });
  } catch (error) {
    console.error("Error adding police member:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const makeIncharge = async (req, res) => {
  try {
    const { policeMemberId } = req.body;
    const { stationId } = req.params;

    // Validate policeMemberId
    if (!policeMemberId) {
      return res
        .status(400)
        .json({ success: false, message: "Police Member ID is required" });
    }

    // Check if police station exists
    const station = await PoliceStation.findById(stationId);
    if (!station) {
      return res
        .status(404)
        .json({ success: false, message: "Police Station not found" });
    }

    // Check if police member exists
    const member = await PoliceMember.findById(policeMemberId);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Police Member not found" });
    }

    // Assign as in-charge
    station.inCharge = policeMemberId;
    await station.save();

    return res
      .status(200)
      .json({ success: true, message: "Police In-Charge assigned", station });
  } catch (error) {
    console.error("Error assigning in-charge:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createPoliceStation,
  addPoliceMembers,
  makeIncharge,
};
