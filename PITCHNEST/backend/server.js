const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ✅ Routes import
const authRouter = require("./routes/auth_router");
const contactroute = require("./routes/contact_router");
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const profileRoutes = require("./routes/profile-routes");
const startupRoutes = require('./routes/startup-routes');
const investorRoutes = require('./routes/investor-routes');
const messageRoutes = require('./routes/message-routes');
const collaborationRoutes = require('./routes/collaboration-routes');
const meetingRoutes = require('./routes/meeting-routes');
const documentRoutes = require('./routes/document-routes');
const dealRoutes = require('./routes/deal-routes');

// ✅ CORS Options
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/form", contactroute);
app.use("/api/profile", profileRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/deals', dealRoutes);
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// ✅ Online users track karo - userId => socketId
const onlineUsers = new Map();

// ✅ Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ User apna ID register kare
  socket.on("register-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // ✅ Video call notification bhejo
  socket.on("call-user", ({ receiverId, callerId, callerName, roomId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    console.log(`Call from ${callerId} to ${receiverId}, room: ${roomId}`);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", {
        callerId,
        callerName,
        roomId,
      });
      console.log(`Incoming call sent to socket ${receiverSocketId}`);
    } else {
      socket.emit("user-offline", { receiverId });
      console.log(`User ${receiverId} is offline`);
    }
  });

  // ✅ Call accept
  socket.on("accept-call", ({ callerId, roomId }) => {
    const callerSocketId = onlineUsers.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-accepted", { roomId });
    }
  });

  // ✅ Call decline
  socket.on("decline-call", ({ callerId }) => {
    const callerSocketId = onlineUsers.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-declined");
    }
  });

  // ✅ Room join karo - WebRTC
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    console.log(`User ${userId} joined room ${roomId}`);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });

  // ✅ WebRTC Signaling
  socket.on("offer", (offer, roomId) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate, roomId) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("leave-room", (roomId, userId) => {
    socket.to(roomId).emit("user-disconnected", userId);
    socket.leave(roomId);
  });

  // ✅ Disconnect pe online users se hata do
  socket.on("disconnect", () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
});

app.use(errorMiddleware);

const PORT = 1000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
});