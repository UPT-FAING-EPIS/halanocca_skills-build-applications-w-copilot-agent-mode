import { useEffect, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Fetching activities from:', endpoint);

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Activities data:', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
      })
      .catch((error) => console.error('Failed to fetch activities:', error));
  }, []);

  return <pre>{JSON.stringify(activities, null, 2)}</pre>;
};

export default Activities;
