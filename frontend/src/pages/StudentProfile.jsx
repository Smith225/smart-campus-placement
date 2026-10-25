import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function StudentProfile() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: "",
        rollNumber: "",
        department: "",
        course: "",
        graduationYear: "",
        cgpa: "",
        skills: ""
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [resume, setResume] = useState(null);
    const [uploadedResume, setUploadedResume] = useState("");
    const [resumeMessage, setResumeMessage] = useState("");
    const [resumeError, setResumeError] = useState("");
    const [uploadingResume, setUploadingResume] = useState(false);

    // Load existing profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiRequest("/students/profile");

                const student = data.student;

                setFormData({
                    phone: student.phone || "",
                    rollNumber: student.rollNumber || "",
                    department: student.department || "",
                    course: student.course || "",
                    graduationYear: student.graduationYear || "",
                    cgpa: student.cgpa || "",
                    skills: student.skills
                        ? student.skills.join(", ")
                        : ""
                });

                setUploadedResume(student.resume || "");
            } catch (error) {
                // Profile may not exist yet
                console.log("Profile not found:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const data = await apiRequest("/students/profile", {
                method: "POST",
                body: JSON.stringify({
                    phone: formData.phone,
                    rollNumber: formData.rollNumber,
                    department: formData.department,
                    course: formData.course,
                    graduationYear: Number(formData.graduationYear),
                    cgpa: Number(formData.cgpa),
                    skills: formData.skills
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(skill => skill !== "")
                })
            });

            setMessage(data.message);

        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleResumeUpload = async () => {
        if (!resume) {
            setResumeError("Please select a PDF resume");
            return;
        }

        setResumeMessage("");
        setResumeError("");

        if (resume.type !== "application/pdf") {
            setResumeError("Only PDF files are allowed");
            return;
        }

        if (resume.size > 5 * 1024 * 1024) {
            setResumeError("Resume must be less than 5 MB");
            return;
        }

        const formData = new FormData();

        formData.append("resume", resume);

        try {
            setUploadingResume(true);

            const data = await apiRequest("/students/resume", {
                method: "POST",
                body: formData
            });

            setResumeMessage(data.message);
            setUploadedResume(data.resume);
            setResume(null);

        } catch (error) {
            console.error("Resume upload error:", error);
            setResumeError(error.message);

        } finally {
            setUploadingResume(false);
        }
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">

                <h1 className="text-3xl font-bold mb-2">
                    Student Profile
                </h1>

                <p className="text-gray-600 mb-6">
                    Complete your profile to apply for placement opportunities.
                </p>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* Roll Number */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Roll Number
                        </label>

                        <input
                            type="text"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter roll number"
                        />
                    </div>

                    {/* Department */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Department
                        </label>

                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="e.g. Computer Science and Engineering"
                        />
                    </div>

                    {/* Course */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Course
                        </label>

                        <input
                            type="text"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="e.g. M.Tech"
                        />
                    </div>

                    {/* Graduation Year */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Graduation Year
                        </label>

                        <input
                            type="number"
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="e.g. 2027"
                        />
                    </div>

                    {/* CGPA */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            CGPA
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            name="cgpa"
                            value={formData.cgpa}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="e.g. 8.4"
                        />
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                        <label className="block font-medium mb-1">
                            Skills
                        </label>

                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="C++, Java, React, Node.js, MongoDB"
                        />

                        <p className="text-sm text-gray-500 mt-1">
                            Separate skills using commas.
                        </p>
                    </div>

                    <div className="mb-6 border-t pt-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Resume
                        </h2>

                        <p className="text-sm text-gray-500 mb-3">
                            Upload your resume in PDF format. Maximum size: 5 MB.
                        </p>

                        {resumeMessage && (
                            <div className="bg-green-100 text-green-700 p-3 rounded mb-3">
                                {resumeMessage}
                            </div>
                        )}

                        {resumeError && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
                                {resumeError}
                            </div>
                        )}

                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => {
                                setResume(e.target.files[0]);
                                setResumeMessage("");
                                setResumeError("");
                            }}
                            className="w-full border p-2 rounded mb-3"
                        />

                        {resume && (
                            <p className="text-sm text-gray-600 mb-3">
                                Selected file: {resume.name}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleResumeUpload}
                            disabled={uploadingResume}
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {uploadingResume ? "Uploading..." : "Upload Resume"}
                        </button>

                        {uploadedResume && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    Uploaded Resume: {uploadedResume}
                                </p>

                                <a
                                    href={`http://localhost:5000/uploads/resumes/${uploadedResume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                                >
                                    View Resume
                                </a>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Save Profile
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/student-dashboard")}
                        className="ml-3 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Dashboard
                    </button>

                </form>
            </div>
        </div>
    );
}

export default StudentProfile;