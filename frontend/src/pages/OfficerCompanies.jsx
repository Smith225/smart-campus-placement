import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function OfficerCompanies() {

    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCompanies = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await apiRequest(
                "/officer/companies"
            );

            setCompanies(response.companies || []);

        } catch (error) {

            console.error(error);

            setError(
                error.message || "Unable to load companies"
            );

        } finally {

            setLoading(false);
        }
    };

    const updateApprovalStatus = async (companyId, approvalStatus) => {

        try {

            await apiRequest(
                `/officer/companies/${companyId}/approval`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        approvalStatus
                    })
                }
            );

            fetchCompanies();

        } catch (error) {

            console.error(error);

            alert(
                error.message || "Unable to update company status"
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

        fetchCompanies();

    }, [navigate]);


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-lg">
                    Loading companies...
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
                        onClick={fetchCompanies}
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
                        All Companies
                    </h1>

                    <p className="text-gray-600 mt-1">
                        View companies registered for campus placements
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
                    Total Companies
                </p>

                <p className="text-2xl font-bold">
                    {companies.length}
                </p>

            </div>


            {/* COMPANIES */}

            {companies.length === 0 ? (

                <div className="bg-white rounded-lg shadow p-6 text-center">

                    <p className="text-gray-500">
                        No companies found.
                    </p>

                </div>

            ) : (

                <div className="bg-white rounded-lg shadow overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="px-6 py-3">
                                    Company
                                </th>

                                <th className="px-6 py-3">
                                    Location
                                </th>

                                <th className="px-6 py-3">
                                    Industry
                                </th>

                                <th className="px-6 py-3">
                                    Recruiter
                                </th>

                                <th className="px-6 py-3">
                                    Recruiter Email
                                </th>

                                <th className="px-6 py-3">
                                    Approval Status
                                </th>

                                <th className="px-6 py-3">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {companies.map((company) => (

                                <tr
                                    key={company._id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-4 font-medium">
                                        {company.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.location || "N/A"}
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.industry || "N/A"}
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.createdBy?.name || "N/A"}
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.createdBy?.email || "N/A"}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span
                                            className={
                                                company.approvalStatus === "approved"
                                                    ? "text-green-600 font-semibold"
                                                    : company.approvalStatus === "rejected"
                                                        ? "text-red-600 font-semibold"
                                                        : "text-yellow-600 font-semibold"
                                            }
                                        >
                                            {company.approvalStatus || "pending"}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4">

                                        {company.approvalStatus === "pending" ? (

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        updateApprovalStatus(
                                                            company._id,
                                                            "approved"
                                                        )
                                                    }
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        updateApprovalStatus(
                                                            company._id,
                                                            "rejected"
                                                        )
                                                    }
                                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>

                                            </div>

                                        ) : (

                                            <span className="text-gray-500">
                                                No Action
                                            </span>

                                        )}

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

export default OfficerCompanies;