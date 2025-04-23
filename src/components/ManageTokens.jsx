// src/components/ManageTokens.jsx
import React from 'react';
import { allSupportedTokens } from '../components/data/tokenList';
import { getUserVisibleTokens, setUserVisibleTokens } from '../components/utils/storage';

const ManageTokens = ({ visibleSymbols, setVisibleSymbols, closeModal }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Manage Tokens</h2>
        <ul className="space-y-2">
          {allSupportedTokens.map(token => (
            <li key={token.symbol} className="flex justify-between items-center">
              <span>{token.name} ({token.symbol})</span>
              <button
                className={`px-3 py-1 text-sm rounded ${
                  visibleSymbols.includes(token.symbol)
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
                onClick={() => handleToggle(token.symbol)}
              >
                {visibleSymbols.includes(token.symbol) ? 'Hide' : 'Show'}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <button onClick={closeModal} className="text-indigo-600 hover:underline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTokens;
