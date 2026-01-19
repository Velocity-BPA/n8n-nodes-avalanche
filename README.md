# n8n-nodes-avalanche

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

---

A comprehensive n8n community node for Avalanche blockchain providing 12 resources and 40+ operations for C-Chain, X-Chain, P-Chain, DeFi, staking, and cross-chain operations. Includes polling triggers for blockchain monitoring.

![Avalanche](https://img.shields.io/badge/Avalanche-E84142?style=for-the-badge&logo=avalanche&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-BSL--1.1-blue?style=for-the-badge)

## Features

### C-Chain (EVM) Operations
- **Account**: Get balances, transaction counts, transaction history
- **Transactions**: Send AVAX, get transaction details, wait for confirmations
- **Tokens (ERC-20)**: Get balances, transfer, approve, check allowances
- **NFTs (ERC-721/1155)**: Get balances, owners, metadata, transfer NFTs
- **Smart Contracts**: Read/write contract functions, get ABIs
- **DeFi**: WAVAX wrap/unwrap, token price queries

### X-Chain Operations
- Asset balances and transfers
- UTXO management
- Asset information queries

### P-Chain Operations
- **Validators**: Get current/pending validators
- **Staking**: Get staking parameters and info
- **Subnets**: Query subnet information

### Cross-Chain
- Atomic UTXOs for cross-chain transfers
- Multi-chain balance queries

### Network & Utility
- Network information (ID, name, node version)
- Gas price and fee data
- Block information
- AVAX price from Snowtrace
- Unit conversion utilities
- Address validation

### Triggers (Polling)
- New block detection
- Address activity monitoring
- Token transfer monitoring
- Contract event listening
- Balance change alerts
- Gas price alerts
- Whale transfer alerts

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-avalanche`
5. Click **Install**

### Manual Installation

1. Clone or download this repository:
```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-avalanche.git
cd n8n-nodes-avalanche
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Link to n8n:
```bash
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-avalanche
```

4. Restart n8n

### Development Installation

```bash
# Extract the zip file
unzip n8n-nodes-avalanche.zip
cd n8n-nodes-avalanche

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-avalanche

# Restart n8n
n8n start
```

## Credentials Setup

### Avalanche RPC

| Field | Description |
|-------|-------------|
| Network | Mainnet, Fuji Testnet, or Custom |
| RPC Provider | Public (free), Infura, Alchemy, QuickNode, or Custom URL |
| Private Key | Optional - for signing transactions (hex format) |

### Snowtrace API

| Field | Description |
|-------|-------------|
| API Key | Get from [Snowtrace](https://snowtrace.io/apis) |
| Network | Mainnet or Fuji |

### Avalanche Subnet

| Field | Description |
|-------|-------------|
| Subnet RPC URL | Your subnet's RPC endpoint |
| Subnet ID | The subnet identifier |
| Blockchain ID | The blockchain identifier |
| Chain ID | The EVM chain ID |

## Resources & Operations

### Account
| Operation | Description |
|-----------|-------------|
| Get Balance | Get AVAX balance of an address |
| Get Transaction Count | Get nonce/transaction count |
| Get Transaction History | Get transaction history from Snowtrace |

### Block
| Operation | Description |
|-----------|-------------|
| Get Block | Get block by number or hash |
| Get Latest Block | Get the latest block |
| Get Block Number | Get current block number |

### Token (ERC-20)
| Operation | Description |
|-----------|-------------|
| Get Token Balance | Get ERC-20 token balance |
| Get Token Info | Get token name, symbol, decimals |
| Transfer Token | Transfer ERC-20 tokens |
| Get Allowance | Get token spending allowance |
| Approve Token | Approve token spending |

### NFT (ERC-721)
| Operation | Description |
|-----------|-------------|
| Get NFT Balance | Get NFT balance for an address |
| Get NFT Owner | Get owner of an NFT |
| Get NFT Metadata | Get NFT metadata |
| Get NFT Token URI | Get NFT token URI |

### Transaction
| Operation | Description |
|-----------|-------------|
| Send AVAX | Send AVAX to an address |
| Get Transaction | Get transaction details |
| Get Transaction Receipt | Get transaction receipt |
| Wait for Transaction | Wait for confirmation |

### Contract
| Operation | Description |
|-----------|-------------|
| Read Contract | Call a read-only function |
| Write Contract | Execute a contract function |
| Get ABI | Get contract ABI from Snowtrace |

### DeFi
| Operation | Description |
|-----------|-------------|
| Get Token Price | Get token price from DEX |
| Get Swap Quote | Get quote for token swap |
| Wrap AVAX | Wrap AVAX to WAVAX |
| Unwrap WAVAX | Unwrap WAVAX to AVAX |

### P-Chain
| Operation | Description |
|-----------|-------------|
| Get Validators | Get current validators |
| Get Pending Validators | Get pending validators |
| Get Staking Info | Get staking parameters |
| Get Subnets | Get all subnets |

### X-Chain
| Operation | Description |
|-----------|-------------|
| Get Balance | Get X-Chain balance |
| Get Asset Info | Get asset information |
| Get UTXOs | Get UTXOs for an address |

### Network
| Operation | Description |
|-----------|-------------|
| Get Network Info | Get network information |
| Get Gas Price | Get current gas price |
| Get Chain ID | Get chain ID |
| Get AVAX Price | Get AVAX price in USD |

### Utility
| Operation | Description |
|-----------|-------------|
| Convert Units | Convert between AVAX units |
| Validate Address | Validate Avalanche address |
| Encode Function | Encode function call data |
| Decode Function | Decode function return data |

## Trigger Node

The Avalanche Trigger node monitors blockchain events using polling.

### Event Types

| Event | Description |
|-------|-------------|
| New Block | Trigger on new blocks |
| Address Activity | Monitor address for transactions |
| Token Transfer | Monitor ERC-20 transfers |
| Contract Event | Listen for contract events |
| Balance Change | Monitor balance changes |
| Gas Price Alert | Alert on gas price changes |
| Whale Alert | Large transfer monitoring |

## Usage Examples

### Get Account Balance

```javascript
// Using Avalanche node
// Resource: Account
// Operation: Get Balance
// Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f9Eb3d

// Returns:
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f9Eb3d",
  "balanceWei": "1500000000000000000",
  "balanceAvax": "1.5"
}
```

### Send AVAX

```javascript
// Using Avalanche node
// Resource: Transaction
// Operation: Send AVAX
// To Address: 0x...
// Amount: 1.0

// Returns:
{
  "hash": "0x...",
  "from": "0x...",
  "to": "0x...",
  "value": "1.0"
}
```

### Monitor Whale Transfers

```javascript
// Using Avalanche Trigger node
// Event: Whale Alert
// Threshold: 10000 AVAX

// Triggers when transfers >= 10000 AVAX detected
```

## Avalanche Concepts

### Three-Chain Architecture

Avalanche uses three built-in blockchains:

- **C-Chain**: Contract Chain - EVM-compatible for smart contracts
- **X-Chain**: Exchange Chain - for creating and trading assets
- **P-Chain**: Platform Chain - for validators and subnets

### Native Token

AVAX is the native token used for:
- Transaction fees
- Staking
- Subnet creation
- Cross-chain transfers

### Subnets

Subnets are independent networks that can have their own:
- Validators
- Virtual machines
- Token economics
- Governance rules

## Networks

| Network | Chain ID | RPC Endpoint |
|---------|----------|--------------|
| Mainnet C-Chain | 43114 | https://api.avax.network/ext/bc/C/rpc |
| Fuji C-Chain | 43113 | https://api.avax-test.network/ext/bc/C/rpc |

## Error Handling

The node includes comprehensive error handling:

- Network connection errors
- Invalid address errors
- Insufficient balance errors
- Contract execution errors
- Rate limiting errors

Enable **Continue on Fail** to handle errors gracefully in workflows.

## Security Best Practices

1. **Never share private keys** - Use secure credential storage
2. **Use testnet first** - Test workflows on Fuji before mainnet
3. **Validate addresses** - Use the Validate Address operation
4. **Set gas limits** - Prevent unexpected transaction costs
5. **Monitor balances** - Use triggers to track wallet activity

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix linting issues
npm run lint:fix
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows the existing style
2. Tests are included for new features
3. Documentation is updated
4. Licensing headers are included in new files

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-avalanche/issues) page.

## Acknowledgments

- [Avalanche](https://www.avax.network/) - Blockchain platform
- [n8n](https://n8n.io/) - Workflow automation platform
- [ethers.js](https://ethers.org/) - Ethereum library
- [Snowtrace](https://snowtrace.io/) - Block explorer API
