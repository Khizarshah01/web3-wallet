import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Send, Gift, BarChart3, PlusCircle, ChevronRight, Layers } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  // Dummy wallet data
  const selectedNetwork = {
    symbol: 'ETH',
    name: 'Ethereum Mainnet',
  };

  // Simple formatAddress function
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navItems = [
    { path: '/dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { path: '/send', icon: <Send size={20} />, label: 'Send' },
    { path: '/receive', icon: <Gift size={20} />, label: 'Receive' },
    { path: '/add-token', icon: <PlusCircle size={20} />, label: 'Add Token' },
  ];

  return (
    <aside className={`sticky top-0 h-screen flex flex-col border-r border-white/10 bg-neutral-900 text-white transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      
      {/* Top Section */}
      <div className="p-4 flex items-center justify-between">
        <div className={`flex items-center space-x-3 ${!isExpanded && 'justify-center w-full'}`}>
          <Wallet className="h-8 w-8 text-primary-400" />
          {isExpanded && <span className="text-xl font-bold">Web3 Wallet</span>}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded-full hover:bg-white/10 ${!isExpanded && 'absolute -right-3 bg-neutral-900 border border-white/10'}`}
        >
          <ChevronRight className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-lg transition-colors
                  ${location.pathname === item.path
                    ? 'bg-primary-900/50 text-primary-400'
                    : 'text-white/70 hover:bg-white/10'}`}
              >
                <div className="flex items-center">
                  {item.icon}
                  {isExpanded && <span className="ml-3">{item.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center ${!isExpanded && 'justify-center'}`}>
          <Layers className="h-5 w-5 text-white/70" />
          {isExpanded && (
            <div className="ml-3">
              <div className="text-sm font-medium">Network</div>
              <div className="text-xs text-white/70">{selectedNetwork.name}</div>
            </div>
          )}
        </div>
      </div>
      
    </aside>
  );
};

export default Sidebar;
