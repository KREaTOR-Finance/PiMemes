import { Link } from "react-router-dom";
import Card from "./Card";

export default function TokenCard({ token }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>{token.symbol}</span>
          </div>
          <div>
            <h3 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px', margin: '0 0 4px 0' }}>{token.name}</h3>
            <p style={{ color: '#9ca3af', margin: 0 }}>Meme Token</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#9ca3af' }}>Supply: </span>
            <span style={{ color: '#FFD700' }}>{token.totalSupply.toLocaleString()}</span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#9ca3af' }}>Liquidity: </span>
            <span style={{ color: '#FFD700' }}>{token.liquidity.toLocaleString()} Pi</span>
          </div>
          <div>
            <span style={{ color: '#9ca3af' }}>Price: </span>
            <span style={{ color: '#FFD700' }}>{token.price} Pi</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
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
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
        >
          Trade {token.name}
        </Link>
      </div>
    </Card>
  );
} 