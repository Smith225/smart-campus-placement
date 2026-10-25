const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createCompany,
    getMyCompanies,
    getAllCompanies
} = require("../controllers/companyController");

const router = express.Router();

// Recruiter creates company
router.post(
    "/",
    authenticate,
    authorize("recruiter"),
    createCompany
);

// Recruiter gets their companies
router.get(
    "/my",
    authenticate,
    authorize("recruiter"),
    getMyCompanies
);

// Get all companies
router.get(
    "/",
    authenticate,
    getAllCompanies
);

module.exports = router;