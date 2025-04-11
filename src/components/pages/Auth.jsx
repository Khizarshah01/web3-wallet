import React from 'react';
import { TokenIcon } from '@web3icons/react';

const Auth = () => {
  return (
    <div className="flex flex-col items-center text-center">
        <h1
        className="text-4xl font-bold text-black-800 mb-4 Arizona"
      >
        Web3-Wallet
      </h1>
      <h1
        className="text-5xl font-bold text-sky-800 mb-4 Arizona"
      >
        A safer way to hold Bitcoin
      </h1>

      <p
        className="text-gray-600 mb-8 text-lg max-w-md Arizona"
      >
        Ensures only <span className="font-semibold text-blue-600">you</span> can access your crypto assets — fast, private & secure.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
          Create New Wallet
        </button>

        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
          Import Existing Wallet
        </button>
      </div>

      <p className="text-sm text-gray-400 mt-8 italic">
        Your keys. Your crypto. Fully private & secure.
      </p>

      <div className="flex flex-wrap justify-center gap-5 mt-10 animate-pulse-slow">
        {[
          'eth',
          'btc',
          'sol',
          'dot',
          'atom',
          'matic',
          'ton',
          'avax',
          'ada',
        ].map((symbol) => (
          <div
            key={symbol}
            className="hover:scale-110 transition-transform duration-300 ease-in-out"
          >
            <TokenIcon symbol={symbol} variant="branded" size="48" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Auth;
