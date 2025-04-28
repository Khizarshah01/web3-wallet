import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Import } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [animationLoaded, setAnimationLoaded] = useState(false);

  useEffect(() => {
    const encrypted = localStorage.getItem("wallet_encrypted_key");
    if (encrypted) {
      navigate("/verify-password");
    }
    const timer = setTimeout(() => {
      setAnimationLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="py-6 px-8">
        <div className="flex items-center space-x-2">
          <Wallet className="h-8 w-8 text-primary-400" />
          <h1 className="text-2xl font-bold">Web3-Wallet</h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className={`transform transition-transform duration-1000 ${
          animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6">
            Welcome to Web3-Wallet
          </h2>
          <p className="text-xl text-center text-neutral-400 max-w-md mx-auto mb-12">
            A safer way to hold Bitcoin. 
            Your secure gateway to crypto assets — fast, private & secure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
          <div 
            className={`transform transition-all duration-700 ${
              animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex flex-col items-center bg-neutral-900 rounded-lg p-8 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="rounded-full p-4 bg-gradient-to-br from-green-400 to-blue-500 mb-6">
                <Wallet className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create New Wallet</h3>
              <p className="text-neutral-400 text-center mb-6">
                Generate a new secure wallet with a recovery phrase.
              </p>
              <button 
                onClick={() => navigate('/create')}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 w-full"
              >
                Create Wallet
              </button>
            </div>
          </div>

          <div 
            className={`transform transition-all duration-700 ${
              animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex flex-col items-center bg-neutral-900 rounded-lg p-8 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="rounded-full p-4 bg-gradient-to-br from-purple-400 to-pink-500 mb-6">
                <Import className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Import Existing Wallet</h3>
              <p className="text-neutral-400 text-center mb-6">
                Restore your wallet using a recovery phrase.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 w-full"
              >
                Import Wallet
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 px-8 text-center text-neutral-500">
        <p>Web3-Wallet © 2025</p>
      </footer>
    </div>
  );
};

export default Landing;
