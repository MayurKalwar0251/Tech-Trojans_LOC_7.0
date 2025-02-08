const mongoose = require("mongoose");

const policeMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    badgeNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["inspector", "constable"], // Only these roles are allowed
      required: true,
    },
    policeStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceStation", // Reference to the police station they belong to
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PoliceMember = mongoose.model("PoliceMember", policeMemberSchema);

module.exports = PoliceMember;
