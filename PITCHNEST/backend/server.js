const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Routes import
const authRouter = require("./routes/auth_router");
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

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