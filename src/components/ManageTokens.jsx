import React, { useState } from 'react';
import { allSupportedTokens } from '../data/tokenList';
import { getUserVisibleTokens, setUserVisibleTokens } from '../components/utils/storage';
import { TokenIcon } from '@web3icons/react';

const ManageTokens = ({ visibleSymbols, setVisibleSymbols, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = (symbol) => {
    let updated;
    if (visibleSymbols.includes(symbol)) {
      updated = visibleSymbols.filter(s => s !== symbol);
    } else {
      updated = [...visibleSymbols, symbol];
    }
    setVisibleSymbols(updated);
    setUserVisibleTokens(updated);
  };

  const filteredTokens = allSupportedTokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={closeModal} className="text-indigo-400 hover:underline">
            Close
          </button>
        </div>

        <h2 className="text-lg font-bold mb-4">Manage Tokens</h2>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Tokens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      
        <div className="overflow-y-auto max-h-[60vh]">
          <ul className="space-y-2">
            {filteredTokens.map(token => (
              <li key={token.symbol} className="flex justify-between items-center">
                <TokenIcon symbol={token.symbol} variant="branded" size="32" />
                <span className="text-sm font-medium">{token.name} ({token.symbol})</span>
                <button
                  className={`px-4 py-2 text-sm rounded ${
                    visibleSymbols.includes(token.symbol)
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  } hover:bg-opacity-80 transition duration-200`}
                  onClick={() => handleToggle(token.symbol)}
                >
                  {visibleSymbols.includes(token.symbol) ? 'Hide' : 'Show'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageTokens;
