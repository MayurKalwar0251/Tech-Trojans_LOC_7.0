const mongoose = require("mongoose");

const policeCaseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "under_investigation"],
      default: "open",
    },
    casePriority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    policeStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceStation",
      required: true,
    },
    assignedInspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceMember",
      required: true,
    },
    crimeDate: {
      type: Date,
      required: true,
    },
    crimeLocation: {
      type: String,
      required: true,
    },
    crimeCoordinates: {
      lat: { type: String, required: true },
      lng: { type: String, required: true },
    },
    suspects: [
      {
        name: String,
        age: Number,
        address: String,
        gender: { type: String, enum: ["male", "female", "other"] },
        aadharNo: {
          type: Number,
        },
      },
    ],
    witnesses: [
      {
        name: String,
        statement: String,
      },
    ],
    evidence: [
      {
        type: {
          type: String,
          enum: ["image", "video", "document"],
          required: true,
        },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const PoliceCase = mongoose.model("PoliceCase", policeCaseSchema);

module.exports = PoliceCase;
