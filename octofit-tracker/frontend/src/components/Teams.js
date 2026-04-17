import { useEffect, useState } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Fetching teams from:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Teams data:', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
      })
      .catch((error) => console.error('Failed to fetch teams:', error));
  }, []);

  return <pre>{JSON.stringify(teams, null, 2)}</pre>;
};

export default Teams;
