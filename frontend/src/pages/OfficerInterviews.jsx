import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function OfficerInterviews() {

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchInterviews = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await apiRequest(
                "/officer/interviews"
            );

            setInterviews(response.interviews || []);

        } catch (error) {

            console.error(error);

            setError(
                error.message || "Unable to load interviews"
            );

        } finally {

            setLoading(false);
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

        fetchInterviews();

    }, [navigate]);

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-lg">
                    Loading interviews...
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
                        onClick={fetchInterviews}
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
                        All Interviews
                    </h1>

                    <p className="text-gray-600 mt-1">
                        View all scheduled placement interviews
                    </p>

                </div>

                <button
                    onClick={() => navigate("/officer")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>

            </div>


            {/* Total Interviews */}

            <div className="bg-white rounded-lg shadow p-4 mb-6">

                <p className="text-gray-500">
                    Total Interviews
                </p>

                <p className="text-2xl font-bold">
                    {interviews.length}
                </p>

            </div>


            {/* Interviews Table */}

            {interviews.length === 0 ? (

                <div className="bg-white rounded-lg shadow p-6 text-center">

                    <p className="text-gray-500">
                        No interviews found.
                    </p>

                </div>

            ) : (

                <div className="bg-white rounded-lg shadow overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="px-6 py-3">
                                    Student
                                </th>

                                <th className="px-6 py-3">
                                    Student Email
                                </th>

                                <th className="px-6 py-3">
                                    Job
                                </th>

                                <th className="px-6 py-3">
                                    Company
                                </th>

                                <th className="px-6 py-3">
                                    Recruiter
                                </th>

                                <th className="px-6 py-3">
                                    Interview Date
                                </th>

                                <th className="px-6 py-3">
                                    Mode
                                </th>

                                <th className="px-6 py-3">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {interviews.map((interview) => {

                                const student =
                                    interview.application?.student;

                                const job =
                                    interview.application?.job;

                                const company =
                                    job?.company;

                                const recruiter =
                                    interview.recruiter;

                                return (

                                    <tr
                                        key={interview._id}
                                        className="border-t"
                                    >

                                        {/* Student */}

                                        <td className="px-6 py-4 font-medium">
                                            {student?.name || "N/A"}
                                        </td>


                                        {/* Student Email */}

                                        <td className="px-6 py-4">
                                            {student?.email || "N/A"}
                                        </td>


                                        {/* Job */}

                                        <td className="px-6 py-4">
                                            {job?.title || "N/A"}
                                        </td>


                                        {/* Company */}

                                        <td className="px-6 py-4">
                                            {company?.name || "N/A"}
                                        </td>


                                        {/* Recruiter */}

                                        <td className="px-6 py-4">
                                            {recruiter?.name || "N/A"}
                                        </td>


                                        {/* Interview Date */}

                                        <td className="px-6 py-4">

                                            {interview.scheduledAt
                                                ? new Date(
                                                    interview.scheduledAt
                                                ).toLocaleString()
                                                : "N/A"}

                                        </td>


                                        {/* Mode */}

                                        <td className="px-6 py-4 capitalize">
                                            {interview.mode || "N/A"}
                                        </td>


                                        {/* Status */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`px-3 py-1 rounded text-sm font-medium capitalize ${interview.status === "scheduled"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : interview.status === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : interview.status === "cancelled"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {interview.status || "N/A"}
                                            </span>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default OfficerInterviews;