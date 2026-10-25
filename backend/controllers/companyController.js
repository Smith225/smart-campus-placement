const Company = require("../models/Company");

// Create company
const createCompany = async (req, res) => {
    try {
        const {
            name,
            description,
            website,
            location,
            industry
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Company name is required"
            });
        }

        const company = await Company.create({
            name,
            description,
            website,
            location,
            industry,
            createdBy: req.user.userId
        });

        res.status(201).json({
            message: "Company created successfully",
            company
        });

    } catch (error) {
        console.error("Create company error:", error);

        res.status(500).json({
            message: "Failed to create company",
            error: error.message
        });
    }
};


// Get companies created by recruiter
const getMyCompanies = async (req, res) => {
    try {
        const companies = await Company.find({
            createdBy: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            companies
        });

    } catch (error) {
        console.error("Get companies error:", error);

        res.status(500).json({
            message: "Failed to get companies",
            error: error.message
        });
    }
};


// Get all companies
const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            companies
        });

    } catch (error) {
        console.error("Get all companies error:", error);

        res.status(500).json({
            message: "Failed to get companies",
            error: error.message
        });
    }
};


module.exports = {
    createCompany,
    getMyCompanies,
    getAllCompanies
};