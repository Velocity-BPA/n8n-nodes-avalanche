# n8n-nodes-avalanche

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with Avalanche blockchain network, providing access to 6 key resources including C-Chain operations, X-Chain asset management, P-Chain staking, cross-chain transfers, node information, and health monitoring capabilities for building robust blockchain automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Avalanche](https://img.shields.io/badge/Avalanche-E84142-red)
![Blockchain](https://img.shields.io/badge/Blockchain-Ready-green)
![DeFi](https://img.shields.io/badge/DeFi-Compatible-purple)

## Features

- **Multi-Chain Support** - Access C-Chain, X-Chain, and P-Chain operations from a single node
- **Asset Management** - Create, mint, and transfer digital assets on X-Chain
- **Staking Operations** - Manage validators and delegators on P-Chain for network participation
- **Cross-Chain Transfers** - Seamlessly move assets between Avalanche chains
- **Node Monitoring** - Real-time health checks and network status monitoring
- **Smart Contract Integration** - Deploy and interact with smart contracts on C-Chain
- **Transaction Tracking** - Monitor and retrieve transaction details across all chains
- **Network Information** - Access comprehensive node and network statistics

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
| API Key | Your Avalanche node API key or access token | Yes |
| RPC URL | Custom RPC endpoint URL (optional, defaults to public nodes) | No |
| Network | Target network: mainnet, fuji-testnet, or local | Yes |
| Chain ID | Specific chain ID for C-Chain operations | No |

## Resources & Operations

### 1. C-Chain Operations

| Operation | Description |
|-----------|-------------|
| Send Transaction | Send AVAX or interact with smart contracts |
| Get Transaction | Retrieve transaction details by hash |
| Get Balance | Check AVAX balance for an address |
| Deploy Contract | Deploy smart contracts to C-Chain |
| Call Contract | Execute read-only contract functions |
| Get Block | Retrieve block information by number or hash |
| Get Gas Price | Get current gas price estimates |

### 2. X-Chain Assets

| Operation | Description |
|-----------|-------------|
| Create Asset | Create a new digital asset on X-Chain |
| Mint Asset | Mint additional units of an existing asset |
| Send Asset | Transfer assets between X-Chain addresses |
| Get Asset Info | Retrieve asset metadata and information |
| Get Balance | Check asset balances for an address |
| Get UTXO | Get unspent transaction outputs |
| Import Asset | Import assets from other chains |

### 3. P-Chain Staking

| Operation | Description |
|-----------|-------------|
| Add Validator | Add a new validator to the network |
| Add Delegator | Delegate AVAX to an existing validator |
| Get Validators | List current validators and their stakes |
| Get Stake | Check staking information for an address |
| Get Rewards | Retrieve staking rewards information |
| Create Subnet | Create a new subnet for custom blockchains |
| Get Subnets | List available subnets |

### 4. Cross-Chain Transfers

| Operation | Description |
|-----------|-------------|
| Export P to C | Export AVAX from P-Chain to C-Chain |
| Export C to P | Export AVAX from C-Chain to P-Chain |
| Export X to P | Export assets from X-Chain to P-Chain |
| Export P to X | Export assets from P-Chain to X-Chain |
| Import | Import assets to the target chain |
| Get Export Status | Check the status of cross-chain exports |

### 5. Node Information

| Operation | Description |
|-----------|-------------|
| Get Node Info | Retrieve comprehensive node information |
| Get Network Info | Get network-wide statistics and data |
| Get Peers | List connected peer nodes |
| Get Version | Get node software version information |
| Get Blockchain Status | Check blockchain synchronization status |
| Get VM Info | Retrieve virtual machine information |

### 6. Health Monitoring

| Operation | Description |
|-----------|-------------|
| Health Check | Perform comprehensive node health check |
| Get Metrics | Retrieve detailed node performance metrics |
| Check Connectivity | Test network connectivity and latency |
| Monitor Chain Status | Check individual chain health status |
| Get Uptime | Retrieve node uptime statistics |
| Alert Status | Check for any system alerts or warnings |

## Usage Examples

```javascript
// Check AVAX balance on C-Chain
{
  "resource": "CChainOperations",
  "operation": "Get Balance",
  "address": "0x742d35Cc6634C0532925a3b8D6666aD7c29e4456",
  "blockTag": "latest"
}
```

```javascript
// Create a new asset on X-Chain
{
  "resource": "XChainAssets", 
  "operation": "Create Asset",
  "name": "My Token",
  "symbol": "MTK",
  "denomination": 18,
  "initialHolders": [
    {
      "address": "X-avax1234567890abcdef",
      "amount": "1000000000000000000000"
    }
  ]
}
```

```javascript
// Add a validator to P-Chain
{
  "resource": "PChainStaking",
  "operation": "Add Validator", 
  "nodeID": "NodeID-MFrZFVCXPv5iCn6M9K6XduxGTYp891xXZ",
  "stakeAmount": "2000000000000",
  "startTime": "2024-01-01T00:00:00Z",
  "endTime": "2024-12-31T23:59:59Z",
  "delegationFeeRate": "10"
}
```

```javascript
// Export AVAX from P-Chain to C-Chain
{
  "resource": "CrossChainTransfers",
  "operation": "Export P to C",
  "amount": "1000000000",
  "to": "0x742d35Cc6634C0532925a3b8D6666aD7c29e4456",
  "sourceChain": "P",
  "destinationChain": "C"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has required permissions |
| Network Timeout | Request timed out waiting for node response | Check network connectivity or try different RPC endpoint |
| Insufficient Balance | Not enough AVAX/assets for transaction | Verify account balance and adjust transaction amount |
| Invalid Address | Provided address format is incorrect | Ensure address matches the target chain format (0x for C-Chain, X-/P- prefix for others) |
| Gas Estimation Failed | Unable to estimate gas for transaction | Check contract parameters or increase gas limit manually |
| Cross-Chain Export Pending | Export transaction not yet available for import | Wait for export to be accepted before attempting import |

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
- **Avalanche Documentation**: [Avalanche Developer Docs](https://docs.avax.network/)
- **Avalanche Community**: [Avalanche Discord](https://chat.avalabs.org/)