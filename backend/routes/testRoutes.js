const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// Any logged-in user
router.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});


// Student only
router.get(
    "/student",
    authenticate,
    authorize("student"),
    (req, res) => {
        res.json({
            message: "Student route accessed successfully",
            user: req.user
        });
    }
);


// Recruiter only
router.get(
    "/recruiter",
    authenticate,
    authorize("recruiter"),
    (req, res) => {
        res.json({
            message: "Recruiter route accessed successfully",
            user: req.user
        });
    }
);


// Officer only
router.get(
    "/officer",
    authenticate,
    authorize("officer"),
    (req, res) => {
        res.json({
            message: "Officer route accessed successfully",
            user: req.user
        });
    }
);


module.exports = router;