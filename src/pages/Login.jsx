import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [mnemonicaarr, setMnemonicArr] = useState(Array(12).fill(''));
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const mnemonic = mnemonicaarr.join(' ');
    if (mnemonicaarr.every(word => word.trim() !== '') && (mnemonic.split(' ').length === 12)) {
      if (password.length >= 8) {
        navigate('/dashboard'); // Successful login
      } else {
        alert('Password must be at least 8 characters.');
      }
    } else {
      alert('Please enter all 12 words of the mnemonic phrase.');
    }
  };

  const handleChangeMnemonic = (idx, value) => {
    const update = [...mnemonicaarr];
    update[idx] = value.trim();
    setMnemonicArr(update);
  };

  const checkPasswordStrength = (value) => {
    setPassword(value);

    if (value.length < 6) {
      setPasswordStrength('Weak');
    } else if (value.length < 10) {
      setPasswordStrength('Good');
    } else {
      setPasswordStrength('Strong');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="py-6 px-8 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold ml-3">Login</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 p-8 rounded-xl shadow-md">

            <h2 className="text-2xl font-bold mb-6 text-center">🔐 Unlock Wallet</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {mnemonicaarr.map((word, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={word}
                  onChange={(e) => handleChangeMnemonic(idx, e.target.value)}
                  className="bg-neutral-800 text-white p-2 rounded-md text-center text-sm focus:ring-indigo-400 focus:ring-2"
                  placeholder={`${idx + 1}`}
                />
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                  className="bg-neutral-800 text-white p-2 w-full rounded-md focus:ring-indigo-400 focus:ring-2"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-neutral-700 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength === 'Weak' ? 'bg-red-500 w-1/3' :
                        passwordStrength === 'Good' ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">{passwordStrength}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogin}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
            >
              🔓 Unlock Wallet
            </button>

            <p className="text-xs text-neutral-500 mt-4 text-center">
              Never share your recovery phrase or password with anyone.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
