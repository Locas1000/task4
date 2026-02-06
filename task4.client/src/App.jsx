import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserTable from './components/UserTable';
import Verify from './components/Verify';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/users" element={<UserTable />} />

                <Route path="/verify" element={<Verify />} />
            </Routes>
        </Router>
    );
}

export default App;