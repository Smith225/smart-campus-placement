import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function OfficerStudents() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // FETCH STUDENTS
    // =========================

    const fetchStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await apiRequest("/officer/students");

            setStudents(response.students || []);

        } catch (error) {

            console.error(error);

            setError(
                error.message || "Unable to load students"
            );

        } finally {

            setLoading(false);
        }
    };

    const updateApprovalStatus = async (studentId, approvalStatus) => {

        try {

            await apiRequest(
                `/officer/students/${studentId}/approval`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        approvalStatus
                    })
                }
            );

            fetchStudents();

        } catch (error) {

            console.error(error);

            alert(
                error.message || "Unable to update student status"
            );
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user || user.role !== "officer") {

            navigate("/login");

            return;
        }

        fetchStudents();

    }, [navigate]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-lg">
                    Loading students...
                </p>

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <p className="text-red-600 mb-4">
                        {error}
                    </p>

                    <button
                        onClick={fetchStudents}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        All Students
                    </h1>

                    <p className="text-gray-600 mt-1">
                        View registered student information
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
                    Total Students
                </p>

                <p className="text-2xl font-bold">
                    {students.length}
                </p>

            </div>


            {/* NO STUDENTS */}

            {students.length === 0 ? (

                <div className="bg-white rounded-lg shadow p-6 text-center">

                    <p className="text-gray-500">
                        No students found.
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

                                <th className="px-6 py-3">
                                    Approval Status
                                </th>

                                <th className="px-6 py-3">
                                    Action
                                </th>

                                <th className="px-6 py-3">
                                    Resume
                                </th>
                            </tr>

                        </thead>


                        <tbody>

                            {students.map((student) => (

                                <tr
                                    key={student._id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-4">
                                        {student.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {student.email}
                                    </td>

                                    <td className="px-6 py-4 capitalize">
                                        {student.role}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span
                                            className={
                                                student.approvalStatus === "approved"
                                                    ? "text-green-600 font-semibold"
                                                    : student.approvalStatus === "rejected"
                                                        ? "text-red-600 font-semibold"
                                                        : "text-yellow-600 font-semibold"
                                            }
                                        >
                                            {student.approvalStatus || "pending"}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4">

                                        {student.approvalStatus === "pending" ? (

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        updateApprovalStatus(
                                                            student._id,
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
                                                            student._id,
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

                                    <td className="px-6 py-4">

                                        {student.profile?.resume ? (

                                            <a
                                                href={`http://localhost:5000/uploads/resumes/${student.profile.resume}`}
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

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default OfficerStudents;