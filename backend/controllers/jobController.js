const Job = require("../models/Job");
const Company = require("../models/Company");


// Create a job opening
const createJob = async (req, res) => {
    try {
        const {
            company,
            title,
            description,
            skillsRequired,
            salary,
            location,
            minimumCGPA,
            applicationDeadline
        } = req.body;

        // Validate required fields
        if (
            !company ||
            !title ||
            !description ||
            !applicationDeadline
        ) {
            return res.status(400).json({
                message: "Company, title, description and application deadline are required"
            });
        }

        // Check whether company exists
        const companyData = await Company.findById(company);

        if (!companyData) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        // Check whether recruiter owns the company
        if (companyData.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only create jobs for your own companies"
            });
        }

        // Check whether company is approved
        if (companyData.approvalStatus !== "approved") {
            return res.status(403).json({
                message: "Company must be approved by the Placement Officer before posting jobs"
            });
        }

        // Create job
        const job = await Job.create({
            company,
            title,
            description,
            skillsRequired: skillsRequired || [],
            salary,
            location,
            minimumCGPA: minimumCGPA || 0,
            applicationDeadline,
            createdBy: req.user.userId
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create job error:", error);

        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });
    }
};


// Get jobs created by logged-in recruiter
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            createdBy: req.user.userId
        })
            .populate("company", "name location industry")
            .sort({ createdAt: -1 });

        res.status(200).json({
            jobs
        });

    } catch (error) {
        console.error("Get recruiter jobs error:", error);

        res.status(500).json({
            message: "Failed to get jobs",
            error: error.message
        });
    }
};


// Get all open jobs for students
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("company", "name description website location industry")
            .sort({ createdAt: -1 });

        res.status(200).json({
            jobs
        });

    } catch (error) {
        console.error("Get all jobs error:", error);

        res.status(500).json({
            message: "Failed to get jobs",
            error: error.message
        });
    }
};


module.exports = {
    createJob,
    getMyJobs,
    getAllJobs
};