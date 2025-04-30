import React, { useState, useEffect } from 'react';
import { Copy, Download, Share2, ArrowLeft, Check, ExternalLink, AlertTriangle, Circle} from 'lucide-react';
import { useTokenStore } from '../stores/tokenStore';
import { QRCodeSVG } from 'qrcode.react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Receive = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { tokens } = useTokenStore();
  const [copied, setCopied] = useState(false);
  const [isNative, setIsNative] = useState(false);
  
  // Get complete token info from Zustand store
  const tokenInfo = tokens.find(t => t.symbol === symbol) || {
    symbol: symbol,
    name: `${symbol} Token`,
    network: 'ethereum', // Default network
    contractAddress: null
  };

  // Get address from localStorage
  const storedAddresses = JSON.parse(localStorage.getItem("wallet_addresses")) || {};
  const displayAddress = storedAddresses[symbol?.toLowerCase()] || 
                        storedAddresses.eth || 
                        '0x0000000000000000000000000000000000000000';

  // Set native token status
  useEffect(() => {
    setIsNative(symbol === 'ETH' || symbol === 'SOL');
  }, [symbol]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveQR = () => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${symbol}-address.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My ${tokenInfo.symbol} Address`,
          text: `Send ${tokenInfo.symbol} to this address: ${displayAddress}`,
          url: displayAddress
        });
      } else {
        handleCopyAddress();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to share address');
      }
    }
  };

  const openInExplorer = () => {
    let url = '';
    switch (tokenInfo.network) {
      case 'ethereum':
        url = `https://etherscan.io/address/${displayAddress}`;
        break;
      case 'solana':
        url = `https://solscan.io/address/${displayAddress}`;
        break;
      default:
        url = `https://${tokenInfo.network}.io/address/${displayAddress}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold ml-4 bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Receive {tokenInfo.symbol}
          </h1>
        </div>
  
        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
          <p className="text-gray-400 mb-6 text-center">
            Share this address to receive {tokenInfo.name} ({tokenInfo.symbol})
          </p>
          
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-xl border-4 border-white shadow-lg">
              <QRCodeSVG 
                id="qr-code"
                value={displayAddress} 
                size={200}
                level="H"
                fgColor="#000000"
                bgColor="#ffffff"
                includeMargin={true}
              />
            </div>
          </div>
          
          {/* Address Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your {tokenInfo.name} Address
            </label>
            <div className="flex">
              <input
                type="text"
                value={displayAddress}
                readOnly
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-l-xl focus:outline-none text-white font-mono truncate"
                aria-label={`${tokenInfo.symbol} address`}
              />
              <button
                onClick={handleCopyAddress}
                className={`px-4 flex items-center justify-center rounded-r-xl transition-all ${
                  copied ? 'bg-green-600/90' : 'bg-indigo-600 hover:bg-indigo-500'
                } text-white`}
                aria-label="Copy address"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {/* Token Info */}
          <div className="mb-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Asset</span>
              <span className="text-white font-medium">{tokenInfo.name} ({tokenInfo.symbol})</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Network</span>
              <span className="text-white font-medium capitalize">{tokenInfo.network}</span>
            </div>
            {!isNative && tokenInfo.contractAddress && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Contract</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(tokenInfo.contractAddress);
                    toast.info('Contract address copied');
                  }}
                  className="text-white font-mono hover:text-indigo-400 transition-colors"
                >
                  {tokenInfo.contractAddress.slice(0, 6)}...{tokenInfo.contractAddress.slice(-4)}
                </button>
              </div>
            )}
          </div>
  
          {/* Warning */}
          <div className="flex items-start p-3 bg-yellow-900/20 rounded-xl mb-6 border border-yellow-700/30">
            <div className="p-1 bg-yellow-900/50 rounded-full mr-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </div>
            <span className="text-sm text-yellow-300">
              Only send {tokenInfo.symbol} to this address. Sending other assets may result in permanent loss.
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={handleSaveQR}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all border border-gray-600/50"
              aria-label="Save QR code"
            >
              <Download className="h-5 w-5 mb-1 text-gray-300" />
              <span className="text-xs text-gray-300">Save QR</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all border border-gray-600/50"
              aria-label="Share address"
            >
              <Share2 className="h-5 w-5 mb-1 text-gray-300" />
              <span className="text-xs text-gray-300">Share</span>
            </button>
            <button 
              onClick={openInExplorer}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all border border-gray-600/50"
              aria-label="View in explorer"
            >
              <ExternalLink className="h-5 w-5 mb-1 text-gray-300" />
              <span className="text-xs text-gray-300">Explorer</span>
            </button>
          </div>
        </div>
  
        {/* Network Specific Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-3">Receiving {tokenInfo.symbol}</h3>
          <ul className="text-sm text-gray-400 space-y-3">
            <li className="flex items-start">
              <div className="p-1 bg-indigo-900/30 rounded-full mr-2 mt-0.5">
                <Circle className="h-2 w-2 text-indigo-400" />
              </div>
              Ensure you're on the {tokenInfo.network} network when sending
            </li>
            {!isNative && (
              <li className="flex items-start">
                <div className="p-1 bg-indigo-900/30 rounded-full mr-2 mt-0.5">
                  <Circle className="h-2 w-2 text-indigo-400" />
                </div>
                Token transfers require a small amount of native currency ({tokenInfo.network === 'ethereum' ? 'ETH' : 'SOL'}) for gas fees
              </li>
            )}
            <li className="flex items-start">
              <div className="p-1 bg-indigo-900/30 rounded-full mr-2 mt-0.5">
                <Circle className="h-2 w-2 text-indigo-400" />
              </div>
              Transactions typically take 1-5 minutes to complete
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Receive;