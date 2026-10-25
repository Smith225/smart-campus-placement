import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function RecruiterApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [showInterviewForm, setShowInterviewForm] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [interviewData, setInterviewData] = useState({
        scheduledAt: "",
        mode: "online",
        meetingLink: "",
        location: "",
        notes: ""
    });

    const [scheduling, setScheduling] = useState(false);
    const [scheduledInterviewIds, setScheduledInterviewIds] = useState([]);

    useEffect(() => {
        fetchApplications();
        fetchScheduledInterviews();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await apiRequest("/applications/recruiter");

            setApplications(data.applications);
        } catch (error) {
            console.error("Fetch applications error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchScheduledInterviews = async () => {
        try {
            const data = await apiRequest(
                "/interviews/recruiter"
            );

            const applicationIds = data.interviews.map(
                (interview) =>
                    interview.application?._id
            );

            setScheduledInterviewIds(applicationIds);

        } catch (error) {
            console.error(
                "Fetch scheduled interviews error:",
                error
            );
        }
    };

    const updateStatus = async (applicationId, status) => {
        setMessage("");
        setError("");

        try {
            setUpdatingId(applicationId);

            const data = await apiRequest(
                `/applications/${applicationId}/status`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        status
                    })
                }
            );

            setMessage(data.message);

            // Refresh applications
            await fetchApplications();

        } catch (error) {
            console.error("Update status error:", error);
            setError(error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const openInterviewForm = (application) => {
        setSelectedApplication(application);

        setInterviewData({
            scheduledAt: "",
            mode: "online",
            meetingLink: "",
            location: "",
            notes: ""
        });

        setShowInterviewForm(true);

        setMessage("");
        setError("");
    };

    const scheduleInterview = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            setScheduling(true);

            const data = await apiRequest(
                "/interviews",
                {
                    method: "POST",
                    body: JSON.stringify({
                        applicationId: selectedApplication._id,
                        scheduledAt: interviewData.scheduledAt,
                        mode: interviewData.mode,
                        meetingLink:
                            interviewData.mode === "online"
                                ? interviewData.meetingLink
                                : "",
                        location:
                            interviewData.mode === "offline"
                                ? interviewData.location
                                : "",
                        notes: interviewData.notes
                    })
                }
            );

            setMessage(data.message);

            setShowInterviewForm(false);
            setSelectedApplication(null);

            setInterviewData({
                scheduledAt: "",
                mode: "online",
                meetingLink: "",
                location: "",
                notes: ""
            });
            await fetchScheduledInterviews();

        } catch (error) {
            console.error(
                "Schedule interview error:",
                error
            );

            setError(error.message);
        } finally {
            setScheduling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">
                    Loading applications...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-6">
                    Student Applications
                </h1>

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

                {showInterviewForm && selectedApplication && (
                    <div className="bg-white p-6 rounded-lg shadow mb-6">

                        <h2 className="text-2xl font-semibold mb-4">
                            Schedule Interview
                        </h2>

                        <div className="bg-gray-50 p-4 rounded mb-5">
                            <p>
                                <strong>Student:</strong>{" "}
                                {selectedApplication.student?.name}
                            </p>

                            <p>
                                <strong>Job:</strong>{" "}
                                {selectedApplication.job?.title}
                            </p>

                            <p>
                                <strong>Company:</strong>{" "}
                                {selectedApplication.job?.company?.name}
                            </p>
                        </div>

                        <form
                            onSubmit={scheduleInterview}
                            className="space-y-4"
                        >

                            <div>
                                <label className="block font-medium mb-1">
                                    Interview Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    value={interviewData.scheduledAt}
                                    onChange={(e) =>
                                        setInterviewData({
                                            ...interviewData,
                                            scheduledAt: e.target.value
                                        })
                                    }
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>


                            <div>
                                <label className="block font-medium mb-1">
                                    Interview Mode
                                </label>

                                <select
                                    value={interviewData.mode}
                                    onChange={(e) =>
                                        setInterviewData({
                                            ...interviewData,
                                            mode: e.target.value,
                                            meetingLink: "",
                                            location: ""
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="online">
                                        Online
                                    </option>

                                    <option value="offline">
                                        Offline
                                    </option>
                                </select>
                            </div>


                            {interviewData.mode === "online" && (
                                <div>
                                    <label className="block font-medium mb-1">
                                        Meeting Link
                                    </label>

                                    <input
                                        type="url"
                                        value={interviewData.meetingLink}
                                        onChange={(e) =>
                                            setInterviewData({
                                                ...interviewData,
                                                meetingLink: e.target.value
                                            })
                                        }
                                        placeholder="https://meet.google.com/..."
                                        required
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            )}


                            {interviewData.mode === "offline" && (
                                <div>
                                    <label className="block font-medium mb-1">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        value={interviewData.location}
                                        onChange={(e) =>
                                            setInterviewData({
                                                ...interviewData,
                                                location: e.target.value
                                            })
                                        }
                                        placeholder="Interview location"
                                        required
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            )}


                            <div>
                                <label className="block font-medium mb-1">
                                    Notes
                                </label>

                                <textarea
                                    value={interviewData.notes}
                                    onChange={(e) =>
                                        setInterviewData({
                                            ...interviewData,
                                            notes: e.target.value
                                        })
                                    }
                                    placeholder="Additional interview instructions..."
                                    rows="4"
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>


                            <div className="flex gap-3">

                                <button
                                    type="submit"
                                    disabled={scheduling}
                                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                                >
                                    {scheduling
                                        ? "Scheduling..."
                                        : "Schedule Interview"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowInterviewForm(false);
                                        setSelectedApplication(null);
                                    }}
                                    className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>
                )}
                {applications.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600">
                            No applications received yet.
                        </p>
                    </div>
                ) : (

                    <div className="space-y-6">

                        {applications.map((application) => (

                            <div
                                key={application._id}
                                className="bg-white p-6 rounded-lg shadow"
                            >

                                {/* Student Information */}
                                <div className="mb-4">

                                    <h2 className="text-xl font-semibold">
                                        {application.student?.name}
                                    </h2>

                                    <p className="text-gray-600">
                                        {application.student?.email}
                                    </p>

                                </div>


                                {/* Job Information */}
                                <div className="border-t pt-4">

                                    <p>
                                        <strong>Job:</strong>{" "}
                                        {application.job?.title}
                                    </p>

                                    <p>
                                        <strong>Company:</strong>{" "}
                                        {application.job?.company?.name}
                                    </p>

                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {application.job?.company?.location ||
                                            application.job?.location ||
                                            "Not specified"}
                                    </p>

                                </div>


                                {/* Application Status */}
                                <div className="mt-4">

                                    <p>
                                        <strong>Status:</strong>{" "}

                                        <span
                                            className={`px-3 py-1 rounded text-sm ${application.status === "applied"
                                                ? "bg-blue-100 text-blue-700"
                                                : application.status === "shortlisted"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : application.status === "selected"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {application.status}
                                        </span>

                                    </p>

                                </div>


                                {/* Resume */}
                                {application.student?.resume && (
                                    <div className="mt-4">

                                        <a
                                            href={`http://localhost:5000/uploads/resumes/${application.student.resume}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800"
                                        >
                                            View Resume
                                        </a>

                                    </div>
                                )}


                                {/* Status Buttons */}
                                <div className="mt-5 flex flex-wrap gap-3">

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "shortlisted"
                                            )
                                        }
                                        disabled={
                                            updatingId === application._id
                                        }
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400"
                                    >
                                        Shortlist
                                    </button>


                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "rejected"
                                            )
                                        }
                                        disabled={
                                            updatingId === application._id
                                        }
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                                    >
                                        Reject
                                    </button>


                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "selected"
                                            )
                                        }
                                        disabled={
                                            updatingId === application._id
                                        }
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                                    >
                                        Select
                                    </button>
                                    {application.status === "selected" ? (
                                        <button
                                            disabled
                                            className="bg-green-600 text-white px-4 py-2 rounded cursor-not-allowed"
                                        >
                                            Selected
                                        </button>
                                    ) : application.status === "rejected" ? (
                                        <button
                                            disabled
                                            className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed"
                                        >
                                            Rejected
                                        </button>
                                    ) : application.status === "shortlisted" &&
                                        scheduledInterviewIds.includes(application._id) ? (
                                        <button
                                            disabled
                                            className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                                        >
                                            Interview Scheduled
                                        </button>
                                    ) : application.status === "shortlisted" ? (
                                        <button
                                            onClick={() =>
                                                openInterviewForm(application)
                                            }
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Schedule Interview
                                        </button>
                                    ) : null}
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default RecruiterApplications;