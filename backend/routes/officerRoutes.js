const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const authenticate = require("../middleware/authMiddleware");

const {
    getDashboardStats,
    getAllStudents,
    getAllRecruiters,
    getAllCompanies,
    getAllJobs,
    getAllApplications,
    getAllInterviews,
    getPlacementStatistics,
    updateStudentApproval,
    updateCompanyApproval,
    updateJobStatus
} = require("../controllers/officerController");

router.patch(
    "/companies/:companyId/approval",
    authMiddleware,
    authorize("officer"),
    updateCompanyApproval
);

router.patch(
    "/jobs/:jobId/status",
    authenticate,
    authorize("officer"),
    updateJobStatus
);

// =========================
// OFFICER DASHBOARD
// =========================

router.get(
    "/dashboard",
    authMiddleware,
    authorize("officer"),
    getDashboardStats
);

router.get(
    "/students",
    authMiddleware,
    authorize("officer"),
    getAllStudents
);

router.patch(
    "/students/:studentId/approval",
    authMiddleware,
    authorize("officer"),
    updateStudentApproval
);

// =========================
// GET ALL RECRUITERS
// =========================

router.get(
    "/recruiters",
    authMiddleware,
    authorize("officer"),
    getAllRecruiters
);

// =========================
// GET ALL COMPANIES
// =========================

router.get(
    "/companies",
    authMiddleware,
    authorize("officer"),
    getAllCompanies
);

router.get(
    "/recruiters",
    authMiddleware,
    authorize("officer"),
    getAllRecruiters
);

router.get(
    "/companies",
    authMiddleware,
    authorize("officer"),
    getAllCompanies
);

router.get(
    "/jobs",
    authMiddleware,
    authorize("officer"),
    (req, res, next) => {
        next();
    },
    getAllJobs
);

// =========================
// GET ALL INTERVIEWS
// =========================

router.get(
    "/interviews",
    authMiddleware,
    authorize("officer"),
    getAllInterviews
);

// =========================
// PLACEMENT STATISTICS
// =========================

router.get(
    "/statistics",
    authMiddleware,
    authorize("officer"),
    getPlacementStatistics
);

// =========================
// GET ALL APPLICATIONS
// =========================

router.get(
    "/applications",
    authMiddleware,
    authorize("officer"),
    getAllApplications
);

module.exports = router;