import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the authentication data (e.g., token, user info)
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.setItem("loggedIn", "false");

    // Redirect to the login page
    navigate("/login"); // Change this path if your login page is different
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Logging out...</h2>
        <p>Please wait while we log you out.</p>
      </div>
    </div>
  );
};

export default LogoutPage;






