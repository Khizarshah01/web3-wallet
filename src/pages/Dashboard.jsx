import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontFoot from '../components/FrontFoot';
import axios from 'axios';
import { allSupportedTokens } from '../data/tokenList';
import { getBalance } from '../components/utils/getBalance';
import ManageTokens from '../components/ManageTokens';
import { getUserVisibleTokens, setUserVisibleTokens } from '../components/utils/storage';
import { Eye, Copy, ArrowUpRight, ArrowDownLeft} from 'lucide-react';
import { TokenIcon } from '@web3icons/react';
import { Plus, RefreshCw, Send, ArrowDown } from 'lucide-react';
import Qrcode from '../components/Qrcode';
import Sidebar from '../components/Sidebar';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';



const Dashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [visibleSymbols, setVisibleSymbols] = useState(getUserVisibleTokens());
  const [showTokenManager, setShowTokenManager] = useState(false);
  const [activeTab, setActiveTab] = useState('tokens');
  const [address, setAddress] = useState({});
  const [selectedWallet, setSelectedWallet] = useState('ethereum');
  const navigate = useNavigate();

  const dummyData = [
    { name: 'Jan', price: 400 },
    { name: 'Feb', price: 500 },
    { name: 'Mar', price: 470 },
    { name: 'Apr', price: 520 },
    { name: 'May', price: 600 },
  ];

  const totalBalance = tokens.reduce(
    (sum, token) => sum + token.balance * token.price,
    0
  );

  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem("wallet_addresses"));
    const logIn = localStorage.getItem('wallet_logged_in');

    if (!storedAddresses || logIn !== "true") {
      navigate('/login');
      return;
    }
    setAddress(storedAddresses);

    const fetchData = async () => {
      const filtered = allSupportedTokens.filter(token =>
        visibleSymbols.includes(token?.symbol)
      );
      // console.log(filtered);

      const balances = await Promise.all(
        filtered.map(async (token) => {
          const balance = await getBalance(token.symbol, storedAddresses);
          return { ...token, balance };
        })
      );

      try {
        const tokenIds = filtered.map(token => token.name.toLowerCase()).join(',');
        // console.log(tokenIds);
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: tokenIds,
            vs_currencies: 'usd',
          },
        });
        // console.log(response);

        const updatedTokens = balances.map(token => ({
          ...token,
          price: response.data[token.name.toLowerCase()]?.usd || 0, // Default to 0 if price is not found
        }));
        // console.log(updatedTokens);
        setTokens(updatedTokens);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchData();
  }, [navigate, selectedWallet, visibleSymbols]);

  return (
    <div className="bg-neutral-950 min-h-screen text-gray-100">
      {/* <FrontFoot selectedWallet={selectedWallet} setSelectedWallet={setSelectedWallet} /> */}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">

          {/* Left Cards */}
          <div className="flex flex-col gap-6">
            {/* Total Balance Card */}
            <div className="bg-neutral-900 p-6 rounded-2xl shadow-md flex flex-col justify-between hover:shadow-lg transition h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400 text-sm">Total Balance</div>
                <button className="text-gray-400 hover:text-white">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
              <div className="text-3xl font-bold mb-6">${totalBalance.toFixed(2)}</div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-neutral-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col gap-6 h-full">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/send')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary-900/30 hover:bg-primary-900/50 transition"
                >
                  <div className="p-3 rounded-full bg-primary-900/50 mb-2">
                    <Send className="h-5 w-5 text-primary-400" />
                  </div>
                  <span className="text-sm font-medium">Send</span>
                </button>

                <button
                  onClick={() => navigate('/receive')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary-900/30 hover:bg-primary-900/50 transition"
                >
                  <div className="p-3 rounded-full bg-primary-900/50 mb-2">
                    <ArrowDown className="h-5 w-5 text-primary-400" />
                  </div>
                  <span className="text-sm font-medium">Receive</span>
                </button>

                <button
                  onClick={() => setShowTokenManager(true)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition col-span-2"
                >
                  <div className="p-3 rounded-full bg-neutral-700 mb-2">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">Add Token</span>
                </button>
              </div>
            </div>
          </div>

          {/* Market Chart Right Side */}
          <div className="md:col-span-2 bg-neutral-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between h-full">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Market Overview</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dummyData}>
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>


        {/* Token List */}
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg grid gap-6 ">
          <div>Assests</div>
          {/* Tabs */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-4 py-2 rounded-md ${activeTab === 'tokens' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Tokens
            </button>
            <button
              onClick={() => setActiveTab('nfts')}
              className={`px-4 py-2 rounded-md ${activeTab === 'nfts' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              NFTs
            </button>
          </div>

          {/* Tokens Table */}
          {activeTab === 'tokens' && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-gray-400 uppercase text-xs border-b border-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left">Tokens</th>
                    <th className="py-2 px-4 text-right">Price</th>
                    <th className="py-2 px-4 text-right">Balance</th>
                    <th className="py-2 px-4 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
  {tokens.map((token, index) => (
    <tr
      key={index}
      onClick={() => navigate(`/token/${token.name.toLowerCase()}`)}
      className="cursor-pointer border-b border-gray-700 hover:bg-gray-700/30 transition"
    >
      <td className="py-3 px-4 flex items-center gap-3">
        <TokenIcon symbol={token.symbol} variant="branded" size="32" />
        <div>
          <div className="font-semibold">{token.symbol}</div>
          <div className="text-xs text-gray-400">{token.name}</div>
        </div>
      </td>
      <td className="py-3 px-4 text-right">${token.price.toFixed(2)}</td>
      <td className="py-3 px-4 text-right">{token.balance.toFixed(4)}</td>
      <td className="py-3 px-4 text-right font-semibold">
        ${(token.balance * token.price).toFixed(2)}
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          )}

          {/* NFTs Section */}
          {activeTab === 'nfts' && (
            <div className="text-center text-gray-400">
              <p>No NFTs found.</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg my-6">
          <div className="text-gray-200 text-xl font-bold mb-4">Recent Activity</div>
          <p className="text-sm text-gray-400">No transactions yet.</p>
        </div>
      </div>

      {/* Token Manager Modal */}
      {showTokenManager && (
        <ManageTokens
          visibleSymbols={visibleSymbols}
          setVisibleSymbols={setVisibleSymbols}
          closeModal={() => setShowTokenManager(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
