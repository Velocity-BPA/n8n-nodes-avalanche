# n8n-nodes-avalanche

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with the Avalanche blockchain network, offering access to 6 key resources including C-Chain, X-Chain, P-Chain, Subnet management, Asset operations, and Wallet functionality. Build powerful blockchain workflows with transaction monitoring, asset transfers, subnet operations, and cross-chain interactions directly within n8n.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Avalanche](https://img.shields.io/badge/Avalanche-Compatible-red)
![Web3](https://img.shields.io/badge/Web3-Enabled-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-purple)

## Features

- **C-Chain Operations** - Execute Ethereum-compatible smart contract interactions and EVM transactions
- **X-Chain Management** - Handle AVAX token transfers and asset exchange operations on the Exchange Chain
- **P-Chain Integration** - Manage validator operations, staking, and platform chain functionality
- **Subnet Administration** - Create, configure, and monitor custom blockchain subnets
- **Asset Operations** - Create, mint, and transfer custom digital assets across chains
- **Wallet Management** - Generate addresses, check balances, and manage multiple wallet operations
- **Cross-Chain Transfers** - Seamlessly move assets between different Avalanche chains
- **Real-time Monitoring** - Track transaction status and blockchain events in real-time

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-avalanche`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-avalanche
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-avalanche.git
cd n8n-nodes-avalanche
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-avalanche
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Avalanche node or service provider API key | Yes |
| Network | Target network (mainnet, fuji testnet, or custom) | Yes |
| Node URL | Custom RPC endpoint URL (if using custom network) | No |

## Resources & Operations

### 1. CChain

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve ETH or ERC-20 token balance for an address |
| Send Transaction | Send ETH or execute contract transactions |
| Call Contract | Execute read-only smart contract function calls |
| Get Transaction | Retrieve transaction details by hash |
| Get Block | Get block information by number or hash |
| Estimate Gas | Calculate gas costs for transactions |
| Get Receipt | Get transaction receipt and execution logs |

### 2. XChain

| Operation | Description |
|-----------|-------------|
| Get Balance | Check AVAX balance for X-Chain addresses |
| Send AVAX | Transfer AVAX tokens between X-Chain addresses |
| Create Asset | Create new fungible or non-fungible assets |
| Mint Asset | Mint additional units of existing assets |
| Get UTXO | Retrieve unspent transaction outputs |
| Get Transaction | Get X-Chain transaction details |
| Export to C-Chain | Export AVAX from X-Chain to C-Chain |

### 3. PChain

| Operation | Description |
|-----------|-------------|
| Get Balance | Check P-Chain AVAX balance |
| Add Validator | Register a new validator on the network |
| Add Delegator | Delegate stake to existing validators |
| Get Validators | List current and pending validators |
| Get Stake | Retrieve staking information |
| Import from C-Chain | Import AVAX from C-Chain to P-Chain |
| Create Subnet | Create new blockchain subnets |

### 4. Subnet

| Operation | Description |
|-----------|-------------|
| Create Subnet | Initialize new subnet infrastructure |
| Get Subnets | List all available subnets |
| Validate Subnet | Add validator to subnet |
| Get Subnet Info | Retrieve detailed subnet information |
| Create Blockchain | Deploy blockchain on existing subnet |
| Get Blockchains | List blockchains in subnet |

### 5. Asset

| Operation | Description |
|-----------|-------------|
| Create Asset | Generate new fungible or NFT assets |
| Get Asset Info | Retrieve asset metadata and properties |
| Mint Tokens | Create additional asset units |
| Transfer Asset | Send assets between addresses |
| Get Asset Balance | Check asset holdings for addresses |
| List Assets | Get all assets created by address |

### 6. Wallet

| Operation | Description |
|-----------|-------------|
| Create Address | Generate new wallet addresses |
| Import Key | Import existing private keys |
| List Addresses | Get all addresses in wallet |
| Get Private Key | Export private key for address |
| Sign Message | Cryptographically sign messages |
| Get All Balances | Retrieve balances across all chains |

## Usage Examples

```javascript
// Monitor C-Chain transaction status
{
  "operation": "getTransaction",
  "txHash": "0x1234567890abcdef...",
  "includeLogs": true
}

// Transfer AVAX on X-Chain
{
  "operation": "sendAVAX",
  "to": "X-avax1xyz789...",
  "amount": "100",
  "memo": "Payment for services"
}

// Create custom asset
{
  "operation": "createAsset",
  "name": "MyToken",
  "symbol": "MTK",
  "denomination": 8,
  "initialHolders": [
    {
      "address": "X-avax1abc123...",
      "amount": "1000000"
    }
  ]
}

// Add validator to P-Chain
{
  "operation": "addValidator",
  "nodeID": "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
  "startTime": "2024-01-01T00:00:00Z",
  "endTime": "2024-12-31T23:59:59Z",
  "stakeAmount": "2000"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with node | Verify API key and network configuration |
| Insufficient Funds | Not enough balance for transaction | Check wallet balance and reduce amount |
| Transaction Timeout | Transaction not confirmed within time limit | Check network status and retry with higher gas |
| Invalid Address | Malformed or incorrect address format | Validate address format for target chain |
| Network Error | Connection issues with Avalanche node | Check network connectivity and node status |
| Gas Limit Exceeded | Transaction requires more gas than provided | Increase gas limit or optimize transaction |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-avalanche/issues)
- **Avalanche Documentation**: [docs.avax.network](https://docs.avax.network)
- **Developer Resources**: [developer.avalabs.org](https://developer.avalabs.org)