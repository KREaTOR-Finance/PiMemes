import { useState } from "react";
import useStore from "../context/store";

export default function FarmingDashboard() {
  const { tokens } = useStore();
  const [stakeAmount, setStakeAmount] = useState("");
  
  // Mock data for farming pools
  const farmingPools = [
    { 
      id: "farm1", 
      name: "DOGEPI-PI LP", 
      staked: "45,678 LP", 
      earned: "1,234 DOGEPI", 
      apr: "210%",
      token: "DOGEPI" 
    },
    { 
      id: "farm2", 
      name: "MOONPI-PI LP", 
      staked: "23,456 LP", 
      earned: "567 MOONPI", 
      apr: "180%",
      token: "MOONPI" 
    },
    { 
      id: "farm3", 
      name: "CATPI-PI LP", 
      staked: "12,345 LP", 
      earned: "789 CATPI", 
      apr: "195%",
      token: "CATPI" 
    },
  ];

  // Filter farming pools based on available tokens (if tokens exist)
  const availablePools = tokens && tokens.length > 0 
    ? farmingPools.filter(pool => tokens.some(t => t.symbol === pool.token))
    : farmingPools;

  const handleStake = (poolId) => {
    if (!stakeAmount) {
      alert("Please enter an amount to stake");
      return;
    }
    
    alert(`Staked ${stakeAmount} LP tokens in pool ${poolId}`);
    setStakeAmount("");
  };

  const handleHarvest = (poolId, token) => {
    alert(`Harvested rewards from pool ${poolId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-dark p-6 rounded-lg shadow-lg border border-royalPurple mb-8">
        <h2 className="text-xl font-bold mb-4 text-gold">Farming Dashboard</h2>
        <p className="mb-4 text-lightGray">Stake your LP tokens to earn additional rewards</p>
        
        <div className="grid gap-6">
          {availablePools.map(pool => (
            <div key={pool.id} className="border border-royalPurple rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{pool.name}</h3>
                <span className="text-gold font-bold">APR: {pool.apr}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-lightGray mb-1">Your Staked</p>
                  <p className="font-medium">{pool.staked}</p>
                </div>
                <div>
                  <p className="text-sm text-lightGray mb-1">Earned {pool.token}</p>
                  <p className="font-medium">{pool.earned}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded bg-dark text-lightGray border-royalPurple" 
                    placeholder={`Enter ${pool.name} amount`}
                    value={stakeAmount} 
                    onChange={(e) => setStakeAmount(e.target.value)} 
                  />
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="flex-1 bg-royalPurple text-gold p-2 rounded hover:bg-opacity-90 transition-all"
                    onClick={() => handleStake(pool.id)}
                  >
                    Stake
                  </button>
                  <button 
                    className="flex-1 bg-gold text-black p-2 rounded hover:bg-yellow-500 transition-colors"
                    style={{backgroundColor: '#FFD700', color: '#000000'}}
                    onClick={() => handleHarvest(pool.id, pool.token)}
                  >
                    Harvest
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 