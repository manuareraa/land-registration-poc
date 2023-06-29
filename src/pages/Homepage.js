import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Homepage(props) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col w-full items-center mt-10 space-y-8">
        {props.appState.account !== "" ? (
          <div>
            <p className="text-lg">
              <span>
                <b>Wallet Connected:</b> &nbsp;
              </span>
              {props.appState.account}
            </p>
          </div>
        ) : null}
        <div className="flex flex-row space-x-8">
          {props.appState.account !== "" ? (
            <button className="btn" onClick={() => props.walletLogout()}>
              Disconnect Wallet
            </button>
          ) : (
            <button className="btn" onClick={() => props.setUpWeb3()}>
              Connect Wallet
            </button>
          )}
        </div>
        {props.appState.account !== "" ? (
          <div className="flex flex-row space-x-4">
            <button className="btn" onClick={() => props.userLogin()}>
              Login with Connected Wallet
            </button>
            <button className="btn" onClick={() => props.userRegister()}>
              Register with Connected Wallet
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Homepage;
