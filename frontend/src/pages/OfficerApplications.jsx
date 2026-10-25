import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function OfficerApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const totalApplications = applications.length;

    const appliedApplications = applications.filter(
        (application) => application.status === "applied"
    ).length;

    const shortlistedApplications = applications.filter(
        (application) => application.status === "shortlisted"
    ).length;

    const selectedApplications = applications.filter(
        (application) => application.status === "selected"
    ).length;

    const rejectedApplications = applications.filter(
        (application) => application.status === "rejected"
    ).length;

    const fetchApplications = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await apiRequest(
                "/officer/applications"
            );

            setApplications(response.applications || []);

        } catch (error) {

            console.error(error);

            setError(
                error.message || "Unable to load applications"
            );

        } finally {

            setLoading(false);
        }
    };

    const filteredApplications =
        statusFilter === "all"
            ? applications
            : applications.filter(
                (application) =>
                    application.status === statusFilter
            );

    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user || user.role !== "officer") {

            navigate("/login");

            return;
        }

        fetchApplications();

    }, [navigate]);

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-lg">
                    Loading applications...
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
                        onClick={fetchApplications}
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
                        All Applications
                    </h1>

                    <p className="text-gray-600 mt-1">
                        View all student job applications
                    </p>

                </div>

                <button
                    onClick={() => navigate("/officer")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>

            </div>


            {/* Total Applications */}

            {/* Application Summary */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

                {/* Total */}

                <div className="bg-white rounded-lg shadow p-5">

                    <p className="text-gray-500">
                        Total Applications
                    </p>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {totalApplications}
                    </p>

                </div>


                {/* Applied */}

                <div className="bg-yellow-50 rounded-lg shadow p-5">

                    <p className="text-yellow-700">
                        Applied
                    </p>

                    <p className="text-3xl font-bold text-yellow-800 mt-2">
                        {appliedApplications}
                    </p>

                </div>


                {/* Shortlisted */}

                <div className="bg-blue-50 rounded-lg shadow p-5">

                    <p className="text-blue-700">
                        Shortlisted
                    </p>

                    <p className="text-3xl font-bold text-blue-800 mt-2">
                        {shortlistedApplications}
                    </p>

                </div>


                {/* Selected */}

                <div className="bg-green-50 rounded-lg shadow p-5">

                    <p className="text-green-700">
                        Selected
                    </p>

                    <p className="text-3xl font-bold text-green-800 mt-2">
                        {selectedApplications}
                    </p>

                </div>


                {/* Rejected */}

                <div className="bg-red-50 rounded-lg shadow p-5">

                    <p className="text-red-700">
                        Rejected
                    </p>

                    <p className="text-3xl font-bold text-red-800 mt-2">
                        {rejectedApplications}
                    </p>

                </div>

            </div>

            {/* Application Filters */}

            <div className="bg-white rounded-lg shadow p-4 mb-6">

                <p className="font-semibold text-gray-700 mb-3">
                    Filter by Status
                </p>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-4 py-2 rounded ${statusFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        All ({applications.length})
                    </button>

                    <button
                        onClick={() => setStatusFilter("applied")}
                        className={`px-4 py-2 rounded ${statusFilter === "applied"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Applied ({
                            applications.filter(
                                (application) =>
                                    application.status === "applied"
                            ).length
                        })
                    </button>

                    <button
                        onClick={() => setStatusFilter("shortlisted")}
                        className={`px-4 py-2 rounded ${statusFilter === "shortlisted"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Shortlisted ({
                            applications.filter(
                                (application) =>
                                    application.status === "shortlisted"
                            ).length
                        })
                    </button>

                    <button
                        onClick={() => setStatusFilter("rejected")}
                        className={`px-4 py-2 rounded ${statusFilter === "rejected"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Rejected ({
                            applications.filter(
                                (application) =>
                                    application.status === "rejected"
                            ).length
                        })
                    </button>

                    <button
                        onClick={() => setStatusFilter("selected")}
                        className={`px-4 py-2 rounded ${statusFilter === "selected"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Selected ({
                            applications.filter(
                                (application) =>
                                    application.status === "selected"
                            ).length
                        })
                    </button>

                </div>

            </div>

            {/* Applications Table */}

            {filteredApplications.length === 0 ? (

                <div className="bg-white rounded-lg shadow p-6 text-center">

                    <p className="text-gray-500">
                        No applications found.
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
                                    Email
                                </th>

                                <th className="px-6 py-3">
                                    Job
                                </th>

                                <th className="px-6 py-3">
                                    Company
                                </th>

                                <th className="px-6 py-3">
                                    Status
                                </th>

                                <th className="px-6 py-3">
                                    Resume
                                </th>

                                <th className="px-6 py-3">
                                    Applied On
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredApplications.map((application) => (

                                <tr
                                    key={application._id}
                                    className="border-t"
                                >

                                    {/* Student */}

                                    <td className="px-6 py-4 font-medium">
                                        {application.student?.name || "N/A"}
                                    </td>


                                    {/* Email */}

                                    <td className="px-6 py-4">
                                        {application.student?.email || "N/A"}
                                    </td>


                                    {/* Job */}

                                    <td className="px-6 py-4">
                                        {application.job?.title || "N/A"}
                                    </td>


                                    {/* Company */}

                                    <td className="px-6 py-4">
                                        {application.job?.company?.name || "N/A"}
                                    </td>


                                    {/* Status */}

                                    <td className="px-6 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${application.status === "selected"
                                                ? "bg-green-100 text-green-700"
                                                : application.status === "shortlisted"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : application.status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {application.status || "N/A"}
                                        </span>

                                    </td>


                                    {/* Resume */}

                                    <td className="px-6 py-4">

                                        {application.resume ? (

                                            <a
                                                href={`http://localhost:5000/uploads/resumes/${application.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Resume
                                            </a>

                                        ) : (

                                            <span className="text-gray-500">
                                                No Resume
                                            </span>

                                        )}

                                    </td>


                                    {/* Applied Date */}

                                    <td className="px-6 py-4">

                                        {application.createdAt
                                            ? new Date(
                                                application.createdAt
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

export default OfficerApplications;