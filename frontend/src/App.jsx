import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentProfile from "./pages/StudentProfile";
import StudentJobs from "./pages/StudentJobs";
import StudentDashboard from "./pages/StudentDashboard";
import StudentApplications from "./pages/StudentApplications";
import StudentInterviews from "./pages/StudentInterviews";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import RecruiterApplications from "./pages/RecruiterApplications";
import RecruiterInterviews from "./pages/RecruiterInterviews";
import RecruiterCompanies from "./pages/RecruiterCompanies";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerStudents from "./pages/OfficerStudents";
import OfficerRecruiters from "./pages/OfficerRecruiters";
import OfficerCompanies from "./pages/OfficerCompanies";
import OfficerJobs from "./pages/OfficerJobs";
import OfficerApplications from "./pages/OfficerApplications";
import OfficerInterviews from "./pages/OfficerInterviews";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Student Route */}

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student-profile"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student-jobs"
                    element={<StudentJobs />}
                />

                <Route
                    path="/student-applications"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student-interviews"
                    element={<StudentInterviews />}
                />


                {/* Recruiter Route */}

                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute allowedRole="recruiter">
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter-jobs"
                    element={<RecruiterJobs />}
                />


                <Route
                    path="/recruiter-applications"
                    element={<RecruiterApplications />}
                />

                <Route
                    path="/recruiter-interviews"
                    element={<RecruiterInterviews />}
                />

                <Route
                    path="/recruiter-companies"
                    element={
                        <ProtectedRoute allowedRole="recruiter">
                            <RecruiterCompanies />
                        </ProtectedRoute>
                    }
                />

                {/* Placement Officer Route */}

                <Route
                    path="/officer"
                    element={
                        <ProtectedRoute allowedRole="officer">
                            <OfficerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/officer/students"
                    element={<OfficerStudents />}
                />

                <Route
                    path="/officer/recruiters"
                    element={<OfficerRecruiters />}
                />

                <Route
                    path="/officer/companies"
                    element={<OfficerCompanies />}
                />

                <Route
                    path="/officer/jobs"
                    element={<OfficerJobs />}
                />

                <Route
                    path="/officer/applications"
                    element={<OfficerApplications />}
                />

                <Route
                    path="/officer/interviews"
                    element={<OfficerInterviews />}
                />


            </Routes>
        </BrowserRouter>
    );
}

export default App;