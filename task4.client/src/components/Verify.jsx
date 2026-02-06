import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Verify() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Verifying...");

    // 1. FIX: Force empty string for relative paths in wwwroot.
    // This prevents the "/api/api/..." double path error.
    const API_URL = "";

    const verifyUser = useCallback(async () => {
        const email = searchParams.get('email');

        if (!email) {
            setStatus("Invalid link: No email provided.");
            return;
        }

        try {
            // 2. FIX: Ensure single "/api" and match likely Controller casing
            // Note: Verify logic is usually a POST, but if your backend expects GET, 
            // you might see 405. If this is standard Identity logic, POST is correct.
            const response = await fetch(`${API_URL}/api/Auth/verify?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setStatus("Success! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                // Try to read error message if available
                const errorText = await response.text();
                console.error("Verification failed:", errorText);
                setStatus("Verification failed.");
            }
        } catch (error) {
            console.error(error);
            setStatus("Error connecting to server.");
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-5 shadow text-center">
                <h3>{status}</h3>
                {status.includes("Success") && <i className="bi bi-check-circle-fill text-success display-1 mt-3"></i>}
                {status.includes("failed") && <i className="bi bi-x-circle-fill text-danger display-1 mt-3"></i>}
            </div>
        </div>
    );
}

export default Verify;