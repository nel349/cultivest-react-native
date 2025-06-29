# Bitcoin Testnet Faucet Backend Implementation

## Overview
The frontend now supports a local Bitcoin faucet that eliminates the need for users to manually visit external faucet websites. This document outlines what needs to be implemented on the backend.

## Frontend Integration
The frontend calls: `POST /faucet/bitcoin` when users click "Get Bitcoin Testnet (Local Faucet)"

## Required Backend Endpoint

### POST `/api/v1/faucet/bitcoin`

**Purpose**: Send Bitcoin testnet from your master wallet to user's wallet

**Request Body**:
```json
{
  "userID": "string",
  "bitcoinAddress": "string"  // User's Bitcoin testnet address
}
```

**Success Response**:
```json
{
  "success": true,
  "txid": "transaction_hash_here",
  "amount": "0.001",
  "bitcoinAddress": "user_address_here",
  "message": "Bitcoin testnet sent successfully"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Implementation Strategy

### 1. Master Wallet Setup
- Create a Bitcoin testnet wallet (or use existing one)
- Fund it from external faucets (one-time manual setup)
- Store private key securely in environment variables

### 2. Rate Limiting
Implement per-user rate limiting to prevent abuse:
- Max 1 request per user per hour
- Max 0.001 BTC per request
- Track requests in database/redis

### 3. Master Wallet Management
```javascript
// Example implementation concept
const DAILY_FAUCET_LIMIT = 0.01; // BTC per day total
const PER_USER_AMOUNT = 0.001;   // BTC per request
const MIN_MASTER_BALANCE = 0.005; // Alert threshold

// Before sending, check:
// 1. User hasn't requested in last hour
// 2. Master wallet has sufficient balance
// 3. Daily limit not exceeded
```

### 4. Bitcoin Transaction
Use a Bitcoin library like `bitcoinjs-lib` or similar to:
1. Create transaction from master wallet to user address
2. Sign with master wallet private key
3. Broadcast to Bitcoin testnet
4. Return transaction hash

### 5. Error Handling
Common error scenarios:
- Invalid Bitcoin address format
- Insufficient master wallet balance
- Rate limit exceeded
- Transaction broadcast failure
- Network connectivity issues

## Environment Variables Needed

```bash
# Bitcoin testnet configuration
BITCOIN_TESTNET_PRIVATE_KEY=your_master_wallet_private_key
BITCOIN_TESTNET_RPC_URL=optional_if_using_external_service
BITCOIN_FAUCET_AMOUNT=0.001
BITCOIN_FAUCET_RATE_LIMIT_HOURS=1

# Master wallet monitoring
BITCOIN_MASTER_WALLET_ADDRESS=your_master_wallet_address
BITCOIN_LOW_BALANCE_ALERT_THRESHOLD=0.005
```

## Testing

Test the endpoint with:
```bash
curl -X POST http://localhost:3000/api/v1/faucet/bitcoin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userID": "test-user-id",
    "bitcoinAddress": "tb1qrgaz6s66pv6ymvzvn8xtp7703atujjuxf2fmmr"
  }'
```

## Benefits of Local Faucet

✅ **No user friction** - One-click funding  
✅ **Reliable** - No dependency on external faucets  
✅ **Fast** - Direct transfer from your wallet  
✅ **Controlled** - You manage rate limits and amounts  
✅ **Professional** - Better user experience  

## Security Considerations

1. **Private Key Security**: Store master wallet private key in secure environment variables
2. **Rate Limiting**: Prevent abuse with per-user and daily limits
3. **Balance Monitoring**: Alert when master wallet is running low
4. **Input Validation**: Validate Bitcoin addresses before sending
5. **Logging**: Log all faucet requests for monitoring and debugging

## Maintenance

- **Refill Master Wallet**: Periodically add testnet Bitcoin from external faucets
- **Monitor Usage**: Track daily/weekly faucet usage patterns
- **Balance Alerts**: Set up alerts when master wallet balance is low
- **Clean Old Requests**: Periodically clean up old rate limit records

This implementation gives you full control over testnet funding while providing an excellent user experience! 