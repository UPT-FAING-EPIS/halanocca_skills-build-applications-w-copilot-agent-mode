import { useEffect, useState } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Fetching workouts from:', endpoint);

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Workouts data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
      })
      .catch((error) => console.error('Failed to fetch workouts:', error));
  }, []);

  return <pre>{JSON.stringify(workouts, null, 2)}</pre>;
};

export default Workouts;
