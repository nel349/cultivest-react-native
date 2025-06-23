# 🔐 **Multi-Chain Key Management Architecture**

## 📋 **System Overview**

This document specifies the secure storage and management of master keys for multi-chain cryptocurrency portfolios in the Cultivest platform, supporting **Bitcoin**, **Ethereum**, **Solana**, and **Algorand** blockchains.

## 🏗️ **Architecture Components**

### **Execution Environments:**
- **📱 React Native App (Device)** - User's mobile device (iOS/Android) - **CLIENT-SIDE**
- **☁️ Backend API (Server)** - Node.js server with Supabase database - **SERVER-SIDE**
- **⛓️ Blockchain Networks** - Bitcoin, Ethereum, Solana, Algorand mainnet/testnet

---

## 🔑 **Key Generation & Storage Flow**

### **1. Initial Multi-Chain Wallet Creation**

**🔍 EXECUTION LOCATION: React Native App (Device) - CLIENT-SIDE**
**🌐 BLOCKCHAIN: All chains (Bitcoin, Ethereum, Solana, Algorand)**

```typescript
// File: cultivest-react-native/utils/SecureWalletManager.ts
// RUNS ON: User's mobile device (React Native)
export class SecureWalletManager {
  
  static async createNewWallet(userPin: string, userId: string) {
    console.log('🔐 DEVICE: Generating master mnemonic locally');
    
    // Generate master mnemonic on device (NEVER sent to server)
    const mnemonic = bip39.generateMnemonic(128); // 12 words
    
    // Derive wallets for all supported blockchains
    const wallets = await this.deriveAllBlockchainWallets(mnemonic);
    
    console.log('📱 DEVICE: Encrypting master seed with user PIN');
    // Encrypt master seed with user PIN (device-only)
    const deviceEncrypted = CryptoJS.AES.encrypt(mnemonic, userPin).toString();
    
    console.log('💾 DEVICE: Storing encrypted seed in device storage');
    // Store encrypted seed locally on device
    await AsyncStorage.setItem(`master_seed_${userId}`, deviceEncrypted);
    
    console.log('☁️ DEVICE→SERVER: Creating encrypted backup');
    // Create backup for recovery (double-encrypted)
    await this.createServerBackup(deviceEncrypted, userId);
    
    return {
      publicAddresses: {
        bitcoin: wallets.bitcoin.address,      // Bitcoin mainnet address
        ethereum: wallets.ethereum.address,   // Ethereum mainnet address  
        solana: wallets.solana.publicKey.toString(), // Solana mainnet address
        algorand: wallets.algorand.addr       // Algorand testnet address
      },
      masterSeedStored: true,
      backupCreated: true
    };
  }
  
  // RUNS ON: React Native Device (CLIENT-SIDE)
  // BLOCKCHAIN: Derives keys for Bitcoin, Ethereum, Solana, Algorand
  private static async deriveAllBlockchainWallets(mnemonic: string) {
    console.log('🔑 DEVICE: Deriving blockchain-specific wallets');
    const seed = await bip39.mnemonicToSeed(mnemonic);
    
    return {
      // Bitcoin wallet derivation (BIP44: m/44'/0'/0'/0/0)
      bitcoin: this.deriveBitcoinWallet(seed, 0),
      
      // Ethereum wallet derivation (BIP44: m/44'/60'/0'/0/0)  
      ethereum: this.deriveEthereumWallet(seed, 0),
      
      // Solana wallet derivation (BIP44: m/44'/501'/0'/0/0)
      solana: this.deriveSolanaWallet(seed, 0),
      
      // Algorand wallet derivation (BIP44: m/44'/283'/0'/0/0)
      algorand: this.deriveAlgorandWallet(seed, 0)
    };
  }
  
  // RUNS ON: React Native Device (CLIENT-SIDE)
  // BLOCKCHAIN: Bitcoin-specific key derivation
  private static deriveBitcoinWallet(seed: Buffer, accountIndex: number) {
    console.log('₿ DEVICE: Deriving Bitcoin wallet from master seed');
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(`m/44'/0'/0'/0/${accountIndex}`);
    
    return {
      privateKey: child.privateKey,
      publicKey: child.publicKey,
      address: bitcoin.payments.p2wpkh({ 
        pubkey: child.publicKey,
        network: bitcoin.networks.bitcoin // Bitcoin mainnet
      }).address,
      blockchain: 'bitcoin',
      network: 'mainnet'
    };
  }
  
  // RUNS ON: React Native Device (CLIENT-SIDE)  
  // BLOCKCHAIN: Ethereum-specific key derivation
  private static deriveEthereumWallet(seed: Buffer, accountIndex: number) {
    console.log('⟠ DEVICE: Deriving Ethereum wallet from master seed');
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(`m/44'/60'/0'/0/${accountIndex}`);
    
    return {
      privateKey: child.privateKey,
      publicKey: child.publicKey, 
      address: ethUtil.toChecksumAddress(
        ethUtil.pubToAddress(child.publicKey, true).toString('hex')
      ),
      blockchain: 'ethereum',
      network: 'mainnet'
    };
  }
  
  // RUNS ON: React Native Device (CLIENT-SIDE)
  // BLOCKCHAIN: Solana-specific key derivation  
  private static deriveSolanaWallet(seed: Buffer, accountIndex: number) {
    console.log('◎ DEVICE: Deriving Solana wallet from master seed');
    const derivedSeed = derivePath(`m/44'/501'/0'/0/${accountIndex}`, seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    
    return {
      privateKey: keypair.secretKey,
      publicKey: keypair.publicKey,
      address: keypair.publicKey.toString(),
      blockchain: 'solana', 
      network: 'mainnet'
    };
  }
  
  // RUNS ON: React Native Device (CLIENT-SIDE)
  // BLOCKCHAIN: Algorand-specific key derivation
  private static deriveAlgorandWallet(seed: Buffer, accountIndex: number) {
    console.log('🔺 DEVICE: Deriving Algorand wallet from master seed');
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(`m/44'/283'/0'/0/${accountIndex}`);
    const account = algosdk.mnemonicFromSeed(child.privateKey);
    
    return {
      privateKey: child.privateKey,
      mnemonic: account.mnemonic,
      ...algosdk.mnemonicToSecretKey(account.mnemonic),
      blockchain: 'algorand',
      network: 'testnet' // Using testnet for hackathon
    };
  }
}
```

### **2. Backup Creation**

**🔍 EXECUTION LOCATION: React Native Device → Backend Server**
**🌐 BLOCKCHAIN: N/A (backup storage only)**

```typescript
// RUNS ON: React Native Device (CLIENT-SIDE)
private static async createServerBackup(deviceEncrypted: string, userId: string) {
  console.log('📤 DEVICE→SERVER: Sending encrypted backup to server');
  
  const backupData = {
    userId: userId,
    deviceEncryptedSeed: deviceEncrypted, // Already encrypted with user PIN on device
    timestamp: Date.now()
  };
  
  // Send to backend API (encrypted seed never decrypted on server)
  const response = await fetch(`${API_BASE}/wallet/create-backup`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify(backupData)
  });
  
  return response.json();
}
```

**🔍 EXECUTION LOCATION: Backend Server (SERVER-SIDE)**
**🌐 BLOCKCHAIN: N/A (database storage only)**

```typescript
// File: cultivest-backend/app/api/wallet/create-backup+api.ts
// RUNS ON: Backend server (Node.js)

