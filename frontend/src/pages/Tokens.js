import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import SearchInput from "../components/SearchInput";

export default function Tokens() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, supply, liquidity

  const tokens = [
    {
      symbol: "DOGEPI",
      name: "DogePi",
      type: "Meme Token",
      supply: 1000000,
      liquidity: 5000,
      price: 0.00012
    },
    {
      symbol: "MOONPI",
      name: "MoonPi",
      type: "Meme Token",
      supply: 500000,
      liquidity: 7000,
      price: 0.0002
    },
    {
      symbol: "SHIBPI",
      name: "ShibPi",
      type: "Meme Token",
      supply: 2000000,
      liquidity: 3000,
      price: 0.00008
    }
  ];

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case "supply":
        return b.supply - a.supply;
      case "liquidity":
        return b.liquidity - a.liquidity;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '32px', marginBottom: '12px' }}>Token List</h1>
        <p style={{ color: '#9ca3af' }}>Explore and trade meme tokens on Pi Network</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px' }}>
        <div>
          <Card>
            <div style={{ marginBottom: '24px' }}>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tokens..."
              />
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '24px',
              borderBottom: '1px solid rgba(106, 13, 173, 0.3)',
              paddingBottom: '12px'
            }}>
              <button
                onClick={() => setSortBy('name')}
                style={{
                  backgroundColor: sortBy === 'name' ? 'rgba(106, 13, 173, 0.5)' : 'transparent',
                  color: '#FFD700',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy('supply')}
                style={{
                  backgroundColor: sortBy === 'supply' ? 'rgba(106, 13, 173, 0.5)' : 'transparent',
                  color: '#FFD700',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
              >
                Supply
              </button>
              <button
                onClick={() => setSortBy('liquidity')}
                style={{
                  backgroundColor: sortBy === 'liquidity' ? 'rgba(106, 13, 173, 0.5)' : 'transparent',
                  color: '#FFD700',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
              >
                Liquidity
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sortedTokens.map((token) => (
                <div
                  key={token.symbol}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '12px',
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
                      <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>{token.symbol[0]}</span>
                    </div>
                    <div>
                      <h3 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>{token.name}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '14px' }}>{token.type}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#FFD700', fontWeight: '500', marginBottom: '4px' }}>{token.supply.toLocaleString()}</div>
                      <p style={{ color: '#9ca3af', fontSize: '14px' }}>Supply</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#FFD700', fontWeight: '500', marginBottom: '4px' }}>{token.liquidity.toLocaleString()} Pi</div>
                      <p style={{ color: '#9ca3af', fontSize: '14px' }}>Liquidity</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#FFD700', fontWeight: '500', marginBottom: '4px' }}>{token.price} Pi</div>
                      <p style={{ color: '#9ca3af', fontSize: '14px' }}>Price</p>
                    </div>
                    <Link
                      to={`/swap?token=${token.symbol}`}
                      style={{
                        backgroundColor: '#FFD700',
                        color: '#000000',
                        padding: '8px 24px',
                        borderRadius: '12px',
                        fontWeight: '500',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s',
                        marginLeft: '16px'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
                    >
                      Trade
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ width: '300px' }}>
          <Card>
            <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px', marginBottom: '16px' }}>Create Token</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Launch your own meme coin on Pi Network</p>
            <Link
              to="/create-token"
              style={{
                width: '100%',
                backgroundColor: '#FFD700',
                color: '#000000',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
            >
              Create New Token
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
} 