import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const navigate = useNavigate();

    // 1. FIX: Set to empty string for relative paths in wwwroot.
    // This prevents the "/api/api/users" double path error.
    const API_URL = "";

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate]);

    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');

            // 2. FIX: Use Capital 'U' for 'Users' to match C# Controller on Linux
            const targetUrl = `${API_URL}/api/Users`;

            const response = await fetch(targetUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Safety Check: Detect if server returned HTML (error) instead of JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                console.error("CRITICAL: Server returned HTML. Check route:", targetUrl);
                return;
            }

            if (response.status === 401) {
                logout();
                return;
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    }, [logout, API_URL]);


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        fetchUsers();
    }, [navigate, fetchUsers]);


    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleAction = async (action) => {
        if (selectedUsers.length === 0) return;

        const token = localStorage.getItem('token');

        // 3. FIX: Updated path to use Capital 'U'
        const response = await fetch(`${API_URL}/api/Users/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(selectedUsers)
        });

        if (response.status === 401) {
            logout();
            return;
        }

        await fetchUsers();
        setSelectedUsers([]);
    };

    const handleDeleteUnverified = async () => {
        const token = localStorage.getItem('token');

        // 4. FIX: Updated path to use Capital 'U'
        await fetch(`${API_URL}/api/Users/delete-unverified`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        await fetchUsers();
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-5">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#">Admin<span className="text-light opacity-75">Panel</span></a>
                    <div className="d-flex align-items-center text-white">
                        <span className="me-3">Hello, <strong>{currentUser?.name || 'User'}</strong></span>
                        <button onClick={logout} className="btn btn-light btn-sm fw-bold text-primary">
                            Logout <i className="bi bi-box-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="card shadow-sm">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold text-secondary">User Registry</h5>

                        <div className="btn-group shadow-sm">

                            <button className="btn btn-light text-secondary border" onClick={() => handleAction('unblock')} title="Unblock">
                                <i className="bi bi-unlock-fill"></i>
                            </button>

                            <button className="btn btn-light text-danger border" onClick={() => handleAction('block')}>
                                <i className="bi bi-lock-fill me-1"></i>
                            </button>

                            <button className="btn btn-light text-danger border" onClick={() => handleAction('delete')} title="Delete">
                                <i className="bi bi-trash-fill"></i>
                            </button>
                            <button className="btn btn-light text-warning border" onClick={handleDeleteUnverified} title="Delete Unverified">
                                <i className="bi bi-person-x-fill"></i>
                            </button>
                        </div>

                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4" style={{ width: '50px' }}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input cursor-pointer"
                                            onChange={handleSelectAll}
                                            checked={users.length > 0 && selectedUsers.length === users.length}
                                        />
                                    </th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Last Login</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className={user.status === 'Blocked' ? 'table-secondary text-muted' : ''}>
                                        <td className="ps-4">
                                            <input
                                                type="checkbox"
                                                className="form-check-input cursor-pointer"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                            />
                                        </td>
                                        <td className="fw-500">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="small text-secondary">{new Date(user.lastLoginTime).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserTable;