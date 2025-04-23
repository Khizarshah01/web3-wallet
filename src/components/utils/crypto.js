import { Buffer } from 'buffer'; // Polyfill Buffer for the browser
import {mnemonicToSeed} from 'bip39';
import { HDKey } from '@scure/bip32';
import { sha512 } from '@noble/hashes/sha512';
import { ripemd160 } from '@noble/hashes/ripemd160';
// import * as bitcoin from 'bitcoinjs-lib';
import bs58 from 'bs58';
import * as ed25519 from '@noble/ed25519';
import { ethers } from 'ethers';
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"

// Patch ed25519 to use noble's sha512
ed25519.etc.sha512Sync = (...m) => sha512(ed25519.etc.concatBytes(...m));

export async function getAllCoinAddresses(mnemonic) {
  // Generate seed from mnemonic
  const seed = await mnemonicToSeed(mnemonic);

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
  const derivedSeed = derivePath(solPath, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const keypair = Keypair.fromSecretKey(secret);
  // const solPublicKey = keypair.publicKey.toBytes(); // Convert to byte array if needed
  const solAddress = keypair.publicKey.toBase58();  // Directly get Base58 address


  // =======================
  // Bitcoin Address
  // =======================
  // const btcPath = "m/44'/0'/0'/0/0";
  // const btcHdNode = bitcoin.bip32.fromSeed(seed);
  // const btcWalletNode = btcHdNode.derivePath(btcPath);
  // const { address: btcAddress } = bitcoin.payments.p2pkh({
  //   pubkey: btcWalletNode.publicKey,
  //   network: bitcoin.networks.bitcoin, // Use .testnet for test network
  // });

  return {
    eth: ethAddress,
    // btc: btcAddress,
    sol: solAddress,
  };
}