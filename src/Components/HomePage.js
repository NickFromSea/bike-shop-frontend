import "../App.css";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import picBikeStock from"../resources/13716.jpg"

const HomePage = ()=>{
    const {isAuthenticated } = useAuth0();
    return (
     !isAuthenticated && (
      <div>
       <h3 className="main-page-header">
        Welcome to the Motorcycle Sales Management System!
       </h3>
       <div className="main-page-body">
        <img src={picBikeStock} alt="bike stock" className="picBikeStock" />
        <p className="main-page-text">
         Manage inventory, track sales, and update model information — all in
         one place. Our interface allows you to quickly and easily update data,
         improving work efficiency and ensuring a high level of customer
         service.
        </p>
       </div>
      </div>
     )
    );
}

export default HomePage;