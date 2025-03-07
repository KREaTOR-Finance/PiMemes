import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../context/store';

// Import icons from Heroicons - add SparklesIcon for Farming
import { 
  HomeIcon, 
  ArrowsRightLeftIcon, 
  ChartBarIcon, 
  PlusCircleIcon, 
  WalletIcon, 
  Bars3Icon, 
  XMarkIcon,
  SparklesIcon,
  UserCircleIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

export default function MainNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isWalletConnected, walletAddress, userProfile, disconnectWallet } = useStore();
  
  const isActive = (path) => location.pathname === path;
  
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div style={{position: 'relative', zIndex: 9999}}>
      {/* Desktop navbar */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        borderBottom: '1px solid rgba(106, 13, 173, 0.3)',
        padding: '12px 0',
        zIndex: 9999
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link to="/home" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none'
          }}>
            <img
              src={`${process.env.PUBLIC_URL}/images/logos/pimemes-logo.svg`}
              alt="PiMemes"
              style={{height: '40px', width: '40px'}}
            />
            <span style={{
              marginLeft: '8px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#a78bfa',
              display: 'none'
            }} className="sm-show">PiMemes</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div style={{
            display: 'none'
          }} className="md-show">
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <Link to="/home" style={{
                color: isActive('/home') ? '#FFD700' : '#d1d5db',
                textDecoration: 'none',
                padding: '8px 12px'
              }}>
                Home
              </Link>
              <Link to="/swap" style={{
                color: isActive('/swap') ? '#FFD700' : '#d1d5db',
                textDecoration: 'none',
                padding: '8px 12px'
              }}>
                Swap
              </Link>
              <Link to="/liquidity" style={{
                color: isActive('/liquidity') ? '#FFD700' : '#d1d5db',
                textDecoration: 'none',
                padding: '8px 12px'
              }}>
                Liquidity
              </Link>
              <Link to="/farming" style={{
                color: isActive('/farming') ? '#FFD700' : '#d1d5db',
                textDecoration: 'none',
                padding: '8px 12px'
              }}>
                Farming
              </Link>
              <Link to="/tokens" style={{
                color: isActive('/tokens') ? '#FFD700' : '#d1d5db',
                textDecoration: 'none',
                padding: '8px 12px'
              }}>
                Tokens
              </Link>
              <Link to="/create-token" style={{
                backgroundColor: '#FFD700',
                color: '#000',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '9999px',
                marginLeft: '8px',
                fontWeight: '500'
              }}>
                Create Token
              </Link>
              
              {isWalletConnected ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(106, 13, 173, 0.3)',
                  border: '1px solid rgba(147, 51, 234, 0.5)',
                  borderRadius: '9999px',
                  padding: '4px 8px 4px 12px',
                  marginLeft: '8px',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  {userProfile && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '8px'
                    }}>
                      <UserCircleIcon style={{height: '20px', width: '20px', color: '#FFD700', marginRight: '4px'}} />
                      <span style={{color: '#FFD700', fontSize: '14px'}}>{userProfile.username}</span>
                    </div>
                  )}
                  <Link to="/wallet" style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#d1d5db',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}>
                    <span style={{color: '#FFD700'}}>{formatAddress(walletAddress)}</span>
                  </Link>
                </div>
              ) : (
                <Link to="/wallet" style={{
                  backgroundColor: 'rgba(106, 13, 173, 0.3)',
                  color: '#d1d5db',
                  border: '1px solid rgba(147, 51, 234, 0.5)',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  marginLeft: '8px'
                }}>
                  Connect Wallet
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'block',
              color: '#FFD700',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
            className="md-hide"
          >
            <Bars3Icon style={{height: '24px', width: '24px'}} />
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid rgba(106, 13, 173, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/logos/pimemes-logo.svg`}
                  alt="PiMemes"
                  style={{height: '32px', width: '32px'}}
                />
                <span style={{
                  marginLeft: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#a78bfa'
                }}>PiMemes</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#FFD700',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <XMarkIcon style={{height: '24px', width: '24px'}} />
              </button>
            </div>
            
            {/* User Profile in Mobile Menu */}
            {isWalletConnected && (
              <div style={{
                padding: '16px',
                borderBottom: '1px solid rgba(106, 13, 173, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <UserCircleIcon style={{height: '24px', width: '24px', color: '#FFD700', marginRight: '8px'}} />
                  <div>
                    {userProfile ? (
                      <span style={{color: '#FFD700', fontWeight: 'bold'}}>{userProfile.username}</span>
                    ) : (
                      <span style={{color: '#d1d5db'}}>No Profile</span>
                    )}
                    <div style={{color: '#d1d5db', fontSize: '14px'}}>{formatAddress(walletAddress)}</div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    disconnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    color: '#d1d5db',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '14px',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Disconnect
                </button>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              gap: '16px'
            }}>
              <Link 
                to="/home" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/home') ? 'rgba(106, 13, 173, 0.3)' : 'transparent',
                  color: isActive('/home') ? '#FFD700' : '#d1d5db',
                  textDecoration: 'none'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon style={{height: '20px', width: '20px', marginRight: '12px'}} />
                Home
              </Link>
              
              <Link 
                to="/swap" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/swap') ? 'rgba(106, 13, 173, 0.3)' : 'transparent',
                  color: isActive('/swap') ? '#FFD700' : '#d1d5db',
                  textDecoration: 'none'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowsRightLeftIcon style={{height: '20px', width: '20px', marginRight: '12px'}} />
                Swap
              </Link>
              
              <Link 
                to="/liquidity" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/liquidity') ? 'rgba(106, 13, 173, 0.3)' : 'transparent',
                  color: isActive('/liquidity') ? '#FFD700' : '#d1d5db',
                  textDecoration: 'none'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ChartBarIcon style={{height: '20px', width: '20px', marginRight: '12px'}} />
                Liquidity
              </Link>
              
              <Link 
                to="/farming" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/farming') ? 'rgba(106, 13, 173, 0.3)' : 'transparent',
                  color: isActive('/farming') ? '#FFD700' : '#d1d5db',
                  textDecoration: 'none'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <SparklesIcon style={{height: '20px', width: '20px', marginRight: '12px'}} />
                Farming
              </Link>
              
              <Link 
                to="/tokens" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/tokens') ? 'rgba(106, 13, 173, 0.3)' : 'transparent',
                  color: isActive('/tokens') ? '#FFD700' : '#d1d5db',
                  textDecoration: 'none'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListBulletIcon style={{height: '20px', width: '20px', marginRight: '12px'}} />
                Tokens
              </Link>
              
              <Link 
                to="/wallet" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/wallet') ? 'rgba(106, 13, 173, 0.3)' : 'transparent',
                  color: isActive('/wallet') ? '#FFD700' : '#d1d5db',
                  textDecoration: 'none'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <WalletIcon style={{height: '20px', width: '20px', marginRight: '12px'}} />
                Wallet
              </Link>
              
              <Link 
                to="/create-token" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFD700',
                  color: '#000',
                  textDecoration: 'none',
                  marginTop: '16px'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircleIcon style={{height: '20px', width: '20px', marginRight: '8px'}} />
                Create Token
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      <div style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        borderTop: '1px solid rgba(106, 13, 173, 0.3)',
        zIndex: 9999
      }} className="sm-show md-hide">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          height: '64px'
        }}>
          <Link 
            to="/home" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive('/home') ? '#FFD700' : '#9ca3af',
              textDecoration: 'none'
            }}
          >
            <HomeIcon style={{height: '24px', width: '24px'}} />
            <span style={{fontSize: '12px', marginTop: '4px'}}>Home</span>
          </Link>
          
          <Link 
            to="/swap" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive('/swap') ? '#FFD700' : '#9ca3af',
              textDecoration: 'none'
            }}
          >
            <ArrowsRightLeftIcon style={{height: '24px', width: '24px'}} />
            <span style={{fontSize: '12px', marginTop: '4px'}}>Swap</span>
          </Link>
          
          <Link 
            to="/create-token" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '-20px',
              textDecoration: 'none'
            }}
          >
            <div style={{
              backgroundColor: '#FFD700',
              borderRadius: '9999px',
              padding: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <PlusCircleIcon style={{height: '24px', width: '24px', color: '#000'}} />
            </div>
            <span style={{
              fontSize: '12px', 
              marginTop: '4px',
              color: isActive('/create-token') ? '#FFD700' : '#9ca3af'
            }}>Create</span>
          </Link>
          
          <Link 
            to="/liquidity" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive('/liquidity') ? '#FFD700' : '#9ca3af',
              textDecoration: 'none'
            }}
          >
            <ChartBarIcon style={{height: '24px', width: '24px'}} />
            <span style={{fontSize: '12px', marginTop: '4px'}}>Pool</span>
          </Link>
          
          <Link 
            to="/wallet" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive('/wallet') ? '#FFD700' : '#9ca3af',
              textDecoration: 'none'
            }}
          >
            <WalletIcon style={{height: '24px', width: '24px'}} />
            <span style={{fontSize: '12px', marginTop: '4px'}}>Wallet</span>
          </Link>
        </div>
      </div>
      
      {/* Content padding for fixed header and footer */}
      <div style={{paddingTop: '64px', paddingBottom: '64px'}}></div>
      
      {/* CSS for responsive display */}
      <style jsx>{`
        .sm-show {
          display: none;
        }
        .md-show {
          display: none;
        }
        .md-hide {
          display: block;
        }
        
        @media (min-width: 640px) {
          .sm-show {
            display: block;
          }
        }
        
        @media (min-width: 768px) {
          .md-show {
            display: block;
          }
          .md-hide {
            display: none;
          }
        }
      `}</style>
    </div>
  );
} 