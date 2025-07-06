import { useEffect, useState } from 'react';

const candidates = [
  { id: 'candidateA', name: 'Lionel Messi', image: 'https://assets.goal.com/images/v3/bltd58c4d60ecd9275e/GOAL_-_Blank_WEB_-_Facebook_-_2023-06-13T135350.847.png?auto=webp&format=pjpg&width=3840&quality=60' },
  { id: 'candidateB', name: 'Cristiano Ronaldo', image: 'https://cdn1-production-images-kly.akamaized.net/EE_t7V6EElzm3XO9ayspeiqNpHs=/1200x1200/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4256932/original/047386200_1670720138-Momen_Pilu_Cristiano_Ronaldo_Menangis_di_Lapangan-AP__7_.jpg' },
  { id: 'candidateC', name: 'Neymar Jr', image: 'https://assets.goal.com/images/v3/blta48e3bbb2f5a960f/GettyImages-1446977379.jpg?auto=webp&format=pjpg&width=3840&quality=60' }
];

function App() {
  const [votes, setVotes] = useState({});
  const [selected, setSelected] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/votes')
      .then(res => res.json())
      .then(data => setVotes(data));
  }, []);

  const vote = async () => {
    if (!selected) return;
    await fetch('http://localhost:5000/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate: selected })
    });
    const res = await fetch('http://localhost:5000/votes');
    const data = await res.json();
    setVotes(data);
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("https://wallpapercave.com/wp/wp2599594.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{ width: 700 }}>
        <div className="window">
          <div className="title-bar">
            <div className="title-bar-text">Voting App</div>
            <div className="title-bar-controls">
              <button aria-label="Close"></button>
            </div>
          </div>
          <div className="window-body">
            <p><strong>who is the real GOAT?:</strong></p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              {candidates.map(c => (
                <label key={c.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  border: selected === c.id ? '2px solid blue' : '1px solid gray',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '30%'
                }}>
                  <img
                    src={c.image}
                    alt={c.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px' }}
                  />
                  <span style={{ marginBottom: '5px' }}>{c.name}</span>
                  <input
                    type="radio"
                    name="candidate"
                    value={c.id}
                    checked={selected === c.id}
                    onChange={(e) => setSelected(e.target.value)}
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={vote}
              disabled={!selected}
              style={{
                backgroundColor: '#0078D7',
                color: 'white',
                padding: '6px 20px',
                border: 'none',
                fontWeight: 'bold',
                cursor: selected ? 'pointer' : 'not-allowed',
                marginBottom: '1rem'
              }}
            >
              Vote
            </button>
            <hr />
            <p><strong>Voting Results:</strong></p>
            <ul>
              {Object.entries(votes).map(([key, value]) => (
                <li key={key}>{key}: {value} suara</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
