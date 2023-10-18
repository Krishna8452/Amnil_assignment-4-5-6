
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDetails = ({ token }) => {
   const [userData, setUserData] = useState(null);
  console.log(token, "t");

  useEffect(() => {
    if (token) {
      createUser(token);
    }
  }, [token]);

  const createUser = async (token) => {
    axios.post('http://localhost:5000/users/auth/register', { token })
      .then((response) => {
        setUserData(response.data);
        console.log(response.data,'res')
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };
console.log(userData,'df')
  return (
    <div>
    <h1>User Data</h1>
    {userData ? (
      <div>
        <p>UID: {userData.uid}</p>
        <p>Name: {userData.displayName}</p>
        <p>Email: {userData.email}</p>
      </div>
    ) : (
      <p>Loading user data...</p>
    )}
  </div>
  );
};

export default UserDetails;
