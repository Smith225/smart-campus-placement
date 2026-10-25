import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Sending registration data:", formData);

            const data = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            alert(data.message);
            navigate("/login");

        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="student">Student</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="officer">Placement Officer</option>
                </select>

                <button type="submit">
                    Register
                </button>

            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;