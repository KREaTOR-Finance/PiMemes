import { useEffect } from "react";
import CreateToken from "../components/CreateToken";
import useTokenStore from "../context/tokenStore";
import WalletDisplay from "../components/WalletDisplay";

export default function CreateTokenPage() {
  const { loadTokens, tokens, loading } = useTokenStore();

  useEffect(() => {
    loadTokens().catch(console.error);
  }, [loadTokens]);

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gold mb-6 text-center">Create Your Meme Coin</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CreateToken />
          
          {tokens.length > 0 && (
            <div className="mt-6 bg-dark p-4 rounded-lg shadow-lg border border-purple-700/50">
              <h2 className="text-xl font-bold mb-4 text-gold">Your Created Tokens</h2>
              
              {loading ? (
                <p className="text-center text-gray-400">Loading tokens...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-purple-700/50">
                        <th className="py-2 text-left text-gold">Name</th>
                        <th className="py-2 text-left text-gold">Supply</th>
                        <th className="py-2 text-left text-gold">Creator %</th>
                        <th className="py-2 text-left text-gold">Liquidity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, index) => (
                        <tr key={index} className="border-b border-purple-700/30">
                          <td className="py-3 text-gray-300">{token.name}</td>
                          <td className="py-3 text-gray-300">{Number(token.supply).toLocaleString()}</td>
                          <td className="py-3 text-gray-300">{token.creatorAllocation}%</td>
                          <td className="py-3 text-gray-300">{Number(token.initialLiquidity).toLocaleString()} PI</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-dark p-4 rounded-lg shadow-lg border border-purple-700/50">
            <h2 className="text-lg font-bold mb-3 text-gold">Your Wallet</h2>
            <WalletDisplay />
          </div>
          
          <div className="mt-6 bg-dark p-4 rounded-lg shadow-lg border border-purple-700/50">
            <h2 className="text-lg font-bold mb-3 text-gold">Token Creation Guide</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
              <li>Choose a unique name for your meme coin</li>
              <li>Set a total supply (recommended: 1 billion+)</li>
              <li>Creator allocation cannot exceed 30%</li>
              <li>Total tax must be 49% or lower</li>
              <li>Initial liquidity helps your token get trading volume</li>
              <li>Enable minting if you want to create more tokens later</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 