const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB);

    console.log(`MongoDB connected with server: `);
  } catch (error) {
    console.log(error.message, error);
  }
};

module.exports = { connectDb };
