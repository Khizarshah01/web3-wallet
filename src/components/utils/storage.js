export const getUserVisibleTokens = () => {
    const saved = localStorage.getItem('visibleTokens');
    return saved ? JSON.parse(saved) : ['ETH', 'SOL']; // default visible
  };
  
  export const setUserVisibleTokens = (symbols) => {
    localStorage.setItem('visibleTokens', JSON.stringify(symbols));
  };
  