import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BookingForm() {
    const [status, setStatus] = useState('Loading...');
    const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' });
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch('http://3.144.195.215:4000/api/status')
            .then(res => res.json())
            .then(data => {
                setStatus(`Server is ${data.status} at ${new Date(data.timestamp).toLocaleTimeString()}`);
            })
            .catch(() => setStatus('Failed to connect to backend.'));
    }, []);

    const loadBookings = () => {
        fetch('http://3.144.195.215:4000/api/bookings')
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(() => setBookings([]));
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('http://3.144.195.215:4000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.success) {
                setMessage('Booking successful!');
                setForm({ name: '', phone: '', date: '', time: '' });
                loadBookings();
            } else {
                setMessage(data.error || 'Something went wrong.');
            }
        } catch (err) {
            setMessage('Error submitting booking.');
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Nafi's Reflexology</h1>
            <p><strong>Status:</strong> {status}</p>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <h2>Book an Appointment</h2>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
                <br />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />
                <br />
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
                <br />
                <input type="time" name="time" value={form.time} onChange={handleChange} required />
                <br />
                <button type="submit">Book Now</button>
            </form>

            {message && <p><strong>{message}</strong></p>}

            <h2>Recent Bookings</h2>
            <ul>
                {bookings.map(b => (
                    <li key={b.id}>
                        {b.name} booked for {b.date} at {b.time}
                    </li>
                ))}
            </ul>

            <br />
            <Link to="/admin/login">
                <button>Admin Login</button>
            </Link>
        </div>
    );
}

export default BookingForm;
