const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { name, email, phoneNo, password, role } = req.body;
    const profilePicture =
      req.body.profilePicture ??
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    if (!name || !email || !password ) {
      return res.status(500).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(500).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user = await User.create({
      name,
      email,
      password: hashPass,
      phoneNo,
      profilePicture,
      role,
    });

    // sendToken(user, 200, "User Created Successfully", res);
    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error.message, " Error Message ", error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "All Fields Are Required",
    });
  }

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "User Doesn't Exist",
    });
  }

  const comparePass = await bcrypt.compare(password, user.password);

  if (!comparePass) {
    return res.status(500).json({
      success: false,
      message: "Password Doesn't Match",
    });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(200).json({
    success: true,
    message: "User Login Successfully",
    user,
    token,
  });
};

const generateToken = async (userID) => {
  const token = await jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

const getUserDetails = async (req, res) => {
  try {
    const myId = req.user._id;

    const user = await User.findById(myId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(300).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserDetails,
};
