import { Buffer } from 'buffer';  // Polyfill Buffer for the browser
import * as bip39 from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { keccak256 } from 'js-sha3';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import bs58 from 'bs58';
import * as ed25519 from '@noble/ed25519';
// import * as secp from '@noble/secp256k1';
// import secp256k1 from 'secp256k1'; 
// import { ethers } from 'ethers';
import { sha512 } from '@noble/hashes/sha512';
ed25519.etc.sha512Sync = (...m) => sha512(ed25519.etc.concatBytes(...m));

export async function getAllCoinAddresses(mnemonic) {

  //Etherium
  // Await the seed generation since it's asynchronous
  const seed = await bip39.mnemonicToSeed(mnemonic);  // unit8Array Expected
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive("m/44'/60'/0'/0/0");
  const publicKeyHex = Buffer.from(child.publicKey).toString('hex');
  const hash = keccak256(publicKeyHex.slice(1));
  const ethAddress = "0x" + hash.slice(-40);

  // Solana
  const solSeed = await bip39.mnemonicToSeed(mnemonic); // same seed
  const solPath = "m/44'/501'/0'/0'";
  const solKey = HDKey.fromMasterSeed(solSeed).derive(solPath);
  const solPrivateKey = solKey.privateKey;
  const solPubKey = await ed25519.getPublicKey(solPrivateKey);
  const solAddress = bs58.encode(solPubKey);




  // Bitcoin

  const btcKey = root.derive("m/44'/0'/0'/0/0");
  const btcPubKey = btcKey.publicKey;
  const sha256Hash = sha256(btcPubKey);
  const ripemdHash = ripemd160(sha256Hash);
  const versionedPayload = Uint8Array.from([0x00, ...ripemdHash]); // 0x00 = Mainnet
  const checksum = sha256(sha256(versionedPayload)).slice(0, 4);
  const fullPayload = Uint8Array.from([...versionedPayload, ...checksum]);
  const btcAddress = bs58.encode(fullPayload);

  return {
    eth: ethAddress,
    btc: btcAddress,
    sol: solAddress
  };
}
