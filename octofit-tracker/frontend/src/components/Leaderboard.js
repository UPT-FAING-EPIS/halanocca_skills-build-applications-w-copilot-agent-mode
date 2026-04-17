import { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const endpoint = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
      : 'http://localhost:8000/api/leaderboard/';
    console.log('Fetching leaderboard from:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard data:', data);
        setLeaderboard(Array.isArray(data) ? data : data.results || []);
      })
      .catch((error) => console.error('Failed to fetch leaderboard:', error));
  }, []);

  return <pre>{JSON.stringify(leaderboard, null, 2)}</pre>;
};

export default Leaderboard;
