import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db/connection";   // initializes DB connection

// Routes
import userRoute from "./routes/user";
import donationRoute from "./routes/donation";
import contributionRoute from "./routes/contribution";
import pickupRoute from "./routes/pickups";
import dashboardRoute from "./routes/dashboard";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes (same paths as before)
app.use("/user", userRoute);
app.use("/donations", donationRoute);
app.use("/contributions", contributionRoute);
app.use("/pickups", pickupRoute);
app.use("/dashboard", dashboardRoute);

// Optional test route
app.get("/", (_req, res) => {
  res.send("Donation & Charity API (TypeScript running)");
});

export default app;
