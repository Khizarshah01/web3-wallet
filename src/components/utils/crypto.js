import { Buffer } from 'buffer';
import { mnemonicToSeed } from 'bip39';
import { ethers } from 'ethers';
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { BIP32Factory } from "bip32";

export async function getAllCoinAddresses(mnemonic) {
  const seed = await mnemonicToSeed(mnemonic);

  // Ethereum
  const ethPath = "m/44'/60'/0'/0/0";
  const ethHdNode = ethers.HDNodeWallet.fromSeed(seed);
  const ethWalletNode = ethHdNode.derivePath(ethPath);
  const ethWallet = new ethers.Wallet(ethWalletNode.privateKey);
  const ethAddress = ethWallet.address;

  // Solana
  const solPath = "m/44'/501'/0'/0'";
  const derivedSeed = derivePath(solPath, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const keypair = Keypair.fromSecretKey(secret);
  const solAddress = keypair.publicKey.toBase58();

  // Bitcoin
  const bip32 = BIP32Factory(ecc);
  const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
  const child = root.derivePath("m/84'/0'/0'/0/0"); // m/84'/0'/0'/0/0 -> Used modern wallets and exchanges SegWit adrs.. (P2WPKH) — which start with `bc1..`
  const { address: btcAddress } = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(child.publicKey),
    network: bitcoin.networks.bitcoin,
  });

  return {
    eth: ethAddress,
    btc: btcAddress,
    sol: solAddress,
  };
}
