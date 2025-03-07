import { useState } from "react";
import useStore from "../context/store";

export default function LiquidityPool() {
  const { selectedCoin, setSelectedCoin } = useStore();
  const [piAmount, setPiAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  
  // Mock data for liquidity pools
  const pools = [
    { id: "DOGEPI", name: "DOGEPI-PI", liquidity: "1,245,678 PI", apr: "120%" },
    { id: "MOONPI", name: "MOONPI-PI", liquidity: "987,654 PI", apr: "85%" },
    { id: "CATPI", name: "CATPI-PI", liquidity: "456,789 PI", apr: "95%" },
  ];

  const handleAddLiquidity = () => {
    alert(`Added liquidity: ${piAmount} PI and ${tokenAmount} ${selectedCoin}`);
    setPiAmount("");
    setTokenAmount("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-dark p-6 rounded-lg shadow-lg border border-royalPurple mb-8">
        <h2 className="text-xl font-bold mb-6 text-gold">Add Liquidity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">PI Amount</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded bg-dark text-lightGray border-royalPurple" 
              placeholder="Enter PI amount" 
              value={piAmount} 
              onChange={(e) => setPiAmount(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Token</label>
            <div className="flex space-x-2">
              <select 
                className="flex-grow p-2 border rounded bg-dark text-lightGray border-royalPurple" 
                value={selectedCoin} 
                onChange={(e) => setSelectedCoin(e.target.value)}
              >
                <option value="DOGEPI">DOGEPI</option>
                <option value="MOONPI">MOONPI</option>
                <option value="CATPI">CATPI</option>
              </select>
              <input 
                type="number" 
                className="flex-grow p-2 border rounded bg-dark text-lightGray border-royalPurple" 
                placeholder="Enter token amount" 
                value={tokenAmount} 
                onChange={(e) => setTokenAmount(e.target.value)} 
              />
            </div>
          </div>
        </div>
        
        <button 
          className="w-full bg-royalPurple text-gold p-2 rounded mt-4 hover:bg-opacity-90 transition-all"
          onClick={handleAddLiquidity}
        >
          Add Liquidity
        </button>
      </div>
      
      <div className="bg-dark p-6 rounded-lg shadow-lg border border-royalPurple">
        <h2 className="text-xl font-bold mb-6 text-gold">Your Liquidity Positions</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-royalPurple">
                <th className="py-3 text-left">Pool</th>
                <th className="py-3 text-left">Your Liquidity</th>
                <th className="py-3 text-left">APR</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pools.map(pool => (
                <tr key={pool.id} className="border-b border-gray-700">
                  <td className="py-4">{pool.name}</td>
                  <td className="py-4">{pool.liquidity}</td>
                  <td className="py-4 text-gold">{pool.apr}</td>
                  <td className="py-4">
                    <button className="bg-royalPurple text-gold px-3 py-1 rounded text-sm mr-2">
                      Add
                    </button>
                    <button className="bg-dark text-lightGray border border-royalPurple px-3 py-1 rounded text-sm">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 