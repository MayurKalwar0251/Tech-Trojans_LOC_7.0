const mongoose = require("mongoose");
const PoliceStation = require("../models/policeStationSchema");
const PoliceMember = require("../models/policeMember");
const PoliceCase = require("../models/policeCase");

const createPoliceStation = async (req, res) => {
  try {
    const {
      name,
      location,
      longitude,
      latitude,
      contactNumber,
      email,
      password,
    } = req.body;

    // Validate request body
    if (
      !name ||
      !location ||
      !longitude ||
      !latitude ||
      !contactNumber ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const station = await PoliceStation.findOne({ name });
    if (station) {
      return res
        .status(400)
        .json({ success: false, message: "Station already exists" });
    }

    // Create a new police station
    const newStation = new PoliceStation({
      name,
      location,
      longitude,
      latitude,
      contactNumber,
      email,
      password,
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

const getCasesByStation = async (req, res) => {
  try {
    const { stationId } = req.params;
    console.log(stationId);

    // Check if the police station exists
    const policeStation = await PoliceStation.findById(stationId);
    if (!policeStation) {
      return res
        .status(404)
        .json({ success: false, message: "Police station not found" });
    }

    // Find all cases linked to this police station
    const cases = await PoliceCase.find({ policeStation: stationId })
      .populate("assignedInspector", "name badgeNumber role") // Fetch inspector details
      .populate("policeStation", "name location") // Fetch police station details
      .select("-__v"); // Exclude unnecessary fields

    // Process evidence files for each case
    const processedCases = cases.map((policeCase) => {
      const processedCase = policeCase.toObject();

      // Process evidence files if they exist

      console.log(processedCase);

      if (processedCase.evidence && processedCase.evidence.length > 0) {
        processedCase.evidence = processedCase.evidence.map(({ url }) => {
          // Get the filename from the path
          const filename = url.split("/").pop();

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
            path: url,
            url: `${req.protocol}://${req.get("host")}/${url}`,
            filename: filename,
            fileType: fileType,
            fileExtension: fileExtension,
          };
        });
      }

      return processedCase;
    });

    return res.status(200).json({
      success: true,
      totalCases: processedCases.length,
      cases: processedCases,
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getPoliceStationBySimilarLocationName = async (req, res) => {
  try {
    // Aggregate to group by location and count occurrences
    const duplicates = await PoliceStation.aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
          stations: { $push: "$$ROOT" },
        },
      },
      {
        $match: {
          count: { $gt: 1 }, // Only keep locations with more than one occurrence
        },
      },
    ]);

    if (duplicates.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Duplicate police stations found",
        duplicates,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "No duplicate police stations found",
      });
    }
  } catch (error) {
    console.error("Error checking duplicate police stations:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const createPoliceStationsFromArray = async (req, res) => {
  try {
    const { policeStations } = req.body;

    // Validate request body
    if (!Array.isArray(policeStations) || policeStations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of police station data",
      });
    }

    const results = {
      created: [],
      skipped: [],
      errors: [],
    };

    // Process each police station in the array
    await Promise.all(
      policeStations.map(async (stationData) => {
        try {
          const {
            name,
            location,
            longitude,
            latitude,
            contactNumber,
            email,
            password,
            policeMembers,
          } = stationData;

          // Validate individual station data
          if (
            !name ||
            !location ||
            !longitude ||
            !latitude ||
            !contactNumber ||
            !email ||
            !password
          ) {
            results.errors.push({
              name: name || "Unknown",
              error: "Missing required fields",
            });
            return;
          }

          // Check if station already exists
          const existingStation = await PoliceStation.findOne({ name });
          if (existingStation) {
            results.skipped.push({
              name,
              reason: "Station already exists",
            });
            return;
          }

          // Process police members if provided
          const processedPoliceMembers = Array.isArray(policeMembers)
            ? policeMembers.map((member) => ({
                ...member,
                id: member.id || new mongoose.Types.ObjectId(), // Generate new ID if not provided
              }))
            : [];

          // Create new police station
          const newStation = new PoliceStation({
            name,
            location,
            longitude,
            latitude,
            contactNumber,
            email,
            password,
            policeMembers: processedPoliceMembers,
          });

          await newStation.save();
          results.created.push({
            name,
            id: newStation._id,
            membersCount: processedPoliceMembers.length,
          });
        } catch (stationError) {
          results.errors.push({
            name: stationData.name || "Unknown",
            error: stationError.message,
          });
        }
      })
    );

    return res.status(200).json({
      success: true,
      message: "Police stations processing completed",
      summary: {
        total: policeStations.length,
        created: results.created.length,
        skipped: results.skipped.length,
        failed: results.errors.length,
      },
      results,
    });
  } catch (error) {
    console.error("Error processing police stations:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createPoliceStation,
  addPoliceMembers,
  makeIncharge,
  getCasesByStation,
  getPoliceStationBySimilarLocationName,
  createPoliceStationsFromArray,
};
