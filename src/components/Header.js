import React from "react";

function Header(props) {
  return (
    <div className="flex flex-col items-center  py-8">
      <p className="text-custom-primary text-3xl">Land Registration PoC</p>
      {props.appState.loggedIn === true ? (
        <p className="text-custom-primary text-sm mt-2">
          {props.appState.isAdmin === true
            ? "Welcome Admin"
            : "Welcome Citizen"}
        </p>
      ) : null}
    </div>
  );
}

export default Header;
