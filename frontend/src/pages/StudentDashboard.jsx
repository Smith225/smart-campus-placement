import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function StudentDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div>
            <h1>Student Dashboard</h1>

            <Link
                to="/student-jobs"
                className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
            >
                View Available Jobs
            </Link>

            <Link
                to="/student-applications"
                className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
            >
                My Applications
            </Link>

            <button
                onClick={() => navigate("/student-profile")}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                My Profile
            </button>

            <Link
                to="/student-interviews"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                My Interviews
            </Link>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default StudentDashboard;