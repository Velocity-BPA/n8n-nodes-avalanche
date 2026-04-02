/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-avalanche/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Avalanche implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Avalanche',
    name: 'avalanche',
    icon: 'file:avalanche.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Avalanche API',
    defaults: {
      name: 'Avalanche',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'avalancheApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'CChain',
            value: 'cChain',
          },
          {
            name: 'XChain',
            value: 'xChain',
          },
          {
            name: 'PChain',
            value: 'pChain',
          },
          {
            name: 'Subnet',
            value: 'subnet',
          },
          {
            name: 'Asset',
            value: 'asset',
          },
          {
            name: 'Wallet',
            value: 'wallet',
          },
          {
            name: 'CChainOperations',
            value: 'cChainOperations',
          },
          {
            name: 'XChainAssets',
            value: 'xChainAssets',
          },
          {
            name: 'PChainStaking',
            value: 'pChainStaking',
          },
          {
            name: 'CrossChainTransfers',
            value: 'crossChainTransfers',
          },
          {
            name: 'NodeInfo',
            value: 'nodeInfo',
          },
          {
            name: 'HealthMonitoring',
            value: 'healthMonitoring',
          }
        ],
        default: 'cChain',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['cChain'] } },
  options: [
    { name: 'Get Balance', value: 'getBalance', description: 'Get AVAX balance for address', action: 'Get balance' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details by hash', action: 'Get transaction' },
    { name: 'Get Block', value: 'getBlock', description: 'Get block information', action: 'Get block' },
    { name: 'Send Transaction', value: 'sendTransaction', description: 'Send signed transaction', action: 'Send transaction' },
    { name: 'Call Contract', value: 'call', description: 'Execute contract call', action: 'Call contract' },
    { name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas for transaction', action: 'Estimate gas' },
    { name: 'Get Transaction Receipt', value: 'getTransactionReceipt', description: 'Get transaction receipt', action: 'Get transaction receipt' },
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['xChain'] } },
  options: [
    { name: 'Get Balance', value: 'getBalance', description: 'Get asset balance for address', action: 'Get balance' },
    { name: 'Get Transaction', value: 'getTx', description: 'Get transaction by ID', action: 'Get transaction' },
    { name: 'Get Transaction Status', value: 'getTxStatus', description: 'Get transaction status', action: 'Get transaction status' },
    { name: 'List Addresses', value: 'listAddresses', description: 'List wallet addresses', action: 'List addresses' },
    { name: 'Get UTXOs', value: 'getUTXOs', description: 'Get UTXOs for addresses', action: 'Get UTXOs' },
    { name: 'Send Assets', value: 'send', description: 'Send assets between addresses', action: 'Send assets' },
    { name: 'Create Asset', value: 'createAsset', description: 'Create new asset', action: 'Create asset' }
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['pChain'] } },
  options: [
    { name: 'Get Balance', value: 'getBalance', description: 'Get AVAX balance for addresses', action: 'Get balance' },
    { name: 'Get Transaction', value: 'getTx', description: 'Get transaction by ID', action: 'Get transaction' },
    { name: 'Get Transaction Status', value: 'getTxStatus', description: 'Get transaction status by ID', action: 'Get transaction status' },
    { name: 'Get Current Validators', value: 'getCurrentValidators', description: 'Get current validators for subnet', action: 'Get current validators' },
    { name: 'Get Pending Validators', value: 'getPendingValidators', description: 'Get pending validators for subnet', action: 'Get pending validators' },
    { name: 'Get Staking Asset ID', value: 'getStakingAssetID', description: 'Get staking asset ID for subnet', action: 'Get staking asset ID' },
    { name: 'Add Validator', value: 'addValidator', description: 'Add validator to subnet', action: 'Add validator' },
    { name: 'Add Delegator', value: 'addDelegator', description: 'Add delegator to validator', action: 'Add delegator' },
  ],
  default: 'getBalance',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['subnet'],
		},
	},
	options: [
		{
			name: 'Get Subnets',
			value: 'getSubnets',
			description: 'List all subnets',
			action: 'Get subnets',
		},
		{
			name: 'Create Subnet',
			value: 'createSubnet',
			description: 'Create a new subnet',
			action: 'Create subnet',
		},
		{
			name: 'Validate Subnet',
			value: 'validateSubnet',
			description: 'Add validator to subnet',
			action: 'Validate subnet',
		},
		{
			name: 'Get Blockchains',
			value: 'getBlockchains',
			description: 'Get blockchains in subnet',
			action: 'Get blockchains',
		},
		{
			name: 'Create Blockchain',
			value: 'createBlockchain',
			description: 'Create blockchain in subnet',
			action: 'Create blockchain',
		},
		{
			name: 'Get Network ID',
			value: 'getNetworkID',
			description: 'Get network ID',
			action: 'Get network ID',
		},
		{
			name: 'Get Network Name',
			value: 'getNetworkName',
			description: 'Get network name',
			action: 'Get network name',
		},
	],
	default: 'getSubnets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['asset'] } },
  options: [
    { name: 'Get Asset Description', value: 'getAssetDescription', description: 'Get asset metadata', action: 'Get asset description' },
    { name: 'Create Asset', value: 'createAsset', description: 'Create new asset', action: 'Create asset' },
    { name: 'Create NFT Asset', value: 'createNFTAsset', description: 'Create NFT asset', action: 'Create NFT asset' },
    { name: 'Mint Asset', value: 'mint', description: 'Mint asset tokens', action: 'Mint asset' },
    { name: 'Export AVAX', value: 'exportAVAX', description: 'Export AVAX to another chain', action: 'Export AVAX' },
    { name: 'Import AVAX', value: 'importAVAX', description: 'Import AVAX from another chain', action: 'Import AVAX' },
    { name: 'Export Asset', value: 'export', description: 'Export asset to another chain', action: 'Export asset' },
  ],
  default: 'getAssetDescription',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['wallet'],
		},
	},
	options: [
		{
			name: 'Create User',
			value: 'createUser',
			description: 'Create a new wallet user',
			action: 'Create user',
		},
		{
			name: 'List Users',
			value: 'listUsers',
			description: 'List all wallet users',
			action: 'List users',
		},
		{
			name: 'Delete User',
			value: 'deleteUser',
			description: 'Delete a wallet user',
			action: 'Delete user',
		},
		{
			name: 'Create X-Chain Address',
			value: 'createXAddress',
			description: 'Create a new X-Chain address',
			action: 'Create X-Chain address',
		},
		{
			name: 'List X-Chain Addresses',
			value: 'listXAddresses',
			description: 'List X-Chain addresses for a user',
			action: 'List X-Chain addresses',
		},
		{
			name: 'Create P-Chain Address',
			value: 'createPAddress',
			description: 'Create a new P-Chain address',
			action: 'Create P-Chain address',
		},
		{
			name: 'List P-Chain Addresses',
			value: 'listPAddresses',
			description: 'List P-Chain addresses for a user',
			action: 'List P-Chain addresses',
		},
	],
	default: 'createUser',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
    },
  },
  options: [
    {
      name: 'Get Account Balance',
      value: 'getBalance',
      description: 'Get the balance of an Avalanche C-Chain account',
      action: 'Get account balance',
    },
    {
      name: 'Send Raw Transaction',
      value: 'sendRawTransaction',
      description: 'Send a signed raw transaction to the C-Chain',
      action: 'Send raw transaction',
    },
    {
      name: 'Get Transaction by Hash',
      value: 'getTransactionByHash',
      description: 'Get transaction details by transaction hash',
      action: 'Get transaction by hash',
    },
    {
      name: 'Get Transaction Receipt',
      value: 'getTransactionReceipt',
      description: 'Get transaction receipt by transaction hash',
      action: 'Get transaction receipt',
    },
    {
      name: 'Call Contract',
      value: 'callContract',
      description: 'Execute a read-only contract call',
      action: 'Call contract',
    },
    {
      name: 'Estimate Gas',
      value: 'estimateGas',
      description: 'Estimate gas required for a transaction',
      action: 'Estimate gas',
    },
    {
      name: 'Get Block by Number',
      value: 'getBlockByNumber',
      description: 'Get block information by block number',
      action: 'Get block by number',
    },
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
    },
  },
  options: [
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get asset balance for an address',
      action: 'Get asset balance',
    },
    {
      name: 'Send Assets',
      value: 'send',
      description: 'Send assets to another address',
      action: 'Send assets',
    },
    {
      name: 'Create Asset',
      value: 'createAsset',
      description: 'Create a new asset on X-Chain',
      action: 'Create new asset',
    },
    {
      name: 'Get Transaction',
      value: 'getTx',
      description: 'Get transaction details by ID',
      action: 'Get transaction details',
    },
    {
      name: 'Get Transaction Status',
      value: 'getTxStatus',
      description: 'Get transaction status by ID',
      action: 'Get transaction status',
    },
    {
      name: 'Get UTXOs',
      value: 'getUTXOs',
      description: 'Get unspent transaction outputs',
      action: 'Get unspent transaction outputs',
    },
    {
      name: 'List Addresses',
      value: 'listAddresses',
      description: 'List wallet addresses',
      action: 'List wallet addresses',
    },
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
    },
  },
  options: [
    {
      name: 'Get Validators',
      value: 'getValidators',
      description: 'Get current validators',
      action: 'Get current validators',
    },
    {
      name: 'Get Pending Validators',
      value: 'getPendingValidators',
      description: 'Get pending validators',
      action: 'Get pending validators',
    },
    {
      name: 'Add Validator',
      value: 'addValidator',
      description: 'Add validator',
      action: 'Add validator',
    },
    {
      name: 'Add Delegator',
      value: 'addDelegator',
      description: 'Add delegator',
      action: 'Add delegator',
    },
    {
      name: 'Get Stake',
      value: 'getStake',
      description: 'Get stake amount',
      action: 'Get stake amount',
    },
    {
      name: 'Get Current Validators',
      value: 'getCurrentValidators',
      description: 'Get current validator set',
      action: 'Get current validator set',
    },
    {
      name: 'Get Reward UTXOs',
      value: 'getRewardUTXOs',
      description: 'Get reward UTXOs',
      action: 'Get reward UTXOs',
    },
  ],
  default: 'getValidators',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['crossChainTransfers'],
    },
  },
  options: [
    {
      name: 'Export AVAX from X-Chain',
      value: 'exportFromXChain',
      description: 'Export AVAX from X-Chain to another chain',
      action: 'Export AVAX from X-Chain',
    },
    {
      name: 'Export AVAX from C-Chain',
      value: 'exportFromCChain',
      description: 'Export AVAX from C-Chain to another chain',
      action: 'Export AVAX from C-Chain',
    },
    {
      name: 'Export AVAX from P-Chain',
      value: 'exportFromPChain',
      description: 'Export AVAX from P-Chain to another chain',
      action: 'Export AVAX from P-Chain',
    },
    {
      name: 'Import AVAX to X-Chain',
      value: 'importToXChain',
      description: 'Import AVAX to X-Chain from another chain',
      action: 'Import AVAX to X-Chain',
    },
    {
      name: 'Import AVAX to C-Chain',
      value: 'importToCChain',
      description: 'Import AVAX to C-Chain from another chain',
      action: 'Import AVAX to C-Chain',
    },
    {
      name: 'Import AVAX to P-Chain',
      value: 'importToPChain',
      description: 'Import AVAX to P-Chain from another chain',
      action: 'Import AVAX to P-Chain',
    },
  ],
  default: 'exportFromXChain',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['nodeInfo'],
    },
  },
  options: [
    {
      name: 'Get Node Version',
      value: 'getNodeVersion',
      description: 'Get node version information',
      action: 'Get node version information',
    },
    {
      name: 'Get Node ID',
      value: 'getNodeID',
      description: 'Get node ID',
      action: 'Get node ID',
    },
    {
      name: 'Get Network ID',
      value: 'getNetworkID',
      description: 'Get network ID',
      action: 'Get network ID',
    },
    {
      name: 'Get Network Name',
      value: 'getNetworkName',
      description: 'Get network name',
      action: 'Get network name',
    },
    {
      name: 'Get Blockchain ID',
      value: 'getBlockchainID',
      description: 'Get blockchain ID',
      action: 'Get blockchain ID',
    },
    {
      name: 'Get Connected Peers',
      value: 'getPeers',
      description: 'Get connected peers',
      action: 'Get connected peers',
    },
    {
      name: 'Check Bootstrap Status',
      value: 'isBootstrapped',
      description: 'Check if node is bootstrapped',
      action: 'Check if node is bootstrapped',
    },
  ],
  default: 'getNodeVersion',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['healthMonitoring'],
    },
  },
  options: [
    {
      name: 'Get Liveness',
      value: 'getLiveness',
      description: 'Get node liveness status',
      action: 'Get node liveness status',
    },
    {
      name: 'Get Readiness',
      value: 'getReadiness',
      description: 'Get node readiness status',
      action: 'Get node readiness status',
    },
    {
      name: 'Get Health',
      value: 'getHealth',
      description: 'Get overall health status',
      action: 'Get overall health status',
    },
    {
      name: 'Issue AVM Transaction',
      value: 'issueAvmTx',
      description: 'Issue transaction on X-Chain for testing',
      action: 'Issue AVM transaction',
    },
    {
      name: 'Issue Platform Transaction',
      value: 'issuePlatformTx',
      description: 'Issue platform transaction on P-Chain',
      action: 'Issue platform transaction',
    },
    {
      name: 'Get Latest Block Number',
      value: 'getLatestBlockNumber',
      description: 'Get latest block number from C-Chain',
      action: 'Get latest block number',
    },
  ],
  default: 'getLiveness',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  default: '',
  placeholder: '0x...',
  description: 'The address to get balance for',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['getBalance'],
    },
  },
},
{
  displayName: 'Block Tag',
  name: 'blockTag',
  type: 'options',
  options: [
    { name: 'Latest', value: 'latest' },
    { name: 'Earliest', value: 'earliest' },
    { name: 'Pending', value: 'pending' },
    { name: 'Custom Block Number', value: 'custom' },
  ],
  default: 'latest',
  description: 'The block tag to query',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['getBalance', 'call'],
    },
  },
},
{
  displayName: 'Block Number',
  name: 'customBlockNumber',
  type: 'string',
  default: '',
  placeholder: '0x1b4',
  description: 'Custom block number in hex format',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['getBalance', 'call'],
      blockTag: ['custom'],
    },
  },
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  default: '',
  placeholder: '0x...',
  description: 'The transaction hash',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['getTransaction', 'getTransactionReceipt'],
    },
  },
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  default: 'latest',
  placeholder: '0x1b4 or latest',
  description: 'Block number in hex format or "latest"',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['getBlock'],
    },
  },
},
{
  displayName: 'Include Transactions',
  name: 'includeTransactions',
  type: 'boolean',
  default: false,
  description: 'Whether to include full transaction objects',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['getBlock'],
    },
  },
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  default: '',
  placeholder: '0x...',
  description: 'The signed transaction data',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['sendTransaction'],
    },
  },
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  default: '',
  placeholder: '0x...',
  description: 'The contract address to call',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['call'],
    },
  },
},
{
  displayName: 'Data',
  name: 'data',
  type: 'string',
  required: true,
  default: '',
  placeholder: '0x...',
  description: 'The encoded function call data',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['call'],
    },
  },
},
{
  displayName: 'Transaction Object',
  name: 'transaction',
  type: 'json',
  required: true,
  default: '{"to": "", "value": "", "data": ""}',
  description: 'Transaction object to estimate gas for',
  displayOptions: {
    show: {
      resource: ['cChain'],
      operation: ['estimateGas'],
    },
  },
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['getBalance'] } },
  default: '',
  description: 'The address to check balance for',
},
{
  displayName: 'Asset ID',
  name: 'assetID',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['xChain'], operation: ['getBalance', 'send'] } },
  default: '',
  description: 'The asset ID to check balance for (optional)',
},
{
  displayName: 'Transaction ID',
  name: 'txID',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['getTx', 'getTxStatus'] } },
  default: '',
  description: 'The transaction ID',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  options: [
    { name: 'Hex', value: 'hex' },
    { name: 'CB58', value: 'cb58' },
    { name: 'JSON', value: 'json' }
  ],
  displayOptions: { show: { resource: ['xChain'], operation: ['getTx'] } },
  default: 'json',
  description: 'The encoding format for the transaction',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['listAddresses', 'send', 'createAsset'] } },
  default: '',
  description: 'The username for wallet operations',
},
{
  displayName: 'Password',
  name: 'password',
  type: 'string',
  typeOptions: { password: true },
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['listAddresses', 'send', 'createAsset'] } },
  default: '',
  description: 'The password for wallet operations',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['getUTXOs'] } },
  default: '',
  description: 'Comma-separated list of addresses to get UTXOs for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['xChain'], operation: ['getUTXOs'] } },
  default: 1024,
  description: 'Maximum number of UTXOs to return',
},
{
  displayName: 'Start Index',
  name: 'startIndex',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['xChain'], operation: ['getUTXOs'] } },
  default: '',
  description: 'Start index for UTXO pagination',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['send'] } },
  default: '',
  description: 'The recipient address',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['send'] } },
  default: 0,
  description: 'The amount to send',
},
{
  displayName: 'Asset Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['createAsset'] } },
  default: '',
  description: 'The name of the asset to create',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['createAsset'] } },
  default: '',
  description: 'The symbol of the asset to create',
},
{
  displayName: 'Denomination',
  name: 'denomination',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['createAsset'] } },
  default: 0,
  description: 'The denomination of the asset',
},
{
  displayName: 'Initial Holders',
  name: 'initialHolders',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['xChain'], operation: ['createAsset'] } },
  default: '[]',
  description: 'Array of initial holders with addresses and amounts',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['pChain'], operation: ['getBalance'] } },
  default: '',
  placeholder: 'P-avax1...',
  description: 'Comma-separated list of P-Chain addresses to get balance for',
},
{
  displayName: 'Transaction ID',
  name: 'txID',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['pChain'], operation: ['getTx', 'getTxStatus'] } },
  default: '',
  description: 'Transaction ID to retrieve',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: { show: { resource: ['pChain'], operation: ['getTx'] } },
  options: [
    { name: 'JSON', value: 'json' },
    { name: 'Hex', value: 'hex' },
    { name: 'CB58', value: 'cb58' },
  ],
  default: 'json',
  description: 'Encoding format for transaction data',
},
{
  displayName: 'Subnet ID',
  name: 'subnetID',
  type: 'string',
  displayOptions: { show: { resource: ['pChain'], operation: ['getCurrentValidators', 'getPendingValidators', 'getStakingAssetID'] } },
  default: '',
  placeholder: 'Optional subnet ID',
  description: 'Subnet ID to filter validators (optional for primary network)',
},
{
  displayName: 'Node IDs',
  name: 'nodeIDs',
  type: 'string',
  displayOptions: { show: { resource: ['pChain'], operation: ['getCurrentValidators', 'getPendingValidators'] } },
  default: '',
  placeholder: 'NodeID-...',
  description: 'Comma-separated list of node IDs to filter (optional)',
},
{
  displayName: 'Node ID',
  name: 'nodeID',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['pChain'], operation: ['addValidator', 'addDelegator'] } },
  default: '',
  placeholder: 'NodeID-...',
  description: 'Node ID of the validator',
},
{
  displayName: 'Start Time',
  name: 'startTime',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['pChain'], operation: ['addValidator', 'addDelegator'] } },
  default: 0,
  description: 'Unix timestamp when staking starts',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['pChain'], operation: ['addValidator', 'addDelegator'] } },
  default: 0,
  description: 'Unix timestamp when staking ends',
},
{
  displayName: 'Stake Amount',
  name: 'stakeAmount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['pChain'], operation: ['addValidator', 'addDelegator'] } },
  default: '',
  description: 'Amount to stake in nAVAX (1 AVAX = 1,000,000,000 nAVAX)',
},
{
	displayName: 'Subnet IDs',
	name: 'ids',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['getSubnets'],
		},
	},
	default: '',
	description: 'Comma-separated list of subnet IDs to filter by',
},
{
	displayName: 'Control Keys',
	name: 'controlKeys',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['createSubnet'],
		},
	},
	required: true,
	default: '',
	description: 'Comma-separated list of control key addresses',
},
{
	displayName: 'Threshold',
	name: 'threshold',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['createSubnet'],
		},
	},
	required: true,
	default: 1,
	description: 'Number of signatures required to make changes to the subnet',
},
{
	displayName: 'Node ID',
	name: 'nodeID',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['validateSubnet'],
		},
	},
	required: true,
	default: '',
	description: 'Node ID of the validator',
},
{
	displayName: 'Subnet ID',
	name: 'subnetID',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['validateSubnet', 'createBlockchain'],
		},
	},
	required: true,
	default: '',
	description: 'ID of the subnet',
},
{
	displayName: 'Start Time',
	name: 'startTime',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['validateSubnet'],
		},
	},
	required: true,
	default: '',
	description: 'Start time for validation period',
},
{
	displayName: 'End Time',
	name: 'endTime',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['validateSubnet'],
		},
	},
	required: true,
	default: '',
	description: 'End time for validation period',
},
{
	displayName: 'VM ID',
	name: 'vmID',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['createBlockchain'],
		},
	},
	required: true,
	default: '',
	description: 'Virtual machine ID for the blockchain',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['createBlockchain'],
		},
	},
	required: true,
	default: '',
	description: 'Name of the blockchain',
},
{
	displayName: 'Genesis Data',
	name: 'genesisData',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['subnet'],
			operation: ['createBlockchain'],
		},
	},
	required: true,
	default: '{}',
	description: 'Genesis data for the blockchain',
},
{
  displayName: 'Asset ID',
  name: 'assetID',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['getAssetDescription'] } },
  default: '',
  description: 'The ID of the asset to get description for',
},
{
  displayName: 'Asset Name',
  name: 'assetName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['createAsset', 'createNFTAsset'] } },
  default: '',
  description: 'The name of the asset',
},
{
  displayName: 'Asset Symbol',
  name: 'assetSymbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['createAsset', 'createNFTAsset'] } },
  default: '',
  description: 'The symbol of the asset',
},
{
  displayName: 'Denomination',
  name: 'denomination',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['createAsset'] } },
  default: 8,
  description: 'The denomination of the asset',
},
{
  displayName: 'Initial Holders',
  name: 'initialHolders',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['createAsset'] } },
  default: '[]',
  description: 'Initial holders of the asset as JSON array',
},
{
  displayName: 'Minter Sets',
  name: 'minterSets',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['createNFTAsset'] } },
  default: '[]',
  description: 'Minter sets for the NFT asset as JSON array',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['mint', 'exportAVAX', 'export'] } },
  default: '',
  description: 'The amount to mint or export',
},
{
  displayName: 'Asset ID',
  name: 'assetID',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['mint', 'export'] } },
  default: '',
  description: 'The ID of the asset to mint or export',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['mint', 'exportAVAX', 'importAVAX'] } },
  default: '',
  description: 'The destination address',
},
{
  displayName: 'Destination Chain',
  name: 'destinationChain',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['exportAVAX', 'export'] } },
  default: 'C',
  description: 'The destination chain (C, P, or X)',
},
{
  displayName: 'Source Chain',
  name: 'sourceChain',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['importAVAX'] } },
  default: 'C',
  description: 'The source chain (C, P, or X)',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['asset'], operation: ['export'] } },
  default: '',
  description: 'The destination address for export',
},
{
	displayName: 'Username',
	name: 'username',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['wallet'],
			operation: ['createUser', 'deleteUser', 'createXAddress', 'listXAddresses', 'createPAddress', 'listPAddresses'],
		},
	},
	default: '',
	description: 'Username for the wallet operation',
},
{
	displayName: 'Password',
	name: 'password',
	type: 'string',
	typeOptions: {
		password: true,
	},
	required: true,
	displayOptions: {
		show: {
			resource: ['wallet'],
			operation: ['createUser', 'deleteUser', 'createXAddress', 'listXAddresses', 'createPAddress', 'listPAddresses'],
		},
	},
	default: '',
	description: 'Password for the wallet operation',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['getBalance'],
    },
  },
  default: '',
  description: 'The account address to get balance for (0x format)',
},
{
  displayName: 'Block Tag',
  name: 'blockTag',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['getBalance'],
    },
  },
  options: [
    {
      name: 'Latest',
      value: 'latest',
    },
    {
      name: 'Earliest',
      value: 'earliest',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Custom Block Number',
      value: 'custom',
    },
  ],
  default: 'latest',
  description: 'The block tag to use for balance query',
},
{
  displayName: 'Custom Block Number',
  name: 'customBlockNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['getBalance'],
      blockTag: ['custom'],
    },
  },
  default: '',
  description: 'Custom block number in hex format (e.g., 0x1b4)',
},
{
  displayName: 'Signed Transaction Data',
  name: 'signedTransactionData',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['sendRawTransaction'],
    },
  },
  default: '',
  description: 'The signed transaction data in hex format',
},
{
  displayName: 'Transaction Hash',
  name: 'transactionHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['getTransactionByHash', 'getTransactionReceipt'],
    },
  },
  default: '',
  description: 'The transaction hash to query',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['callContract', 'estimateGas'],
    },
  },
  default: '',
  description: 'The contract address to call',
},
{
  displayName: 'Data',
  name: 'data',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['callContract', 'estimateGas'],
    },
  },
  default: '',
  description: 'The encoded function call data',
},
{
  displayName: 'From Address',
  name: 'fromAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['callContract', 'estimateGas'],
    },
  },
  default: '',
  description: 'The address to call from (optional)',
},
{
  displayName: 'Value',
  name: 'value',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['callContract', 'estimateGas'],
    },
  },
  default: '0x0',
  description: 'The value to send with the call in hex format',
},
{
  displayName: 'Gas',
  name: 'gas',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['estimateGas'],
    },
  },
  default: '',
  description: 'Gas limit for the transaction (optional)',
},
{
  displayName: 'Gas Price',
  name: 'gasPrice',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['estimateGas'],
    },
  },
  default: '',
  description: 'Gas price for the transaction (optional)',
},
{
  displayName: 'Call Block Tag',
  name: 'callBlockTag',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['callContract'],
    },
  },
  options: [
    {
      name: 'Latest',
      value: 'latest',
    },
    {
      name: 'Earliest',
      value: 'earliest',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Custom Block Number',
      value: 'custom',
    },
  ],
  default: 'latest',
  description: 'The block tag to use for the contract call',
},
{
  displayName: 'Custom Call Block Number',
  name: 'customCallBlockNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['callContract'],
      callBlockTag: ['custom'],
    },
  },
  default: '',
  description: 'Custom block number in hex format (e.g., 0x1b4)',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['getBlockByNumber'],
    },
  },
  default: 'latest',
  description: 'Block number in hex format or "latest", "earliest", "pending"',
},
{
  displayName: 'Include Transactions',
  name: 'includeTransactions',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['cChainOperations'],
      operation: ['getBlockByNumber'],
    },
  },
  default: false,
  description: 'Whether to include full transaction objects',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['getBalance'],
    },
  },
  default: '',
  description: 'The address to get balance for',
},
{
  displayName: 'Asset ID',
  name: 'assetID',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['getBalance', 'send'],
    },
  },
  default: 'AVAX',
  description: 'The asset ID to check balance for (default: AVAX)',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['send'],
    },
  },
  default: '',
  description: 'The destination address',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['send'],
    },
  },
  default: 0,
  description: 'The amount to send',
},
{
  displayName: 'From Address',
  name: 'from',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['send'],
    },
  },
  default: '',
  description: 'The source address (optional)',
},
{
  displayName: 'Change Address',
  name: 'changeAddr',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['send'],
    },
  },
  default: '',
  description: 'The address to send change to (optional)',
},
{
  displayName: 'Asset Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['createAsset'],
    },
  },
  default: '',
  description: 'The name of the asset to create',
},
{
  displayName: 'Asset Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['createAsset'],
    },
  },
  default: '',
  description: 'The symbol of the asset to create',
},
{
  displayName: 'Denomination',
  name: 'denomination',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['createAsset'],
    },
  },
  default: 0,
  description: 'The denomination of the asset (number of decimal places)',
},
{
  displayName: 'Initial Holders',
  name: 'initialHolders',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['createAsset'],
    },
  },
  default: '[]',
  description: 'Array of initial holder objects with address and amount properties',
},
{
  displayName: 'Transaction ID',
  name: 'txID',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['getTx', 'getTxStatus'],
    },
  },
  default: '',
  description: 'The transaction ID to query',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['getUTXOs'],
    },
  },
  default: '',
  description: 'Comma-separated list of addresses to get UTXOs for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['getUTXOs'],
    },
  },
  default: 1024,
  description: 'Maximum number of UTXOs to return',
},
{
  displayName: 'Start Index',
  name: 'startIndex',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['getUTXOs'],
    },
  },
  default: '',
  description: 'Start index for pagination',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['listAddresses'],
    },
  },
  default: '',
  description: 'The username for wallet access',
},
{
  displayName: 'Password',
  name: 'password',
  type: 'string',
  typeOptions: {
    password: true,
  },
  required: true,
  displayOptions: {
    show: {
      resource: ['xChainAssets'],
      operation: ['listAddresses'],
    },
  },
  default: '',
  description: 'The password for wallet access',
},
{
  displayName: 'Subnet ID',
  name: 'subnetID',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['getValidators', 'getPendingValidators', 'getCurrentValidators'],
    },
  },
  default: '',
  description: 'The ID of the subnet to query validators for',
},
{
  displayName: 'Node IDs',
  name: 'nodeIDs',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['getValidators', 'getPendingValidators'],
    },
  },
  default: '',
  description: 'Comma-separated list of node IDs to filter by',
},
{
  displayName: 'Node ID',
  name: 'nodeID',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['addValidator', 'addDelegator'],
    },
  },
  default: '',
  description: 'The ID of the node to validate or delegate to',
},
{
  displayName: 'Start Time',
  name: 'startTime',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['addValidator', 'addDelegator'],
    },
  },
  default: 0,
  description: 'Unix timestamp when the validation/delegation starts',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['addValidator', 'addDelegator'],
    },
  },
  default: 0,
  description: 'Unix timestamp when the validation/delegation ends',
},
{
  displayName: 'Stake Amount',
  name: 'stakeAmount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['addValidator', 'addDelegator'],
    },
  },
  default: '',
  description: 'The amount of AVAX to stake in nAVAX (10^9 nAVAX = 1 AVAX)',
},
{
  displayName: 'Reward Address',
  name: 'rewardAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['addValidator', 'addDelegator'],
    },
  },
  default: '',
  description: 'The address where rewards should be sent',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['getStake'],
    },
  },
  default: '',
  description: 'Comma-separated list of addresses to check stake for',
},
{
  displayName: 'Validators Only',
  name: 'validatorsOnly',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['getStake'],
    },
  },
  default: false,
  description: 'Whether to only include validator stake',
},
{
  displayName: 'Transaction ID',
  name: 'txID',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['getRewardUTXOs'],
    },
  },
  default: '',
  description: 'The ID of the transaction to get reward UTXOs for',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['pChainStaking'],
      operation: ['getRewardUTXOs'],
    },
  },
  options: [
    {
      name: 'CB58',
      value: 'cb58',
    },
    {
      name: 'Hex',
      value: 'hex',
    },
  ],
  default: 'cb58',
  description: 'The encoding format for the response',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChainTransfers'],
      operation: ['exportFromXChain', 'exportFromCChain', 'exportFromPChain', 'importToXChain', 'importToCChain', 'importToPChain'],
    },
  },
  default: '',
  description: 'The destination address for the transfer',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChainTransfers'],
      operation: ['exportFromXChain', 'exportFromCChain', 'exportFromPChain'],
    },
  },
  default: '',
  description: 'The amount of AVAX to export (in nAVAX)',
},
{
  displayName: 'Destination Chain',
  name: 'destinationChain',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChainTransfers'],
      operation: ['exportFromXChain', 'exportFromCChain', 'exportFromPChain'],
    },
  },
  options: [
    {
      name: 'X-Chain',
      value: 'X',
    },
    {
      name: 'P-Chain',
      value: 'P',
    },
    {
      name: 'C-Chain',
      value: 'C',
    },
  ],
  default: 'P',
  description: 'The chain to export AVAX to',
},
{
  displayName: 'Source Chain',
  name: 'sourceChain',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChainTransfers'],
      operation: ['importToXChain', 'importToCChain', 'importToPChain'],
    },
  },
  options: [
    {
      name: 'X-Chain',
      value: 'X',
    },
    {
      name: 'P-Chain',
      value: 'P',
    },
    {
      name: 'C-Chain',
      value: 'C',
    },
  ],
  default: 'P',
  description: 'The chain to import AVAX from',
},
{
  displayName: 'Alias',
  name: 'alias',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nodeInfo'],
      operation: ['getBlockchainID'],
    },
  },
  default: '',
  description: 'The blockchain