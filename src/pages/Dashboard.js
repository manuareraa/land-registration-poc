import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Web3 from "web3";

function Dashboard(props) {
  let iPrice = 0;
  const [iLand, setILand] = useState("");
  //   const [iPrice, setIPrice] = useState("");
  const [landprice, setLandPrice] = useState({});
  const [pLands, setPLands] = useState([]);
  const [oLands, setOLands] = useState([]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  };

  const handleInput = (id, price) => {
    console.log("Recv Input: ", id, price);
    iPrice = price;
    // setIPrice(price);

    // if(iLand === id) {
    //     setIPrice(price);
    // }

    // setLandPrice((prevState) => {
    //   return {
    //     ...prevState,
    //     [lid]: p,
    //   };
    // });
    console.log("LAND: ", landprice);
  };

  const processingLands = () => {
    console.log("PLANDS EXEC ");
    let tempArr = [];
    setPLands([]);
    props.appState.allLands.forEach((land) => {
      if (land.isApprovedByInspector === "waiting") {
        console.log("Lands for Sale", land);
        if (
          land.owner === props.appState.account ||
          land.bidder === props.appState.account
        ) {
          console.log("FOUND PLAND: ", land);
          let element = (
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
                  {Web3.utils.fromWei(land.bidPrice.toString())}&nbsp; MATIC
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p>
                  <b>Bidder:&nbsp;</b>
                  {land.bidder.substring(0, 6) +
                    "..." +
                    land.bidder.substring(38, 42)}
                </p>
                <p>
                  <b>Date: &nbsp;</b> {formatDate(parseInt(land.timestamp))}
                </p>
              </div>
              <button className="btn disabled hover:cursor-not-allowed text-white/50 bg-custom-primary/50 hover:bg-custom-primary">
                Waiting for approval
              </button>
            </div>
          );
          tempArr.push(element);
          setPLands(tempArr);
        }
      } else {
        console.log("Lands not for Sale");
      }
    });
    return tempArr;
  };

  const ownedLands = () => {
    console.log("OLANDS EXEC ");
    let tempArr = [];
    setOLands([]);
    props.appState.allLands.forEach((land) => {
      if (land.owner === props.appState.account) {
        let element = (
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
                <b>Price: &nbsp;</b> {
                    Web3.utils.fromWei(land.price.toString())
                } &nbsp; MATIC
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p>
                <b>Status:&nbsp;</b> Bought
              </p>
              <p>
                <b>Date: &nbsp;</b> {formatDate(parseInt(land.timestamp))}
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              {land.isForSale === true ||
              land.isApprovedByInspector === "waiting" ? (
                <button className="btn disabled hover:cursor-not-allowed text-white/50 bg-custom-primary/50 hover:bg-custom-primary">
                  Land already for Sale
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter Price"
                    className="border-2 border-custom-primary rounded-lg p-2"
                    onChange={(e) => {
                      console.log("LAND ID: ", land.landId, e.target.value);
                      handleInput(land.landId, e.target.value);
                    }}
                  ></input>
                  <button
                    className="btn"
                    onClick={() => {
                      if (
                        iPrice === undefined ||
                        iPrice === "" ||
                        isNaN(iPrice) ||
                        iPrice === 0
                      ) {
                        console.log("LAND ID: ", land.landId, iPrice);
                        toast.error("Please enter a valid price");
                      } else {
                        console.log("LAND ID: ", land.landId, iPrice);
                        props.postLandForSale(
                          land.landId,
                          Web3.utils.toWei(iPrice.toString())
                        );
                      }
                    }}
                  >
                    Post for Sale
                  </button>
                </>
              )}
            </div>
          </div>
        );
        tempArr.push(element);
        setOLands(tempArr);
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    ownedLands();
    processingLands();
  }, [props.appState.allLands]);

  return (
    <div className="w-full ">
      <div className="w-full p-4 mt-8 flex flex-col space-y-4">
        <div className="w-full flex flex-col">
          {/* <p className="text-2xl font-bold my-2">Land plots under processing</p> */}
          <div className="flex flex-row w-full justify-between mb-4">
            <p className="text-2xl font-bold my-2">
              Land plots under processing
            </p>
            <button className="btn" onClick={() => props.getAllLands()}>
              Refresh Data
            </button>
          </div>

          {pLands.length === 0 ? (
            <div className="flex flex-row bg-custom-primary/40 p-4 rounded-lg items-center justify-center w-full mt-4">
              <p>You do not have any land plots under processing</p>
            </div>
          ) : (
            pLands
          )}
        </div>
        <div className="flex flex-col w-full border-opacity-50">
          <div className="divider"></div>
        </div>

        <div className="w-full flex flex-col">
          <p className="text-2xl font-bold my-2">Land Plots Owned</p>
          {oLands.length === 0 ? (
            <div className="flex flex-row bg-custom-primary/40 p-4 rounded-lg items-center justify-center w-full ">
              <p>You do not own any land plots</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">{oLands}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
