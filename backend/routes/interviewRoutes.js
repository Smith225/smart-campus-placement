const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    scheduleInterview,
    getRecruiterInterviews,
    getStudentInterviews,
    updateInterviewStatus
} = require("../controllers/interviewController");

const router = express.Router();


// Recruiter schedules interview
router.post(
    "/",
    authenticate,
    authorize("recruiter"),
    scheduleInterview
);


// Recruiter views interviews
router.get(
    "/recruiter",
    authenticate,
    authorize("recruiter"),
    getRecruiterInterviews
);

// Recruiter updates interview status

router.patch(
    "/:interviewId/status",
    authenticate,
    authorize("recruiter"),
    updateInterviewStatus
);


// Student views interviews
router.get(
    "/student",
    authenticate,
    authorize("student"),
    getStudentInterviews
);


module.exports = router;