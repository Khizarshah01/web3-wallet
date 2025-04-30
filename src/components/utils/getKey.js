import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export const getPrivateKeyFromMnemonic = async (mnemonic, symbol) => {
    try {
        switch (symbol) {
            case 'ETH': {
                const seed = await bip39.mnemonicToSeed(mnemonic); 
                const ethHdNode = ethers.HDNodeWallet.fromSeed(seed); 
                const ethPath = "m/44'/60'/0'/0/0";
                const ethWalletNode = ethHdNode.derivePath(ethPath);
                const privateKey = ethWalletNode.privateKey;
                return privateKey;
            }
            case 'SOL': {
                const seed = await bip39.mnemonicToSeed(mnemonic); 
                const solPath = "m/44'/501'/0'/0'";
                const derivedSeed = derivePath(solPath, seed.toString("hex")).key;
                const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
                const keypair = Keypair.fromSecretKey(secret);
                const privateKey = keypair.secretKey;
                console.log(privateKey);
                return privateKey;
            }
            default:
                throw new Error("Unsupported token symbol");
        }
    } catch (error) {
        console.error("Error deriving key:", error);
        return null;
    }
};
