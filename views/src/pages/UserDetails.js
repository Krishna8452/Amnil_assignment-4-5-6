
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserAuth } from '../context/AuthContext';

const UserDetails = ({ token }) => {
  const {user} = UserAuth()
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
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };
console.log(user,'df')
  return (
    <div>
    <h1>User Data</h1>
    {userData ? (
      <div>
        <p>UID: {user.uid}</p>
        <p>Name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <p>Token: {user.accessToken}</p>
      </div>
    ) : (
      <p>Loading user data...</p>
    )}
  </div>
  );
};

export default UserDetails;
