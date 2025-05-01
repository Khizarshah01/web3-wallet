# 🚀 Web3 Wallet (Testnet/Devnet Only)

A secure, non-custodial multi-chain crypto wallet built from scratch — no MetaMask, no third-party wallets — just raw blockchain integration.

  * ✅ Supports Ethereum (Goerli, Sepolia) & Solana (Devnet)
  * 🔐 Wallet generation, transaction signing, sending & receiving — all handled client-side
## 🔑 Key Features

   * 🔐 BIP39/BIP44 Compliant Wallet Generation
    Generate mnemonic and derive keys for both Ethereum and Solana from a single seed.

  * 🌐 Testnet / Devnet Support

    - Ethereum: Sepolia

    - Solana: Devnet

  * 📦 Manual Key Management
    No third-party wallet providers (MetaMask/Phantom). Full control over private keys.

  * 🔄 Transaction Processing
    Built-in transaction builder and sender via Alchemy RPC.

  *  💰 Live Balance Check
    View your real-time balances across chains.

  * 📤 Send & Receive Tokens
    Enter amount + address and fire transactions directly from your browser.

  *  🛡️ Client-side Encryption
    Private keys are encrypted in the browser using a user-defined password.

## ⚠️ Important Notes

  * ❗ This wallet is intended for educational/testing purposes only.

  * 🧪 Only works with Testnet/Devnet tokens.

  * 🚫 Mainnet is not supported without further security audits.

  *  🔐 Always use test credentials — never expose real assets during development or demo.
    
## Technologies Used 🛠️

| Category            | Tech Used                                     |
|---------------------|-----------------------------------------------|
| **Core**            | BIP39, BIP44, HD Wallet Derivation            |
| **Blockchain**      | Ethers.js, Solana Web3.js, Alchemy API        |
| **Frontend**        | React, Tailwind CSS                           |
| **State Management**| Zustand                                       |
| **Cryptography**    | `crypto-js`, `@scure/bip39`, manual PK crypto |

## 📂 Get Started Locally
```
git clone https://github.com/Khizarshah01/web3-wallet.git
cd web3-wallet
npm install
npm run dev
```
* Make sure to add your Alchemy API keys in a .env 
