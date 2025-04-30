import React, { useState } from 'react';
import { useTokenStore } from '../stores/tokenStore';
import { TokenIcon } from '@web3icons/react';

const ManageTokens = ({ closeModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    allTokens,
    visibleTokens: currentVisibleTokens,
    updateVisibleTokens
  } = useTokenStore();
  
  // Local state for temporary changes
  const [workingVisibleTokens, setWorkingVisibleTokens] = useState([...currentVisibleTokens]);

  const filteredTokens = allTokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (symbol) => {
    setWorkingVisibleTokens(prev => 
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol) // Hide
        : [...prev, symbol] // Show
    );
  };

  const handleApplyChanges = () => {
    updateVisibleTokens(workingVisibleTokens);
    closeModal();
  };

  const handleSelectAll = () => {
    setWorkingVisibleTokens(allTokens.map(token => token.symbol));
  };

  const handleDeselectAll = () => {
    setWorkingVisibleTokens([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Manage Tokens</h2>
          <button 
            onClick={closeModal}
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            ✕
          </button>
        </div>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Tokens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />

        {/* Bulk Actions */}
        <div className="flex gap-2 mb-3">
          <button 
            onClick={handleSelectAll}
            className="text-xs px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            Select All
          </button>
          <button 
            onClick={handleDeselectAll}
            className="text-xs px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            Deselect All
          </button>
        </div>
      
        {/* Token List */}
        <div className="overflow-y-auto flex-1">
          {filteredTokens.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No tokens found</p>
          ) : (
            <ul className="space-y-2">
              {filteredTokens.map(token => (
                <li 
                  key={token.symbol} 
                  className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded transition"
                >
                  <TokenIcon symbol={token.symbol} variant="branded" size="28" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{token.name}</p>
                    <p className="text-xs text-gray-400 truncate">{token.symbol}</p>
                  </div>
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      workingVisibleTokens.includes(token.symbol)
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    } transition`}
                    onClick={() => handleToggle(token.symbol)}
                  >
                    {workingVisibleTokens.includes(token.symbol) ? 'Hide' : 'Show'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-gray-800 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Showing {filteredTokens.length} of {allTokens.length} tokens
          </p>
          <div className="flex gap-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm rounded bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyChanges}
              className="px-4 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-500"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTokens;