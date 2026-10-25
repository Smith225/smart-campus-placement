const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        skillsRequired: {
            type: [String],
            default: []
        },

        salary: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        minimumCGPA: {
            type: Number,
            default: 0
        },

        applicationDeadline: {
            type: Date,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);