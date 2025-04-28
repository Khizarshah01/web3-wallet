import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, RefreshCw, MoreHorizontal, Trash2 } from 'lucide-react';

function TokenDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Sample tokens data (you should replace this with your actual data)
  const tokens = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', balance: '1.23', price: '54000', logoUrl: '', address: '0x1234567890abcdef', decimals: 8, network: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', balance: '2.56', price: '1800', logoUrl: '', address: '0xabcdef1234567890', decimals: 18, network: 'Ethereum' }
  ];
  
  const token = tokens.find(t => t.id === id);

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center p-8">
        <p className="text-neutral-500">Token not found</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleRemoveToken = () => {
    // Replace with actual remove token logic
    console.log(`Removing token: ${token.name}`);
    navigate('/dashboard');
  };

  const calculateValue = (balance, price) => {
    return (parseFloat(balance) * parseFloat(price)).toFixed(2);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-full hover:bg-neutral-700"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-400" />
        </button>
        <h1 className="text-2xl font-bold ml-4 text-white">{token.name}</h1>

        <div className="ml-auto relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-neutral-700"
          >
            <MoreHorizontal className="h-5 w-5 text-neutral-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-md bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10">
              <button
                onClick={handleRemoveToken}
                className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-neutral-700"
              >
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                Remove Token
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Token Card */}
      <div className="bg-neutral-800 rounded-2xl p-6 mb-6 shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {token.logoUrl ? (
              <img
                src={token.logoUrl}
                alt={token.name}
                className="w-14 h-14 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="w-14 h-14 bg-primary-700 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {token.symbol.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">{token.balance || '0'} {token.symbol}</h2>
              {token.price && (
                <p className="text-neutral-400 text-sm">
                  ${calculateValue(token.balance || '0', token.price)}
                </p>
              )}
            </div>
          </div>
          <button className="p-2 hover:bg-neutral-700 rounded-full">
            <RefreshCw className="h-5 w-5 text-neutral-400" />
          </button>
        </div>

        <div className="h-36 bg-neutral-700 rounded-lg flex items-center justify-center mb-6">
          <p className="text-neutral-500">Chart placeholder</p>
        </div>

        {/* Send and Receive */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/send')} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition"
          >
            <Send className="h-5 w-5 text-white" />
            Send
          </button>
          <button 
            onClick={() => navigate('/receive')} 
            className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl font-semibold transition"
          >
            Receive
          </button>
        </div>
      </div>

      {/* Token Information */}
      <div className="bg-neutral-800 rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold text-white mb-4">Token Information</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-neutral-400">Contract</span>
            <span className="font-medium text-white">{token.address.slice(0, 6)}...{token.address.slice(-4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Decimals</span>
            <span className="font-medium text-white">{token.decimals}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Network</span>
            <span className="font-medium text-white">{token.network}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenDetails;
