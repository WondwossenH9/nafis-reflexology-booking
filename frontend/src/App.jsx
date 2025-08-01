import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:4000/api/status')
      .then(res => res.json())
      .then(data => {
        setStatus(`Server is ${data.status} at ${new Date(data.timestamp).toLocaleTimeString()}`);
      })
      .catch(() => setStatus('Failed to connect to backend.'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Nafi's Reflexology</h1>
      <p>Welcome! Book your relaxing feet massage session here.</p>
      <p><strong>Backend Status:</strong> {status}</p>
    </div>
  );
}

export default App;

