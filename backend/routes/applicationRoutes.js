const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    applyForJob,
    getMyApplications,
    getRecruiterApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const router = express.Router();


// Student applies for a job
router.post(
    "/:jobId",
    authenticate,
    authorize("student"),
    applyForJob
);


// Student gets their applications
router.get(
    "/my",
    authenticate,
    authorize("student"),
    getMyApplications
);

// Recruiter gets applications for their jobs
router.get(
    "/recruiter",
    authenticate,
    authorize("recruiter"),
    getRecruiterApplications
);


// Recruiter updates application status
router.put(
    "/:applicationId/status",
    authenticate,
    authorize("recruiter"),
    updateApplicationStatus
);

module.exports = router;