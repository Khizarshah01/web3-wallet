import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontFoot from '../FrontFoot';
import * as bip39 from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { wordlist } from '@scure/bip39/wordlists/english';
import { keccak_256 } from '@noble/hashes/sha3';
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
  const [ethAddress, setEthAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('ethereum');
  const navigate = useNavigate();

  const totalBalance = tokens.reduce(
    (sum, token) => sum + token.balance * token.price,
    0
  );

  useEffect(() => {
    const mnemonic = localStorage.getItem('mnemonic')?.trim();

    if (!mnemonic || !bip39.validateMnemonic(mnemonic, wordlist)) {
      console.warn('Invalid or missing mnemonic');
      navigate('/login');
      return;
    }

    const generateKeys = async () => {
      try {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        if(selectedWallet=="ethereum"){

          const root = HDKey.fromMasterSeed(seed);
          const child = root.derive("m/44'/60'/0'/0/0");
          
          const privateKeyHex = Buffer.from(child.privateKey).toString('hex');
          const publicKeyHex = Buffer.from(child.publicKey).toString('hex');
          
          setPrivateKey("0x"+privateKeyHex);
          setPublicKey("0x"+publicKeyHex);
          
          const publicKeyBuffer = Buffer.from(publicKeyHex, 'hex');
          console.log(publicKeyBuffer);
          const hash = keccak_256(publicKeyBuffer.subarray(1)); // skip the 0x04 prefix
          const address = '0x' + Buffer.from(hash.slice(-20)).toString('hex');
          setEthAddress(address);
        } else if(selectedWallet=="bitcoin"){
          console.log("Bitcoin");
        } else if(selectedWallet=="solana"){
          console.log("Solana");
        }

        // console.log('Private Key:', privateKeyHex);
        // console.log('Public Key:', publicKeyHex);
        // console.log('Address:', address);
      } catch (error) {
        console.error('Error generating keys:', error);
      }
    };

    generateKeys();
  }, [navigate,selectedWallet]);

  return (
    <div className="bg-gray-100 min-h-screen">
  <FrontFoot
  selectedWallet={selectedWallet}
  setSelectedWallet={setSelectedWallet}
/>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-gray-800 text-3xl font-semibold mb-6">
          ${totalBalance.toFixed(2)}
          <p className="text-sm text-gray-500">Total Wallet Balance</p>
        </div>

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

        <div className="feed bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Transactions</h2>
          <p className="text-sm text-gray-500">No transactions yet.</p>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm text-sm text-gray-700 break-all">
          <p><strong>Ethereum Address:</strong> {ethAddress || 'Generating...'}</p>
          <p className="mt-2"><strong>Public Key:</strong> {publicKey || 'Generating...'}</p>
          <p className="mt-2"><strong>Private Key:</strong> {privateKey || 'Generating...'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