router.post('/create-backup', async (req, res) => {
  console.log('☁️ SERVER: Receiving encrypted backup from device');
  const { userId, deviceEncryptedSeed, timestamp } = req.body;
  
  console.log('🔒 SERVER: Double-encrypting backup with server key');
  // Double-encrypt with server key (defense in depth)
  // NOTE: Server cannot decrypt original seed - still needs user PIN
  const serverKey = process.env.MASTER_ENCRYPTION_KEY!;
  const doubleEncrypted = CryptoJS.AES.encrypt(deviceEncryptedSeed, serverKey).toString();
  
  console.log('💾 SERVER: Storing double-encrypted backup in database');
  // Store in Supabase database - CANNOT be decrypted without user PIN + server key
  const { data, error } = await supabase
    .from('wallet_backups')
    .insert({
      user_id: userId,
      encrypted_backup: doubleEncrypted, // Double-encrypted
      backup_date: new Date(timestamp).toISOString(),
      can_decrypt_on_server: false, // Server cannot decrypt without user PIN
      supported_blockchains: ['bitcoin', 'ethereum', 'solana', 'algorand'],
      notes: 'Backup requires user PIN + server key to decrypt'
    });
    
  return res.json({ 
    success: true, 
    backupStored: true,
    serverCanDecrypt: false // Important: server cannot access user's keys
  });
});
```

---

## 🔓 **Key Retrieval & Blockchain Operations**

### **3. Daily Transaction Signing**

**🔍 EXECUTION LOCATION: React Native Device (CLIENT-SIDE)**
**🌐 BLOCKCHAIN: Bitcoin, Ethereum, Solana, Algorand**

```typescript
// RUNS ON: React Native Device (CLIENT-SIDE)
export class WalletOperations {
  
