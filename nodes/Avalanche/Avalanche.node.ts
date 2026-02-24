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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
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
        default: 'cChainOperations',
      },
      // Operation dropdowns per resource
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
      // Parameter definitions
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
  description: 'The blockchain alias (e.g., X, P, C)',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nodeInfo'],
      operation: ['isBootstrapped'],
    },
  },
  default: '',
  description: 'The chain identifier to check bootstrap status for',
},
{
  displayName: 'Tags',
  name: 'tags',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['healthMonitoring'],
      operation: ['getHealth'],
    },
  },
  default: '',
  description: 'Comma-separated list of tags to filter health checks',
},
{
  displayName: 'Transaction',
  name: 'tx',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['healthMonitoring'],
      operation: ['issueAvmTx', 'issuePlatformTx'],
    },
  },
  default: '',
  description: 'The transaction data to issue',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['healthMonitoring'],
      operation: ['issueAvmTx', 'issuePlatformTx'],
    },
  },
  options: [
    {
      name: 'Hex',
      value: 'hex',
    },
    {
      name: 'CB58',
      value: 'cb58',
    },
    {
      name: 'JSON',
      value: 'json',
    },
  ],
  default: 'hex',
  description: 'The encoding format for the transaction',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'cChainOperations':
        return [await executeCChainOperationsOperations.call(this, items)];
      case 'xChainAssets':
        return [await executeXChainAssetsOperations.call(this, items)];
      case 'pChainStaking':
        return [await executePChainStakingOperations.call(this, items)];
      case 'crossChainTransfers':
        return [await executeCrossChainTransfersOperations.call(this, items)];
      case 'nodeInfo':
        return [await executeNodeInfoOperations.call(this, items)];
      case 'healthMonitoring':
        return [await executeHealthMonitoringOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeCChainOperationsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('avalancheApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      const baseUrl = credentials.network === 'testnet' 
        ? 'https://api.avax-test.network' 
        : 'https://api.avax.network';

      switch (operation) {
        case 'getBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const blockTag = this.getNodeParameter('blockTag', i) as string;
          const customBlockNumber = this.getNodeParameter('customBlockNumber', i, '') as string;
          
          const actualBlockTag = blockTag === 'custom' ? customBlockNumber : blockTag;
          
          const rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, actualBlockTag],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rpcPayload),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = {
            address,
            balance: responseData.result,
            balanceWei: responseData.result,
            blockTag: actualBlockTag,
          };
          break;
        }

        case 'sendRawTransaction': {
          const signedTransactionData = this.getNodeParameter('signedTransactionData', i) as string;
          
          const rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_sendRawTransaction',
            params: [signedTransactionData],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rpcPayload),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = {
            transactionHash: responseData.result,
          };
          break;
        }

        case 'getTransactionByHash': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;
          
          const rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [transactionHash],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rpcPayload),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        case 'getTransactionReceipt': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;
          
          const rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [transactionHash],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rpcPayload),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        case 'callContract': {
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const data = this.getNodeParameter('data', i, '') as string;
          const fromAddress = this.getNodeParameter('fromAddress', i, '') as string;
          const value = this.getNodeParameter('value', i, '0x0') as string;
          const callBlockTag = this.getNodeParameter('callBlockTag', i, 'latest') as string;
          const customCallBlockNumber = this.getNodeParameter('customCallBlockNumber', i, '') as string;
          
          const actualBlockTag = callBlockTag === 'custom' ? customCallBlockNumber : callBlockTag;
          
          const transactionObject: any = {
            to: toAddress,
            data,
            value,
          };

          if (fromAddress) {
            transactionObject.from = fromAddress;
          }

          const rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [transactionObject, actualBlockTag],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rpcPayload),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = {
            result: responseData.result,
            transaction: transactionObject,
            blockTag: actualBlockTag,
          };
          break;
        }

        case 'estimateGas': {
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const data = this.getNodeParameter('data', i, '') as string;
          const fromAddress = this.getNodeParameter('fromAddress', i, '') as string;
          const value = this.getNodeParameter('value', i, '0x0') as string;
          const gas = this.getNodeParameter('gas', i, '') as string;
          const gasPrice = this.getNodeParameter('gasPrice', i, '') as string;
          
          const transactionObject: any = {
            to: toAddress,
            data,
            value,
          };

          if (fromAddress) {
            transactionObject.from = fromAddress;
          }
          if (gas) {
            transactionObject.gas = gas;
          }
          if (gasPrice) {
            transactionObject.gasPrice = gasPrice;
          }

          const rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [transactionObject],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rpcPayload),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = {
            gasEstimate: responseData.result,
            transaction: transactionObject,
          };
          break;
        }

        case 'getBlockByNumber': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const includeTransactions = this.getNodeParameter('includeTransactions', i, false) as boolean;
          
          const rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [blockNumber, includeTransactions],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rpcPayload),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeXChainAssetsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('avalancheApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.network === 'testnet' 
        ? 'https://api.avax-test.network'
        : 'https://api.avax.network';

      switch (operation) {
        case 'getBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const assetID = this.getNodeParameter('assetID', i) as string;
          
          const requestBody: any = {
            jsonrpc: '2.0',
            method: 'avm.getBalance',
            params: {
              address,
              assetID,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'send': {
          const to = this.getNodeParameter('to', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const assetID = this.getNodeParameter('assetID', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const changeAddr = this.getNodeParameter('changeAddr', i) as string;

          const params: any = {
            to,
            amount: amount.toString(),
            assetID,
          };

          if (from) params.from = [from];
          if (changeAddr) params.changeAddr = changeAddr;

          const requestBody: any = {
            jsonrpc: '2.0',
            method: 'avm.send',
            params,
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAsset': {
          const name = this.getNodeParameter('name', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const denomination = this.getNodeParameter('denomination', i) as number;
          const initialHoldersInput = this.getNodeParameter('initialHolders', i) as string;
          
          let initialHolders: any;
          try {
            initialHolders = JSON.parse(initialHoldersInput);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON format for initial holders: ${error.message}`);
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            method: 'avm.createAsset',
            params: {
              name,
              symbol,
              denomination,
              initialHolders,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTx': {
          const txID = this.getNodeParameter('txID', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            method: 'avm.getTx',
            params: {
              txID,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTxStatus': {
          const txID = this.getNodeParameter('txID', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            method: 'avm.getTxStatus',
            params: {
              txID,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUTXOs': {
          const addressesInput = this.getNodeParameter('addresses', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const startIndex = this.getNodeParameter('startIndex', i) as string;

          const addresses = addressesInput.split(',').map((addr: string) => addr.trim());

          const params: any = {
            addresses,
            limit,
          };

          if (startIndex) params.startIndex = startIndex;

          const requestBody: any = {
            jsonrpc: '2.0',
            method: 'avm.getUTXOs',
            params,
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listAddresses': {
          const username = this.getNodeParameter('username', i) as string;
          const password = this.getNodeParameter('password', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            method: 'avm.listAddresses',
            params: {
              username,
              password,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error);
      }

      returnData.push({ json: result.result || result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message || 'Unknown error occurred' }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executePChainStakingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('avalancheApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getValidators': {
          const subnetID = this.getNodeParameter('subnetID', i) as string;
          const nodeIDs = this.getNodeParameter('nodeIDs', i) as string;
          
          const params: any = {};
          if (subnetID) params.subnetID = subnetID;
          if (nodeIDs) params.nodeIDs = nodeIDs.split(',').map((id: string) => id.trim());

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'platform.getValidators',
              params,
              id: 1,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPendingValidators': {
          const subnetID = this.getNodeParameter('subnetID', i) as string;
          const nodeIDs = this.getNodeParameter('nodeIDs', i) as string;
          
          const params: any = {};
          if (subnetID) params.subnetID = subnetID;
          if (nodeIDs) params.nodeIDs = nodeIDs.split(',').map((id: string) => id.trim());

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'platform.getPendingValidators',
              params,
              id: 1,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addValidator': {
          const nodeID = this.getNodeParameter('nodeID', i) as string;
          const startTime = this.getNodeParameter('startTime', i) as number;
          const endTime = this.getNodeParameter('endTime', i) as number;
          const stakeAmount = this.getNodeParameter('stakeAmount', i) as string;
          const rewardAddress = this.getNodeParameter('rewardAddress', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'platform.addValidator',
              params: {
                nodeID,
                startTime,
                endTime,
                stakeAmount,
                rewardAddress,
              },
              id: 1,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addDelegator': {
          const nodeID = this.getNodeParameter('nodeID', i) as string;
          const startTime = this.getNodeParameter('startTime', i) as number;
          const endTime = this.getNodeParameter('endTime', i) as number;
          const stakeAmount = this.getNodeParameter('stakeAmount', i) as string;
          const rewardAddress = this.getNodeParameter('rewardAddress', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'platform.addDelegator',
              params: {
                nodeID,
                startTime,
                endTime,
                stakeAmount,
                rewardAddress,
              },
              id: 1,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStake': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const validatorsOnly = this.getNodeParameter('validatorsOnly', i) as boolean;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'platform.getStake',
              params: {
                addresses: addresses.split(',').map((addr: string) => addr.trim()),
                validatorsOnly,
              },
              id: 1,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCurrentValidators': {
          const subnetID = this.getNodeParameter('subnetID', i) as string;
          
          const params: any = {};
          if (subnetID) params.subnetID = subnetID;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'platform.getCurrentValidators',
              params,
              id: 1,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRewardUTXOs': {
          const txID = this.getNodeParameter('txID', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              jsonrpc: '2.0',
              method: 'platform.getRewardUTXOs',
              params: {
                txID,
                encoding,
              },
              id: 1,
            },
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error);
      }

      returnData.push({ 
        json: result.result || result, 
        pairedItem: { item: i } 
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCrossChainTransfersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('avalancheApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const to = this.getNodeParameter('to', i) as string;
      
      switch (operation) {
        case 'exportFromXChain': {
          const amount = this.getNodeParameter('amount', i) as string;
          const destinationChain = this.getNodeParameter('destinationChain', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'avm.exportAVAX',
            params: {
              to,
              amount,
              destinationChain,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'exportFromCChain': {
          const amount = this.getNodeParameter('amount', i) as string;
          const destinationChain = this.getNodeParameter('destinationChain', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'avax.export',
            params: {
              to,
              amount,
              destinationChain,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'exportFromPChain': {
          const amount = this.getNodeParameter('amount', i) as string;
          const destinationChain = this.getNodeParameter('destinationChain', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'platform.exportAVAX',
            params: {
              to,
              amount,
              destinationChain,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'importToXChain': {
          const sourceChain = this.getNodeParameter('sourceChain', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'avm.importAVAX',
            params: {
              to,
              sourceChain,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'importToCChain': {
          const sourceChain = this.getNodeParameter('sourceChain', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'avax.import',
            params: {
              to,
              sourceChain,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'importToPChain': {
          const sourceChain = this.getNodeParameter('sourceChain', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'platform.importAVAX',
            params: {
              to,
              sourceChain,
            },
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeNodeInfoOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('avalancheApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      const baseOptions: any = {
        method: 'POST',
        url: `${credentials.baseUrl}/ext/info`,
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      };

      switch (operation) {
        case 'getNodeVersion': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'info.getNodeVersion',
            params: {},
            id: 1,
          };
          
          const options: any = {
            ...baseOptions,
            body: requestBody,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = response.result || response;
          break;
        }

        case 'getNodeID': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'info.getNodeID',
            params: {},
            id: 1,
          };
          
          const options: any = {
            ...baseOptions,
            body: requestBody,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = response.result || response;
          break;
        }

        case 'getNetworkID': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'info.getNetworkID',
            params: {},
            id: 1,
          };
          
          const options: any = {
            ...baseOptions,
            body: requestBody,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = response.result || response;
          break;
        }

        case 'getNetworkName': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'info.getNetworkName',
            params: {},
            id: 1,
          };
          
          const options: any = {
            ...baseOptions,
            body: requestBody,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = response.result || response;
          break;
        }

        case 'getBlockchainID': {
          const alias = this.getNodeParameter('alias', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'info.getBlockchainID',
            params: {
              alias: alias,
            },
            id: 1,
          };
          
          const options: any = {
            ...baseOptions,
            body: requestBody,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = response.result || response;
          break;
        }

        case 'getPeers': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'info.peers',
            params: {},
            id: 1,
          };
          
          const options: any = {
            ...baseOptions,
            body: requestBody,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = response.result || response;
          break;
        }

        case 'isBootstrapped': {
          const chain = this.getNodeParameter('chain', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'info.isBootstrapped',
            params: {
              chain: chain,
            },
            id: 1,
          };
          
          const options: any = {
            ...baseOptions,
            body: requestBody,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = response.result || response;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error.response && error.response.body && error.response.body.error) {
          throw new NodeApiError(this.getNode(), error.response.body.error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeHealthMonitoringOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('avalancheApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getLiveness': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ext/health`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getReadiness': {
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/health`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'health.getReadiness',
              params: {},
              id: 1,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getHealth': {
          const tags = this.getNodeParameter('tags', i) as string;
          const params: any = {};
          if (tags) {
            params.tags = tags.split(',').map((tag: string) => tag.trim());
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/health`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'health.health',
              params,
              id: 1,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'issueAvmTx': {
          const tx = this.getNodeParameter('tx', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/bc/X`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'avm.issueTx',
              params: {
                tx,
                encoding,
              },
              id: 1,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'issuePlatformTx': {
          const tx = this.getNodeParameter('tx', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/P`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'platform.issueTx',
              params: {
                tx,
                encoding,
              },
              id: 1,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLatestBlockNumber': {
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ext/bc/C/rpc`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}
