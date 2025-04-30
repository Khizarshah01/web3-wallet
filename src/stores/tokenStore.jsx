import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { allSupportedTokens } from '../data/tokenList';
import { getBalance } from '../components/utils/getBalance';
import axios from 'axios';

export const useTokenStore = create(
  persist(
    (set, get) => ({
      // All supported tokens (from your list)
      allTokens: allSupportedTokens,
      
      // User-visible tokens (default: only BTC, ETH, SOL)
      visibleTokens: ['BTC', 'ETH', 'SOL'],
      
      // Fetched token data (balance + price)
      tokens: [],
      selectedNetwork: null,
      isLoading: false,
      error: null,
      
      // Actions
      updateVisibleTokens: (newVisibleTokens) => {
        set({ visibleTokens: newVisibleTokens });
        // Optional: Auto-refresh after visibility change
        // get().fetchTokenData(get().lastUsedAddresses);
      },
      toggleTokenVisibility: (symbol) => {
        const { visibleTokens } = get();
        set({
          visibleTokens: visibleTokens.includes(symbol)
            ? visibleTokens.filter(s => s !== symbol) // Hide
            : [...visibleTokens, symbol] // Show
        });
      },
      
      fetchTokenData: async () => {
        const taddress = JSON.parse(localStorage.getItem("wallet_addresses"));
        const { allTokens, visibleTokens } = get();
        
        // Filter to only include BTC, ETH, SOL from all supported tokens
        const defaultTokens = allTokens.filter(t => 
          ['BTC', 'ETH', 'SOL'].includes(t.symbol)
        );
        
        // Then apply user's visibility preferences
        const tokensToFetch = defaultTokens.filter(t => 
          visibleTokens.includes(t.symbol)
        );
        
        // Fetch balances (Web3)
        const balances = await Promise.all(
          tokensToFetch.map(async (token) => ({
            ...token,
            balance: await getBalance(token.symbol, taddress)
          }))
        );
        
        // Fetch prices (CoinGecko)
        const tokenIds = tokensToFetch.map(t => t.name.toLowerCase()).join(',');
        const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: { ids: tokenIds, vs_currencies: 'usd' }
        });
        
        // Merge data
        set({
          tokens: balances.map(token => ({
            ...token,
            price: prices.data[token.name.toLowerCase()]?.usd || 0
          }))
        });
      }
    }),
    {
      name: 'token-storage', // unique name for localStorage
      partialize: (state) => ({ 
        visibleTokens: state.visibleTokens 
      }), // only persist visibility state
    }
  )
);