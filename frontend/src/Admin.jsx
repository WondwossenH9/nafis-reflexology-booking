import { useState, useEffect } from 'react';

const API = 'http://3.15.33.227:4000'; // replace if IP changes

export default function Admin() {
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                setToken(data.token);
                setPassword('');
                setMessage('');
                fetchBookings(data.token);
            } else {
                setMessage(data.error || 'Login failed');
            }
        } catch (err) {
            setMessage('Network error');
        }
    };

    const fetchBookings = async (jwt) => {
        try {
            const res = await fetch(`${API}/api/bookings`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            setMessage('Failed to load bookings');
        }
    };

    useEffect(() => {
        if (token) fetchBookings(token);
    }, [token]);

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken('');
        setBookings([]);
    };

    if (!token) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Login</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Admin Dashboard</h2>
            <button onClick={logout}>Logout</button>
            <h3>All Bookings</h3>
            <ul>
                {bookings.map((b) => (
                    <li key={b.id}>
                        {b.name} - {b.phone} - {b.date} at {b.time}
                    </li>
                ))}
            </ul>
        </div>
    );
}
