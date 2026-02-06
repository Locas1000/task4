import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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

            // FIX: Used Backticks (`) instead of Single Quotes (')
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');

            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg overflow-hidden border-0" style={{ maxWidth: '900px', width: '100%' }}>
                <div className="row g-0">

                    <div className="col-md-6 d-none d-md-block">
                        <img
                            src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop"
                            alt="Register Visual"
                            className="img-fluid h-100 w-100"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>

                    <div className="col-md-6 p-5 bg-white d-flex flex-column justify-content-center">
                        <h2 className="fw-bold text-success mb-2">Create Account</h2>
                        <p className="text-muted mb-4">Start your journey with us today.</p>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-muted">FULL NAME</label>
                                <input type="text" className="form-control form-control-lg bg-light border-0" name="name" onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-muted">EMAIL</label>
                                <input type="email" className="form-control form-control-lg bg-light border-0" name="email" onChange={handleChange} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-muted">PASSWORD</label>
                                <input type="password" className="form-control form-control-lg bg-light border-0" name="password" onChange={handleChange} required />
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-success btn-lg fw-bold">Sign Up</button>
                            </div>
                        </form>

                        <div className="text-center mt-4">
                            <span className="text-muted small">Already have an account? </span>
                            <Link to="/login" className="fw-bold text-decoration-none">Sign In</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Register;