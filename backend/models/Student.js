const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        phone: {
            type: String,
            trim: true
        },

        rollNumber: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        },

        department: {
            type: String,
            trim: true
        },

        course: {
            type: String,
            trim: true
        },

        graduationYear: {
            type: Number
        },

        cgpa: {
            type: Number,
            min: 0,
            max: 10
        },

        skills: {
            type: [String],
            default: []
        },

        resume: {
            type: String,
            default: ""
        },

        profileCompleted: {
            type: Boolean,
            default: false
        },

        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);