import React, { useEffect} from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user!= null) {
      navigate("/home");
    }
  },[]);

  return <>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          textAlign:'center',
          alignItems:'center'
        }}
      >
        <h1>Google Sign In</h1>
        <div>
          <GoogleButton onClick={handleGoogleSignIn} />
        </div>
      </div>
    </>
};

export default Signin;
