const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true,
            unique: true
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        scheduledAt: {
            type: Date,
            required: true
        },

        mode: {
            type: String,
            enum: ["online", "offline"],
            required: true
        },

        meetingLink: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        notes: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "scheduled",
                "completed",
                "cancelled"
            ],
            default: "scheduled"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Interview",
    interviewSchema
);