import { ethers } from 'ethers';
import axios from 'axios';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

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
        const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const solBalance = await connection.getBalance(new PublicKey(addressObj.sol));
        return solBalance / 1e9;
      }
      default:
        return 0;
    }
  } catch (err) {
    console.error(`Error fetching ${symbol} balance`, err);
    return 0;
  }
};
