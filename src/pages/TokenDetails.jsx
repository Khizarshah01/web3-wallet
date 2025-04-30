import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Download, RefreshCw, MoreHorizontal, Trash2, Copy, ExternalLink } from 'lucide-react';
import { TokenIcon } from '@web3icons/react';
import { useTokenStore } from '../stores/tokenStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TokenDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  
  const { tokens, removeToken, fetchTokenData } = useTokenStore();
  const token = tokens.find(t => t.symbol === symbol);
  const storedAddresses = JSON.parse(localStorage.getItem("wallet_addresses")) || {};
  const tokenAddress = storedAddresses[symbol?.toLowerCase()];

  const handleRemoveToken = () => {
    removeToken(symbol);
    toast.success(`${symbol} removed successfully`);
    navigate('/dashboard');
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchTokenData();
      toast.success('Token data refreshed');
    } catch (error) {
      toast.error('Failed to refresh token data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard');
  };

  const openInExplorer = () => {
    if (!tokenAddress) return;
    let url = '';
    switch (token.network) {
      case 'ethereum':
        url = `https://etherscan.io/token/${tokenAddress}`;
        break;
      case 'solana':
        url = `https://solscan.io/token/${tokenAddress}`;
        break;
      default:
        url = `https://etherscan.io/token/${tokenAddress}`;
    }
    window.open(url, '_blank');
  };

  const calculateValue = (balance, price) => {
    return (parseFloat(balance || 0) * parseFloat(price || 0)).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const formatBalance = (balance, decimals = 6) => {
    return parseFloat(balance || 0).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="w-full max-w-md text-center">
          <p className="text-gray-400 mb-6">Token not found</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all border border-indigo-500/50 flex items-center mx-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold ml-4 bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
            {token.name} ({token.symbol})
          </h1>

          <div className="ml-auto relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
              aria-label="Token options"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-gray-800/90 backdrop-blur-sm border border-gray-700 z-10 overflow-hidden">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="w-full flex items-center px-4 py-3 text-sm text-white hover:bg-gray-700/50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={openInExplorer}
                  className="w-full flex items-center px-4 py-3 text-sm text-white hover:bg-gray-700/50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Explorer
                </button>
                <div className="border-t border-gray-700"></div>
                <button
                  onClick={handleRemoveToken}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Token
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Token Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <TokenIcon symbol={token.symbol} size="42" variant="branded" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {formatBalance(token.balance)} {token.symbol}
                </h2>
                <p className="text-gray-400 text-sm">
                  {calculateValue(token.balance, token.price)}
                </p>
              </div>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
              aria-label="Refresh balance"
            >
              <RefreshCw className={`h-5 w-5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Chart Placeholder */}
          <div className="h-48 bg-gray-700/30 rounded-xl flex items-center justify-center mb-6 border border-gray-600/50">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Price Chart</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate(`/send?token=${symbol}`)} 
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all border border-indigo-500/50"
            >
              <Send className="h-5 w-5 text-white" />
              Send
            </button>
            <button 
              onClick={() => navigate(`/receive/${symbol}`)} 
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl font-medium transition-all border border-gray-600/50"
            >
              <Download className="h-5 w-5 text-white" />
              Receive
            </button>
          </div>
        </div>

        {/* Token Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Token Information</h3>
          <div className="space-y-4">
            {tokenAddress && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Contract</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowFullAddress(!showFullAddress)}
                    className="font-medium text-white text-right"
                  >
                    {showFullAddress ? tokenAddress : `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`}
                  </button>
                  <button 
                    onClick={() => copyToClipboard(tokenAddress)}
                    className="p-1 hover:bg-gray-700/50 rounded"
                    aria-label="Copy address"
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Network</span>
              <span className="font-medium text-white capitalize">{token.network}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Decimals</span>
              <span className="font-medium text-white">{token.decimals || 18}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Price</span>
              <span className="font-medium text-white">
                {token.price?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                }) || '$0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction History (Placeholder) */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              View All
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">Transaction history coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenDetails;