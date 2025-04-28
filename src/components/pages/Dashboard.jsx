import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontFoot from '../FrontFoot';
import axios from 'axios';
import { allSupportedTokens } from '../data/tokenList';
import { getBalance } from '../utils/getBalance';
import ManageTokens from '../ManageTokens';
import { getUserVisibleTokens, setUserVisibleTokens } from '../utils/storage';
import { Eye, Copy, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { TokenIcon } from '@web3icons/react';
import Qrcode from '../Qrcode';
const Dashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [visibleSymbols, setVisibleSymbols] = useState(getUserVisibleTokens());
  const [showTokenManager, setShowTokenManager] = useState(false);
  const [activeTab, setActiveTab] = useState('tokens');
  const [address, setAddress] = useState({});
  const [selectedWallet, setSelectedWallet] = useState('ethereum');
  const navigate = useNavigate();

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

      const balances = await Promise.all(
        filtered.map(async (token) => {
          const balance = await getBalance(token.symbol, storedAddresses);
          return { ...token, balance };
        })
      );

      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'ethereum,bitcoin,solana',
            vs_currencies: 'usd',
          },
        });

        const prices = {
          ETH: response.data.ethereum.usd,
          BTC: response.data.bitcoin.usd,
          SOL: response.data.solana.usd,
        };

        const updated = balances.map(token => ({
          ...token,
          price: prices[token.symbol] || 0,
        }));

        setTokens(updated);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchData();
  }, [navigate, selectedWallet, visibleSymbols]);

  return (
    <div className="bg-neutral-950 min-h-screen text-gray-100">
      <FrontFoot selectedWallet={selectedWallet} setSelectedWallet={setSelectedWallet} />

      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className="bg-neutral-900 p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <div className="text-gray-400 text-sm mb-2">Total Balance</div>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">${totalBalance.toFixed(2)}</div>
              <button className="text-gray-400 hover:text-white">
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Account */}
          <div className="bg-neutral-800 p-6 rounded-xl shadow-lg md:col-span-2">
            <div className="text-gray-200 text-lg font-semibold mb-4">Account</div>
              Wallet address Eth
            <div className="flex items-center justify-between gap-2">
              <code className="bg-gray-700 text-xs p-2 rounded-md">
                {address.eth}
              </code>
              <button className="text-gray-400 hover:text-white">
                <Copy className="h-5 w-5" />
              </button>
            </div>
            {/* <Qrcode address={address.eth} /> */}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            <ArrowUpRight className="h-4 w-4" /> Send
          </button>
          <button className="flex items-center gap-2 bg-gray-700 text-gray-200 px-6 py-2 rounded-md hover:bg-gray-600">
            <ArrowDownLeft className="h-4 w-4" /> Receive
          </button>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            onClick={() => setShowTokenManager(true)}
          >
            + Add Token
          </button>
        </div>

        {/* Token List */}
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg grid gap-6">
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
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/30 transition">
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
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg">
          <div className="text-gray-200 text-xl font-bold mb-4">Recent Activity</div>
          <p className="text-sm text-gray-400">No transactions yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
