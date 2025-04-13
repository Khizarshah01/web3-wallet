import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mnemonicaarr, setMnemonicArr] = useState(Array(12).fill(''));
  const navigate = useNavigate();

  const handleLogin = () => {
    const mnemonic = mnemonicaarr.join(' ');
    if (mnemonicaarr.every(word => word.trim() !== '') && mnemonic.split(' ').length === 12) {
      alert('Logged in with mnemonic!');
      localStorage.setItem("mnemonic", mnemonic);
      navigate('/dashboard'); // Change to your protected route
    } else {
      alert('Please enter all 12 words of the mnemonic phrase.');
    }
  };

  const handleChange = (idx, value) => {
    const update = [...mnemonicaarr];
    update[idx] = value.trim();
    setMnemonicArr(update);
  };

  return (
    
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">🔐 Login to Wallet</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your <span className="font-semibold text-indigo-600">12-word mnemonic</span> to access your wallet.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {mnemonicaarr.map((word, idx) => (
            <input
              key={idx}
              type="text"
              value={word}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-center text-sm focus:ring-indigo-400 focus:ring-2"
              placeholder={`${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleLogin}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          🔓 Unlock Wallet
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Never share your seed phrase with anyone.
        </p>
      </div>
  
  );
};

export default Login;
