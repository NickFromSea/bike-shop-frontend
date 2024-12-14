import React from "react";
import "./App.css";
import BikeList from "./BikeList";
import LoginBtn from "./Components/LoginBtn";
import HomePage from "./Components/HomePage";


function App() {
 return (
  <div className="App">

<HomePage/>
   <LoginBtn />

   <BikeList />

  </div>
 );
}

export default App;
