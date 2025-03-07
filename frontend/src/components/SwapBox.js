import { useState } from "react";
import { tradeMemeCoin } from "../services/api";
import useStore from "../context/store";

export default function SwapBox() {
  const { user, selectedCoin, setSelectedCoin } = useStore();
  const [amount, setAmount] = useState("");
  const [swapType, setSwapType] = useState("buy");

  const handleSwap = async () => {
    try {
      const response = await tradeMemeCoin(user, selectedCoin, parseFloat(amount), swapType === "buy");
      alert(response.message);
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-dark p-6 shadow-md rounded-lg border border-royalPurple">
      <h2 className="text-xl font-semibold text-center mb-4 text-gold">Swap Meme Coins</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Coin</label>
        <select 
          className="w-full p-2 border rounded bg-dark text-lightGray border-royalPurple" 
          value={selectedCoin} 
          onChange={(e) => setSelectedCoin(e.target.value)}
        >
          <option value="DOGEPI">DOGEPI</option>
          <option value="MOONPI">MOONPI</option>
          <option value="CATPI">CATPI</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Swap Type</label>
        <div className="flex">
          <button 
            className={`flex-1 ${swapType === "buy" ? "bg-royalPurple text-gold" : "bg-dark text-lightGray border border-royalPurple"}`}
            onClick={() => setSwapType("buy")}
          >
            Buy
          </button>
          <button 
            className={`flex-1 ${swapType === "sell" ? "bg-royalPurple text-gold" : "bg-dark text-lightGray border border-royalPurple"}`}
            onClick={() => setSwapType("sell")}
          >
            Sell
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input 
          type="number" 
          className="w-full p-2 border rounded bg-dark text-lightGray border-royalPurple" 
          placeholder="Enter amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
      </div>
      
      <button 
        className="w-full bg-royalPurple text-gold p-2 rounded mt-2 hover:bg-opacity-90 transition-all"
        onClick={handleSwap}
      >
        Confirm Swap
      </button>
    </div>
  );
} 