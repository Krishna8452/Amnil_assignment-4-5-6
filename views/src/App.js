import React from "react";
import Signin from "./pages/Signin";
import Header from "./Shared/Header";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return <>
      <Header/>
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/signin" element={<Signin/>} />
     </Routes>
     </>  
}
export default App;
