# 🚀 Web3 Wallet (Testnet/Devnet Only)

A secure, non-custodial crypto wallet built from scratch — no MetaMask, no third-party wallets — just raw blockchain integration.

  * ✅ Supports Ethereum (Sepolia) & Solana (Devnet)
  * 🔐 Wallet generation, transaction signing, sending & receiving — all handled client-side

![Screenshot from 2025-05-01 13-22-10](https://github.com/user-attachments/assets/c69d278a-a59c-46d0-8f77-62acee94dea2)
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
    View your real-time balances across chains (testnet, devnet).

  * 📤 Send & Receive Tokens
    Enter the amount + address and fire transactions directly from your browser.

  *  🛡️ Client-side Encryption
    Private keys are encrypted in the browser using a user-defined password.

## ⚠️ Important Notes

  * This wallet is intended for educational/testing purposes only.

  * Only works with Testnet/Devnet tokens (eth, sol).

    
## Technologies Used 
| Category            | Tech Used                                     |
|---------------------|-----------------------------------------------|
| **Core**            | BIP39, BIP44, HD Wallet Derivation            |
| **Blockchain**      | Ethers.js, Solana Web3.js, Alchemy API        |
| **Frontend**        | React, Tailwind CSS                           |
| **State Management**| Zustand                                       |
| **Cryptography**    | `crypto-js`, `@scure/bip39`, manual PK crypto |

## Installation
```
git clone https://github.com/Khizarshah01/web3-wallet.git
cd web3-wallet
npm install
npm run dev
```
* Make sure to add your Alchemy API keys in a .env
```
VITE_ALCHEMY_API_KEY=
GEEKO_KEY=
```

# Screenshots

## DashBoard page

![Screenshot from 2025-05-01 13-20-28](https://github.com/user-attachments/assets/67101239-52f7-45ba-b043-2c2050b6e298)

![Screenshot from 2025-05-01 13-20-35](https://github.com/user-attachments/assets/de6b7060-7e62-47b4-b13d-056d0df093c9)

## Send page 
![Screenshot from 2025-05-01 13-20-50](https://github.com/user-attachments/assets/ad4b75cc-9e97-45b3-877e-1e3b74f1fe75)

## Receive Page
![Screenshot from 2025-05-01 13-21-00](https://github.com/user-attachments/assets/738a74c6-3132-4657-abda-4a8201e5ef63)




