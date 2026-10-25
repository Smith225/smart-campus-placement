const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createOrUpdateProfile,
    getProfile,
    uploadResume
} = require("../controllers/studentController");

const router = express.Router();


// Get logged-in student's profile
router.get(
    "/profile",
    authenticate,
    authorize("student"),
    getProfile
);


// Create or update logged-in student's profile
router.post(
    "/profile",
    authenticate,
    authorize("student"),
    createOrUpdateProfile
);

router.post(
    "/resume",
    authenticate,
    authorize("student"),
    upload.single("resume"),
    uploadResume
);

module.exports = router;