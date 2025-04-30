import { ethers } from "ethers";
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import bs58 from 'bs58';

// Validate Ethereum address
const isValidEthAddress = (address) => ethers.isAddress(address);

// Validate Solana address
const isValidSolAddress = (address) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const broadcastTransaction = async ({ tokenSymbol, fromAddress, recipient, amount, privateKey }) => {
  console.log(`[Trigger] Token: ${tokenSymbol}, To: ${recipient}, Amount: ${amount}`);
  
  try {
    // Validate inputs
    if (!tokenSymbol || !recipient || !amount || !fromAddress || !privateKey) {
      throw new Error('Missing required transaction parameters');
    }

    // Convert amount to string and validate
    amount = amount.toString();
    if (isNaN(parseFloat(amount))) {
      throw new Error('Invalid amount');
    }

    // Token-specific validation
    switch (tokenSymbol.toUpperCase()) {
      case 'ETH':
        if (!isValidEthAddress(recipient)) throw new Error('Invalid Ethereum address');
        break;
      case 'SOL':
        if (!isValidSolAddress(recipient)) throw new Error('Invalid Solana address');
        break;
      case 'BTC':
        // Basic BTC address validation (placeholder)
        if (recipient.length < 26 || recipient.length > 35) {
          throw new Error('Invalid Bitcoin address format');
        }
        break;
      default:
        throw new Error(`Unsupported token: ${tokenSymbol}`);
    }

    let txResult;
    switch (tokenSymbol.toUpperCase()) {
      case 'ETH':
        txResult = await handleEthTransaction(recipient, amount, privateKey);
        break;
      case 'BTC':
        txResult = await handleBtcTransaction(recipient, amount, fromAddress);
        break;
      case 'SOL':
        txResult = await handleSolTransaction(recipient, amount, privateKey);
        break;
    }

    if (!txResult.success) {
      throw new Error(txResult.error || 'Transaction failed');
    }

    return {
      success: true,
      txHash: txResult.txHash || 'N/A',
      message: `Successfully sent ${amount} ${tokenSymbol} to ${recipient}`
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    return {
      success: false,
      error: error.message,
      txHash: null
    };
  }
};

// ETH transaction handler
const handleEthTransaction = async (recipient, amount, privateKey) => {
  try {
    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const tx = await wallet.sendTransaction({
      to: recipient,
      value: ethers.parseEther(amount),
    });
    
    console.log("Transaction Hash:", tx.hash);
    await tx.wait();

    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error("ETH Transaction failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// BTC transaction handler (mock implementation)
const handleBtcTransaction = async (recipient, amount, fromAddress) => {
  try {
    // This is a mock implementation - replace with actual BTC transaction logic
    console.log(`Sending ${amount} BTC from ${fromAddress} to ${recipient}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock transaction hash
    return {
      success: true,
      txHash: `btc-mock-tx-${Math.random().toString(36).substring(2, 10)}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// SOL transaction handler
const handleSolTransaction = async (recipient, amount, privateKey) => {
  // Silence console.error temporarily
  const originalConsoleError = console.error;
  console.error = () => {}; // Mute subscription errors

  try {
    const connection = new Connection(
      `https://solana-devnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
      {
        commitment: 'confirmed',
        disableRetryOnRateLimit: true, // Important for reducing retries
        confirmTransactionInitialTimeout: 30000, // 30 second timeout
      }
    );

    const sender = Keypair.fromSecretKey(privateKey);
    const recp = new PublicKey(recipient);

    // Convert amount to lamports
    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
    if (isNaN(lamports)) {
      throw new Error('Invalid amount for Solana transaction');
    }

    // Get recent blockhash with commitment
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

    // Create transaction
    const tx = new Transaction({
      feePayer: sender.publicKey,
      blockhash,
      lastValidBlockHeight
    }).add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recp,
        lamports
      })
    );

    // Sign transaction
    tx.sign(sender);

    // Send with custom confirmation handler
    const signature = await connection.sendTransaction(tx, [sender], {
      skipPreflight: false,
      maxRetries: 3, // Limit retry attempts
    });

    console.log('Transaction submitted:', signature);

    // Custom confirmation logic to avoid noisy subscriptions
    let confirmation = null;
    try {
      confirmation = await waitForConfirmation(connection, signature);
    } catch (error) {
      console.warn('Confirmation warning:', error);
      // Fallback to direct check
      const txResult = await connection.getTransaction(signature, {
        commitment: 'confirmed'
      });

      if (txResult?.meta?.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(txResult.meta.err)}`);
      }

      // If we got here, transaction likely succeeded
      return {
        success: true,
        txHash: signature,
        warning: error.message
      };
    }

    return {
      success: true,
      txHash: signature
    };
  } catch (error) {
    console.error('SOL Transaction failed:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    // Restore original console.error
    console.error = originalConsoleError;
  }
};

// Custom confirmation function that avoids noisy subscriptions
const waitForConfirmation = async (connection, signature, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error('Confirmation timeout'));
      }
    }, timeout);

    // Use getSignatureStatus instead of signatureSubscribe
    const interval = setInterval(async () => {
      try {
        const status = await connection.getSignatureStatus(signature);
        
        if (status?.value?.confirmationStatus === 'confirmed') {
          clearInterval(interval);
          clearTimeout(timer);
          resolved = true;
          resolve(status);
        } else if (status?.value?.err) {
          clearInterval(interval);
          clearTimeout(timer);
          resolved = true;
          reject(new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`));
        }
      } catch (error) {
        console.warn('Status check error:', error);
      }
    }, 2000); // Check every 2 seconds
  });
};

export const verifyTransaction = async (txHash) => {
  try {
    const connection = new Connection(
      `https://solana-devnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
      "confirmed"
    );
    
    const tx = await connection.getTransaction(txHash);
    return tx && !tx.meta?.err;
  } catch (error) {
    console.error('Verification failed:', error);
    return false;
  }
};