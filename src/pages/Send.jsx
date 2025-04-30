import React, { useState, useEffect } from 'react';
import { ArrowRight, Info, ChevronDown, Loader2, CheckCircle2, XCircle, CheckCircle } from 'lucide-react';
import { useTokenStore } from '../stores/tokenStore';
import { broadcastTransaction, verifyTransaction } from '../components/utils/transactionHelpers';
import { getPrivateKeyFromMnemonic } from '../components/utils/getKey';
import { PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

const Send = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    password: ''
  });
  const [selectedToken, setSelectedToken] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [txStatus, setTxStatus] = useState('idle'); // 'idle' | 'loading' | 'pending' | 'success' | 'error'
  const [txDetails, setTxDetails] = useState(null);

  const { tokens, fetchTokenData, selectedNetwork, isLoading } = useTokenStore();

  // Set initial selected token
  useEffect(() => {
    if (tokens.length > 0 && !selectedToken) {
      setSelectedToken(tokens[0].symbol);
    }
  }, [tokens, selectedToken]);

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
  const balance = selectedTokenData?.balance || '0';
  const storedAddresses = JSON.parse(localStorage.getItem('wallet_addresses')) || {};
  const address = storedAddresses[selectedToken?.toLowerCase()] || '0x0000000000000000000000000000000000000000';

  const networkTokens = tokens.filter(token => token.network === selectedNetwork?.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      handleChange(e);
    }
  };

  const handleMaxAmount = () => {
    setFormData(prev => ({
      ...prev,
      amount: balance
    }));
  };

  const validateForm = () => {
    if (!formData.recipient) {
      setError('Please enter a recipient address');
      return false;
    }

    // Basic address validation based on token type
    if (selectedToken === 'ETH' && !ethers.isAddress(formData.recipient)) {
      setError('Please enter a valid Ethereum address');
      return false;
    }

    if (selectedToken === 'SOL' && !PublicKey.isOnCurve(formData.recipient)) {
      setError('Please enter a valid Solana address');
      return false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (parseFloat(formData.amount) > parseFloat(balance)) {
      setError(`Insufficient ${selectedToken} balance`);
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setIsConfirming(true);
    }
  };

  const handleSend = async () => {
    if (!formData.password) {
      setShowPasswordPrompt(true);
      return;
    }

    try {
      setTxStatus('loading');
      
      // Decrypt mnemonic
      const encrypted = localStorage.getItem('wallet_encrypted_key');
      if (!encrypted) throw new Error('Wallet not found');
      
      const mnemonic = CryptoJS.AES.decrypt(encrypted, formData.password).toString(CryptoJS.enc.Utf8);
      if (!mnemonic) throw new Error('Incorrect password');

      // Get private key for the selected token
      const privateKey = await getPrivateKeyFromMnemonic(mnemonic, selectedToken);
      
      setTxStatus('pending');
      
      // Broadcast transaction
      const result = await broadcastTransaction({
        tokenSymbol: selectedToken,
        fromAddress: address,
        recipient: formData.recipient,
        amount: formData.amount,
        privateKey,
      });
      if (result.success === 'unknown') {
        // Special case - transaction might have succeeded
        setTxStatus('pending-verification');
        setSuccess('Transaction submitted - verifying status...');
        
        // Additional verification
        const verified = await verifyTransaction(result.txHash);
        if (verified) {
          setTxStatus('success');
          setSuccess('Transaction verified successfully!');
        } else {
          setTxStatus('error');
          setError('Transaction status could not be verified');
        }
      } 
      if (result.success) {
        setTxStatus('success');
        setSuccess(result.message);
        setTxDetails({
          hash: result.txHash,
          amount: formData.amount,
          token: selectedToken,
          recipient: formData.recipient
        });
        
        // Reset form after success
        setTimeout(() => {
          fetchTokenData();
          setIsConfirming(false);
          setFormData({
            recipient: '',
            amount: '',
            password: ''
          });
          setShowPasswordPrompt(false);
        }, 5000);
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (err) {
      setTxStatus('error');
      setError(err.message);
      setTimeout(() => {
        setIsConfirming(false);
        setShowPasswordPrompt(false);
      }, 3000);
    }
  };

  const resetTransaction = () => {
    setTxStatus('idle');
    setError('');
    setSuccess('');
    setTxDetails(null);
    setIsConfirming(false);
    setShowPasswordPrompt(false);
  };

  const getStatusIcon = () => {
    switch (txStatus) {
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'loading':
      case 'pending':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (txStatus) {
      case 'loading':
        return 'Preparing transaction...';
      case 'pending':
        return 'Transaction is being processed...';
      case 'success':
        return 'Transaction successful!';
      case 'error':
        return 'Transaction failed';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Send Assets
            </h2>
            {isLoading && (
              <div className="flex items-center text-sm text-blue-400">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </div>
            )}
          </div>
  
          {/* Transaction Status Messages */}
          {txStatus === 'success' && (
            <div className="p-4 bg-green-900/30 rounded-xl mb-6 border border-green-700/50">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-900/50 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-green-300 font-medium">{getStatusMessage()}</p>
                  {txDetails && (
                    <div className="mt-2 space-y-1 text-sm text-green-400/80">
                      <p>Sent {txDetails.amount} {txDetails.token}</p>
                      <p className="truncate">To: {txDetails.recipient}</p>
                      {txDetails.hash && (
                        <p className="truncate">
                          Tx Hash: {typeof txDetails.hash === 'string' 
                            ? `${txDetails.hash.substring(0, 12)}...${txDetails.hash.substring(txDetails.hash.length - 4)}` 
                            : JSON.stringify(txDetails.hash).substring(0, 16) + '...'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
  
          {txStatus === 'error' && (
            <div className="p-4 bg-red-900/30 rounded-xl mb-6 border border-red-700/50">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-red-900/50 rounded-full">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-red-300 font-medium">{getStatusMessage()}</p>
                  <p className="mt-1 text-sm text-red-400/80">{error}</p>
                </div>
              </div>
            </div>
          )}
  
          {isConfirming ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Confirm Transaction</h3>
                
                <div className="p-4 bg-gray-700/30 rounded-xl mb-4 border border-gray-600/50">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "From", value: `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}` },
                      { label: "To", value: `${formData.recipient.substring(0, 6)}...${formData.recipient.substring(formData.recipient.length - 4)}` },
                      { label: "Amount", value: `${formData.amount} ${selectedToken}` },
                      { label: "Network", value: selectedNetwork?.name }
                    ].map((item, index) => (
                      <div key={index}>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="font-medium text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-yellow-900/20 rounded-xl mb-6 border border-yellow-700/30">
                  <Info className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 text-yellow-400" />
                  <p className="text-sm text-yellow-300">
                    Always verify the recipient address. Transactions cannot be reversed once submitted.
                  </p>
                </div>
  
                {showPasswordPrompt && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter Wallet Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white placeholder-gray-500"
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                  </div>
                )}
  
                {(txStatus === 'loading' || txStatus === 'pending') && (
                  <div className="flex items-center justify-center mb-4 text-blue-400">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>{getStatusMessage()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={resetTransaction}
                  className="flex-1 px-6 py-3 rounded-xl font-medium bg-gray-700/50 hover:bg-gray-700/80 transition text-white border border-gray-600/50"
                  disabled={txStatus === 'loading' || txStatus === 'pending'}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSend}
                  disabled={txStatus === 'loading' || txStatus === 'pending'}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition text-white ${
                    (txStatus === 'loading' || txStatus === 'pending') 
                      ? 'bg-indigo-700/50 cursor-not-allowed border border-indigo-700/50' 
                      : 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50'
                  }`}
                >
                  {txStatus === 'pending' ? 'Confirming...' : 'Confirm & Send'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-5">
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  id="recipient"
                  name="recipient"
                  type="text"
                  value={formData.recipient}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white placeholder-gray-500"
                  placeholder={
                    selectedToken === 'ETH' ? '0x...' : 
                    selectedToken === 'SOL' ? 'Solana address...' : 
                    'Recipient address'
                  }
                />
              </div>
  
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="amount" className="text-sm font-medium text-gray-300">
                    Amount
                  </label>
                  <span className="text-sm text-gray-400">
                    Balance: {parseFloat(balance).toFixed(6)} {selectedToken}
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      id="amount"
                      name="amount"
                      type="text"
                      value={formData.amount}
                      onChange={handleAmountChange}
                      className="w-full px-4 py-3 pr-16 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white placeholder-gray-500"
                      placeholder="0.0"
                      inputMode="decimal"
                    />
                    <button
                      onClick={handleMaxAmount}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-300 rounded-lg transition"
                    >
                      MAX
                    </button>
                  </div>
                  
                  <div className="relative">
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      disabled={isLoading}
                      className="appearance-none px-4 py-3 pr-10 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white disabled:opacity-50"
                    >
                      {networkTokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
  
              <div className="mb-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white">{selectedNetwork?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Fee</span>
                  <span className="text-white">~$1.50</span>
                </div>
              </div>
  
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 rounded-xl border border-red-700/50 text-red-300 text-sm">
                  {error}
                </div>
              )}
  
              <button
                onClick={handleContinue}
                disabled={!formData.recipient || !formData.amount || isLoading}
                className={`w-full px-6 py-3 rounded-xl font-medium transition flex items-center justify-center ${
                  (!formData.recipient || !formData.amount || isLoading) 
                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/50'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
};

  export default Send;