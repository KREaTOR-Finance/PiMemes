import { Link } from "react-router-dom";
import useStore from "../context/store";

export default function WalletDisplay() {
  const { 
    isWalletConnected, 
    walletAddress, 
    walletBalance
  } = useStore();

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isWalletConnected) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </div>
        <p style={{ color: '#9ca3af', marginBottom: '16px' }}>Connect your wallet to view your balance</p>
        <Link
          to="/wallet"
          style={{
            backgroundColor: '#FFD700',
            color: '#000000',
            padding: '8px 24px',
            borderRadius: '12px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
        >
          Connect Wallet
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px' }}>π</span>
          </div>
          <div>
            <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px' }}>Balance</div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>{formatAddress(walletAddress)}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>{walletBalance.toFixed(2)} PI</div>
          <div style={{ color: '#9ca3af', fontSize: '14px' }}>${(walletBalance * 1).toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <Link
          to="/swap"
          style={{
            backgroundColor: 'rgba(106, 13, 173, 0.5)',
            color: '#FFD700',
            padding: '8px',
            borderRadius: '12px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.7)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.5)'}
        >
          Swap Tokens
        </Link>
        <Link
          to="/wallet"
          style={{
            backgroundColor: 'rgba(106, 13, 173, 0.5)',
            color: '#FFD700',
            padding: '8px',
            borderRadius: '12px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.7)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.5)'}
        >
          View Wallet
        </Link>
      </div>
    </div>
  );
} 