import { AppBar, IconButton, Toolbar, Box, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import { UserAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import {  } from 'react-router-dom';

export default function Header(){  
    const navigate = useNavigate()
    const { user, logOut } = UserAuth();
    const handleSignOut = async () =>{
      try {
        await logOut()
        localStorage.clear('token')
        navigate('/signin')
      }catch (error) {
        console.log(error)
      }
    }
    return (
    <AppBar position ="sticky" sx={styles.AppBar}> 
        <Toolbar>
            <Box>
                <Typography sx={styles.appLogo}>
                    List of User
                </Typography>
            </Box>

            <Box sx={{flexGrow:1}}/>
            { user ? (<IconButton onClick={handleSignOut} title='Logout'>
                <LogoutIcon/>
            </IconButton>) :(<Link to='/signin'> <LoginIcon/></Link> )}

        </Toolbar>
    </AppBar>)
}

    /** @type {import("@mui/material").SxProps} */
    const styles = {
        AppBar:{
            bgcolor:'#846bff',
            height:"4.5rem",
            justifyContent:'center'
        }
    }


