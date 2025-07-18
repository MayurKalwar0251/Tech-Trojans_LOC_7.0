const express = require("express");
const mongoose = require("mongoose");
const PoliceCase = require("../models/policeCase");
const PoliceStation = require("../models/policeStationSchema");
const PoliceMember = require("../models/policeMember");

// 📌 Create a new Police Case
const createCase = async (req, res) => {
  try {
    const {
      caseNumber,
      title,
      description,
      policeStation,
      assignedInspector,
      crimeDate,
      crimeLocation,
      crimeCoordinates,
      casePriority,
      status,
    } = req.body;
    console.log("WEAREHERE");

    // Validate required fields
    if (
      !caseNumber ||
      !title ||
      !description ||
      !policeStation ||
      !assignedInspector ||
      !crimeDate ||
      !crimeLocation ||
      !crimeCoordinates ||
      !status
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if police station exists
    const stationExists = await PoliceStation.findById(policeStation);
    if (!stationExists) {
      return res
        .status(404)
        .json({ success: false, message: "Police station not found" });
    }

    // Check if inspector exists
    const inspectorExists = await PoliceMember.findById(assignedInspector);
    if (!inspectorExists) {
      return res
        .status(404)
        .json({ success: false, message: "Assigned inspector not found" });
    }

    // Create new police case
    const newCase = new PoliceCase({
      caseNumber,
      title,
      description,
      policeStation,
      assignedInspector,
      crimeDate,
      crimeLocation,
      crimeCoordinates,
      casePriority,
      status,
    });

    await newCase.save();
    return res.status(201).json({
      success: true,
      message: "Case created successfully",
      case: newCase,
    });
  } catch (error) {
    console.error("Error creating case:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Update Case Details
const updateCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const updatedData = req.body;

    const policeCase = await PoliceCase.findByIdAndUpdate(
      { _id: caseId },
      updatedData,
      {
        new: true,
      }
    );

    if (!policeCase) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Case updated successfully",
      case: policeCase,
    });
  } catch (error) {
    console.error("Error updating case:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Add Suspect to a Case
const addSuspect = async (req, res) => {
  try {
    const { caseId } = req.params;
    const data = req.body;

    // const { name, age, address } = req.body;
    // if (!name || !age || !address) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "All suspect details are required" });
    // }

    const policeCase = await PoliceCase.findById(caseId);
    if (!policeCase) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    policeCase.suspects.push(data);
    await policeCase.save();

    return res.status(200).json({
      success: true,
      message: "Suspect added successfully",
      case: policeCase,
    });
  } catch (error) {
    console.error("Error adding suspect:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Add Witnesses to a Case
const addWitnesses = async (req, res) => {
  try {
    const { caseId } = req.params;
    const data = req.body;

    const policeCase = await PoliceCase.findById(caseId);
    if (!policeCase) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    policeCase.witnesses.push(data);
    await policeCase.save();

    return res.status(200).json({
      success: true,
      message: "Suspect added successfully",
      case: policeCase,
    });
  } catch (error) {
    console.error("Error adding suspect:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Upload Evidence (Using Multer)
const uploadEvidence = async (req, res) => {
  try {
    const { caseId } = req.params;
    const fileType = req.body.type; // Type should be "image", "video", or "document"

    if (!req.file || !fileType) {
      return res
        .status(400)
        .json({ success: false, message: "File and type are required" });
    }

    const policeCase = await PoliceCase.findById(caseId);
    if (!policeCase) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    // Push evidence to the case
    policeCase.evidence.push({ type: fileType, url: req.file.path });
    await policeCase.save();

    return res.status(200).json({
      success: true,
      message: "Evidence uploaded successfully",
      case: policeCase,
    });
  } catch (error) {
    console.error("Error uploading evidence:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Get case details by Case ID
// const getCaseDetails = async (req, res) => {
//   try {
//     const { caseId } = req.params;

//     // Find the case by ID
//     const policeCase = await PoliceCase.findById(caseId)
//       .populate("policeStation", "name location") // Fetch police station details
//       .populate("assignedInspector", "name badgeNumber role") // Fetch inspector details
//       .select("-__v"); // Exclude unnecessary fields

//     if (!policeCase) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Case not found" });
//     }

//     return res.status(200).json({ success: true, case: policeCase });
//   } catch (error) {
//     console.error("Error fetching case details:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const getCaseDetails = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Find the case by ID
    const policeCase = await PoliceCase.findById(caseId)
      .populate("policeStation", "name location") // Fetch police station details
      .populate("assignedInspector", "name badgeNumber role") // Fetch inspector details
      .select("-__v"); // Exclude unnecessary fields

    if (!policeCase) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    // Process evidence files to include full URLs
    const processedCase = policeCase.toObject();
    console.log(processedCase);

    return;

    // Check if evidences array exists
    if (processedCase.evidences && processedCase.evidences.length > 0) {
      // Map through evidences array to add full URLs and file information
      processedCase.evidences = processedCase.evidences.map((evidencePath) => {
        // Get the filename from the path
        const filename = evidencePath.split("/").pop();

        // Get file extension
        const fileExtension = filename.split(".").pop().toLowerCase();

        // Determine file type
        let fileType = "unknown";
        if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
          fileType = "image";
        } else if (["pdf"].includes(fileExtension)) {
          fileType = "document";
        } else if (["mp4", "avi", "mov"].includes(fileExtension)) {
          fileType = "video";
        }

        return {
          path: evidencePath,
          url: `${req.protocol}://${req.get("host")}/${evidencePath}`, // Full URL
          filename: filename,
          fileType: fileType,
          fileExtension: fileExtension,
        };
      });
    }

    return res.status(200).json({
      success: true,
      case: processedCase,
    });
  } catch (error) {
    console.error("Error fetching case details:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createCase,
  updateCase,
  addSuspect,
  uploadEvidence,
  getCaseDetails,
  addWitnesses,
};
