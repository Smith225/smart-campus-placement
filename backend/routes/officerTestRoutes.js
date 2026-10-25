const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get(
    "/test",
    authMiddleware,
    authorize("officer"),
    (req, res) => {
        res.status(200).json({
            message: "Officer authorization successful",
            user: req.user
        });
    }
);

module.exports = router;