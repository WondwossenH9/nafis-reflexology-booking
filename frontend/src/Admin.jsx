import { useState, useEffect } from 'react';

function Admin() {
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');

    const isLoggedIn = !!token;

    const fetchBookings = async () => {
        try {
            const res = await fetch('http://3.15.33.227:4000/api/admin/bookings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                setBookings(data.bookings);
            } else {
                setMessage(data.error || 'Failed to fetch bookings.');
            }
        } catch (err) {
            setMessage('Error fetching bookings.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://3.15.33.227:4000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                setToken(data.token);
                setPassword('');
                setMessage('');
                fetchBookings();
            } else {
                setMessage(data.error || 'Login failed.');
            }
        } catch (err) {
            setMessage('Error during login.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken('');
        setBookings([]);
        setMessage('Logged out successfully.');
    };

    useEffect(() => {
        if (token) {
            fetchBookings();
        }
    }, [token]);

    if (!isLoggedIn) {
        return (
            <div>
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        value={password}
                        placeholder="Enter Admin Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        );
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <h3>All Bookings</h3>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {bookings.map((b) => (
                        <li key={b.id}>
                            <strong>{b.name}</strong> - {b.phone} - {b.date} @ {b.time}
                            <br />
                            <small>Booked on: {new Date(b.created_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default Admin;
