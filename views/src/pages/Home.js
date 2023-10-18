import {React, useEffect, useState} from 'react'
import UserDetails from './UserDetails'
const Home = () => {
  const [userToken, setUserToken] = useState('')
  useEffect(()=>{
    const credential = localStorage.getItem('token')
    setUserToken(credential)
  },[])
  return (
    <div>
      <UserDetails token = {userToken}/>
    </div>
  )
}

export default Home