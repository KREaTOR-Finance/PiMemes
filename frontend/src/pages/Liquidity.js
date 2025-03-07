import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import useStore from "../context/store";
import Card from "../components/Card";

export default function Liquidity() {
  const { isWalletConnected, walletBalance, connectWallet } = useStore();
  const [activeTab, setActiveTab] = useState('add');
  const [token, setToken] = useState("DOGEPI");
  const [piAmount, setPiAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const tokens = [
    { symbol: "DOGEPI", name: "DogePi", balance: 0, poolShare: "12.5%" },
    { symbol: "SHIBPI", name: "ShibPi", balance: 0, poolShare: "5.2%" },
    { symbol: "MOONPI", name: "MoonPi", balance: 0, poolShare: "8.1%" }
  ];

  const handleSubmit = async () => {
    if (!isWalletConnected) {
      connectWallet();
      return;
    }
    
    setIsLoading(true);
    // Simulate transaction delay
    setTimeout(() => {
      setIsLoading(false);
      setPiAmount("");
      setTokenAmount("");
    }, 2000);
  };

  const handlePiAmountChange = (value) => {
    setPiAmount(value);
    // Simulate token amount calculation
    setTokenAmount(value ? (parseFloat(value) * 8333.33).toString() : "");
  };

  const handleTokenAmountChange = (value) => {
    setTokenAmount(value);
    // Simulate PI amount calculation
    setPiAmount(value ? (parseFloat(value) / 8333.33).toString() : "");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px' }}>Liquidity</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('add')}
              style={{
                backgroundColor: activeTab === 'add' ? 'rgba(106, 13, 173, 0.5)' : 'transparent',
                color: '#FFD700',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
            >
              Add
            </button>
            <button
              onClick={() => setActiveTab('remove')}
              style={{
                backgroundColor: activeTab === 'remove' ? 'rgba(106, 13, 173, 0.5)' : 'transparent',
                color: '#FFD700',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
            >
              Remove
            </button>
          </div>
        </div>

        {/* Token Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Select Token</label>
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: '#FFD700',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none'
            }}
          >
            {tokens.map(t => (
              <option key={t.symbol} value={t.symbol}>{t.symbol} - {t.name}</option>
            ))}
          </select>
        </div>

        {/* Amount Inputs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: '#9ca3af', fontSize: '14px' }}>PI Amount</label>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                Balance: {walletBalance.toFixed(2)}
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
                value={piAmount}
                onChange={(e) => handlePiAmountChange(e.target.value)}
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
              <span style={{ color: '#FFD700', fontWeight: '500' }}>PI</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: '#9ca3af', fontSize: '14px' }}>{token} Amount</label>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                Balance: {tokens.find(t => t.symbol === token)?.balance.toFixed(2) || '0.00'}
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
                value={tokenAmount}
                onChange={(e) => handleTokenAmountChange(e.target.value)}
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
              <span style={{ color: '#FFD700', fontWeight: '500' }}>{token}</span>
            </div>
          </div>
        </div>

        {/* Pool Info */}
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Pool Share</span>
            <span style={{ color: '#FFD700', fontSize: '14px' }}>
              {tokens.find(t => t.symbol === token)?.poolShare || '0%'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Rewards (24h)</span>
            <span style={{ color: '#FFD700', fontSize: '14px' }}>0.12 PI</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !piAmount}
          style={{
            width: '100%',
            backgroundColor: !piAmount ? 'rgba(106, 13, 173, 0.3)' : '#FFD700',
            color: !piAmount ? '#9ca3af' : '#000000',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            cursor: !piAmount ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => piAmount && (e.target.style.backgroundColor = '#f7c600')}
          onMouseOut={(e) => piAmount && (e.target.style.backgroundColor = '#FFD700')}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : !isWalletConnected ? (
            "Connect Wallet"
          ) : !piAmount ? (
            "Enter an amount"
          ) : (
            <>
              {activeTab === 'add' ? <PlusIcon style={{ width: '20px', height: '20px' }} /> : <MinusIcon style={{ width: '20px', height: '20px' }} />}
              {activeTab === 'add' ? 'Add' : 'Remove'} Liquidity
            </>
          )}
        </button>
      </Card>

      {/* Your Liquidity Positions */}
      <Card title="Your Liquidity Positions" style={{ marginTop: '24px' }}>
        {tokens.map((token, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              marginBottom: index < tokens.length - 1 ? '16px' : 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{token.symbol[0]}</span>
              </div>
              <div>
                <div style={{ color: '#FFD700', fontWeight: '500' }}>{token.name}</div>
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>Pool Share: {token.poolShare}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#FFD700', fontWeight: '500' }}>1,000 {token.symbol}</div>
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>≈ 0.12 PI</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
} 