import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { Copy } from 'lucide-react';

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
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Wallet</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-lg">

          <h2 className="text-xl font-bold text-center mb-6">🔐 Your Recovery Phrase</h2>

          <p className="text-sm text-neutral-400 mb-4 text-center">
            Save this 12-word recovery phrase securely. Losing it means losing access to your wallet.
          </p>

          <div className="relative">
            <div className="grid grid-cols-3 gap-3 text-sm font-mono mb-4">
              {mnemonicarr.map((word, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-800 rounded-lg p-2 text-center shadow hover:bg-neutral-700 transition"
                >
                  <span className="font-bold text-indigo-400">{idx + 1}.</span> {word}
                </div>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="absolute top-0 right-0 text-sm flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
            >
              <Copy className="h-4 w-4" /> Copy
            </button>
          </div>

          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-xs mt-4 border-l-4 border-yellow-500">
            ⚠️ Never share your recovery phrase. Anyone with this can access your funds.
          </div>

          <button
            onClick={() => navigate('/set-password', { state: { mnemonic } })}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreateWallet;
