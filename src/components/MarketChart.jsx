import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MarketChart = ({ coinId, color = "#10b981" }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: '90',
          }
        });

        const priceData = response.data.prices;

        const formattedData = priceData.map(([timestamp, price], index) => {
          const date = new Date(timestamp);
          const day = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

          return {
            name: day,
            price: parseFloat(price.toFixed(2)),
            timestamp: timestamp
          };
        });

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [coinId]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg border border-gray-700 shadow-lg">
          <p className="text-sm text-gray-300">{label}</p>
          <p className="text-lg font-semibold" style={{ color: color }}>
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-2xl h-full">
        <div className="h-8 w-48 bg-gray-700 rounded mb-6 animate-pulse"></div>
        <div className="w-full h-[400px] bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-2xl h-full flex flex-col items-center justify-center">
        <div className="text-red-400 mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-2xl hover:shadow-indigo-500/10 transition-all h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            {coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price Chart
          </span>
        </h3>
        <div className="text-sm text-gray-400">Last 90 days</div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={['dataMin - 1000', 'dataMax + 1000']}
            tickMargin={10}
            width={80}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#4b5563', strokeWidth: 1 }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#1f2937' }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;