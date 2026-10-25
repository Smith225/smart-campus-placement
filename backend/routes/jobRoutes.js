const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createJob,
    getMyJobs,
    getAllJobs
} = require("../controllers/jobController");

const router = express.Router();


// Recruiter creates job
router.post(
    "/",
    authenticate,
    authorize("recruiter"),
    createJob
);


// Recruiter gets their jobs
router.get(
    "/my",
    authenticate,
    authorize("recruiter"),
    getMyJobs
);


// Get all open jobs
router.get(
    "/",
    authenticate,
    getAllJobs
);


module.exports = router;