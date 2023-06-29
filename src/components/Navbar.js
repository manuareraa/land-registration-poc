import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex flex-row bg-custom-secondary justify-between">
      <div className="flex flex-row">
        <div
          className="text-md px-6 bg-custom-primary text-white py-2 cursor-pointer hover:bg-custom-secondary hover:text-black"
          onClick={() => {
            props.walletLogout();
            navigate("/");
          }}
        >
          Home
        </div>
        {props.appState.loggedIn === true ? (
          <div
            className="text-md px-6 bg-custom-primary text-white py-2 cursor-pointer hover:bg-custom-secondary hover:text-black"
            onClick={() => {
              if (props.appState.isAdmin === false && props.appState.loggedIn) {
                navigate("/dashboard");
              } else {
                navigate("/admin-dashboard");
              }
            }}
          >
            Dashboard
          </div>
        ) : null}
        {props.appState.loggedIn === true &&
        props.appState.isAdmin === false ? (
          <>
            <div
              className="text-md px-6 bg-custom-primary text-white py-2 cursor-pointer hover:bg-custom-secondary hover:text-black"
              onClick={() => {
                if (props.appState.isAdmin === false) {
                  navigate("/history");
                } else {
                  navigate("/ins-history");
                }
              }}
            >
              History
            </div>
            <div
              className="text-md px-6 bg-custom-primary text-white py-2 cursor-pointer hover:bg-custom-secondary hover:text-black"
              onClick={() => {
                navigate("/marketplace");
              }}
            >
              Marketplace
            </div>
          </>
        ) : null}

        <div className="text-md px-6 text-black py-2">
          {path === "/"
            ? "Please Login/Register"
            : path === "/dashboard"
            ? "User Dashboard"
            : path === "/track-product"
            ? "Track your donation"
            : path === "/register-org"
            ? "Register as an NGO/Govt."
            : path === "/driver-login"
            ? "Driver Login"
            : path === "/rider-dashboard"
            ? "Rider Dashboard"
            : path === "/driver-dashboard"
            ? "Driver Dashboard"
            : path === "/rider-ride"
            ? "Rider Ride"
            : path === "/driver-ride"}
        </div>
      </div>

      <div className="flex flex-row">
        {props.appState.loggedIn === true ? (
          <>
            <div
              className="text-md px-6 bg-custom-secondary  text-black py-2 "
              onClick={() => navigate("/")}
            >
              <b>Wallet:</b>{" "}
              {props.appState.account.slice(0, 8) +
                "..." +
                props.appState.account.slice(-4)}
            </div>
            <div
              className="text-md px-6 bg-custom-primary text-white py-2 cursor-pointer"
              onClick={() => props.walletLogout()}
            >
              Disconnect Wallet and Logout
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Navbar;
