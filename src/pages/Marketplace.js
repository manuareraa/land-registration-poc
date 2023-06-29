import React, { useState, useEffect } from "react";
import Web3 from "web3";

function Marketplace(props) {
  const [empty, setEmpty] = useState("true");
  const [landArray, setLandArray] = useState([]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  };

  const getLandData = () => {
    let tempArray = [];
    setLandArray(tempArray);
    props.appState.allLands.forEach((land) => {
      console.log("LAND: ", land);
      if (land.isForSale === true && land.owner !== props.appState.account) {
        setEmpty("false");
        let element = (
          <>
            <div className="flex flex-row bg-custom-primary/40 p-4 rounded-lg items-center justify-between w-full">
              <div className="flex flex-col space-y-2">
                <p className="">
                  <span>
                    <b>Land ID: &nbsp;</b>
                  </span>{" "}
                  {land.landId}
                </p>
                <p>
                  <span>
                    <b>Location: &nbsp;</b>
                  </span>
                  {land.location}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p>
                  <b>Area:&nbsp;</b> {land.area} sq. ft.
                </p>
                <p>
                  <b>Price: &nbsp;</b>{" "}
                  {Web3.utils.fromWei(land.bidPrice.toString())}
                  &nbsp; MATIC
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p>
                  <b>Owner:&nbsp;</b>{" "}
                  {land.owner.substring(0, 6) +
                    "..." +
                    land.owner.substring(38, 42)}
                </p>
                <p>
                  <b>Date: &nbsp;</b> {formatDate(parseInt(land.timestamp))}
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <button
                  className="btn"
                  onClick={() => {
                    props.buyLand(land.landId, land.bidPrice.toString());
                  }}
                >
                  Buy Land
                </button>
              </div>
            </div>
          </>
        );
        tempArray.push(element);
        setLandArray(tempArray);
      }
    });
  };

  useEffect(() => {
    getLandData();
  }, [props.appState.allLands]);

  return (
    <div className="w-full ">
      <div className="w-full p-4 mt-8 flex flex-col space-y-4">
        <div className="w-full flex flex-col">
          <div className="flex flex-row w-full justify-between">
            <p className="text-2xl font-bold my-2">Marketplace</p>
            <button className="btn" onClick={() => props.getAllLands()}>
              Refresh Data
            </button>
          </div>
          <div className=" flex flex-col mt-4">{landArray}</div>

          {landArray.length > 0 ? null : (
            <div className="flex flex-row bg-custom-primary/40 p-4 rounded-lg items-center justify-center w-full ">
              <p>No land plots for sale</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
