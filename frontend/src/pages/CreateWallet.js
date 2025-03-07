import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../context/store";

export default function CreateWallet() {
  const { connectWallet } = useStore();
  const [step, setStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  
  const generateWallet = async () => {
    setIsGenerating(true);
    try {
      // In production, this would use the Pi Browser SDK
      const randomAddress = "0x" + Array(40).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      
      await connectWallet(randomAddress);
      setWalletAddress(randomAddress);
      setStep(2);
    } catch (error) {
      console.error("Error generating wallet:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const connectExistingWallet = async () => {
    setIsConnecting(true);
    try {
      // In production, this would use the Pi Browser SDK to connect
      await connectWallet();
      navigate("/create-profile");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const saveWallet = () => {
    navigate("/create-profile");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <div className="bg-dark border border-royalPurple rounded-lg p-6 shadow-lg">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gold mb-2">Create Pi Wallet</h1>
                <p className="text-lightGray">Choose an option to get started with your Pi wallet</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <button
                  onClick={generateWallet}
                  disabled={isGenerating}
                  className="w-full bg-royalPurple text-gold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-all disabled:opacity-70"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Create New Wallet"
                  )}
                </button>
                
                <div className="relative flex items-center justify-center">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="mx-4 text-sm text-gray-400">OR</span>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>
                
                <button
                  onClick={connectExistingWallet}
                  disabled={isConnecting}
                  className="w-full border border-royalPurple text-gold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-royalPurple hover:bg-opacity-20 transition-all disabled:opacity-70"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    "Connect Existing Wallet"
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <Link to="/welcome" className="text-sm text-gray-400 hover:text-gold">
                  Back to Welcome
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-dark border border-royalPurple rounded-lg p-6 shadow-lg">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gold mb-2">Wallet Created!</h1>
                <p className="text-lightGray">Your Pi wallet has been successfully created</p>
              </div>
              
              <div className="mb-6">
                <div className="bg-dark border border-gray-700 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Your Wallet Address:</p>
                  <p className="text-sm text-gold font-mono break-all">{walletAddress}</p>
                </div>
                
                <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-3">
                  <p className="text-sm text-yellow-500">
                    <span className="font-bold">Important:</span> Save this wallet address securely. You'll need it to access your funds.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={saveWallet}
                  className="w-full bg-royalPurple text-gold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-all"
                >
                  Continue to Profile Setup
                </button>
                
                <button
                  onClick={() => setStep(1)}
                  className="w-full border border-royalPurple text-gold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-royalPurple hover:bg-opacity-20 transition-all"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 