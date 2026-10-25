const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Job = require("../models/Job");

// Schedule an interview
const scheduleInterview = async (req, res) => {
    try {
        const {
            applicationId,
            scheduledAt,
            mode,
            meetingLink,
            location,
            notes
        } = req.body;

        if (!applicationId || !scheduledAt || !mode) {
            return res.status(400).json({
                message:
                    "Application, date/time and interview mode are required"
            });
        }

        if (!["online", "offline"].includes(mode)) {
            return res.status(400).json({
                message: "Invalid interview mode"
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
                message:
                    "You can only schedule interviews for your own jobs"
            });
        }

        // Interview should normally be scheduled only
        // for shortlisted students
        if (application.status !== "shortlisted") {
            return res.status(400).json({
                message:
                    "Interview can only be scheduled for shortlisted students"
            });
        }

        // Check whether interview already exists
        const existingInterview = await Interview.findOne({
            application: applicationId
        });

        if (existingInterview) {
            return res.status(400).json({
                message:
                    "An interview has already been scheduled for this application"
            });
        }

        // Online interview should have meeting link
        if (mode === "online" && !meetingLink) {
            return res.status(400).json({
                message:
                    "Meeting link is required for online interviews"
            });
        }

        // Offline interview should have location
        if (mode === "offline" && !location) {
            return res.status(400).json({
                message:
                    "Location is required for offline interviews"
            });
        }

        const interview = await Interview.create({
            application: applicationId,
            recruiter: req.user.userId,
            scheduledAt,
            mode,
            meetingLink: mode === "online"
                ? meetingLink
                : "",
            location: mode === "offline"
                ? location
                : "",
            notes
        });

        res.status(201).json({
            message: "Interview scheduled successfully",
            interview
        });

    } catch (error) {
        console.error(
            "Schedule interview error:",
            error
        );

        res.status(500).json({
            message: "Failed to schedule interview",
            error: error.message
        });
    }
};


// Get interviews for recruiter
const getRecruiterInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            recruiter: req.user.userId
        })
            .populate({
                path: "application",
                populate: [
                    {
                        path: "student",
                        select: "name email"
                    },
                    {
                        path: "job",
                        populate: {
                            path: "company",
                            select: "name location"
                        }
                    }
                ]
            })
            .sort({ scheduledAt: 1 });

        res.status(200).json({
            interviews
        });

    } catch (error) {
        console.error(
            "Get recruiter interviews error:",
            error
        );

        res.status(500).json({
            message: "Failed to get interviews",
            error: error.message
        });
    }
};


// Get interviews for student
const getStudentInterviews = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user.userId
        }).select("_id");

        const applicationIds = applications.map(
            (application) => application._id
        );

        const interviews = await Interview.find({
            application: {
                $in: applicationIds
            }
        })
            .populate({
                path: "application",
                populate: {
                    path: "job",
                    populate: {
                        path: "company",
                        select: "name location"
                    }
                }
            })
            .sort({ scheduledAt: 1 });

        res.status(200).json({
            interviews
        });

    } catch (error) {
        console.error(
            "Get student interviews error:",
            error
        );

        res.status(500).json({
            message: "Failed to get interviews",
            error: error.message
        });
    }
};

// Update interview status
const updateInterviewStatus = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!["scheduled", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({
                message: "Invalid interview status"
            });
        }

        // Find interview
        const interview = await Interview.findById(interviewId)
            .populate({
                path: "application",
                populate: {
                    path: "job",
                    select: "createdBy"
                }
            });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        // Make sure recruiter owns the interview
        if (
            interview.recruiter.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You can only update interviews for your own jobs"
            });
        }

        // Update status
        interview.status = status;

        await interview.save();

        res.status(200).json({
            message: `Interview marked as ${status}`,
            interview
        });

    } catch (error) {
        console.error(
            "Update interview status error:",
            error
        );

        res.status(500).json({
            message: "Failed to update interview status",
            error: error.message
        });
    }
};

module.exports = {
    scheduleInterview,
    getRecruiterInterviews,
    getStudentInterviews,
    updateInterviewStatus
};