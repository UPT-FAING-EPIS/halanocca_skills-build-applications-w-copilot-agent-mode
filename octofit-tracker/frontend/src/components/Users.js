import { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Fetching users from:', endpoint);

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Users data:', data);
        setUsers(Array.isArray(data) ? data : data.results || []);
      })
      .catch((error) => console.error('Failed to fetch users:', error));
  }, []);

  return <pre>{JSON.stringify(users, null, 2)}</pre>;
};

export default Users;
