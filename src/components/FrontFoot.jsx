import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";

const FrontFoot = ({selectedWallet, setSelectedWallet}) => {
  const [showSearch, setShowSearch] = useState(false);

  
  return (
    <div className='flex justify-between items-center px-6 py-4  rounded-xl'>

      {/* Wallet Dropdown */}
      <div className="relative">
        <select className="border border-gray-200 bg-gray-200 rounded-md px-4 py-2 text-sm"
        onChange={(e)=>setSelectedWallet(e.target.value)}
        >
         <option value="ethereum">Ethereum</option>
          <option value="solana">Solana</option>
          <option value="bitcoin">Bitcoin</option>
        </select>
      </div>

      {/* Search Icon and Animated Input */}
      <div className="relative flex items-center gap-2">
        <CiSearch
          className="text-xl text-gray-600 cursor-pointer"
          onClick={() => setShowSearch(!showSearch)}
        />

        <div
          className={`transition-all duration-300 ease-in-out ${
            showSearch ? 'opacity-100 scale-100 w-40' : 'opacity-0 scale-95 w-0'
          } overflow-hidden`}
        >
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
          />
        </div>
      </div>

    </div>
  );
};

export default FrontFoot;
