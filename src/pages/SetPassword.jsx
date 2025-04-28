import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react'; // Assuming you are using Lucide Icons
import 'react-toastify/dist/ReactToastify.css';

const SetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mnemonic = location.state?.mnemonic;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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

    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    const encrypted = CryptoJS.AES.encrypt(mnemonic, password).toString();
    localStorage.setItem("wallet_encrypted_key", encrypted);

    toast.success("Password set successfully!", {
      position: "top-center",
      autoClose: 2000,
      onClose: () => navigate('/verify-password'),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Wallet Password</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type={passwordVisible ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/30 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition"
              disabled={!password || !confirmPassword}
            >
              Continue
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Confirm Action</h2>
            <p className="text-neutral-400 mb-6">Are you sure you want to set this password?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-neutral-700 text-neutral-300 px-4 py-2 rounded hover:bg-neutral-600"
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
