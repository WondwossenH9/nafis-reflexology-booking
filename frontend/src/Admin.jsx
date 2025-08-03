import { useEffect, useState } from 'react';

function Admin() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('http://3.144.195.215:4000/api/admin/bookings', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (data.success === false) {
                    setError(data.error || 'Failed to fetch bookings');
                } else {
                    setBookings(data);
                }
            } catch (err) {
                setError('Error fetching bookings');
            }
        };

        fetchBookings();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Admin Panel – Nafi's Reflexology</h1>
            <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {bookings.length > 0 ? (
                <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Booked At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.id}>
                                <td>{b.id}</td>
                                <td>{b.name}</td>
                                <td>{b.phone}</td>
                                <td>{b.date}</td>
                                <td>{b.time}</td>
                                <td>{new Date(b.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !error && <p>No bookings found.</p>
            )}
        </div>
    );
}

export default Admin;
