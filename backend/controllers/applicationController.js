const Application = require("../models/Application");
const Job = require("../models/Job");
const Student = require("../models/Student");

const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Check whether student profile exists
        const student = await Student.findOne({
            user: req.user.userId
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        // Check whether student is approved
        if (student.approvalStatus !== "approved") {
            return res.status(403).json({
                message: "Your student profile must be approved by the Placement Officer before applying for jobs"
            });
        }

        // Check whether job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check whether job is open
        if (job.status !== "open") {
            return res.status(400).json({
                message: "This job is no longer open"
            });
        }

        // Check application deadline
        if (new Date(job.applicationDeadline) < new Date()) {
            return res.status(400).json({
                message: "Application deadline has passed"
            });
        }

        // Check whether student already applied
        const existingApplication = await Application.findOne({
            student: req.user.userId,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        // Create application
        const application = await Application.create({
            student: req.user.userId,
            job: jobId
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.error("Apply for job error:", error);

        res.status(500).json({
            message: "Failed to apply for job",
            error: error.message
        });
    }
};

// Get applications of logged-in student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user.userId
        })
            .populate({
                path: "job",
                populate: {
                    path: "company",
                    select: "name location industry"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            applications
        });

    } catch (error) {
        console.error("Get applications error:", error);

        res.status(500).json({
            message: "Failed to get applications",
            error: error.message
        });
    }
};

// Get applications received for recruiter's jobs
const getRecruiterApplications = async (req, res) => {
    try {
        const recruiterJobs = await Job.find({
            createdBy: req.user.userId
        }).select("_id");

        const jobIds = recruiterJobs.map((job) => job._id);

        const applications = await Application.find({
            job: { $in: jobIds }
        })
            .populate("student", "name email")
            .populate({
                path: "job",
                populate: {
                    path: "company",
                    select: "name location industry"
                }
            })
            .sort({ createdAt: -1 });

        // Get all student user IDs
        const studentUserIds = applications.map(
            (application) => application.student._id
        );

        // Find corresponding Student profiles
        const studentProfiles = await Student.find({
            user: { $in: studentUserIds }
        }).select("user resume");

        // Create a map: user ID -> resume filename
        const resumeMap = new Map();

        studentProfiles.forEach((profile) => {
            resumeMap.set(
                profile.user.toString(),
                profile.resume
            );
        });

        // Add resume information to each application
        const applicationsWithResume = applications.map(
            (application) => {
                const applicationObject = application.toObject();

                const studentId =
                    application.student._id.toString();

                applicationObject.student.resume =
                    resumeMap.get(studentId) || "";

                return applicationObject;
            }
        );

        res.status(200).json({
            applications: applicationsWithResume
        });

    } catch (error) {
        console.error(
            "Get recruiter applications error:",
            error
        );

        res.status(500).json({
            message: "Failed to get applications",
            error: error.message
        });
    }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "applied",
            "shortlisted",
            "rejected",
            "selected"
        ];

        // Validate status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        // Find application
        const application = await Application.findById(
            applicationId
        ).populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Make sure recruiter owns the job
        if (
            application.job.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message: "You can only manage applications for your own jobs"
            });
        }

        application.status = status;

        await application.save();

        res.status(200).json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.error("Update application status error:", error);

        res.status(500).json({
            message: "Failed to update application status",
            error: error.message
        });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getRecruiterApplications,
    updateApplicationStatus
};