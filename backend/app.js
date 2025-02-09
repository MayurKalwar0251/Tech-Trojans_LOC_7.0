const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDb } = require("./utils/connectDB");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

// routers import
const userRouter = require("./routers/user");
const policeStationRouter = require("./routers/policeStationRouter");
const policeMemberRouter = require("./routers/policeMemberRouter");
const policeCaseRouter = require("./routers/policeCase");
const chatRouter = require("./routers/chat");
const messageRouter = require("./routers/message");
const PoliceStation = require("./models/policeStationSchema");

const app = express();
dotenv.config();

const server = http.createServer(app);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
  maxHttpBufferSize: 1e7, // 10 MB max file size
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
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

const policeMembers = new Map();
const citizens = new Map();

io.on("connection", (socket) => {
  // console.log("Police Members", policeMembers);

  console.log("Citizens Members", citizens);

  socket.on("register_user_based_on_role", (data) => {
    const { role, userId, latitude, longitude } = data;

    if (!role || !userId || !longitude || !latitude) {
      console.log("Invalid registration data", data);
      return;
    }

    if (role === "inspector" || role === "constable") {
      policeMembers.set(userId, {
        socketId: socket.id,
        role,
        latitude,
        longitude,
      }); // Use socket.id instead of userId
      console.log(`Police member registered: ${userId} (${role})`);
    } else if (role === "citizen") {
      citizens.set(userId, socket.id);
      console.log(`Citizen registered: ${userId}`);
    } else if (role === "station") {
      console.log(`Station registered: ${userId}`);
    } else {
      console.log(`Unknown role: ${role}`);
    }
  });

  // crime alert socket connection
  socket.on(
    "crime-alert",
    async ({ userLocation, nearestPoliceStationDetails, citizenId }) => {
      console.log("Crime reported near:", userLocation);
      console.log("Crime reported by citizen:", citizenId);
      console.log("Nearest Police Station:", nearestPoliceStationDetails);

      try {
        // Fetch the police station that matches the location name
        const policeStation = await PoliceStation.findOne({
          location: nearestPoliceStationDetails.location,
        });

        if (!policeStation) {
          console.log("No matching police station found.");
          return;
        }

        console.log("Matched Police Station:", policeStation.name);

        // Get all police member IDs working at this station
        const policeMemberIds = policeStation.policeMembers || [];

        console.log(
          `Police Members at ${policeStation.name}:`,
          policeMemberIds
        );

        // Find matching police members in the socket map with their locations
        const policeToAlert = Array.from(policeMembers.entries())
          .filter(([userId]) => policeMemberIds.includes(userId))
          .map(([userId, details]) => ({
            userId,
            socketId: details.socketId,
            location: {
              latitude: details.latitude,
              longitude: details.longitude,
            },
            role: details.role,
          }));

        console.log("Police members to alert with locations:", policeToAlert);

        // Get citizen's socket ID
        const citizenSocketId = citizens.get(citizenId);

        console.log("citizenSocketId", citizenSocketId, citizenId);

        if (citizenSocketId) {
          // Send available police members' locations to the citizen
          io.to(citizenSocketId).emit("available-police", {
            policeMembers: policeToAlert.map((member) => ({
              userId: member.userId,
              location: member.location,
              role: member.role,
            })),
          });
        }

        // Alert each police officer about the crime
        policeToAlert.forEach((officer) => {
          if (officer.socketId) {
            io.to(officer.socketId).emit("crime-alert", {
              userLocation,
            });
          } else {
            console.log(
              `Skipping userId: ${officer.userId} due to missing socketId`
            );
          }
        });
      } catch (error) {
        console.error("Error processing crime alert:", error);
      }
    }
  );
  socket.on("send_message", (data) => {
    const { sender, receiver, chatBW } = data;
    const fromUserId = sender._id || sender;
    const toUserId = Array.isArray(receiver) ? receiver[0]._id : receiver;

    if (!fromUserId || !toUserId || !data) {
      console.log("Invalid message data");
      return;
    }

    const receiverSocket = policeMembers.get(toUserId);

    if (!receiverSocket) {
      console.log("Receiver not found");
      return;
    }

    const senderInfo = policeMembers.get(fromUserId);

    if (
      senderInfo?.role === "constable" &&
      receiverSocket.role === "inspector"
    ) {
      console.log("Constable cannot send messages to Inspector");
      return;
    }

    // Emit to the specific socket ID
    io.to(receiverSocket.socketId).emit("receive_message", {
      // ...data,
      chatBW,
    });

    console.log(`Message sent to socket: ${receiverSocket.socketId}`);
  });
  // Handle sending images
  socket.on("send_image", async (data) => {
    const { fromUserId, toUserId, image, fileName } = data;

    if (!fromUserId || !toUserId || !image || !fileName) {
      console.log("Invalid image data");
      return;
    }

    const sender = policeMembers.get(fromUserId);
    const receiver = policeMembers.get(toUserId);

    if (!sender || !receiver) {
      console.log("Sender or receiver not found");
      return;
    }

    if (sender.role === "constable" && receiver.role === "inspector") {
      console.log("Constable cannot send images to Inspector");
      return;
    }

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName}`;
      const filePath = path.join(uploadsDir, uniqueFileName);

      // Convert base64 to buffer and save
      const imageBuffer = Buffer.from(image.split(";base64,").pop(), "base64");
      fs.writeFileSync(filePath, imageBuffer);

      // Send image URL to receiver
      const imageUrl = `/uploads/${uniqueFileName}`;
      io.to(receiver.socketId).emit("receive_message", {
        fromUserId,
        message: imageUrl,
        type: "image",
        fileName: uniqueFileName,
      });

      console.log(
        `Image sent from ${fromUserId} to ${toUserId}: ${uniqueFileName}`
      );
    } catch (error) {
      console.error("Error saving image:", error);
      socket.emit("image_error", { error: "Failed to save image" });
    }
  });

  // Handle image upload progress (optional)
  socket.on("upload_progress", (data) => {
    const { toUserId, progress } = data;
    const receiver = policeMembers.get(toUserId);

    if (receiver) {
      io.to(receiver.socketId).emit("upload_progress_update", {
        progress,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    for (const [userId, userData] of policeMembers.entries()) {
      if (userData.socketId === socket.id) {
        policeMembers.delete(userId);
        console.log(`Police member disconnected: ${userId}`);
        break;
      }
    }

    for (const [userId, socketId] of citizens.entries()) {
      if (socketId === socket.id) {
        citizens.delete(userId);
        console.log(`Citizen disconnected: ${userId}`);
        break;
      }
    }
  });
});

// Cleanup old images periodically (optional)
setInterval(() => {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return console.error("Error reading uploads directory:", err);

    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error("Error getting file stats:", err);

        if (Date.now() - stats.mtime.getTime() > maxAge) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting old file:", err);
            else console.log("Deleted old file:", file);
          });
        }
      });
    });
  });
}, 24 * 60 * 60 * 1000); // Run daily

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
