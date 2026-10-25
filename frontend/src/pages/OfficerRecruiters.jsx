import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function OfficerRecruiters() {

    const navigate = useNavigate();

    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRecruiters = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest(
                "/officer/recruiters"
            );

            setRecruiters(response.recruiters || []);

        } catch (error) {
            console.error(error);

            setError(
                error.message || "Unable to load recruiters"
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

        fetchRecruiters();

    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">
                    Loading recruiters...
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
                        onClick={fetchRecruiters}
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

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        All Recruiters
                    </h1>

                    <p className="text-gray-600 mt-1">
                        View registered recruiters
                    </p>
                </div>

                <button
                    onClick={() => navigate("/officer")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>

            </div>


            {/* COUNT */}

            <div className="bg-white rounded-lg shadow p-4 mb-6">

                <p className="text-gray-500">
                    Total Recruiters
                </p>

                <p className="text-2xl font-bold">
                    {recruiters.length}
                </p>

            </div>


            {/* RECRUITERS */}

            {recruiters.length === 0 ? (

                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">
                        No recruiters found.
                    </p>
                </div>

            ) : (

                <div className="bg-white rounded-lg shadow overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="px-6 py-3">
                                    Name
                                </th>

                                <th className="px-6 py-3">
                                    Email
                                </th>

                                <th className="px-6 py-3">
                                    Role
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {recruiters.map((recruiter) => (

                                <tr
                                    key={recruiter._id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-4">
                                        {recruiter.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {recruiter.email}
                                    </td>

                                    <td className="px-6 py-4 capitalize">
                                        {recruiter.role}
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

export default OfficerRecruiters;