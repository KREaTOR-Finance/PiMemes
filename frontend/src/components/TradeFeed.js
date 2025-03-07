import { useState, useEffect } from "react";

export default function TradeFeed() {
  // Mock trade data
  const [trades, setTrades] = useState([
    { id: 1, type: "buy", coin: "DOGEPI", amount: "1,200", price: "0.00045", time: "2 mins ago", user: "0x8f...3a4b" },
    { id: 2, type: "sell", coin: "MOONPI", amount: "5,600", price: "0.00032", time: "5 mins ago", user: "0x7d...9c2e" },
    { id: 3, type: "buy", coin: "CATPI", amount: "3,400", price: "0.00028", time: "8 mins ago", user: "0x3f...6d1a" },
    { id: 4, type: "buy", coin: "DOGEPI", amount: "8,900", price: "0.00044", time: "12 mins ago", user: "0x2b...7e5f" },
    { id: 5, type: "sell", coin: "MOONPI", amount: "2,300", price: "0.00033", time: "15 mins ago", user: "0x9a...1c8d" },
  ]);

  // Simulate new trades coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const newTrade = {
        id: Date.now(),
        type: Math.random() > 0.5 ? "buy" : "sell",
        coin: ["DOGEPI", "MOONPI", "CATPI"][Math.floor(Math.random() * 3)],
        amount: (Math.floor(Math.random() * 10000) + 100).toLocaleString(),
        price: (0.0001 + Math.random() * 0.0005).toFixed(5),
        time: "Just now",
        user: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      };
      
      setTrades(prevTrades => [newTrade, ...prevTrades.slice(0, 9)]);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark p-4 rounded-lg shadow-lg border border-royalPurple">
      <h2 className="text-xl font-bold mb-4 text-gold">Live Trades</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-royalPurple">
              <th className="py-2 text-left">Type</th>
              <th className="py-2 text-left">Coin</th>
              <th className="py-2 text-left">Amount</th>
              <th className="py-2 text-left">Price</th>
              <th className="py-2 text-left">Time</th>
              <th className="py-2 text-left">User</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.id} className="border-b border-gray-700">
                <td className={`py-3 ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {trade.type.toUpperCase()}
                </td>
                <td className="py-3">{trade.coin}</td>
                <td className="py-3">{trade.amount}</td>
                <td className="py-3">{trade.price}</td>
                <td className="py-3 text-sm text-gray-400">{trade.time}</td>
                <td className="py-3 text-sm">{trade.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 