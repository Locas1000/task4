import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            console.log("Attempting login at:", `${API_URL}/auth/login`);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const text = await response.text();
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || `Server Error: ${response.status}`);
                } catch {
                    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/users');

        } catch (err) {
            console.error("Login Error Details:", err);
            setError(err.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg overflow-hidden border-0" style={{ maxWidth: '900px', width: '100%' }}>
                <div className="row g-0">

                    <div className="col-md-6 p-5 bg-white d-flex flex-column justify-content-center">
                        <h2 className="fw-bold text-primary mb-2">Task 4</h2>
                        <p className="text-muted mb-4">Welcome back! Please enter your details.</p>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-muted">EMAIL</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg bg-light border-0"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-muted">PASSWORD</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg bg-light border-0"
                                    name="password"
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary btn-lg fw-bold">Sign In</button>
                            </div>
                        </form>

                        <div className="text-center mt-4">
                            <span className="text-muted small">Don't have an account? </span>
                            <Link to="/register" className="fw-bold text-decoration-none">Sign up for free</Link>
                        </div>
                    </div>

                    <div className="col-md-6 d-none d-md-block">
                        <img
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                            alt="Login Visual"
                            className="img-fluid h-100 w-100 object-fit-cover"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
export default Login;