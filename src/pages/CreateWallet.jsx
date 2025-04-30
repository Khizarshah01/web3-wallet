import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { Copy, ShieldAlert } from 'lucide-react';

const CreateWallet = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [mnemonicarr, setMnemonicarr] = useState([]);
  const [seedHex, setSeedHex] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const generatedMnemonic = bip39.generateMnemonic(wordlist);
    setMnemonic(generatedMnemonic);

    const seed = bip39.mnemonicToSeedSync(generatedMnemonic);
    setSeedHex(seed.toString('hex'));

    const wordArr = generatedMnemonic.split(' ');
    setMnemonicarr(wordArr);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    alert('Mnemonic copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="py-8 px-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Create New Wallet
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-900/20 rounded-full mb-4">
              <ShieldAlert className="h-8 w-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Recovery Phrase</h2>
            <p className="text-gray-400">
              Save this 12-word recovery phrase securely. This is your only way to restore access.
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-3 gap-3 mb-6">
              {mnemonicarr.map((word, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-center transition-all hover:bg-gray-700 hover:border-indigo-400/30 hover:shadow-md"
                >
                  <span className="font-bold text-indigo-400 mr-2">{idx + 1}.</span>
                  <span className="font-mono tracking-wide">{word}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="absolute -top-12 right-0 text-sm flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <Copy className="h-4 w-4" /> Copy Phrase
            </button>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-800/50 p-4 rounded-lg text-sm flex items-start gap-3 mt-6">
            <div className="bg-yellow-800/50 p-1 rounded-full">
              <ShieldAlert className="h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <p className="font-medium text-yellow-200">Security Warning</p>
              <p className="text-yellow-400/90">
                Never share your recovery phrase. Anyone with this phrase can access your funds permanently.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/set-password', { state: { mnemonic } })}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/20"
          >
            Continue to Encryption
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreateWallet;