import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function RecruiterCompanies() {
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        industry: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchCompanies = async () => {
        try {
            const response = await apiRequest("/companies/my");

            setCompanies(response.companies || []);
        } catch (error) {
            console.error(error);
            setError(error.message || "Unable to load companies");
        }
    };

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user || user.role !== "recruiter") {
            navigate("/login");
            return;
        }

        fetchCompanies();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await apiRequest(
                "/companies",
                {
                    method: "POST",
                    body: JSON.stringify(formData)
                }
            );

            setMessage(
                response.message || "Company created successfully"
            );

            setFormData({
                name: "",
                description: "",
                website: "",
                location: "",
                industry: ""
            });

            fetchCompanies();

        } catch (error) {
            console.error(error);

            setError(
                error.message || "Failed to create company"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-5xl mx-auto">

                {/* Header */}

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            My Companies
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Create and manage your companies
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/recruiter")}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </button>

                </div>


                {/* Create Company Form */}

                <div className="bg-white rounded-lg shadow p-6 mb-8">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Create Company
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Company Name */}

                            <div>
                                <label className="block text-gray-700 mb-1">
                                    Company Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="Enter company name"
                                />
                            </div>


                            {/* Industry */}

                            <div>
                                <label className="block text-gray-700 mb-1">
                                    Industry
                                </label>

                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g. Software, Finance"
                                />
                            </div>


                            {/* Website */}

                            <div>
                                <label className="block text-gray-700 mb-1">
                                    Website
                                </label>

                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="https://example.com"
                                />
                            </div>


                            {/* Location */}

                            <div>
                                <label className="block text-gray-700 mb-1">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g. Mumbai, India"
                                />
                            </div>

                        </div>


                        {/* Description */}

                        <div className="mt-4">

                            <label className="block text-gray-700 mb-1">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Enter company description"
                            />

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-5 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Company"}
                        </button>

                    </form>

                </div>


                {/* Existing Companies */}

                <div className="bg-white rounded-lg shadow p-6">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        My Companies
                    </h2>

                    {companies.length === 0 ? (

                        <p className="text-gray-500">
                            No companies created yet.
                        </p>

                    ) : (

                        <div className="space-y-4">

                            {companies.map((company) => (

                                <div
                                    key={company._id}
                                    className="border rounded-lg p-4"
                                >

                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">

                                        <div>

                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {company.name}
                                            </h3>

                                            <p className="text-gray-500">
                                                {company.industry || "Industry not specified"}
                                            </p>

                                            <p className="text-gray-500">
                                                {company.location || "Location not specified"}
                                            </p>

                                        </div>


                                        <div>

                                            <span
                                                className={`px-3 py-1 rounded text-sm font-medium ${
                                                    company.approvalStatus === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : company.approvalStatus === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {company.approvalStatus
                                                    ? company.approvalStatus.toUpperCase()
                                                    : "PENDING"}
                                            </span>

                                        </div>

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

export default RecruiterCompanies;