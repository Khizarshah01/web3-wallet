import React, { useEffect, useState } from 'react';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english'; // there is lot of language 2048 word list available i chose english
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [mnemonicarr, setMnemonicarr] = useState([]);
  const [seedHex, setSeedHex] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const generatedMnemonic = bip39.generateMnemonic(wordlist); // createing memonic means just a choose a 12 words in 2048
    setMnemonic(generatedMnemonic);
    const seed = bip39.mnemonicToSeedSync(generatedMnemonic); // convertin unint8 from array
    setSeedHex(seed.toString('hex')); // converting into hecxa
    // the useEffect run two time fix later ::::{
    const wordArr = generatedMnemonic.split(" ");
    setMnemonicarr(wordArr);
  }, []);

  const handleCopy = () => {
    const phrase = mnemonic;
    navigator.clipboard.writeText(phrase);
    alert("Mnemonic copied to clipboard!");
  };

  return (
    <div className=" p-1 text-center">
     <h1 className="text-2xl font-bold mb-4">Your 12-Word Mnemonic:</h1>
     <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">🔐 Your New Wallet</h1>
     <p className="text-gray-500 text-center mb-6">
          Secure this <span className="text-indigo-600 font-semibold">12-word mnemonic phrase</span> safely. It gives access to your crypto wallet.
        </p>
     <div className="bg-white shadow-xl rounded-2xl p-5 w-full max-w-lg">
     <div className="flex justify-end mb-4">
          <button
            onClick={handleCopy}
            className="text-sm text-white bg-gray-400 hover:bg-gray-600 px-4 py-1 rounded-md transition"
          >
            Copy
          </button>
        </div>
     <div className="grid grid-cols-3 gap-4 text-sm font-mono text-gray-800">
          {mnemonicarr.map((word, idx) => (
            <div
              key={idx}
              className="bg-indigo-50 rounded-md px-3 py-2 text-center shadow-sm"
            >
              <span className="font-bold text-indigo-500 mr-1">{idx + 1}.</span>
              {word}
            </div>
          ))}
        </div>
    </div>
    
    <div className="mt-8">
  <h2 className="text-md font-semibold text-gray-600 mb-2">⚠️ Note</h2>
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 rounded-md">
    Never share this key with anyone. If you lose this seed phrase, you will lose access to your crypto forever.
  </div>
</div>
<div className="mt-6">
        <button
          onClick={() => navigate("/login")} // 👈 Change "/login" to your actual login/home route
          className="bg-indigo-500 text-white px-5 py-2 rounded-md shadow hover:bg-indigo-600 transition"
        >
          Back to Login
        </button>
      </div>
        </div >
  );
};

export default Create;
