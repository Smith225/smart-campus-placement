import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function RecruiterJobs() {
    const [companies, setCompanies] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [formData, setFormData] = useState({
        company: "",
        title: "",
        description: "",
        skillsRequired: "",
        salary: "",
        location: "",
        minimumCGPA: "",
        applicationDeadline: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch recruiter's companies and jobs
    useEffect(() => {
        fetchCompanies();
        fetchJobs();
    }, []);

    const fetchCompanies = async () => {
        try {
            const data = await apiRequest("/companies/my");
            setCompanies(data.companies);
        } catch (error) {
            console.error("Error fetching companies:", error);
            setError(error.message);
        }
    };

    const fetchJobs = async () => {
        try {
            const data = await apiRequest("/jobs/my");
            setJobs(data.jobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setError(error.message);
        }
    };

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

        if (!formData.company) {
            setError("Please select a company");
            return;
        }

        try {
            setLoading(true);

            const jobData = {
                company: formData.company,
                title: formData.title,
                description: formData.description,

                skillsRequired: formData.skillsRequired
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill !== ""),

                salary: formData.salary,
                location: formData.location,

                minimumCGPA: formData.minimumCGPA
                    ? Number(formData.minimumCGPA)
                    : 0,

                applicationDeadline: formData.applicationDeadline
            };

            const data = await apiRequest("/jobs", {
                method: "POST",
                body: JSON.stringify(jobData)
            });

            setMessage(data.message);

            // Clear form
            setFormData({
                company: "",
                title: "",
                description: "",
                skillsRequired: "",
                salary: "",
                location: "",
                minimumCGPA: "",
                applicationDeadline: ""
            });

            // Refresh jobs
            fetchJobs();

        } catch (error) {
            console.error("Create job error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-6">
                    Job Management
                </h1>

                {/* Create Job Form */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">

                    <h2 className="text-2xl font-semibold mb-6">
                        Create Job Opening
                    </h2>

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

                        {/* Company */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2">
                                Company
                            </label>

                            <select
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                required
                            >
                                <option value="">
                                    Select Company
                                </option>

                                {companies.map((company) => (
                                    <option
                                        key={company._id}
                                        value={company._id}
                                    >
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Job Title */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2">
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Software Engineer"
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2">
                                Job Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter job description"
                                rows="4"
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2">
                                Required Skills
                            </label>

                            <input
                                type="text"
                                name="skillsRequired"
                                value={formData.skillsRequired}
                                onChange={handleChange}
                                placeholder="Java, React, Node.js, MongoDB"
                                className="w-full border p-2 rounded"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                Separate skills using commas.
                            </p>
                        </div>

                        {/* Salary */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2">
                                Salary
                            </label>

                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="8 LPA"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        {/* Location */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Pune"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        {/* Minimum CGPA */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2">
                                Minimum CGPA
                            </label>

                            <input
                                type="number"
                                name="minimumCGPA"
                                value={formData.minimumCGPA}
                                onChange={handleChange}
                                placeholder="7.5"
                                min="0"
                                max="10"
                                step="0.1"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        {/* Deadline */}
                        <div className="mb-6">
                            <label className="block font-medium mb-2">
                                Application Deadline
                            </label>

                            <input
                                type="date"
                                name="applicationDeadline"
                                value={formData.applicationDeadline}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? "Creating..." : "Create Job"}
                        </button>

                    </form>
                </div>

                {/* Existing Jobs */}
                <div className="bg-white p-6 rounded-lg shadow">

                    <h2 className="text-2xl font-semibold mb-6">
                        My Job Openings
                    </h2>

                    {jobs.length === 0 ? (
                        <p className="text-gray-600">
                            No job openings created yet.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="border rounded-lg p-5"
                                >

                                    <div className="flex justify-between items-start">

                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                {job.title}
                                            </h3>

                                            <p className="text-gray-600">
                                                {job.company?.name}
                                            </p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded text-sm ${
                                                job.status === "open"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {job.status}
                                        </span>

                                    </div>

                                    <p className="mt-3">
                                        {job.description}
                                    </p>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">

                                        <p>
                                            <strong>Skills:</strong>{" "}
                                            {job.skillsRequired?.join(", ") || "Not specified"}
                                        </p>

                                        <p>
                                            <strong>Salary:</strong>{" "}
                                            {job.salary || "Not specified"}
                                        </p>

                                        <p>
                                            <strong>Location:</strong>{" "}
                                            {job.location || "Not specified"}
                                        </p>

                                        <p>
                                            <strong>Minimum CGPA:</strong>{" "}
                                            {job.minimumCGPA}
                                        </p>

                                        <p>
                                            <strong>Deadline:</strong>{" "}
                                            {new Date(
                                                job.applicationDeadline
                                            ).toLocaleDateString()}
                                        </p>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default RecruiterJobs;