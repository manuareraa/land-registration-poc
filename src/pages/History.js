import React, { useState, useEffect } from "react";
import Web3 from "web3";

function History(props) {
  const [txns, setTxns] = useState([]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  };

  const getAllTxns = async () => {
    console.log("Getting all txns **", props.appState.allUserTxns);
    let tempArr = [];
    props.appState.allUserTxns.forEach((txn) => {
      console.log(txn);
      let element = (
        <>
          <div className="flex flex-row bg-custom-primary/40 p-4 px-4 rounded-lg items-center justify-center space-x-16">
            <div className="flex flex-col space-y-2">
              <p className="">
                <span>
                  <b>Land ID: &nbsp;</b>
                </span>{" "}
                {txn.landId}
              </p>
              <p>
                <span>
                  <b>Date: &nbsp;</b> {formatDate(parseInt(txn.timestamp))}
                </span>
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p>
                <b>Buyer:&nbsp;</b>
                {txn.buyer.substring(0, 6) +
                  "..." +
                  txn.buyer.substring(38, 42)}
              </p>
              <p>
                <b>Seller: &nbsp;</b>
                {txn.seller.substring(0, 6) +
                  "..." +
                  txn.seller.substring(38, 42)}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p>
                <b>Type:&nbsp;</b>

                {txn.seller === props.appState.account ? "Sold" : "Bought"}
              </p>
              <p>
                <b>Amount: &nbsp;</b>
                {Web3.utils.fromWei(txn.amount.toString())} MATIC
              </p>
            </div>
          </div>
        </>
      );
      tempArr.push(element);
      setTxns(tempArr);
    });
  };

  useEffect(() => {
    getAllTxns();
  }, [props.appState.allUserTxns]);

  return (
    <div className="w-full ">
      <div className="w-full p-4 mt-8 flex flex-col space-y-4">
        <div className="w-full flex flex-col">
          <div className="flex flex-row w-full justify-between">
            <p className="text-2xl font-bold my-2">History</p>
            <button className="btn" onClick={() => props.getAllUserTxns()}>
              Refresh Data
            </button>
          </div>

          <div className=" flex flex-col mt-4 space-y-4">
            {txns}
            {txns.length !== 0 ? null : (
              <div className="flex flex-row bg-custom-primary/40 p-4 rounded-lg items-center justify-center w-full ">
                <p>You do not have any purchase history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