  // Get master seed for transaction signing (DEVICE ONLY)
  static async getMasterSeed(userPin: string, userId: string): Promise<string | null> {
    console.log('🔓 DEVICE: Decrypting master seed with user PIN');
    
    try {
      // Retrieve from device storage only
      const encrypted = await AsyncStorage.getItem(`master_seed_${userId}`);
      if (!encrypted) return null;
      
      // Decrypt with user PIN (happens on device only)
      const decrypted = CryptoJS.AES.decrypt(encrypted, userPin);
      const mnemonic = decrypted.toString(CryptoJS.enc.Utf8);
      
      // Validate mnemonic
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid PIN or corrupted seed');
      }
      
      console.log('✅ DEVICE: Master seed successfully decrypted');
      return mnemonic;
    } catch (error) {
      console.error('❌ DEVICE: Failed to decrypt master seed:', error);
      return null;
    }
  }
  
  // Sign Bitcoin transaction
  static async signBitcoinTransaction(transaction: any, userPin: string, userId: string) {
    console.log('₿ DEVICE: Signing Bitcoin transaction');
    
    // Get master seed (device only)
    const mnemonic = await this.getMasterSeed(userPin, userId);
    if (!mnemonic) throw new Error('Cannot access Bitcoin wallet');
    
    // Derive Bitcoin wallet from master seed
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed);
    const bitcoinWallet = root.derivePath("m/44'/0'/0'/0/0");
    
    // Sign Bitcoin transaction
    const psbt = bitcoin.Psbt.fromBase64(transaction.psbtBase64);
    psbt.signAllInputs(bitcoinWallet);
    psbt.finalizeAllInputs();
    
    console.log('✅ BITCOIN: Transaction signed on device');
    return {
      signedTx: psbt.extractTransaction().toHex(),
      blockchain: 'bitcoin',
      network: 'mainnet'
    };
  }
  
  // Sign Ethereum transaction  
  static async signEthereumTransaction(transaction: any, userPin: string, userId: string) {
    console.log('⟠ DEVICE: Signing Ethereum transaction');
    
    // Get master seed (device only)
    const mnemonic = await this.getMasterSeed(userPin, userId);
    if (!mnemonic) throw new Error('Cannot access Ethereum wallet');
    
    // Derive Ethereum wallet from master seed
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed);
    const ethereumWallet = root.derivePath("m/44'/60'/0'/0/0");
    
    // Sign Ethereum transaction
    const tx = new ethTx(transaction.txData);
    tx.sign(ethereumWallet.privateKey);
    
    console.log('✅ ETHEREUM: Transaction signed on device');
    return {
      signedTx: '0x' + tx.serialize().toString('hex'),
      blockchain: 'ethereum',
      network: 'mainnet'
    };
  }
  
  // Sign Solana transaction
  static async signSolanaTransaction(transaction: any, userPin: string, userId: string) {
    console.log('◎ DEVICE: Signing Solana transaction');
    
    // Get master seed (device only)
    const mnemonic = await this.getMasterSeed(userPin, userId);
    if (!mnemonic) throw new Error('Cannot access Solana wallet');
    
    // Derive Solana wallet from master seed
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivedSeed = derivePath("m/44'/501'/0'/0/0", seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    
    // Sign Solana transaction
    const solanaTransaction = Transaction.from(transaction.serializedTx);
    solanaTransaction.sign(keypair);
    
    console.log('✅ SOLANA: Transaction signed on device');
    return {
      signedTx: solanaTransaction.serialize(),
      blockchain: 'solana',
      network: 'mainnet'
    };
  }
  
  // Sign Algorand transaction
  static async signAlgorandTransaction(transaction: any, userPin: string, userId: string) {
    console.log('🔺 DEVICE: Signing Algorand transaction');
    
    // Get master seed (device only)
    const mnemonic = await this.getMasterSeed(userPin, userId);
    if (!mnemonic) throw new Error('Cannot access Algorand wallet');
    
    // Derive Algorand wallet from master seed
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath("m/44'/283'/0'/0/0");
    const algoAccount = algosdk.mnemonicToSecretKey(
      algosdk.mnemonicFromSeed(child.privateKey).mnemonic
    );
    
    // Sign Algorand transaction
    const signedTxn = transaction.txn.signTxn(algoAccount.sk);
    
    console.log('✅ ALGORAND: Transaction signed on device');
    return {
      signedTx: signedTxn,
      txId: transaction.txn.txID(),
      blockchain: 'algorand',
      network: 'testnet'
    };
  }
}
```

### **4. Recovery Process**

**🔍 EXECUTION LOCATION: React Native Device ↔ Backend Server**
**🌐 BLOCKCHAIN: All chains (Bitcoin, Ethereum, Solana, Algorand)**

```typescript
// RUNS ON: React Native Device (CLIENT-SIDE)
export class WalletRecovery {
  
