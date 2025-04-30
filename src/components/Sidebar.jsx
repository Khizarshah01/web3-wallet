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
    { path: '/receive/ETH', icon: <Gift size={20} />, label: 'Receive' },
    { path: '/add-token', icon: <PlusCircle size={20} />, label: 'Add Token' },
  ];

  return (
    <aside className={`sticky top-0 h-screen flex flex-col border-r border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      
      {/* Top Section */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <div className={`flex items-center space-x-3 ${!isExpanded && 'justify-center w-full'}`}>
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          {isExpanded && <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">Web3 Wallet</span>}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded-full hover:bg-gray-700 transition-colors ${!isExpanded ? 'absolute -right-3 bg-gray-800 border border-gray-700 shadow-md' : ''}`}
        >
          <ChevronRight className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-lg transition-all
                  ${location.pathname === item.path
                    ? 'bg-indigo-900/30 text-indigo-400 shadow-md'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
              >
                <div className="flex items-center">
                  <div className={`p-1 rounded-md ${location.pathname === item.path ? 'bg-indigo-900/50' : 'bg-gray-700/50'}`}>
                    {React.cloneElement(item.icon, { className: 'h-5 w-5' })}
                  </div>
                  {isExpanded && <span className="ml-3 font-medium">{item.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center ${!isExpanded && 'justify-center'}`}>
          <div className="p-1.5 rounded-md bg-gray-700/50">
            <Layers className="h-5 w-5 text-indigo-400" />
          </div>
          {isExpanded && (
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-300">Network</div>
              <div className="text-xs text-gray-400">{selectedNetwork.name}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;