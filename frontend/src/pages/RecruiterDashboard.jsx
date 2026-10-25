import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function RecruiterDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div>
            <h1>Recruiter Dashboard</h1>

            <Link
                to="/recruiter-companies"
                className="bg-purple-600 text-white px-5 py-3 rounded hover:bg-purple-700"
            >
                Manage Companies
            </Link>

            <Link
                to="/recruiter-jobs"
                className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
            >
                Manage Job Openings
            </Link>

            <Link
                to="/recruiter-applications"
                className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700"
            >
                View Applications
            </Link>

            <Link to="/recruiter-interviews">
                Interview Management
            </Link>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default RecruiterDashboard;