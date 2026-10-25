import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function StudentJobs() {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [applyingJob, setApplyingJob] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobs();
        fetchApplications();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await apiRequest("/jobs");
            setJobs(data.jobs);
        } catch (error) {
            console.error("Fetch jobs error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const data = await apiRequest("/applications/my");
            setApplications(data.applications);
        } catch (error) {
            console.error("Fetch applications error:", error);
        }
    };

    const handleApply = async (jobId) => {
        setMessage("");
        setError("");

        try {
            setApplyingJob(jobId);

            const data = await apiRequest(
                `/applications/${jobId}`,
                {
                    method: "POST"
                }
            );

            setMessage(data.message);

            // Refresh applications
            fetchApplications();

        } catch (error) {
            console.error("Apply error:", error);
            setError(error.message);
        } finally {
            setApplyingJob(null);
        }
    };

    const hasApplied = (jobId) => {
        return applications.some(
            (application) =>
                application.job?._id === jobId
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading jobs...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-6">
                    Available Jobs
                </h1>

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

                {jobs.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600">
                            No job openings are currently available.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {jobs.map((job) => (

                            <div
                                key={job._id}
                                className="bg-white p-6 rounded-lg shadow"
                            >

                                {/* Job Header */}
                                <div className="flex justify-between items-start">

                                    <div>
                                        <h2 className="text-2xl font-semibold">
                                            {job.title}
                                        </h2>

                                        <p className="text-lg text-blue-600 mt-1">
                                            {job.company?.name}
                                        </p>
                                    </div>

                                    <span
                                        className={
                                            job.status === "open"
                                                ? "bg-green-100 text-green-700 px-3 py-1 rounded"
                                                : "bg-red-100 text-red-700 px-3 py-1 rounded"
                                        }
                                    >
                                        {job.status === "open" ? "Open" : "Closed"}
                                    </span>

                                </div>

                                {/* Description */}
                                <p className="mt-4 text-gray-700">
                                    {job.description}
                                </p>

                                {/* Job Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">

                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {job.location || "Not specified"}
                                    </p>

                                    <p>
                                        <strong>Salary:</strong>{" "}
                                        {job.salary || "Not specified"}
                                    </p>

                                    <p>
                                        <strong>Minimum CGPA:</strong>{" "}
                                        {job.minimumCGPA}
                                    </p>

                                    <p>
                                        <strong>Application Deadline:</strong>{" "}
                                        {new Date(
                                            job.applicationDeadline
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                                {/* Skills */}
                                <div className="mt-4">

                                    <p className="font-semibold mb-2">
                                        Required Skills
                                    </p>

                                    <div className="flex flex-wrap gap-2">

                                        {job.skillsRequired?.map(
                                            (skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-200 px-3 py-1 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                                {/* Apply Button */}
                                <div className="mt-6">

                                    {job.status !== "open" ? (

                                        <button
                                            disabled
                                            className="bg-red-400 text-white px-6 py-2 rounded cursor-not-allowed"
                                        >
                                            Job Closed
                                        </button>

                                    ) : hasApplied(job._id) ? (

                                        <button
                                            disabled
                                            className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
                                        >
                                            Already Applied
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() =>
                                                handleApply(job._id)
                                            }
                                            disabled={
                                                applyingJob === job._id
                                            }
                                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                                        >
                                            {applyingJob === job._id
                                                ? "Applying..."
                                                : "Apply Now"}
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default StudentJobs;