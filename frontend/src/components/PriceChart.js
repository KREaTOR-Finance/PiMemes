import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchMarketData } from "../services/api";
import useStore from "../context/store";

export default function PriceChart({ meme_coin_id }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCoin } = useStore();

  const coinToUse = meme_coin_id || selectedCoin;

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await fetchMarketData(coinToUse);
        
        // Transform data for chart
        const formattedData = data.priceHistory.map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString(),
          price: item.price,
        }));
        
        setChartData(formattedData);
        setError(null);
      } catch (err) {
        console.error("Failed to load chart data:", err);
        setError("Failed to load chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [coinToUse]);

  if (loading) {
    return <div className="text-center p-8">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-dark p-4 rounded-lg shadow-lg border border-royalPurple">
      <h2 className="text-xl font-bold mb-4 text-gold">{coinToUse} Price Chart</h2>
      
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#EAEAEA" />
            <YAxis stroke="#EAEAEA" />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1A1A1A", borderColor: "#6A0DAD" }}
              labelStyle={{ color: "#FFD700" }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#FFD700" 
              activeDot={{ r: 8 }} 
              name={`${coinToUse} Price`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 