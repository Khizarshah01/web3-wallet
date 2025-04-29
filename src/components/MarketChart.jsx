import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const MarketChart = ({ coinId, color = "#10b981" }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
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
            price: price.toFixed(2),
          };
        });

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, [coinId]);


  return (
    <div className="md:col-span-2 bg-neutral-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between h-full">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">Bitcoin Overview</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis 
            stroke="#888888" 
            domain={['auto', 'auto']} 
            ticks={[60000,70000,80000,90000,100000,110000]} 
          />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={true} 
             />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;