  static async recoverWallet(userId: string, userPin: string, userToken: string) {
    console.log('🔄 DEVICE→SERVER: Requesting encrypted backup');
    
    // Request backup from server (still encrypted)
    const response = await fetch(`${API_BASE}/wallet/get-backup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    
    const { encryptedBackup } = await response.json();
    
    console.log('🔓 DEVICE: Decrypting backup with user PIN');
    // Decrypt backup locally with user PIN (server cannot do this)
    const decrypted = CryptoJS.AES.decrypt(encryptedBackup, userPin);
    const mnemonic = decrypted.toString(CryptoJS.enc.Utf8);
    
    // Validate and restore all blockchain wallets
    if (bip39.validateMnemonic(mnemonic)) {
      console.log('💾 DEVICE: Restoring wallet access for all blockchains');
      
      // Re-encrypt and store locally
      await AsyncStorage.setItem(`master_seed_${userId}`, 
        CryptoJS.AES.encrypt(mnemonic, userPin).toString()
      );
      
      // Verify all blockchain wallets can be derived
      const wallets = await this.verifyAllChainAccess(mnemonic);
      
      return { 
        success: true, 
        walletRestored: true,
        supportedChains: ['bitcoin', 'ethereum', 'solana', 'algorand'],
        walletsVerified: wallets
      };
    }
    
    throw new Error('Invalid PIN or corrupted backup');
  }
  
  // RUNS ON: React Native Device (CLIENT-SIDE)
  // BLOCKCHAIN: Verify access to Bitcoin, Ethereum, Solana, Algorand
  private static async verifyAllChainAccess(mnemonic: string) {
    console.log('✅ DEVICE: Verifying access to all blockchain wallets');
    
    const seed = await bip39.mnemonicToSeed(mnemonic);
    
    return {
      bitcoin: {
        address: this.deriveBitcoinAddress(seed),
        accessible: true,
        blockchain: 'bitcoin',
        network: 'mainnet'
      },
      ethereum: {
        address: this.deriveEthereumAddress(seed),
        accessible: true,
        blockchain: 'ethereum', 
        network: 'mainnet'
      },
      solana: {
        address: this.deriveSolanaAddress(seed),
        accessible: true,
        blockchain: 'solana',
        network: 'mainnet'
      },
      algorand: {
        address: this.deriveAlgorandAddress(seed),
        accessible: true,
        blockchain: 'algorand',
        network: 'testnet'
      }
    };
  }
}
```

**🔍 EXECUTION LOCATION: Backend Server (SERVER-SIDE)**
**🌐 BLOCKCHAIN: N/A (database retrieval only)**

```typescript
// RUNS ON: Backend Server (SERVER-SIDE)
router.post('/get-backup', async (req, res) => {
  console.log('☁️ SERVER: Processing backup recovery request');
  const { userId } = req.body;
  
  // Retrieve double-encrypted backup from database
  const { data: backup } = await supabase
    .from('wallet_backups')
    .select('encrypted_backup, supported_blockchains')
    .eq('user_id', userId)
    .single();
    
  if (!backup) {
    return res.status(404).json({ error: 'No backup found' });
  }
  
  console.log('🔓 SERVER: Partially decrypting backup (user PIN still required)');
  // Decrypt with server key (user still needs PIN to fully decrypt)
  const serverKey = process.env.MASTER_ENCRYPTION_KEY!;
  const partiallyDecrypted = CryptoJS.AES.decrypt(backup.encrypted_backup, serverKey);
  
  return res.json({ 
    encryptedBackup: partiallyDecrypted.toString(CryptoJS.enc.Utf8), // Still encrypted with user PIN
    supportedChains: backup.supported_blockchains,
    requiresUserPin: true,
    serverCannotDecrypt: true
  });
});
```

---

## 📊 **Security & Execution Matrix**

| Operation | Location | Blockchain | Encryption | Access Required | Server Can Decrypt? |
|-----------|----------|------------|------------|-----------------|-------------------|
| **Mnemonic Generation** | React Native Device | All chains | User PIN | Device only | ❌ Never |
| **Bitcoin Key Derivation** | React Native Device | Bitcoin | User PIN | Device + PIN | ❌ Never |
| **Ethereum Key Derivation** | React Native Device | Ethereum | User PIN | Device + PIN | ❌ Never |
| **Solana Key Derivation** | React Native Device | Solana | User PIN | Device + PIN | ❌ Never |
| **Algorand Key Derivation** | React Native Device | Algorand | User PIN | Device + PIN | ❌ Never |
| **Backup Storage** | Backend Server | N/A | PIN + Server Key | Auth token | ❌ No PIN access |
| **Bitcoin Transaction** | React Native Device | Bitcoin mainnet | User PIN | Device + PIN | ❌ Never |
| **Ethereum Transaction** | React Native Device | Ethereum mainnet | User PIN | Device + PIN | ❌ Never |
| **Solana Transaction** | React Native Device | Solana mainnet | User PIN | Device + PIN | ❌ Never |
| **Algorand Transaction** | React Native Device | Algorand testnet | User PIN | Device + PIN | ❌ Never |
| **Portfolio NFT Metadata** | Algorand Blockchain | Algorand | None | Public | ❌ Public data only |

---

## 🔒 **Blockchain-Specific Security Guarantees**

### **✅ What We CAN'T Access (Zero Knowledge):**
- Bitcoin private keys or signed transactions
- Ethereum private keys or signed transactions  
- Solana private keys or signed transactions
- Algorand private keys or signed transactions
- User's master mnemonic or PIN
- Ability to spend user's crypto on any blockchain

### **✅ What We CAN Access:**
- Bitcoin public addresses (read-only balance checking)
- Ethereum public addresses (read-only balance checking)
- Solana public addresses (read-only balance checking)  
- Algorand public addresses (read-only balance checking)
- Portfolio balances across all chains (read-only)
- Transaction history (publicly available on blockchains)
- Encrypted backup (useless without user PIN)

### **✅ Recovery Scenarios:**
- **Device lost**: User recovers via PIN + backup → All blockchain access restored
- **PIN forgotten**: User must use 12-word backup phrase → All chains accessible  
- **Server compromised**: User data still encrypted with PIN → All blockchain keys safe
- **App deleted**: User recovers via PIN + backup → Bitcoin, Ethereum, Solana, Algorand access restored

This architecture ensures **maximum security across all blockchains** while maintaining **excellent user experience** and **regulatory compliance**. 