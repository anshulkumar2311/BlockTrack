import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

//INTERNAL IMPORT
import tracking from "../Conetxt/Tracking.json";
const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ContractABI = tracking.abi;

//---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
  const DappName = "Product Tracking Dapp";
  const [currentUser, setCurrentUser] = useState("");

  const createShipment = async (items) => {
    console.log(items);
    const { receiver, pickupTime,senderName,receiverName ,distance, price } = items;
    console.log("check error 1");
    await getAllShipment();
    console.log("check error 2");
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      console.log("checking data", receiver, senderName, receiverName, pickupTime, distance);
      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        senderName,
        receiverName,
        distance,
        ethers.utils.parseUnits(price, 18),
        {
          value: ethers.utils.parseUnits(price, 18),
        }
      );
      console.log("checking flow", receiver, senderName, receiverName, pickupTime, distance);

      await createItem.wait();
      console.log("createItem", createItem);
      // location.reload();
    } catch (error) {
      console.log("Some went wrong createshipment ", error);
    }
  };

  const getAllShipment = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      console.log("asked for getallshipment", contract)
      const shipments = await contract.getAllTranscations();
      console.log("return shipments", shipments)
      const allShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.reciever,
        price: ethers.utils.formatEther(shipment.price.toString()),
        pickupTime: shipment.pickupTime.toNumber(),
        senderName :shipment.senderName,
        receiverName: shipment.receiverName,
        deliveryTime: shipment.deliveryTime.toNumber(),
        distance: shipment.distance.toNumber(),
        isPaid: shipment.isPaid,
        status: shipment.status,
      }));
      
      return allShipments;
    } catch (error) {
      console.log("error here, get all shipment", error);
    }
  };

  const getShipmentsCount = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      console.log("checking accountttttt", accounts, contract);
      const shipmentsCount = await contract.getShipmentCount(accounts[0]);
      return shipmentsCount.toNumber();
    } catch (error) {
      console.log("error want, getting shipment counttttt");
    }
  };

  const completeShipment = async (completeShip) => {
    console.log(completeShip);

    const { recevier, index } = completeShip;
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.CompleteShipment(
        accounts[0],
        recevier,
        index,
        {
          gasLimit: 300000,
        }
      );

      transaction.wait();
      console.log("complete shipment", transaction);
      // location.reload();
    } catch (error) {
      console.log("wrong completeShipment", error);
    }
  };

  const getShipment = async (index) => {
    console.log(index * 1);
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      console.log("getshipment", contract, 0);
      const shipment = await contract.getShipment(accounts[0], index * 1);
      console.log("getshipment", shipment)

      const SingleShiplent = {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        senderName: shipment[3],
        receiverName: shipment[4],
        deliveryTime: shipment[5].toNumber(),
        distance: shipment[6].toNumber(),
        price: ethers.utils.formatEther(shipment[7].toString()),
        status: shipment[8],
        isPaid: shipment[9],
      };
      console.log("getshipment nnn", SingleShiplent)
      return SingleShiplent;
    } catch (error) {
      console.log("Sorry no chipment");
    }
  };

  const startShipment = async (getProduct) => {
    const { reveiver, index } = getProduct;

    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(
        accounts[0],
        reveiver,
        index * 1,
        {
          gasLimit: 300000,
        }
      );

      shipment.wait();
      console.log("start shipment", shipment);
      // location.reload();
    } catch (error) {
      console.log("Sorry no chipment", error);
    }
  };
  //---CHECK WALLET CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        return "No account";
      }
    } catch (error) {
      return "not connected";
    }
  };

  //---CONNET WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentUser(accounts[0]);
    } catch (error) {
      return "Something want wrong";
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        createShipment,
        getAllShipment,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentsCount,
        DappName,
        currentUser,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
