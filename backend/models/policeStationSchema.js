const mongoose = require("mongoose");

const policeStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    inCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceMember", // Reference to the in-charge police member
    },
    policeMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PoliceMember", // Reference to all police members working in this station
      },
    ],
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const PoliceStation = mongoose.model("PoliceStation", policeStationSchema);

module.exports = PoliceStation;
