import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function AdminPanel() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');
            setBookings(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const markAsCompleted = async (id) => {
        try {
            const res = await fetch(`http://3.144.195.215:4000/api/admin/bookings/${id}/complete`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                fetchBookings(); // refresh list
            } else {
                alert('Failed to update booking');
            }
        } catch (err) {
            alert('Error updating booking');
        }
    };

    const groupByDate = () => {
        const grouped = {};
        bookings.forEach(b => {
            const date = b.date;
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(b);
        });
        return grouped;
    };

    const groupedBookings = groupByDate();

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h2>Admin Panel – Nafi's Reflexology</h2>
            <button onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/admin/login';
            }}>
                Logout
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {Object.keys(groupedBookings).sort().map(date => (
                <div key={date}>
                    <h3>== {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ==</h3>
                    <ul>
                        {groupedBookings[date].map(b => (
                            <li key={b.id} style={{ marginBottom: '0.5rem' }}>
                                <strong>{b.name}</strong> – {b.time}
                                <br />
                                Phone: {b.phone}
                                <br />
                                Status: {b.completed ? '✅ Completed' : '🕒 Pending'}
                                {!b.completed && (
                                    <button onClick={() => markAsCompleted(b.id)}>Mark as Completed</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default AdminPanel;
