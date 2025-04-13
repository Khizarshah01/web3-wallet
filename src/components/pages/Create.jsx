import React, { useEffect, useState } from 'react';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english'; // there is lot of language 2048 word list available i chose english

const Create = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [mnemonicarr, setMnemonicarr] = useState([]);
  const [seedHex, setSeedHex] = useState("");

  useEffect(() => {
    const generatedMnemonic = bip39.generateMnemonic(wordlist); // createing memonic means just a choose a 12 words in 2048
    setMnemonic(generatedMnemonic);
    const seed = bip39.mnemonicToSeedSync(generatedMnemonic); // convertin unint8 from array
    setSeedHex(seed.toString('hex')); // converting into hecxa
    // the useEffect run two time fix later ::::{
    const wordArr = generatedMnemonic.split(" ");
    setMnemonicarr(wordArr);
  }, []);

  return (
    <div className="p-4 text-center">
     <h1 className="text-2xl font-bold mb-4">Your 12-Word Mnemonic:</h1>
      <div className="grid grid-cols-3 gap-2 text-blue-700 font-mono">
       {
        mnemonicarr.map((word, idx)=>(
            <div key={idx}>
                {idx+1}.{word}
            </div>
        ))
       }
      </div>
      <p className="text-sm text-gray-600 mt-4 break-all">
        Seed: {seedHex || "Generating..."}
      </p>
    </div>
  );
};

export default Create;
