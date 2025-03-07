import { useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import useStore from "../context/store";
import Card from "../components/Card";

export default function Farming() {
  const { isWalletConnected, connectWallet } = useStore();
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pools = [
    {
      id: 1,
      name: "DOGEPI-PI",
      apr: "120%",
      tvl: "25,000 PI",
      yourStake: "1,000 LP",
      rewards: "5.2 PI",
      lpToken: "DOGEPI-PI LP"
    },
    {
      id: 2,
      name: "SHIBPI-PI",
      apr: "85%",
      tvl: "18,500 PI",
      yourStake: "500 LP",
      rewards: "2.8 PI",
      lpToken: "SHIBPI-PI LP"
    },
    {
      id: 3,
      name: "MOONPI-PI",
      apr: "95%",
      tvl: "22,000 PI",
      yourStake: "750 LP",
      rewards: "4.1 PI",
      lpToken: "MOONPI-PI LP"
    }
  ];

  const handleStake = async () => {
    if (!isWalletConnected) {
      connectWallet();
      return;
    }
    
    setIsLoading(true);
    // Simulate staking delay
    setTimeout(() => {
      setIsLoading(false);
      setStakeAmount("");
      setSelectedPool(null);
    }, 2000);
  };

  const handleHarvest = async (poolId) => {
    if (!isWalletConnected) {
      connectWallet();
      return;
    }
    
    setIsLoading(true);
    // Simulate harvesting delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '32px', marginBottom: '12px' }}>Yield Farming</h1>
        <p style={{ color: '#9ca3af' }}>Stake your LP tokens to earn rewards</p>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {pools.map((pool) => (
          <Card key={pool.id}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>{pool.name.split('-')[0][0]}</span>
                  </div>
                  <div>
                    <h3 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px', marginBottom: '4px' }}>{pool.name}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>Earn PI rewards</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px' }}>{pool.apr}</div>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>APR</p>
                </div>
              </div>

              {/* Pool Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px'
              }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>Total Value Locked</p>
                  <p style={{ color: '#FFD700', fontWeight: '500' }}>{pool.tvl}</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>Your Stake</p>
                  <p style={{ color: '#FFD700', fontWeight: '500' }}>{pool.yourStake}</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>Pending Rewards</p>
                  <p style={{ color: '#FFD700', fontWeight: '500' }}>{pool.rewards}</p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => setSelectedPool(pool)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(106, 13, 173, 0.5)',
                    color: '#FFD700',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.7)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.5)'}
                >
                  Stake
                </button>
                <button
                  onClick={() => handleHarvest(pool.id)}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFD700',
                    color: '#000000',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
                >
                  {isLoading ? (
                    <ArrowPathIcon style={{ width: '20px', height: '20px' }} className="animate-spin" />
                  ) : (
                    <>
                      <ArrowPathIcon style={{ width: '20px', height: '20px' }} />
                      Harvest
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stake Modal */}
      {selectedPool && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <Card style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px' }}>
                Stake {selectedPool.lpToken}
              </h2>
              <button
                onClick={() => setSelectedPool(null)}
                style={{ color: '#9ca3af', fontSize: '24px' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Amount</label>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Balance: {selectedPool.yourStake}
                </span>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px'
              }}>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFD700',
                    fontSize: '20px'
                  }}
                />
                <span style={{ color: '#FFD700', fontWeight: '500' }}>LP</span>
              </div>
            </div>

            <button
              onClick={handleStake}
              disabled={isLoading || !stakeAmount}
              style={{
                width: '100%',
                backgroundColor: !stakeAmount ? 'rgba(106, 13, 173, 0.3)' : '#FFD700',
                color: !stakeAmount ? '#9ca3af' : '#000000',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                cursor: !stakeAmount ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => stakeAmount && (e.target.style.backgroundColor = '#f7c600')}
              onMouseOut={(e) => stakeAmount && (e.target.style.backgroundColor = '#FFD700')}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : !isWalletConnected ? (
                "Connect Wallet"
              ) : !stakeAmount ? (
                "Enter an amount"
              ) : (
                "Stake"
              )}
            </button>
          </Card>
        </div>
      )}
    </div>
  );
} 