import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function StudentApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchApplications = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await apiRequest(
                "/applications/my"
            );

            setApplications(
                response.applications || []
            );

        } catch (error) {

            console.error(
                "Fetch applications error:",
                error
            );

            setError(
                error.message ||
                "Unable to load applications"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user || user.role !== "student") {

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
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* Header */}

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">
                            My Applications
                        </h1>

                        <p className="text-gray-600 mt-1">
                            Track your job applications
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/student")}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </button>

                </div>


                {/* Total Applications */}

                <div className="bg-white rounded-lg shadow p-5 mb-6">

                    <p className="text-gray-500">
                        Total Applications
                    </p>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {applications.length}
                    </p>

                </div>


                {/* Applications */}

                {applications.length === 0 ? (

                    <div className="bg-white rounded-lg shadow p-6 text-center">

                        <p className="text-gray-500">
                            You have not applied for any jobs yet.
                        </p>

                        <button
                            onClick={() => navigate("/student-jobs")}
                            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                        >
                            View Available Jobs
                        </button>

                    </div>

                ) : (

                    <div className="bg-white rounded-lg shadow overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-200">

                                <tr>

                                    <th className="px-6 py-3">
                                        Job
                                    </th>

                                    <th className="px-6 py-3">
                                        Company
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
                                        Applied On
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {applications.map(
                                    (application) => (

                                        <tr
                                            key={application._id}
                                            className="border-t"
                                        >

                                            {/* Job */}

                                            <td className="px-6 py-4 font-medium">
                                                {application.job?.title || "N/A"}
                                            </td>


                                            {/* Company */}

                                            <td className="px-6 py-4">
                                                {application.job?.company?.name || "N/A"}
                                            </td>


                                            {/* Location */}

                                            <td className="px-6 py-4">
                                                {application.job?.location || "N/A"}
                                            </td>


                                            {/* Salary */}

                                            <td className="px-6 py-4">
                                                {application.job?.salary || "N/A"}
                                            </td>


                                            {/* Status */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        application.status === "selected"
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


                                            {/* Applied Date */}

                                            <td className="px-6 py-4">

                                                {application.appliedAt
                                                    ? new Date(
                                                        application.appliedAt
                                                    ).toLocaleDateString()
                                                    : "N/A"}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default StudentApplications;