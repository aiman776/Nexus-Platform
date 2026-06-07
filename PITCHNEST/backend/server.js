const express = require("express");
const cors = require("cors");
const app = express();

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

// ✅ Middlewares
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


// ✅ Uploads folder static serve karo
app.use('/uploads', express.static('uploads'));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// ✅ Error Middleware (hamesha last mein)
app.use(errorMiddleware);

// ✅ Server Start
const PORT = 1000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
});