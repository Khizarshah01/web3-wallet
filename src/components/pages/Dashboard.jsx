import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontFoot from '../FrontFoot';
import * as bip39 from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { wordlist } from '@scure/bip39/wordlists/english';
import { keccak256 } from 'js-sha3';
import { Buffer } from 'buffer';


const defaultTokens = [
  { name: 'Bitcoin', symbol: 'BTC', balance: 0.005, price: 66000 },
  { name: 'Ethereum', symbol: 'ETH', balance: 0.8, price: 3300 },
  { name: 'Polkadot', symbol: 'DOT', balance: 25, price: 7.2 },
];

const Dashboard = () => {
  const [tokens, setTokens] = useState(defaultTokens);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const navigate = useNavigate();

  const totalBalance = tokens.reduce(
    (sum, token) => sum + token.balance * token.price,
    0
  );

  useEffect(() => {
    const mnemonic = localStorage.getItem('mnemonic')?.trim();

    if (!mnemonic || !bip39.validateMnemonic(mnemonic, wordlist)) {
      console.warn('Invalid or missing mnemonic');
      console.log(mnemonic);
      navigate('/login');
      return;
    }

    const generateKeys = async () => {
      try {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = HDKey.fromMasterSeed(seed);
        const child = root.derive("m/44'/60'/0'/0/0"); // Ethereum path
        const privateKeyHex = child.privateKey.toString('hex');
    const publicKeyHex = child.publicKey.toString('hex');
    
    console.log("Private Key (Hex):", privateKeyHex);
    console.log("Public Key (Hex):", publicKeyHex);

   
const publicKeyBuffer = Buffer.from(publicKeyHex, 'hex');
const hash = keccak256(publicKeyBuffer.slice(1)); // returns hex string
const address = '0x' + hash.slice(-40); // last 20 bytes = 40 hex chars

console.log("Ethereum Address:", address);
      } catch (error) {
        console.error('Error generating keys:', error);
      }
    };

    generateKeys();
  }, [navigate]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <FrontFoot />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Wallet Balance */}
        <div className="text-gray-800 text-3xl font-semibold mb-6">
          ${totalBalance.toFixed(2)}
          <p className="text-sm text-gray-500">Total Wallet Balance</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            + Add Token
          </button>
          <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400">
            Send
          </button>
          <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400">
            Receive
          </button>
        </div>

        {/* Token List */}
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

        {/* Transaction Feed */}
        <div className="feed bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Transactions</h2>
          <p className="text-sm text-gray-500">No transactions yet.</p>
        </div>

        {/* Keys Display */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm text-sm text-gray-700 break-all">
          <p>
            <strong>Public Key:</strong> {publicKey || 'Generating...'}
          </p>
          <p className="mt-2">
            <strong>Private Key:</strong> {privateKey || 'Generating...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
