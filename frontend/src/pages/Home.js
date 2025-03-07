import { Link } from "react-router-dom";
import WalletDisplay from "../components/WalletDisplay";
import TradeFeed from "../components/TradeFeed";
import Card from "../components/Card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gold mb-2">Welcome to PiMemes</h1>
        <p className="text-sm md:text-base text-gray-400">The premier DEX for Pi Network meme coins</p>
      </div>
      
      {/* Create Token Button - Prominent and Centered */}
      <div className="flex justify-center mb-8">
        <Link 
          to="/create-token" 
          className="bg-gold text-black text-lg px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center w-4/5 max-w-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Your Meme Coin
        </Link>
      </div>
      
      {/* Chart Section */}
      <Card title="Price Chart" style={{ marginBottom: '24px' }}>
        <div style={{ aspectRatio: '16/9' }}>
          <img 
            src={`${process.env.PUBLIC_URL}/images/charts/price-chart.svg`}
            alt="Price Chart" 
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      </Card>
      
      {/* Token Cards - Horizontal Scrollable on Mobile */}
      <Card title="Top Tokens" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '8px', gap: '16px' }}>
          {[
            { name: "DOGEPI", symbol: "D", price: "0.00012 PI", change: "+5.2%" },
            { name: "MOONPI", symbol: "M", price: "0.00020 PI", change: "+3.1%" },
            { name: "SHIBPI", symbol: "S", price: "0.00008 PI", change: "-1.2%" }
          ].map((token, index) => (
            <div 
              key={index} 
              style={{
                flexShrink: 0,
                width: '160px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px'
                }}>
                  <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{token.symbol}</span>
                </div>
                <h3 style={{ color: '#FFD700', fontWeight: 'bold', margin: 0 }}>{token.name}</h3>
              </div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>Price: {token.price}</div>
              <div style={{ 
                fontSize: '14px', 
                color: token.change.startsWith('+') ? '#10b981' : '#ef4444'
              }}>
                {token.change}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Wallet Summary */}
      <Card title="Your Wallet" style={{ marginBottom: '24px' }}>
        <WalletDisplay />
      </Card>
      
      {/* Recent Trades */}
      <Card title="Recent Trades" style={{ marginBottom: '24px' }}>
        <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
          <TradeFeed />
        </div>
      </Card>
      
      {/* Feature Cards - Vertical Stack on Mobile */}
      <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
        <Link 
          to="/swap"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'}
        >
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
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px', color: '#FFD700' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px' }}>Swap Tokens</h2>
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>Trade Pi for meme coins</p>
            </div>
          </div>
          <div style={{
            backgroundColor: '#FFD700',
            color: '#000000',
            padding: '8px 24px',
            borderRadius: '12px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}>
            Swap
          </div>
        </Link>

        <Link 
          to="/liquidity"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'}
        >
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
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px', color: '#FFD700' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px' }}>Add Liquidity</h2>
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>Earn fees from trades</p>
            </div>
          </div>
          <div style={{
            backgroundColor: '#FFD700',
            color: '#000000',
            padding: '8px 24px',
            borderRadius: '12px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}>
            Add
          </div>
        </Link>

        <Link 
          to="/farming"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'}
        >
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
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px', color: '#FFD700' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px' }}>Farm Rewards</h2>
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>Stake LP tokens for rewards</p>
            </div>
          </div>
          <div style={{
            backgroundColor: '#FFD700',
            color: '#000000',
            padding: '8px 24px',
            borderRadius: '12px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}>
            Farm
          </div>
        </Link>
      </div>
      
      {/* Background image with overlay */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <img 
          src={`${process.env.PUBLIC_URL}/images/backgrounds/crypto-bg.svg`}
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Add custom styles for hiding scrollbars but keeping functionality */}
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}