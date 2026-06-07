const express = require("express");
const cors = require("cors");
const http = require("http"); // ✅ Add
const { Server } = require("socket.io"); // ✅ Add
const app = express();
const server = http.createServer(app); // ✅ Add

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

// ✅ Socket.io Video Call Signaling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Room join karo
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
});

app.use(errorMiddleware);

const PORT = 1000;
connectDB().then(() => {
  server.listen(PORT, () => { // ✅ server.listen (app.listen nahi)
    console.log(`Server is running at port: ${PORT}`);
  });
});