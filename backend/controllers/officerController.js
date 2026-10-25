const User = require("../models/User");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");


// =========================
// OFFICER DASHBOARD
// =========================

const getDashboardStats = async (req, res) => {
    try {

        // Count users by role
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalRecruiters = await User.countDocuments({
            role: "recruiter"
        });

        // Count companies
        const totalCompanies = await Company.countDocuments();

        // Count jobs
        const totalJobs = await Job.countDocuments();

        // Count applications
        const totalApplications = await Application.countDocuments();

        // Count interviews
        const totalInterviews = await Interview.countDocuments();

        // Count selected applications
        const selectedStudents = await Application.countDocuments({
            status: "selected"
        });

        res.status(200).json({
            totalStudents,
            totalRecruiters,
            totalCompanies,
            totalJobs,
            totalApplications,
            totalInterviews,
            selectedStudents
        });

    } catch (error) {

        console.error("Officer dashboard error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllStudents = async (req, res) => {
    try {

        const students = await User.find({
            role: "student"
        }).select("-password");

        const studentProfiles = await Student.find();

        const studentsWithProfiles = students.map((student) => {

            const profile = studentProfiles.find(
                (profile) =>
                    profile.user.toString() === student._id.toString()
            );

            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                profile: profile || null,
                approvalStatus: profile?.approvalStatus || "pending"
            };
        });

        res.status(200).json({
            count: studentsWithProfiles.length,
            students: studentsWithProfiles
        });

    } catch (error) {

        console.error("Get students error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// =========================
// GET ALL RECRUITERS
// =========================

const getAllRecruiters = async (req, res) => {
    try {

        const recruiters = await User.find({
            role: "recruiter"
        }).select("-password");

        res.status(200).json({
            count: recruiters.length,
            recruiters
        });

    } catch (error) {

        console.error("Get recruiters error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// =========================
// GET ALL COMPANIES
// =========================

const getAllCompanies = async (req, res) => {
    try {

        const companies = await Company.find()
            .populate("createdBy", "name email");

        res.status(200).json({
            count: companies.length,
            companies
        });

    } catch (error) {

        console.error("Get companies error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// =========================
// GET ALL JOBS
// =========================

const getAllJobs = async (req, res) => {
    try {

        const jobs = await Job.find()
            .populate("company", "name location industry")
            .populate("createdBy", "name email");

        res.status(200).json({
            count: jobs.length,
            jobs
        });

    } catch (error) {

        console.error("Get jobs error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// =========================
// GET ALL APPLICATIONS
// =========================

const getAllApplications = async (req, res) => {
    try {

        const applications = await Application.find()
            .populate("student", "name email")
            .populate({
                path: "job",
                select: "title salary location status company createdBy",
                populate: {
                    path: "company",
                    select: "name location industry"
                }
            })
            .sort({ appliedAt: -1 });

        const applicationsWithProfiles = await Promise.all(
            applications.map(async (application) => {

                const studentProfile = await Student.findOne({
                    user: application.student._id
                });

                return {
                    _id: application._id,

                    student: {
                        _id: application.student._id,
                        name: application.student.name,
                        email: application.student.email,
                        resume: studentProfile
                            ? studentProfile.resume
                            : null
                    },

                    job: application.job,

                    status: application.status,

                    appliedAt: application.appliedAt,

                    createdAt: application.createdAt,
                    updatedAt: application.updatedAt
                };
            })
        );

        res.status(200).json({
            count: applicationsWithProfiles.length,
            applications: applicationsWithProfiles
        });

    } catch (error) {

        console.error("Get all applications error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// =========================
// GET ALL INTERVIEWS
// =========================

const getAllInterviews = async (req, res) => {
    try {

        const interviews = await Interview.find()
            .populate("recruiter", "name email")
            .populate({
                path: "application",
                populate: [
                    {
                        path: "student",
                        select: "name email"
                    },
                    {
                        path: "job",
                        select: "title salary location company",
                        populate: {
                            path: "company",
                            select: "name location industry"
                        }
                    }
                ]
            })
            .sort({ scheduledAt: 1 });

        res.status(200).json({
            count: interviews.length,
            interviews
        });

    } catch (error) {

        console.error("Get all interviews error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// =========================
// PLACEMENT STATISTICS
// =========================

const getPlacementStatistics = async (req, res) => {
    try {

        // =========================
        // APPLICATION COUNTS
        // =========================

        const totalApplications =
            await Application.countDocuments();

        const appliedApplications =
            await Application.countDocuments({
                status: "applied"
            });

        const shortlistedApplications =
            await Application.countDocuments({
                status: "shortlisted"
            });

        const rejectedApplications =
            await Application.countDocuments({
                status: "rejected"
            });

        const selectedApplications =
            await Application.countDocuments({
                status: "selected"
            });


        // =========================
        // STUDENT COUNTS
        // =========================

        const totalStudents =
            await User.countDocuments({
                role: "student"
            });

        const approvedStudents =
            await Student.countDocuments({
                approvalStatus: "approved"
            });

        const pendingStudents =
            await Student.countDocuments({
                approvalStatus: "pending"
            });

        const rejectedStudents =
            await Student.countDocuments({
                approvalStatus: "rejected"
            });

        const placedStudents =
            await Application.distinct("student", {
                status: "selected"
            });

        const placedStudentCount =
            placedStudents.length;


        // =========================
        // PLACEMENT RATE
        // =========================

        const placementRate =
            totalStudents > 0
                ? Number(
                    (
                        (placedStudentCount / totalStudents) * 100
                    ).toFixed(2)
                )
                : 0;

        // =========================
        // COMPANY COUNTS
        // =========================

        const totalCompanies =
            await Company.countDocuments();

        const approvedCompanies =
            await Company.countDocuments({
                approvalStatus: "approved"
            });

        const pendingCompanies =
            await Company.countDocuments({
                approvalStatus: "pending"
            });

        const rejectedCompanies =
            await Company.countDocuments({
                approvalStatus: "rejected"
            });


        // =========================
        // JOB COUNTS
        // =========================

        const totalJobs =
            await Job.countDocuments();

        const openJobs =
            await Job.countDocuments({
                status: "open"
            });

        const closedJobs =
            await Job.countDocuments({
                status: "closed"
            });


        // =========================
        // INTERVIEW COUNTS
        // =========================

        const totalInterviews =
            await Interview.countDocuments();

        const scheduledInterviews =
            await Interview.countDocuments({
                status: "scheduled"
            });

        const completedInterviews =
            await Interview.countDocuments({
                status: "completed"
            });

        const cancelledInterviews =
            await Interview.countDocuments({
                status: "cancelled"
            });


        // =========================
        // RESPONSE
        // =========================

        res.status(200).json({

            applications: {
                total: totalApplications,
                applied: appliedApplications,
                shortlisted: shortlistedApplications,
                rejected: rejectedApplications,
                selected: selectedApplications
            },

            students: {
                total: totalStudents,
                approved: approvedStudents,
                pending: pendingStudents,
                rejected: rejectedStudents,
                placed: placedStudentCount
            },
            
            companies: {
                total: totalCompanies,
                approved: approvedCompanies,
                pending: pendingCompanies,
                rejected: rejectedCompanies
            },

            placement: {
                placementRate
            },

            jobs: {
                total: totalJobs,
                open: openJobs,
                closed: closedJobs
            },

            interviews: {
                total: totalInterviews,
                scheduled: scheduledInterviews,
                completed: completedInterviews,
                cancelled: cancelledInterviews
            }

        });

    } catch (error) {

        console.error(
            "Placement statistics error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateStudentApproval = async (req, res) => {
    try {

        const { studentId } = req.params;
        const { approvalStatus } = req.body;

        if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
            return res.status(400).json({
                message: "Invalid approval status"
            });
        }

        const student = await Student.findOne({
            user: studentId
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        student.approvalStatus = approvalStatus;

        await student.save();

        res.status(200).json({
            message: `Student ${approvalStatus} successfully`,
            student: {
                user: student.user,
                approvalStatus: student.approvalStatus
            }
        });

    } catch (error) {

        console.error("Update student approval error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateCompanyApproval = async (req, res) => {
    try {

        const { companyId } = req.params;
        const { approvalStatus } = req.body;

        if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
            return res.status(400).json({
                message: "Invalid approval status"
            });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        company.approvalStatus = approvalStatus;

        await company.save();

        res.status(200).json({
            message: `Company ${approvalStatus} successfully`,
            company: {
                _id: company._id,
                name: company.name,
                approvalStatus: company.approvalStatus
            }
        });

    } catch (error) {

        console.error("Update company approval error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateJobStatus = async (req, res) => {
    try {

        const { jobId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!["open", "closed"].includes(status)) {
            return res.status(400).json({
                message: "Invalid job status"
            });
        }

        // Find job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Update status
        job.status = status;

        await job.save();

        res.status(200).json({
            message: `Job ${status} successfully`,
            job: {
                _id: job._id,
                title: job.title,
                status: job.status
            }
        });

    } catch (error) {

        console.error("Update job status error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
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
};