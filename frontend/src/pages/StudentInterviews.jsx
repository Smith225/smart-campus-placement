import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function StudentInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const data = await apiRequest(
                "/interviews/student"
            );

            setInterviews(data.interviews);
        } catch (error) {
            console.error(
                "Fetch student interviews error:",
                error
            );

            setError(error.message);
        } finally {
            setLoading(false);
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

            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-6">
                    My Interviews
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

                                <div className="mb-4">

                                    <h2 className="text-xl font-semibold">
                                        {interview.application?.job?.title}
                                    </h2>

                                    <p className="text-gray-600">
                                        {interview.application?.job?.company?.name}
                                    </p>

                                </div>

                                <div className="border-t pt-4 space-y-3">

                                    <p>
                                        <strong>
                                            Date & Time:
                                        </strong>{" "}
                                        {formatDateTime(
                                            interview.scheduledAt
                                        )}
                                    </p>

                                    <p>
                                        <strong>
                                            Mode:
                                        </strong>{" "}
                                        <span className="capitalize">
                                            {interview.mode}
                                        </span>
                                    </p>

                                    {interview.mode === "online" &&
                                        interview.meetingLink && (
                                            <div>
                                                <strong>
                                                    Meeting Link:
                                                </strong>{" "}

                                                <a
                                                    href={
                                                        interview.meetingLink
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline ml-1"
                                                >
                                                    Join Interview
                                                </a>
                                            </div>
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
                                        <div>
                                            <strong>
                                                Instructions / Notes:
                                            </strong>

                                            <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded">
                                                {interview.notes}
                                            </p>
                                        </div>
                                    )}

                                    <p>
                                        <strong>
                                            Interview Status:
                                        </strong>{" "}

                                        <span className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-700 capitalize">
                                            {interview.status}
                                        </span>
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default StudentInterviews;