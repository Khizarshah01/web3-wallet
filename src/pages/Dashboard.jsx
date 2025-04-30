import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenStore } from '../stores/tokenStore';
import ManageTokens from '../components/ManageTokens';
import { Eye, Copy, ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, Send, ArrowDown } from 'lucide-react';
import { TokenIcon } from '@web3icons/react';
import MarketChart from '../components/MarketChart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    tokens,
    visibleTokens,
    fetchTokenData,
    toggleTokenVisibility,
    allTokens
  } = useTokenStore();

  const [showTokenManager, setShowTokenManager] = useState(false);
  const [activeTab, setActiveTab] = useState('tokens');
  const [selectedWallet, setSelectedWallet] = useState('ethereum');

  // Calculate total balance
  const totalBalance = tokens.reduce(
    (sum, token) => sum + (token.balance || 0) * token.price,
    0
  );

  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem("wallet_addresses"));
    const logIn = localStorage.getItem('wallet_logged_in');

    if (!storedAddresses || logIn !== "true") {
      navigate('/login');
      return;
    }

    fetchTokenData();
  }, [navigate, selectedWallet, visibleTokens]);

  const portfolioData = tokens.map(token => ({
    name: token.symbol,
    value: (token.balance || 0) * token.price,
    color: token.symbol === 'BTC' ? '#f7931a' :
      token.symbol === 'ETH' ? '#627eea' :
        token.symbol === 'SOL' ? '#00ffbd' :
          '#8b5cf6' // default purple
  }));
  const twentyFourHourChange = 2.45;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-2xl hover:shadow-indigo-500/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm font-medium">Total Portfolio Value</div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Eye className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent mb-1">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center text-sm">
                  {twentyFourHourChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={twentyFourHourChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {Math.abs(twentyFourHourChange)}%
                  </span>
                  <span className="text-gray-400 ml-1">24h</span>
                </div>
              </div>

              {tokens.length > 0 && (
                <div className="w-60 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {portfolioData.slice(0, 3).map((token) => (
                <div key={token.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: token.color }}
                  />
                  <span className="text-xs text-gray-400">
                    {token.name} {(token.value / totalBalance * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Quick Actions Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-2xl hover:shadow-indigo-500/10 transition-all">
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/send')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-indigo-900/30 hover:bg-indigo-900/50 transition-all hover:shadow-md"
              >
                <div className="p-3 rounded-full bg-indigo-900/50 mb-2">
                  <Send className="h-5 w-5 text-indigo-400" />
                </div>
                <span className="text-sm font-medium">Send</span>
              </button>

              <button
                onClick={() => navigate('/receive')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/50 transition-all hover:shadow-md"
              >
                <div className="p-3 rounded-full bg-emerald-900/50 mb-2">
                  <ArrowDown className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Receive</span>
              </button>

              <button
                onClick={() => setShowTokenManager(true)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all hover:shadow-md col-span-2"
              >
                <div className="p-3 rounded-full bg-gray-600 mb-2">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Manage Tokens</span>
              </button>
            </div>
          </div>

          {/* Market Chart */}
          <MarketChart coinId={'bitcoin'} />
        </div>

        {/* Token List */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-2xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Assets</h2>
            <div className="flex gap-2 bg-gray-700/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('tokens')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'tokens' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
              >
                Tokens
              </button>
              <button
                onClick={() => setActiveTab('nfts')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'nfts' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
              >
                NFTs
              </button>
            </div>
          </div>

          {activeTab === 'tokens' && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="text-gray-400 text-xs border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Asset</th>
                    <th className="py-3 px-4 text-right font-medium">Price</th>
                    <th className="py-3 px-4 text-right font-medium">Balance</th>
                    <th className="py-3 px-4 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, index) => (
                    <tr
                      key={index}
                      onClick={() => navigate(`/token/${token.symbol}`)}
                      className="cursor-pointer border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <TokenIcon symbol={token.symbol} variant="branded" size="32" className="flex-shrink-0" />
                          <div>
                            <div className="font-semibold">{token.symbol}</div>
                            <div className="text-xs text-gray-400">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                      <td className="py-4 px-4 text-right">{token.balance?.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 }) || '0.0000'}</td>
                      <td className="py-4 px-4 text-right font-medium">
                        ${((token.balance || 0) * token.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'nfts' && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No NFTs found in your wallet</div>
              <button
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                onClick={() => navigate('/import-nfts')}
              >
                Import NFTs
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              View All
            </button>
          </div>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No transactions yet</div>
            <button
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              onClick={() => navigate('/send')}
            >
              Make your first transaction
            </button>
          </div>
        </div>
      </div>

      {showTokenManager && (
        <ManageTokens
          visibleSymbols={visibleTokens}
          setVisibleSymbols={(symbol) => toggleTokenVisibility(symbol)}
          closeModal={() => setShowTokenManager(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;