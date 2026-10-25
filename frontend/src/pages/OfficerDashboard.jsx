import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function OfficerDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [statistics, setStatistics] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const [dashboardResponse, statisticsResponse] =
                await Promise.all([
                    apiRequest("/officer/dashboard"),
                    apiRequest("/officer/statistics")
                ]);

            setDashboard(dashboardResponse);
            setStatistics(statisticsResponse);

        } catch (error) {

            console.error(error);

            setError(
                error.message || "Unable to load dashboard"
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

        fetchDashboardData();

    }, [navigate]);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-lg">
                    Loading dashboard...
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
                        onClick={fetchDashboardData}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}

            <nav className="bg-white shadow px-6 py-4">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            Placement Officer Dashboard
                        </h1>

                        <p className="text-sm text-gray-500">
                            Smart Campus Placement Management Portal
                        </p>

                    </div>


                    <div className="flex gap-3">

                        <button
                            onClick={fetchDashboardData}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Refresh
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </nav>


            {/* Main Content */}

            <main className="p-6">

                {/* Overview */}

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Placement Overview
                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Students */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Total Students
                        </p>

                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {statistics?.students?.total || 0}
                        </p>

                    </div>


                    {/* Recruiters */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Total Recruiters
                        </p>

                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {dashboard?.recruiters || 0}
                        </p>

                    </div>


                    {/* Companies */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Total Companies
                        </p>

                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {dashboard?.companies || 0}
                        </p>

                    </div>


                    {/* Jobs */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Total Jobs
                        </p>

                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {statistics?.jobs?.total || 0}
                        </p>

                    </div>

                </div>


                {/* Application Statistics */}

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Application Statistics
                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Applications */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Total Applications
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {statistics?.applications?.total || 0}
                        </p>

                    </div>


                    {/* Shortlisted */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Shortlisted
                        </p>

                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                            {statistics?.applications?.shortlisted || 0}
                        </p>

                    </div>


                    {/* Selected */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Selected
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {statistics?.applications?.selected || 0}
                        </p>

                    </div>


                    {/* Rejected */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Rejected
                        </p>

                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {statistics?.applications?.rejected || 0}
                        </p>

                    </div>

                </div>


                {/* Placement & Interview */}

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Placement & Interview Statistics
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Placement Rate */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Placement Rate
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {statistics?.placement?.placementRate || 0}%
                        </p>

                    </div>


                    {/* Placed Students */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Placed Students
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {statistics?.students?.placed || 0}
                        </p>

                    </div>


                    {/* Interviews */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Total Interviews
                        </p>

                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {statistics?.interviews?.total || 0}
                        </p>

                    </div>


                </div>

                {/* Approval & Job Status */}

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Approval & Job Status
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5 mb-8 w-full">

                    {/* Approved Students */}

                    <div className="bg-white rounded-lg shadow p-5">

                        <p className="text-gray-500">
                            Approved Students
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {statistics?.students?.approved || 0}
                        </p>

                    </div>


                    {/* Pending Students */}

                    <div className="bg-white rounded-lg shadow p-5">

                        <p className="text-gray-500">
                            Pending Students
                        </p>

                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                            {statistics?.students?.pending || 0}
                        </p>

                    </div>


                    {/* Rejected Students */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Rejected Students
                        </p>

                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {statistics?.students?.rejected || 0}
                        </p>

                    </div>


                    {/* Approved Companies */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Approved Companies
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {statistics?.companies?.approved || 0}
                        </p>

                    </div>


                    {/* Pending Companies */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Pending Companies
                        </p>

                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                            {statistics?.companies?.pending || 0}
                        </p>

                    </div>


                    {/* Rejected Companies */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Rejected Companies
                        </p>

                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {statistics?.companies?.rejected || 0}
                        </p>

                    </div>


                    {/* Open Jobs */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Open Jobs
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {statistics?.jobs?.open || 0}
                        </p>

                    </div>


                    {/* Closed Jobs */}

                    <div className="bg-white rounded-lg shadow p-5 w-full">

                        <p className="text-gray-500">
                            Closed Jobs
                        </p>

                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {statistics?.jobs?.closed || 0}
                        </p>

                    </div>

                </div>



                {/* Quick Navigation */}

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Quick Navigation
                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <button
                        onClick={() => navigate("/officer/students")}
                        className="bg-white shadow rounded-lg p-5 text-left hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-lg">
                            Students
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            View all registered students
                        </p>
                    </button>


                    <button
                        onClick={() => navigate("/officer/recruiters")}
                        className="bg-white shadow rounded-lg p-5 text-left hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-lg">
                            Recruiters
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            View all recruiters
                        </p>
                    </button>


                    <button
                        onClick={() => navigate("/officer/companies")}
                        className="bg-white shadow rounded-lg p-5 text-left hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-lg">
                            Companies
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            View registered companies
                        </p>
                    </button>


                    <button
                        onClick={() => navigate("/officer/jobs")}
                        className="bg-white shadow rounded-lg p-5 text-left hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-lg">
                            Jobs
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            View all job openings
                        </p>
                    </button>


                    <button
                        onClick={() => navigate("/officer/applications")}
                        className="bg-white shadow rounded-lg p-5 text-left hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-lg">
                            Applications
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Monitor student applications
                        </p>
                    </button>


                    <button
                        onClick={() => navigate("/officer/interviews")}
                        className="bg-white shadow rounded-lg p-5 text-left hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-lg">
                            Interviews
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            View scheduled interviews
                        </p>
                    </button>

                </div>

            </main>

        </div>
    );
}

export default OfficerDashboard;