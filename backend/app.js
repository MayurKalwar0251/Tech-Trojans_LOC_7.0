const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDb } = require("./utils/connectDB");
const cookieParser = require("cookie-parser");

// routers import
const userRouter = require("./routers/user");
const policeStationRouter = require("./routers/policeStationRouter");
const policeMemberRouter = require("./routers/policeMemberRouter");
const policeCaseRouter = require("./routers/policeCase");

const app = express();
dotenv.config();

const server = http.createServer(app);

// adding all the middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_STATE == "production" ? process.env.FRONTEND_URL : "*",
    credentials: true,
  })
);

const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin:
      process.env.NODE_STATE == "production" ? process.env.FRONTEND_URL : "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is Working",
  });
});

// connect DB
connectDb();

// adding routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/station", policeStationRouter);
app.use("/api/v1/police-member", policeMemberRouter);
app.use("/api/v1/police-case", policeCaseRouter);

const policeMembers = new Map(); // Stores policeMembers connections { userId: { socketId, role } }
const citizens = new Map(); // Stores citizens connections { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id, " police ", policeMembers);
  console.log("A user connected:", socket.id, " citizens ", citizens);

  // Registration of user based on role in socket and adding it to his map{}
  socket.on("register_user_based_on_role", (data) => {
    const { role, userId } = data; // Assuming the client sends role and userId

    if (!role || !userId) {
      console.log("Invalid registration data");
      return;
    }

    // Add user to the appropriate map based on their role
    if (role === "inspector" || role === "constable") {
      policeMembers.set(userId, { socketId: socket.id, role }); // Add to policeMembers map
      console.log(`Police member registered: ${userId} (${role})`);
    } else if (role === "citizen") {
      citizens.set(userId, socket.id); // Add to citizens map
      console.log(`Citizen registered: ${userId}`);
    } else if (role === "station") {
      // Handle station role if needed
      console.log(`Station registered: ${userId}`);
    } else {
      console.log(`Unknown role: ${role}`);
    }

    // Log the updated maps
    console.log("Updated policeMembers:", policeMembers);
    console.log("Updated citizens:", citizens);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    const { fromUserId, toUserId, message } = data;

    if (!fromUserId || !toUserId || !message) {
      console.log("Invalid message data");
      return;
    }

    const sender = policeMembers.get(fromUserId);
    const receiver = policeMembers.get(toUserId);

    if (!sender || !receiver) {
      console.log("Sender or receiver not found");
      return;
    }

    // Check hierarchy rules
    if (sender.role === "constable" && receiver.role === "inspector") {
      console.log("Constable cannot send messages to Inspector");
      return;
    }

    // Send the message to the receiver
    io.to(receiver.socketId).emit("receive_message", {
      fromUserId,
      message,
    });

    console.log(`Message sent from ${fromUserId} to ${toUserId}: ${message}`);
  });

  // Disconnect user
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove user from policeMembers map if they were registered
    for (const [userId, userData] of policeMembers.entries()) {
      if (userData.socketId === socket.id) {
        policeMembers.delete(userId);
        console.log(`Police member disconnected: ${userId}`);
        break;
      }
    }

    // Remove user from citizens map if they were registered
    for (const [userId, socketId] of citizens.entries()) {
      if (socketId === socket.id) {
        citizens.delete(userId);
        console.log(`Citizen disconnected: ${userId}`);
        break;
      }
    }

    // Log the updated maps
    console.log("Updated policeMembers:", policeMembers);
    console.log("Updated citizens:", citizens);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
