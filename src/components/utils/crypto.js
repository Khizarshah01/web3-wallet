import { Buffer } from 'buffer'; // Polyfill Buffer for the browser
import * as bip39 from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { sha512 } from '@noble/hashes/sha512';
import { ripemd160 } from '@noble/hashes/ripemd160';
import * as bitcoin from 'bitcoinjs-lib';
import bs58 from 'bs58';
import * as ed25519 from '@noble/ed25519';
import { ethers } from 'ethers';

// Patch ed25519 to use noble's sha512
ed25519.etc.sha512Sync = (...m) => sha512(ed25519.etc.concatBytes(...m));

export async function getAllCoinAddresses(mnemonic) {
  // Generate seed from mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // =======================
  // Ethereum Address
  // =======================
  const ethPath = "m/44'/60'/0'/0/0";
  const ethHdNode = ethers.HDNodeWallet.fromSeed(seed);
  const ethWalletNode = ethHdNode.derivePath(ethPath);
  const ethWallet = new ethers.Wallet(ethWalletNode.privateKey);
  const ethAddress = ethWallet.address;

  // =======================
  // Solana Address
  // =======================
  const solPath = "m/44'/501'/0'/0'";
  const solKey = HDKey.fromMasterSeed(seed).derive(solPath);
  const solPrivateKey = solKey.privateKey;
  const solPublicKey = await ed25519.getPublicKey(solPrivateKey);
  const solAddress = bs58.encode(solPublicKey);

  // =======================
  // Bitcoin Address
  // =======================
  const btcPath = "m/44'/0'/0'/0/0";
  const btcHdNode = bitcoin.bip32.fromSeed(seed);
  const btcWalletNode = btcHdNode.derivePath(btcPath);
  const { address: btcAddress } = bitcoin.payments.p2pkh({
    pubkey: btcWalletNode.publicKey,
    network: bitcoin.networks.bitcoin, // Use .testnet for test network
  });

  return {
    eth: ethAddress,
    btc: btcAddress,
    sol: solAddress,
  };
}