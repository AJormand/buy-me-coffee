import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { shortenAddress } from "@/utils/shortenAddress";

const Navbar = () => {
  const [connectedAccount, setConnectedAccount] = useState("");

  useEffect(() => {
    // detect Metamask account change
    window.ethereum.on("accountsChanged", function (accounts) {
      console.log("accountsChanged", accounts);
      setConnectedAccount(shortenAddress(accounts));
    });

    // detect Network account change
    window.ethereum.on("networkChanged", function (networkId) {
      console.log("networkChanged", networkId);
    });
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          const account = accounts[0];
          setConnectedAccount(account);
          console.log(account);
        })
        .catch((error) => {
          console.log(error, error.code);
        });
    } else {
      console.log("Install Metamask");
      window.open("https://metamask.io/download/", "_blank");
    }
  };

  return (
    <div className="flex justify-around items-center bg-slate-200 p-2 rounded-lg m-1 g">
      <div className="font-bold text-xl">Buy me a Coffee</div>
      <div>
        <button
          className="bg-cyan-600 text-white font-bold p-2 rounded-full hover:bg-cyan-500"
          onClick={connectWallet}
        >
          {connectedAccount
            ? shortenAddress(connectedAccount)
            : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
