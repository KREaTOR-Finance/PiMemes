import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDownIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import useStore from "../context/store";
import Card from "../components/Card";

export default function Swap() {
  const [searchParams] = useSearchParams();
  const { isWalletConnected, walletBalance, connectWallet } = useStore();
  
  const [fromToken, setFromToken] = useState("PI");
  const [toToken, setToToken] = useState(searchParams.get("token") || "DOGEPI");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const tokens = [
    { symbol: "PI", name: "Pi Network", balance: walletBalance },
    { symbol: "DOGEPI", name: "DogePi", balance: 0 },
    { symbol: "SHIBPI", name: "ShibPi", balance: 0 },
    { symbol: "MOONPI", name: "MoonPi", balance: 0 }
  ];

  const handleSwap = async () => {
    if (!isWalletConnected) {
      connectWallet();
      return;
    }
    
    setIsLoading(true);
    // Simulate swap delay
    setTimeout(() => {
      setIsLoading(false);
      setFromAmount("");
      setToAmount("");
    }, 2000);
  };

  const handleFromAmountChange = (value) => {
    setFromAmount(value);
    // Simulate price calculation
    setToAmount(value ? (parseFloat(value) * 8333.33).toString() : "");
  };

  const handleToAmountChange = (value) => {
    setToAmount(value);
    // Simulate price calculation
    setFromAmount(value ? (parseFloat(value) / 8333.33).toString() : "");
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px' }}>Swap Tokens</h1>
          <button
            onClick={switchTokens}
            style={{
              backgroundColor: 'rgba(106, 13, 173, 0.5)',
              color: '#FFD700',
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.7)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.5)'}
          >
            <ArrowsRightLeftIcon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* From Token */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ color: '#9ca3af', fontSize: '14px' }}>From</label>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>
              Balance: {tokens.find(t => t.symbol === fromToken)?.balance.toFixed(2) || '0.00'}
            </span>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px'
          }}>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              style={{
                backgroundColor: 'rgba(106, 13, 173, 0.5)',
                color: '#FFD700',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                outline: 'none'
              }}
            >
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              placeholder="0.00"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFD700',
                fontSize: '20px',
                textAlign: 'right'
              }}
            />
          </div>
        </div>

        {/* Arrow Down */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(106, 13, 173, 0.5)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ArrowDownIcon style={{ width: '16px', height: '16px', color: '#FFD700' }} />
          </div>
        </div>

        {/* To Token */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ color: '#9ca3af', fontSize: '14px' }}>To</label>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>
              Balance: {tokens.find(t => t.symbol === toToken)?.balance.toFixed(2) || '0.00'}
            </span>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px'
          }}>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              style={{
                backgroundColor: 'rgba(106, 13, 173, 0.5)',
                color: '#FFD700',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                outline: 'none'
              }}
            >
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
            <input
              type="number"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
              placeholder="0.00"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFD700',
                fontSize: '20px',
                textAlign: 'right'
              }}
            />
          </div>
        </div>

        {/* Price Info */}
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Price</span>
            <span style={{ color: '#FFD700', fontSize: '14px' }}>
              1 {fromToken} = {8333.33} {toToken}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Minimum received</span>
            <span style={{ color: '#FFD700', fontSize: '14px' }}>
              {toAmount ? (parseFloat(toAmount) * 0.99).toFixed(2) : '0.00'} {toToken}
            </span>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={isLoading || !fromAmount}
          style={{
            width: '100%',
            backgroundColor: !fromAmount ? 'rgba(106, 13, 173, 0.3)' : '#FFD700',
            color: !fromAmount ? '#9ca3af' : '#000000',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            cursor: !fromAmount ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => fromAmount && (e.target.style.backgroundColor = '#f7c600')}
          onMouseOut={(e) => fromAmount && (e.target.style.backgroundColor = '#FFD700')}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : !isWalletConnected ? (
            "Connect Wallet"
          ) : !fromAmount ? (
            "Enter an amount"
          ) : (
            "Swap"
          )}
        </button>
      </Card>
    </div>
  );
} 