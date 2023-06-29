import React from "react";

import LoadingSVG from "../assets/loading.svg";

function Loading(props) {
  return (
    <div className="modal modal-open flex flex-col items-center h-full w-full bg-white/90">
      <img src={LoadingSVG} alt="Loading" className="h-40 w-40" />
      <p className="text-xl font-bold">{props.loading.message}</p>
      {props.loading === "error" ? (
        <button
          className="bg-custom-primary px-4 py-2  text-white mt-8"
          onClick={() => props.setLoading({ status: false, message: "" })}
        >
          Close
        </button>
      ) : null}
    </div>
  );
}

export default Loading;
