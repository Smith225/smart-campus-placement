const Student = require("../models/Student");

// Create or update student profile
const createOrUpdateProfile = async (req, res) => {
    try {
        const {
            phone,
            rollNumber,
            department,
            course,
            graduationYear,
            cgpa,
            skills
        } = req.body;

        const student = await Student.findOneAndUpdate(
            { user: req.user.userId },
            {
                phone,
                rollNumber,
                department,
                course,
                graduationYear,
                cgpa,
                skills
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        // Check whether profile is complete
        const isComplete =
            phone &&
            rollNumber &&
            department &&
            course &&
            graduationYear &&
            cgpa !== undefined &&
            skills &&
            skills.length > 0;

        student.profileCompleted = Boolean(isComplete);

        await student.save();

        res.status(200).json({
            message: "Student profile saved successfully",
            student
        });

    } catch (error) {
        console.error("Student profile error:", error);

        res.status(500).json({
            message: "Failed to save student profile",
            error: error.message
        });
    }
};


// Get student profile
const getProfile = async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user.userId
        }).populate(
            "user",
            "name email role"
        );

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.status(200).json({
            student
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Failed to get student profile",
            error: error.message
        });
    }
};

// Upload student resume
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF resume"
            });
        }

        const student = await Student.findOne({
            user: req.user.userId
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        student.resume = req.file.filename;

        await student.save();

        res.status(200).json({
            message: "Resume uploaded successfully",
            resume: student.resume
        });

    } catch (error) {
        console.error("Resume upload error:", error);

        res.status(500).json({
            message: "Failed to upload resume",
            error: error.message
        });
    }
};

module.exports = {
    createOrUpdateProfile,
    getProfile,
    uploadResume
};