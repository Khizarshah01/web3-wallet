import { ethers } from 'ethers';
import axios from 'axios';
// import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

export const getBalance = async (symbol, addressObj) => {
  try {
    switch (symbol) {
      case 'ETH': {
        const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`);
        const balanceBigInt = await provider.getBalance(addressObj.eth);
        return parseFloat(ethers.formatEther(balanceBigInt));
      }
      case 'BTC': {
        const response = await axios.get(`https://blockchain.info/q/addressbalance/${addressObj.btc}`);
        return response.data / 1e8;
      }
      case 'SOL': {
        const options = {
          method: 'POST',
          url: `https://solana-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
          headers: { accept: 'application/json', 'content-type': 'application/json' },
          data: {
            id: 1,
            jsonrpc: '2.0',
            method: 'getBalance',
            params: [addressObj.sol]  
          }
        };
      
        try {
          const response = await axios.request(options);
          const lamports = response.data.result.value;
          return lamports / 1e9; 
        } catch (error) {
          console.error("Solana balance error:", error);
          return 0;
        }
      }
      default:
        return 0;
    }
  } catch (err) {
    console.error(`Error fetching ${symbol} balance`, err);
    return 0;
  }
};
