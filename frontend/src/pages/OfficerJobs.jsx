import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function OfficerJobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await apiRequest(
                "/officer/jobs"
            );

            setJobs(response.jobs || []);

        } catch (error) {

            console.error(error);

            setError(
                error.message || "Unable to load jobs"
            );

        } finally {

            setLoading(false);
        }
    };

    const updateJobStatus = async (jobId, status) => {
        try {
            await apiRequest(
                `/officer/jobs/${jobId}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        status
                    })
                }
            );

            fetchJobs();

        } catch (error) {
            console.error(error);

            alert(
                error.message || "Unable to update job status"
            );
        }
    };

    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user || user.role !== "officer") {

            navigate("/login");

            return;
        }

        fetchJobs();

    }, [navigate]);

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-lg">
                    Loading jobs...
                </p>

            </div>
        );
    }

    if (error) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <p className="text-red-600 mb-4">
                        {error}
                    </p>

                    <button
                        onClick={fetchJobs}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        All Jobs
                    </h1>

                    <p className="text-gray-600 mt-1">
                        View all jobs posted by recruiters
                    </p>

                </div>

                <button
                    onClick={() => navigate("/officer")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>

            </div>


            {/* Total Jobs */}

            <div className="bg-white rounded-lg shadow p-4 mb-6">

                <p className="text-gray-500">
                    Total Jobs
                </p>

                <p className="text-2xl font-bold">
                    {jobs.length}
                </p>

            </div>


            {/* Jobs */}

            {jobs.length === 0 ? (

                <div className="bg-white rounded-lg shadow p-6 text-center">

                    <p className="text-gray-500">
                        No jobs found.
                    </p>

                </div>

            ) : (

                <div className="bg-white rounded-lg shadow overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="px-6 py-3">
                                    Job Title
                                </th>

                                <th className="px-6 py-3">
                                    Company
                                </th>

                                <th className="px-6 py-3">
                                    Recruiter
                                </th>

                                <th className="px-6 py-3">
                                    Location
                                </th>

                                <th className="px-6 py-3">
                                    Salary
                                </th>

                                <th className="px-6 py-3">
                                    Status
                                </th>

                                <th className="px-6 py-3">
                                    Action
                                </th>

                                <th className="px-6 py-3">
                                    Deadline
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {jobs.map((job) => (

                                <tr
                                    key={job._id}
                                    className="border-t"
                                >

                                    {/* Job Title */}

                                    <td className="px-6 py-4 font-medium">
                                        {job.title || "N/A"}
                                    </td>


                                    {/* Company */}

                                    <td className="px-6 py-4">
                                        {job.company?.name || "N/A"}
                                    </td>


                                    {/* Recruiter */}

                                    <td className="px-6 py-4">
                                        {job.createdBy?.name || "N/A"}
                                    </td>


                                    {/* Location */}

                                    <td className="px-6 py-4">
                                        {job.location || "N/A"}
                                    </td>


                                    {/* Salary */}

                                    <td className="px-6 py-4">
                                        {job.salary || "N/A"}
                                    </td>


                                    {/* Status */}

                                    <td className="px-6 py-4 capitalize">
                                        {job.status || "N/A"}
                                    </td>

                                    <td className="px-6 py-4">

                                        {job.status === "open" ? (

                                            <button
                                                onClick={() =>
                                                    updateJobStatus(job._id, "closed")
                                                }
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Close
                                            </button>

                                        ) : (

                                            <button
                                                onClick={() =>
                                                    updateJobStatus(job._id, "open")
                                                }
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Reopen
                                            </button>

                                        )}

                                    </td>

                                    {/* Deadline */}

                                    <td className="px-6 py-4">
                                        {job.deadline
                                            ? new Date(
                                                job.deadline
                                            ).toLocaleDateString()
                                            : "N/A"}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default OfficerJobs;