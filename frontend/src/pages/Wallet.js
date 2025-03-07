import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRightIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import useStore from "../context/store";
import Card from "../components/Card";

export default function Wallet() {
  const { 
    isWalletConnected, 
    walletAddress, 
    walletBalance, 
    walletTokens,
    userProfile,
    connectWallet, 
    disconnectWallet
  } = useStore();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('assets');
  
  useEffect(() => {
    document.querySelector('.wallet-container')?.classList.add('fade-in');
  }, []);
  
  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      connectWallet();
      setIsConnecting(false);
    }, 1500);
  };
  
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gold mb-8 text-center">Wallet</h1>

      {!isWalletConnected ? (
        <div className="max-w-md mx-auto">
          <Card>
            <div className="text-center mb-8">
              <div style={{
                width: '96px',
                height: '96px',
                background: 'linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
              <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px', marginBottom: '12px' }}>Connect Your Wallet</h2>
              <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Connect your wallet to access your portfolio, trade tokens, and more</p>
              
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
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
                  transition: 'background-color 0.2s',
                  cursor: isConnecting ? 'default' : 'pointer',
                  opacity: isConnecting ? 0.7 : 1
                }}
                onMouseOver={(e) => !isConnecting && (e.target.style.backgroundColor = '#f7c600')}
                onMouseOut={(e) => !isConnecting && (e.target.style.backgroundColor = '#FFD700')}
              >
                {isConnecting ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Connect PiTest Wallet"}
              </button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Tabs */}
            <Card style={{ marginBottom: '32px', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => setActiveTab('assets')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    backgroundColor: activeTab === 'assets' ? 'rgba(106, 13, 173, 0.5)' : 'transparent',
                    color: activeTab === 'assets' ? '#FFD700' : '#9ca3af',
                    transition: 'all 0.2s'
                  }}
                >
                  Assets
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    backgroundColor: activeTab === 'activity' ? 'rgba(106, 13, 173, 0.5)' : 'transparent',
                    color: activeTab === 'activity' ? '#FFD700' : '#9ca3af',
                    transition: 'all 0.2s'
                  }}
                >
                  Activity
                </button>
              </div>
            </Card>

            {activeTab === 'assets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* PI Token */}
                <Card>
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
                        <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px' }}>π</span>
                      </div>
                      <div>
                        <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>Pi Network</div>
                        <div style={{ color: '#9ca3af', fontSize: '14px' }}>PI</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>{walletBalance.toFixed(2)}</div>
                      <div style={{ color: '#9ca3af', fontSize: '14px' }}>${(walletBalance * 1).toFixed(2)}</div>
                    </div>
                  </div>
                </Card>
                
                {/* Meme Tokens */}
                <Card title="Meme Tokens">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <Link 
                      to="/swap" 
                      style={{
                        backgroundColor: 'rgba(106, 13, 173, 0.5)',
                        color: '#FFD700',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.7)'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.5)'}
                    >
                      Get More <ChevronRightIcon style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
                    </Link>
                  </div>
                  
                  {walletTokens.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {walletTokens.map((token, index) => (
                        <div 
                          key={index} 
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
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '12px'
                            }}>
                              <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{token.symbol.charAt(0)}</span>
                            </div>
                            <div>
                              <div style={{ color: '#FFD700', fontWeight: '500' }}>{token.symbol}</div>
                              <div style={{ color: '#9ca3af', fontSize: '14px' }}>{token.balance.toLocaleString()} tokens</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#FFD700', fontWeight: '500' }}>{token.value.toFixed(2)} PI</div>
                            <div style={{ color: '#10b981', fontSize: '12px' }}>+5.2% (24h)</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '40px 0', 
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px' 
                    }}>
                      <CurrencyDollarIcon style={{ width: '48px', height: '48px', color: '#6b7280', margin: '0 auto 12px' }} />
                      <p style={{ color: '#9ca3af', marginBottom: '16px' }}>You don't have any meme tokens yet</p>
                      <Link 
                        to="/swap" 
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
                        Get Your First Token
                      </Link>
                    </div>
                  )}
                </Card>
              </div>
            )}
            
            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <Card title="Transaction History">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '24px' 
                }}>
                  <div style={{ color: '#9ca3af', fontSize: '14px' }}>Last 30 days</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { type: "Buy", token: "DOGEPI", amount: "5,000", value: "0.6 PI", time: "2 hours ago" },
                    { type: "Sell", token: "MOONPI", amount: "2,500", value: "0.5 PI", time: "1 day ago" },
                    { type: "Add Liquidity", token: "DOGEPI", amount: "1,000", value: "0.12 PI", time: "3 days ago" },
                    { type: "Buy", token: "SHIBPI", amount: "10,000", value: "1.2 PI", time: "5 days ago" },
                    { type: "Sell", token: "DOGEPI", amount: "2,000", value: "0.24 PI", time: "1 week ago" }
                  ].map((tx, index) => (
                    <div 
                      key={index} 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
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
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          backgroundColor: tx.type === 'Buy' ? 'rgba(16, 185, 129, 0.2)' : 
                                         tx.type === 'Sell' ? 'rgba(239, 68, 68, 0.2)' : 
                                         'rgba(59, 130, 246, 0.2)'
                        }}>
                          <span style={{
                            fontSize: '18px',
                            color: tx.type === 'Buy' ? '#10b981' : 
                                   tx.type === 'Sell' ? '#ef4444' : 
                                   '#3b82f6'
                          }}>
                            {tx.type === 'Buy' ? '↓' : tx.type === 'Sell' ? '↑' : '↔'}
                          </span>
                        </div>
                        <div>
                          <div style={{ color: '#FFD700', fontWeight: '500' }}>{tx.type} {tx.token}</div>
                          <div style={{ color: '#9ca3af', fontSize: '12px' }}>{tx.time}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          color: tx.type === 'Buy' || tx.type === 'Add Liquidity' ? '#ef4444' : '#10b981',
                          fontWeight: '500'
                        }}>
                          {tx.type === 'Buy' || tx.type === 'Add Liquidity' ? '-' : '+'}{tx.value}
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '12px' }}>{tx.amount} tokens</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div>
            {/* Profile Section */}
            <Card title="Profile" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <button 
                  onClick={() => setShowProfileModal(true)}
                  style={{
                    backgroundColor: 'rgba(106, 13, 173, 0.5)',
                    color: '#FFD700',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.7)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.5)'}
                >
                  {userProfile ? "Edit Profile" : "Create Profile"}
                </button>
              </div>
              
              {userProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(to right, rgba(106, 13, 173, 0.5), rgba(106, 13, 173, 0.3))',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>{userProfile.username[0]}</span>
                    </div>
                    <div>
                      <div style={{ color: '#FFD700', fontWeight: 'bold' }}>{userProfile.username}</div>
                      <div style={{ color: '#9ca3af', fontSize: '14px' }}>{formatAddress(walletAddress)}</div>
                    </div>
                  </div>
                  {userProfile.bio && (
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>{userProfile.bio}</p>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ color: '#9ca3af', marginBottom: '16px' }}>Create a profile to personalize your experience</p>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    style={{
                      backgroundColor: '#FFD700',
                      color: '#000000',
                      padding: '8px 24px',
                      borderRadius: '12px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
                  >
                    Create Profile
                  </button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <Link 
                  to="/swap" 
                  style={{
                    backgroundColor: 'rgba(106, 13, 173, 0.5)',
                    color: '#FFD700',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.7)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.5)'}
                >
                  <ArrowsRightLeftIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                  <span>Swap</span>
                </Link>
                <Link 
                  to="/liquidity" 
                  style={{
                    backgroundColor: 'rgba(106, 13, 173, 0.5)',
                    color: '#FFD700',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.7)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(106, 13, 173, 0.5)'}
                >
                  <ChartBarIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                  <span>Liquidity</span>
                </Link>
              </div>
              <button
                onClick={disconnectWallet}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  padding: '12px',
                  borderRadius: '12px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
              >
                Disconnect Wallet
              </button>
            </Card>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
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
          <ProfileModal 
            onClose={() => setShowProfileModal(false)} 
            existingProfile={userProfile}
          />
        </div>
      )}

      <style jsx>{`
        .fade-in {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

// Profile Modal Component
function ProfileModal({ onClose, existingProfile }) {
  const { updateProfile } = useStore();
  const [formData, setFormData] = useState({
    username: existingProfile?.username || "",
    bio: existingProfile?.bio || "",
    avatar: existingProfile?.avatar || "default"
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    onClose();
  };
  
  return (
    <Card style={{ width: '100%', maxWidth: '400px' }}>
      <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px', marginBottom: '24px' }}>
        {existingProfile ? "Edit Your Profile" : "Create Your Profile"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px', fontWeight: '500' }}>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(106, 13, 173, 0.5)',
              borderRadius: '12px',
              padding: '12px',
              color: '#e5e7eb',
              outline: 'none'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px', fontWeight: '500' }}>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(106, 13, 173, 0.5)',
              borderRadius: '12px',
              padding: '12px',
              color: '#e5e7eb',
              outline: 'none',
              resize: 'vertical',
              minHeight: '100px'
            }}
            placeholder="Tell us about yourself (optional)"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#FFD700',
              color: '#000000',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: '#FFD700',
              color: '#000000',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
          >
            {existingProfile ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </form>
    </Card>
  );
} 