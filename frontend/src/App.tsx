/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import abi from "./contractJson/medicine.json";
import { ethers } from "ethers";

function App() {
  const [state, setState] = useState<any>({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("");

  useEffect(() => {
    const template = async () => {
      const contractAddress = "0x7960610A5Ed933ee21c4147C960f82F23dCDD873";
      const contractABI = abi.abi;

      const { ethereum } = window as any;

      if (typeof ethereum !== "undefined") {
        try {
          const acc = await ethereum.request({
            method: "eth_requestAccounts",
          });

          (window as any).ethereum.on("accountsChanged", function () {
            window.location.reload();
          });

          setAccount(acc[0]);

          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          setState({
            provider,
            signer,
            contract,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Please install MetaMask");
      }
    };
    template();
  }, []);

  const addMedicine = async (e: any) => {
    e.preventDefault();

    const { contract } = state;

    const medicine = {
      name: e.target.name.value,
      location: e.target.location.value,
      owner: e.target.owner.value,
      batch_no: e.target.batch_no.value,
    };

    try {
      const txResponse = await contract.addMedicine(
        medicine.name,
        medicine.location,
        medicine.owner,
        medicine.batch_no
      );
      await txResponse.wait();

      const receipt = await state.provider.getTransactionReceipt(txResponse.hash);

      const event = contract.interface.parseLog(receipt.logs[0]);

      alert("Transaction successful " + JSON.stringify(event.args[0]));
    } catch (error) {
      alert("Transaction failed");
      console.log(error);
    }
  }

  const buyMedicine = async (e: any) => {
    e.preventDefault();
    const { contract } = state;

    const amount = {
      value: ethers.parseEther(e.target.amount.value),
    };

    try {
      const tx = await contract.buyMedicine(
        e.target.medicine_id.value,
        e.target.new_owner.value,
        e.target.new_location.value,
        amount,
      );
      await tx.wait();
      alert("Transaction successful");
    } catch (error) {
      alert("Transaction failed");
      console.log(error);
    }
  };

  const locateMedicine = async (e: any) => {
    e.preventDefault();

    const { contract } = state;

    const medicine_id = e.target.medicine_id.value;

    try {
      const location = await contract.locateMedicine(medicine_id);
      alert("Location: " + location);
    } catch (error) {
      alert("Transaction failed");
      console.log(error);
    }
  }

  const getMedicineInfo = async (e: any) => {
    e.preventDefault();

    const { contract } = state;

    const medicine_id = e.target.medicine_id.value;

    try {
      const info = await contract.getMedicineInfo(medicine_id);
      alert("Medicine Info: " + JSON.stringify({
        name: info[0],
        location: info[1],
        owner: info[2],
        batch_no: info.batch_no,
      }));
    } catch (error) {
      alert("Transaction failed");
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Connected account: {account}</h1>

      <h2>Add medicine to blockchain (Sepolia)</h2>
      <form onSubmit={addMedicine}>
        <input name="name" placeholder="Name" />
        <br />
        <input name="owner" placeholder="Owner" />
        <br />
        <input name="location" placeholder="Location" />
        <br />
        <input name="batch_no" placeholder="Batch Number" />
        <br />
        <button>Add</button>
      </form>

      <h2>Buy Medicine</h2>

      <form onSubmit={buyMedicine}>
        <input name="medicine_id" placeholder="Medicine hash" />
        <br />
        <input name="new_owner" placeholder="New owner" />
        <br />
        <input name="new_location" placeholder="New location" />
        <br />
        <input name="amount" placeholder="Amount" />
        <br />
        <button>Buy</button>
      </form>

      <h2>Medicine Info</h2>

      <form onSubmit={getMedicineInfo}>
        <input name="medicine_id" placeholder="Medicine hash" />
        <button>Search</button>
      </form>

      <h2>Locate Medicine</h2>

      <form onSubmit={locateMedicine}>
        <input name="medicine_id" placeholder="Medicine hash" />
        <button>Search</button>
      </form>

    </div>
  );
}

export default App;
