const PoliceMember = require("../models/policeMember");
const PoliceStation = require("../models/policeStationSchema");

// 📌 Create a new Police Member
const createPoliceMember = async (req, res) => {
  try {
    const {
      name,
      badgeNumber,
      role,
      policeStation,
      contactNumber,
      email,
      password,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !badgeNumber ||
      !role ||
      !policeStation ||
      !contactNumber ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the role is valid
    if (!["inspector", "constable"].includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Only 'inspector' or 'constable' are allowed.",
      });
    }

    // Check if police station exists
    const stationExists = await PoliceStation.findById(policeStation);
    if (!stationExists) {
      return res
        .status(404)
        .json({ success: false, message: "Police station not found" });
    }

    // Check for duplicate badgeNumber
    const existingBadge = await PoliceMember.findOne({ badgeNumber });
    if (existingBadge) {
      return res
        .status(400)
        .json({ success: false, message: "Badge number already exists" });
    }

    // Check for duplicate email
    const existingEmail = await PoliceMember.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash the password before saving

    // Create new police member
    const newPoliceMember = new PoliceMember({
      name,
      badgeNumber,
      role: role.toLowerCase(),
      policeStation,
      contactNumber,
      email,
      password,
    });

    await newPoliceMember.save();
    return res.status(201).json({
      success: true,
      message: "Police Member created",
      member: newPoliceMember,
    });
  } catch (error) {
    console.error("Error creating police member:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Search Police Member by Email
const searchPoliceMember = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email", email);

    // Validate email input
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Search for all police members matching the email
    const policeMembers = await PoliceMember.find({
      email: { $regex: email, $options: "i" },
    }) // Case-insensitive search
      .select("-password -__v"); // Exclude password for security

    if (policeMembers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No matching police members found" });
    }

    return res.status(200).json({
      success: true,
      total: policeMembers.length,
      members: policeMembers,
    });
  } catch (error) {
    console.error("Error searching police members:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createPoliceMember, searchPoliceMember };
