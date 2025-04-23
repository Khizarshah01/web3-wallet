import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontFoot from '../FrontFoot';
import axios from 'axios';
import { allSupportedTokens } from '../data/tokenList';
import { getBalance } from '../utils/getBalance';
import ManageTokens from '../ManageTokens';
import { getUserVisibleTokens, setUserVisibleTokens } from '../utils/storage';

const defaultTokens = [
  { name: 'Bitcoin', symbol: 'BTC', balance: 0.0, price: 0 },
  { name: 'Ethereum', symbol: 'ETH', balance: 0.9, price: 0 },
  { name: 'Solana', symbol: 'SOL', balance: 0, price: 0 },
];

const Dashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [visibleSymbols, setVisibleSymbols] = useState(getUserVisibleTokens());
  const [showTokenManager, setShowTokenManager] = useState(false);
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
      console.warn('Invalid or missing mnemonic');
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
    <div className="bg-gray-100 min-h-screen">
      <FrontFoot selectedWallet={selectedWallet} setSelectedWallet={setSelectedWallet} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-gray-800 text-3xl font-semibold mb-6">
          ${totalBalance.toFixed(2)}
          <p className="text-sm text-gray-500">Total Wallet Balance</p>
        </div>
        {showTokenManager && (
  <ManageTokens
    visibleSymbols={visibleSymbols}
    setVisibleSymbols={setVisibleSymbols}
    closeModal={() => setShowTokenManager(false)}
  />
)}
        <div className="flex gap-4 mb-8">
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            onClick={() => setShowTokenManager(true)}
          >
            + Add Token
          </button>

          <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400">
            Send
          </button>
          <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400">
            Receive
          </button>
        </div>

        <div className="grid gap-4 mb-8">
          {tokens.map((token, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium">{token.name}</h3>
                <p className="text-sm text-gray-500">
                  {token.balance} {token.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="text-md font-semibold">
                  ${(token.balance * token.price).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  (${token.price.toFixed(2)} / {token.symbol})
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="feed bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Transactions</h2>
          <p className="text-sm text-gray-500">No transactions yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
