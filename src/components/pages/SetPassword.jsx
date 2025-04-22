import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mnemonic = location.state?.mnemonic;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!mnemonic) {
      toast.error("Mnemonic not found", { position: "top-center" });
      return;
    }

    setShowModal(true); // Show confirmation modal
  };

  const handleConfirm = () => {
    setShowModal(false);
    const encrypted = CryptoJS.AES.encrypt(mnemonic, password).toString();
    localStorage.setItem("wallet_encrypted_key", encrypted);

    toast.success("Password set successfully!", {
      position: "top-center",
      autoClose: 2000,
      onClose: () => navigate('/login'),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">🔐 Set Your Wallet Password</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Your password is used to encrypt and secure your mnemonic phrase. Make sure to remember it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Enter Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-100 rounded-md px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            Set Password
          </button>
        </form>
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Confirm Action</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to set this password?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetPassword;
