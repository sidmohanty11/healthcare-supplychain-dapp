/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import abi from "./contractJson/chai.json";
import { ethers } from "ethers";

function App() {
  const [state, setState] = useState<any>({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("");
  const [memos, setMemos] = useState<any[]>([]);

  useEffect(() => {
    const template = async () => {
      const contractAddress = "0x80f317198e7764b26Be08DC5e5FE5FabfBC742c1";
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

  const buy = async (e: any) => {
    e.preventDefault();
    const { contract } = state;

    const amount = {
      value: ethers.parseEther(e.target.amount.value),
    };

    try {
      const tx = await contract.buyChai(
        e.target.name.value,
        e.target.message.value,
        amount
      );
      await tx.wait();
      alert("Transaction successful");
    } catch (error) {
      alert("Transaction failed");
      console.log(error);
    }
  };

  useEffect(() => {
    const { contract } = state;

    if (contract) {
      (async function () {
        const data = await contract.getMemos();
        setMemos(data);
      })();
    }
  }, [state]);

  return (
    <div>
      <h1>Connected account: {account}</h1>

      <form onSubmit={buy}>
        <input name="name" placeholder="name" />
        <br />
        <input name="message" placeholder="message" />
        <br />
        <input name="amount" placeholder="amount" />
        <br />
        <button>Buy</button>
      </form>

      <h2>Memos</h2>

      <table border={1}>
        <tr>
          <th>Index</th>
          <th>Name</th>
          <th>Message</th>
          <th>From</th>
        </tr>
        {memos.map((memo, index) => (
          <tr key={index}>
            <th>{`Memo ${index}`}</th>
            <td>{memo.name}</td>
            <td>{memo.message}</td>
            <td>{memo.from}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
