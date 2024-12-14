import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../App.css";

const LogoutBtn = () => {
 const { logout, isAuthenticated } = useAuth0();
 return (
  isAuthenticated && (
    <div>
   <button onClick={() => logout({logoutParams:{returnTo:window.location.origin}})} className="btnLogOut">Log out</button>

    </div>
  )
 );
};

export default LogoutBtn;
