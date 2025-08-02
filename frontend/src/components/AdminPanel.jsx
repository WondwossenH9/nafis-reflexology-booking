import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loadBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://3.15.33.227:4000/api/admin/bookings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success && data.bookings) {
                setBookings(data.bookings);
            } else {
                throw new Error('Invalid token');
            }
        } catch (err) {
            setError('Invalid or expired token');
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h2>Admin Panel – Nafi's Reflexology</h2>
            <button onClick={handleLogout}>Logout</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!error && (
                <>
                    <h3>All Bookings</h3>
                    {bookings.length === 0 ? (
                        <p>No bookings found.</p>
                    ) : (
                        <ul>
                            {bookings.map((b) => (
                                <li key={b.id}>
                                    {b.name} – {b.date} at {b.time} – {b.phone}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminPanel;
