import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import { prisma } from './lib/db.js';
import { authenticateToken, requireUserType, updateUserStatus } from './middleware/auth.js';

// Import controllers
import * as userController from './controllers/userController.js';
import * as jobController from './controllers/jobController.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ message: "Empleadora API is running" });
});

// Auth routes
app.post("/api/auth/signup", userController.signup);
app.post("/api/auth/signin", userController.signin);
app.post("/api/auth/logout", authenticateToken, userController.logout);

// User routes
app.get("/api/user/profile", authenticateToken, userController.getProfile);
app.put("/api/user/profile", authenticateToken, userController.updateProfile);
app.get("/api/users/freelancers", userController.getFreelancers);

// Job routes
app.post("/api/jobs", authenticateToken, requireUserType('client'), jobController.createJob);
app.get("/api/jobs", jobController.getJobs);
app.get("/api/jobs/categories", jobController.getJobCategories);
app.get("/api/jobs/:id", jobController.getJobById);
app.put("/api/jobs/:id", authenticateToken, jobController.updateJob);
app.delete("/api/jobs/:id", authenticateToken, jobController.deleteJob);
app.get("/api/user/jobs", authenticateToken, jobController.getUserJobs);

// Update user status middleware
app.use(authenticateToken, updateUserStatus);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Try a different one!`);
    process.exit(1);
  } else {
    throw err;
  }
});

