import { Link } from "react-router-dom";
import useStore from "../context/store";

export default function Welcome() {
  const { isWalletConnected, userProfile } = useStore();

  const features = [
    {
      title: "Create Meme Coins",
      description: "Launch your own Pi Network meme coins with custom tokenomics",
      link: "/create-token",
      icon: "➕"
    },
    {
      title: "Trade & Swap",
      description: "Easily swap Pi for meme coins",
      link: "/swap",
      icon: "💱"
    },
    {
      title: "Provide Liquidity",
      description: "Earn fees by providing liquidity",
      link: "/liquidity",
      icon: "💧"
    }
  ];

  return (
    <div className="welcome-container" style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#FFD700',
          marginBottom: '1rem'
        }}>
          Welcome to PiMemes
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#9ca3af',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          The premier platform for creating and trading meme coins on Pi Network
        </p>
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto 3rem'
      }}>
        {features.map((feature, index) => (
          <Link 
            key={index}
            to={feature.link}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '1rem',
              padding: '2rem',
              transition: 'transform 0.2s, background-color 0.2s',
              cursor: 'pointer',
              border: '1px solid #333',
              height: '100%',
              ':hover': {
                transform: 'translateY(-5px)',
                backgroundColor: '#222'
              }
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                {feature.icon}
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#FFD700',
                marginBottom: '1rem'
              }}>
                {feature.title}
              </h2>
              <p style={{
                color: '#9ca3af',
                fontSize: '1rem'
              }}>
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Get Started Section */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '1rem',
        border: '1px solid #333'
      }}>
        <h2 style={{
          color: '#FFD700',
          marginBottom: '1.5rem',
          fontSize: '1.8rem'
        }}>
          Get Started
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link 
            to="/create-wallet" 
            style={{
              backgroundColor: !isWalletConnected ? '#FFD700' : '#4a5568',
              color: !isWalletConnected ? '#000' : '#9ca3af',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            {isWalletConnected ? 'Wallet Connected' : 'Create Wallet'}
          </Link>

          <Link 
            to="/create-profile"
            style={{
              backgroundColor: isWalletConnected && !userProfile ? '#FFD700' : '#4a5568',
              color: isWalletConnected && !userProfile ? '#000' : '#9ca3af',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              pointerEvents: isWalletConnected ? 'auto' : 'none',
              opacity: isWalletConnected ? 1 : 0.5
            }}
          >
            {userProfile ? 'Profile Created' : 'Create Profile'}
          </Link>

          <Link 
            to="/home"
            style={{
              backgroundColor: 'rgba(106, 13, 173, 0.5)',
              color: '#FFD700',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            Skip & Explore App
          </Link>
        </div>
      </div>
    </div>
  );
} 