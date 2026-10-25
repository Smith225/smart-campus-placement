import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function RecruiterInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const data = await apiRequest(
                "/interviews/recruiter"
            );

            setInterviews(data.interviews);
        } catch (error) {
            console.error(
                "Fetch interviews error:",
                error
            );

            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (interviewId, status) => {
        try {
            setError("");

            await apiRequest(
                `/interviews/${interviewId}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        status
                    })
                }
            );

            // Refresh interviews after updating status
            await fetchInterviews();

        } catch (error) {
            console.error(
                "Update interview status error:",
                error
            );

            setError(
                error.message ||
                "Failed to update interview status"
            );
        }
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">
                    Loading interviews...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-6">
                    Interview Management
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {interviews.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600">
                            No interviews scheduled yet.
                        </p>
                    </div>
                ) : (

                    <div className="space-y-6">

                        {interviews.map((interview) => (

                            <div
                                key={interview._id}
                                className="bg-white p-6 rounded-lg shadow"
                            >

                                <h2 className="text-xl font-semibold mb-2">
                                    {interview.application?.student?.name}
                                </h2>

                                <p className="text-gray-600 mb-4">
                                    {interview.application?.student?.email}
                                </p>

                                <div className="border-t pt-4 space-y-2">

                                    <p>
                                        <strong>Job:</strong>{" "}
                                        {interview.application?.job?.title}
                                    </p>

                                    <p>
                                        <strong>Company:</strong>{" "}
                                        {
                                            interview.application?.job
                                                ?.company?.name
                                        }
                                    </p>

                                    <p>
                                        <strong>Date & Time:</strong>{" "}
                                        {formatDateTime(
                                            interview.scheduledAt
                                        )}
                                    </p>

                                    <p>
                                        <strong>Mode:</strong>{" "}
                                        <span className="capitalize">
                                            {interview.mode}
                                        </span>
                                    </p>

                                    {interview.mode === "online" &&
                                        interview.meetingLink && (
                                            <p>
                                                <strong>
                                                    Meeting Link:
                                                </strong>{" "}
                                                <a
                                                    href={
                                                        interview.meetingLink
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Join Meeting
                                                </a>
                                            </p>
                                        )}

                                    {interview.mode === "offline" &&
                                        interview.location && (
                                            <p>
                                                <strong>
                                                    Location:
                                                </strong>{" "}
                                                {interview.location}
                                            </p>
                                        )}

                                    {interview.notes && (
                                        <p>
                                            <strong>Notes:</strong>{" "}
                                            {interview.notes}
                                        </p>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                                        <p>
                                            <strong>Status:</strong>{" "}

                                            <span
                                                className={`px-3 py-1 rounded text-sm capitalize ${interview.status === "scheduled"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : interview.status === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {interview.status}
                                            </span>
                                        </p>


                                        {/* Status Actions */}

                                        {interview.status === "scheduled" && (
                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            interview._id,
                                                            "completed"
                                                        )
                                                    }
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    Mark Completed
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            interview._id,
                                                            "cancelled"
                                                        )
                                                    }
                                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                >
                                                    Cancel Interview
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default RecruiterInterviews;