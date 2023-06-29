import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import Loading from "./components/Loading";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import contractabi from "./smart-contract/contractabi";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Marketplace from "./pages/Marketplace";
import InsDashboard from "./pages/InsDashboard";
import InsHistory from "./pages/InsHistory";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    loading: false,
    message: "",
  });
  const [appState, setAppState] = useState({
    loggedIn: false,
    web3: null,
    account: "",
    chainId: "",
    maticBalance: "",
    username: "",
    isAdmin: false,
    landCount: 0,
    allLands: [],
    allUserTxns: [],
    allInsTxns: [],
    contractAddress: "0x28D9579d344cd073d78b4dc96c88BC2e23C73745",
    inspectorAddress: "0x201afF250FB75889450ca589D70fcb0540f7E501",
  });

  const setUpWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading({
          loading: true,
          message: "Connecting to Metamask...",
        });
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setAppState((prevState) => {
          return { ...prevState, web3: web3 };
        });
        console.log("<< Web3 Object Received  >>");

        window.ethereum
          .request({ method: "net_version" })
          .then(async (chainId) => {
            if (chainId !== "80001") {
              try {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0x13881" }],
                });
                console.log("Polygon Mumbai Chain found.");
              } catch (switchError) {
                console.log("Error connecting to Polygon Mumbai Chain (1)");
              }
            }
          });

        const accounts = await web3.eth.getAccounts();
        console.log("<< Account Received  >>", accounts[0]);

        setAppState((prevState) => {
          return {
            ...prevState,
            account: accounts[0],
          };
        });
        setLoading({
          loading: false,
          message: "Connecting to Metamask...",
        });
      } catch (error) {
        console.error(error);
        console.log("Error getting web3 object. Install Metamask.");
        setLoading({
          loading: false,
          message: "Connecting to Metamask...",
        });
      }
    } else {
      console.log("Please install MetaMask to connect your wallet.");
    }
  };

  const walletLogout = async () => {
    console.log("<< Wallet Logout Called  >>");
    setAppState((prevState) => {
      return {
        ...prevState,
        loggedIn: false,
        username: "",
        account: "",
        isAdmin: false,
      };
    });
    navigate("/");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const userLogin = async () => {
    setLoading({
      loading: true,
      message: "Logging In...",
    });
    console.log("<< User Login Called >>");
    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .loginUser()
      .call({ from: appState.account })
      .then(async (response) => {
        setLoading({
          loading: false,
          message: "",
        });
        console.log("<< Login Response from contract: ", response);
        if (response === true) {
          if (appState.account === appState.inspectorAddress) {
            setAppState((prevState) => {
              return {
                ...prevState,
                loggedIn: true,
                isAdmin: true,
              };
            });
            getAllLands();
            getAllInsTxns();
            navigate("/admin-dashboard");
          } else {
            setAppState((prevState) => {
              return {
                ...prevState,
                loggedIn: true,
                isAdmin: false,
              };
            });
            getAllLands();
            getAllUserTxns();
            navigate("/dashboard");
          }
        } else {
          toast.error("Not registered or Invalid Credentials");
        }
      })
      .catch((error) => {
        console.log("<< Error from contract while loggin in: ", error);
        setLoading({
          loading: false,
          message: "Registering product in Blockchain...",
        });
      });
  };

  const userRegister = async () => {
    setLoading({
      loading: true,
      message: "Registering new user on the Blockchain...",
    });
    console.log("<< User Registration Called >>");
    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .registerUser(appState.account)
      .send({ from: appState.account })
      .then(async (response) => {
        setLoading({
          loading: false,
          message: "",
        });
        console.log("<< Register Response from contract: ", response);
        toast.success(
          "Registered Successfully in the Blockchain. Please login"
        );
      })
      .catch((error) => {
        console.log("<< Error from contract while registering: ", error);
        setLoading({
          loading: false,
          message: "Registering product in Blockchain...",
        });
      });
  };

  const getAllLands = async () => {
    console.log("<< Get All Lands Called >>");
    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .landCount()
      .call({ from: appState.account })
      .then(async (response) => {
        console.log("<< Land Count Response from contract: ", response);
        setAppState((prevState) => {
          return {
            ...prevState,
            landCount: response,
          };
        });
        if (parseInt(response) > 0) {
          let lands = [];
          for (let i = 1; i <= parseInt(response); i++) {
            await contract.methods
              .allLands(i)
              .call({ from: appState.account })
              .then(async (land) => {
                console.log("<< Land Response from contract: ", land);
                lands.push(land);
              })
              .catch((error) => {
                console.log(
                  "<< Error from contract while getting lands: ",
                  error
                );
              });
          }
          setAppState((prevState) => {
            return {
              ...prevState,
              allLands: lands,
            };
          });
        }
      })
      .catch((error) => {
        console.log("<< Error from contract while getting landcount: ", error);
      });
  };

  const postLandForSale = async (landId, price) => {
    setLoading({
      loading: true,
      message: "Posting Land for Sale...",
    });
    console.log("<< Post Land for Sale Called >>", landId, price);
    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .postLandForSale(landId, price)
      .send({ from: appState.account })
      .then(async (response) => {
        setLoading({
          loading: false,
          message: "",
        });
        console.log("<< Post Land for Sale Response from contract: ", response);
        toast.success("Land Posted for Sale Successfully");
        getAllLands();
      })
      .catch((error) => {
        console.log(
          "<< Error from contract while posting land for sale: ",
          error
        );
        setLoading({
          loading: false,
          message: "Posting Land for Sale...",
        });
      });
  };

  const buyLand = async (landId, price) => {
    setLoading({
      loading: true,
      message: "Buying Land and sending request to the Inspector...",
    });

    console.log("<< Buy Land Called >>");
    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .buyLand(landId, appState.inspectorAddress)
      .send({ from: appState.account, value: price })
      .then(async (response) => {
        setLoading({
          loading: false,
          message: "",
        });
        console.log("<< Buy Land Response from contract: ", response);
        toast.success("Land Bought Successfully");
        getAllLands();
      })
      .catch((error) => {
        console.log("<< Error from contract while buying land: ", error);
        setLoading({
          loading: false,
          message: "Buying Land...",
        });
      });
  };

  const approveDenyRequest = async (landId, isApproved, bidPrice) => {
    setLoading({
      loading: true,
      message: "Updating the status of the request...",
    });

    console.log("<< Approve/Deny Request Called >>");
    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .approveLand(landId, isApproved)
      .send({ from: appState.account, value: bidPrice })
      .then(async (response) => {
        setLoading({
          loading: false,
          message: "",
        });
        console.log(
          "<< Approve/Deny Request Response from contract: ",
          response
        );
        toast.success("Request Approved/Denied Successfully");
        getAllLands();
      })
      .catch((error) => {
        console.log(
          "<< Error from contract while approving/denying request: ",
          error
        );
        setLoading({
          loading: false,
          message: "Approving/Denying Request...",
        });
      });
  };

  const getAllUserTxns = async () => {
    console.log("<< Get All User Txns Called >>");
    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .userTxnCount()
      .call({ from: appState.account })
      .then(async (response) => {
        console.log("<< User Txn Count Response from contract: ", response);
        setAppState((prevState) => {
          return {
            ...prevState,
            userTxnCount: response,
          };
        });
        if (parseInt(response) > 0) {
          let txns = [];
          for (let i = 1; i <= parseInt(response); i++) {
            await contract.methods
              .userTxns(i)
              .call({ from: appState.account })
              .then(async (txn) => {
                console.log("<< Txn Response from contract for USR: ", txn);
                txns.push(txn);
              })
              .catch((error) => {
                console.log(
                  "<< Error from contract while getting txns: ",
                  error
                );
              });
          }
          setAppState((prevState) => {
            return {
              ...prevState,
              allUserTxns: txns,
            };
          });
        }
      })
      .catch((error) => {
        console.log("<< Error from contract while getting txncount: ", error);
      });
  };

  const getAllInsTxns = async () => {
    console.log("<< Get All Inspector Txns Called >>");
    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .insTxnCount()
      .call({ from: appState.account })
      .then(async (response) => {
        console.log(
          "<< Inspector Txn Count Response from contract: ",
          response
        );
        setAppState((prevState) => {
          return {
            ...prevState,
            insTxnCount: response,
          };
        });
        if (parseInt(response) > 0) {
          let txns = [];
          for (let i = 1; i <= parseInt(response); i++) {
            await contract.methods
              .inspectorTxns(i)
              .call({ from: appState.account })
              .then(async (txn) => {
                console.log("<< Txn Response from contract for INS: ", txn);
                txns.push(txn);
              })
              .catch((error) => {
                console.log(
                  "<< Error from contract while getting txns: ",
                  error
                );
              });
          }
          setAppState((prevState) => {
            return {
              ...prevState,
              allInsTxns: txns,
            };
          });
        }
      })
      .catch((error) => {
        console.log("<< Error from contract while getting txncount: ", error);
      });
  };

  useEffect(() => {}, []);

  return (
    <>
      <Toaster />
      <div className="h-screen">
        {loading.loading === true ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : null}

        <Header appState={appState} />
        <Navbar appState={appState} walletLogout={walletLogout} />

        <Routes>
          <Route
            path="/"
            element={
              <Homepage
                setUpWeb3={setUpWeb3}
                appState={appState}
                walletLogout={walletLogout}
                userLogin={userLogin}
                userRegister={userRegister}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                appState={appState}
                getAllLands={getAllLands}
                postLandForSale={postLandForSale}
              />
            }
          />
          <Route
            path="/history"
            element={
              <History
                appState={appState}
                getAllLands={getAllLands}
                getAllUserTxns={getAllUserTxns}
                getAllInsTxns={getAllInsTxns}
              />
            }
          />
          <Route
            path="/marketplace"
            element={
              <Marketplace
                appState={appState}
                getAllLands={getAllLands}
                buyLand={buyLand}
              />
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <InsDashboard
                appState={appState}
                getAllLands={getAllLands}
                approveDenyRequest={approveDenyRequest}
              />
            }
          />
          <Route
            path="/ins-history"
            element={
              <InsHistory
                appState={appState}
                getAllLands={getAllLands}
                getAllUserTxns={getAllUserTxns}
                getAllInsTxns={getAllInsTxns}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
