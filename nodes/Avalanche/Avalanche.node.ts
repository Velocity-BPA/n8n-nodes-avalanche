/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { ethers } from 'ethers';
import axios from 'axios';

// Licensing notice - logged once per node load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

let licensingNoticeShown = false;

function showLicensingNotice(): void {
  if (!licensingNoticeShown) {
    console.warn(LICENSING_NOTICE);
    licensingNoticeShown = true;
  }
}

export class Avalanche implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Avalanche',
    name: 'avalanche',
    icon: 'file:avalanche.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      'Interact with Avalanche blockchain - C-Chain, X-Chain, P-Chain, DeFi, and more',
    defaults: {
      name: 'Avalanche',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'avalancheRpc',
        required: true,
      },
      {
        name: 'snowtrace',
        required: false,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Block', value: 'block' },
          { name: 'Contract', value: 'contract' },
          { name: 'Cross-Chain', value: 'crosschain' },
          { name: 'DeFi', value: 'defi' },
          { name: 'Network', value: 'network' },
          { name: 'NFT', value: 'nft' },
          { name: 'P-Chain', value: 'pchain' },
          { name: 'Token', value: 'token' },
          { name: 'Transaction', value: 'transaction' },
          { name: 'Utility', value: 'utility' },
          { name: 'X-Chain', value: 'xchain' },
        ],
        default: 'account',
      },
      // Account Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['account'] } },
        options: [
          {
            name: 'Get Balance',
            value: 'getBalance',
            description: 'Get AVAX balance of an address',
            action: 'Get balance of an address',
          },
          {
            name: 'Get Transaction Count',
            value: 'getTransactionCount',
            description: 'Get nonce/transaction count',
            action: 'Get transaction count',
          },
          {
            name: 'Get Transaction History',
            value: 'getTransactionHistory',
            description: 'Get transaction history from Snowtrace',
            action: 'Get transaction history',
          },
        ],
        default: 'getBalance',
      },
      // Block Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['block'] } },
        options: [
          {
            name: 'Get Block',
            value: 'getBlock',
            description: 'Get block by number or hash',
            action: 'Get block',
          },
          {
            name: 'Get Latest Block',
            value: 'getLatestBlock',
            description: 'Get the latest block',
            action: 'Get latest block',
          },
          {
            name: 'Get Block Number',
            value: 'getBlockNumber',
            description: 'Get current block number',
            action: 'Get block number',
          },
        ],
        default: 'getLatestBlock',
      },
      // Contract Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['contract'] } },
        options: [
          {
            name: 'Read Contract',
            value: 'readContract',
            description: 'Call a read-only contract function',
            action: 'Read contract',
          },
          {
            name: 'Write Contract',
            value: 'writeContract',
            description: 'Execute a contract function',
            action: 'Write contract',
          },
          {
            name: 'Get ABI',
            value: 'getAbi',
            description: 'Get contract ABI from Snowtrace',
            action: 'Get contract ABI',
          },
        ],
        default: 'readContract',
      },
      // Cross-Chain Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['crosschain'] } },
        options: [
          {
            name: 'Get Atomic UTXOs',
            value: 'getAtomicUTXOs',
            description: 'Get atomic UTXOs for cross-chain transfers',
            action: 'Get atomic UTXOs',
          },
          {
            name: 'Get X-Chain Balance',
            value: 'getXChainBalance',
            description: 'Get X-Chain AVAX balance',
            action: 'Get X-Chain balance',
          },
          {
            name: 'Get P-Chain Balance',
            value: 'getPChainBalance',
            description: 'Get P-Chain AVAX balance',
            action: 'Get P-Chain balance',
          },
        ],
        default: 'getAtomicUTXOs',
      },
      // DeFi Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['defi'] } },
        options: [
          {
            name: 'Get Token Price',
            value: 'getTokenPrice',
            description: 'Get token price from DEX',
            action: 'Get token price',
          },
          {
            name: 'Get Swap Quote',
            value: 'getSwapQuote',
            description: 'Get quote for token swap',
            action: 'Get swap quote',
          },
          {
            name: 'Wrap AVAX',
            value: 'wrapAvax',
            description: 'Wrap AVAX to WAVAX',
            action: 'Wrap AVAX',
          },
          {
            name: 'Unwrap WAVAX',
            value: 'unwrapWavax',
            description: 'Unwrap WAVAX to AVAX',
            action: 'Unwrap WAVAX',
          },
        ],
        default: 'getTokenPrice',
      },
      // Network Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['network'] } },
        options: [
          {
            name: 'Get Network Info',
            value: 'getNetworkInfo',
            description: 'Get network information',
            action: 'Get network info',
          },
          {
            name: 'Get Gas Price',
            value: 'getGasPrice',
            description: 'Get current gas price',
            action: 'Get gas price',
          },
          {
            name: 'Get Chain ID',
            value: 'getChainId',
            description: 'Get chain ID',
            action: 'Get chain ID',
          },
          {
            name: 'Get AVAX Price',
            value: 'getAvaxPrice',
            description: 'Get current AVAX price in USD',
            action: 'Get AVAX price',
          },
        ],
        default: 'getNetworkInfo',
      },
      // NFT Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['nft'] } },
        options: [
          {
            name: 'Get NFT Balance',
            value: 'getNftBalance',
            description: 'Get NFT balance for an address',
            action: 'Get NFT balance',
          },
          {
            name: 'Get NFT Owner',
            value: 'getNftOwner',
            description: 'Get owner of an NFT',
            action: 'Get NFT owner',
          },
          {
            name: 'Get NFT Metadata',
            value: 'getNftMetadata',
            description: 'Get NFT metadata',
            action: 'Get NFT metadata',
          },
          {
            name: 'Get NFT Token URI',
            value: 'getNftTokenUri',
            description: 'Get NFT token URI',
            action: 'Get NFT token URI',
          },
        ],
        default: 'getNftBalance',
      },
      // P-Chain Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['pchain'] } },
        options: [
          {
            name: 'Get Validators',
            value: 'getValidators',
            description: 'Get current validators',
            action: 'Get validators',
          },
          {
            name: 'Get Pending Validators',
            value: 'getPendingValidators',
            description: 'Get pending validators',
            action: 'Get pending validators',
          },
          {
            name: 'Get Staking Info',
            value: 'getStakingInfo',
            description: 'Get staking parameters',
            action: 'Get staking info',
          },
          {
            name: 'Get Subnets',
            value: 'getSubnets',
            description: 'Get all subnets',
            action: 'Get subnets',
          },
        ],
        default: 'getValidators',
      },
      // Token Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['token'] } },
        options: [
          {
            name: 'Get Token Balance',
            value: 'getTokenBalance',
            description: 'Get ERC-20 token balance',
            action: 'Get token balance',
          },
          {
            name: 'Get Token Info',
            value: 'getTokenInfo',
            description: 'Get token name, symbol, decimals',
            action: 'Get token info',
          },
          {
            name: 'Transfer Token',
            value: 'transferToken',
            description: 'Transfer ERC-20 tokens',
            action: 'Transfer token',
          },
          {
            name: 'Get Allowance',
            value: 'getAllowance',
            description: 'Get token spending allowance',
            action: 'Get allowance',
          },
          {
            name: 'Approve Token',
            value: 'approveToken',
            description: 'Approve token spending',
            action: 'Approve token',
          },
        ],
        default: 'getTokenBalance',
      },
      // Transaction Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['transaction'] } },
        options: [
          {
            name: 'Send AVAX',
            value: 'sendAvax',
            description: 'Send AVAX to an address',
            action: 'Send AVAX',
          },
          {
            name: 'Get Transaction',
            value: 'getTransaction',
            description: 'Get transaction details',
            action: 'Get transaction',
          },
          {
            name: 'Get Transaction Receipt',
            value: 'getTransactionReceipt',
            description: 'Get transaction receipt',
            action: 'Get transaction receipt',
          },
          {
            name: 'Wait for Transaction',
            value: 'waitForTransaction',
            description: 'Wait for transaction confirmation',
            action: 'Wait for transaction',
          },
        ],
        default: 'getTransaction',
      },
      // Utility Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['utility'] } },
        options: [
          {
            name: 'Convert Units',
            value: 'convertUnits',
            description: 'Convert between AVAX units',
            action: 'Convert units',
          },
          {
            name: 'Validate Address',
            value: 'validateAddress',
            description: 'Validate Avalanche address',
            action: 'Validate address',
          },
          {
            name: 'Encode Function',
            value: 'encodeFunction',
            description: 'Encode function call data',
            action: 'Encode function',
          },
          {
            name: 'Decode Function',
            value: 'decodeFunction',
            description: 'Decode function return data',
            action: 'Decode function',
          },
        ],
        default: 'convertUnits',
      },
      // X-Chain Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['xchain'] } },
        options: [
          {
            name: 'Get Balance',
            value: 'getXBalance',
            description: 'Get X-Chain balance',
            action: 'Get X-Chain balance',
          },
          {
            name: 'Get Asset Info',
            value: 'getAssetInfo',
            description: 'Get asset information',
            action: 'Get asset info',
          },
          {
            name: 'Get UTXOs',
            value: 'getUtxos',
            description: 'Get UTXOs for an address',
            action: 'Get UTXOs',
          },
        ],
        default: 'getXBalance',
      },
      // Common Parameters
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        required: true,
        placeholder: '0x...',
        displayOptions: {
          show: {
            resource: ['account', 'token', 'nft', 'crosschain'],
            operation: [
              'getBalance',
              'getTransactionCount',
              'getTransactionHistory',
              'getTokenBalance',
              'getAllowance',
              'getNftBalance',
              'getAtomicUTXOs',
              'getXChainBalance',
              'getPChainBalance',
            ],
          },
        },
      },
      {
        displayName: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        default: '',
        required: true,
        placeholder: '0x...',
        displayOptions: {
          show: {
            resource: ['contract', 'token', 'nft', 'defi'],
            operation: [
              'readContract',
              'writeContract',
              'getAbi',
              'getTokenBalance',
              'getTokenInfo',
              'transferToken',
              'getAllowance',
              'approveToken',
              'getNftBalance',
              'getNftOwner',
              'getNftMetadata',
              'getNftTokenUri',
              'getTokenPrice',
            ],
          },
        },
      },
      {
        displayName: 'Transaction Hash',
        name: 'transactionHash',
        type: 'string',
        default: '',
        required: true,
        placeholder: '0x...',
        displayOptions: {
          show: {
            resource: ['transaction'],
            operation: ['getTransaction', 'getTransactionReceipt', 'waitForTransaction'],
          },
        },
      },
      {
        displayName: 'To Address',
        name: 'toAddress',
        type: 'string',
        default: '',
        required: true,
        placeholder: '0x...',
        displayOptions: {
          show: {
            resource: ['transaction', 'token'],
            operation: ['sendAvax', 'transferToken'],
          },
        },
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'string',
        default: '',
        required: true,
        placeholder: '1.0',
        description: 'Amount in AVAX or tokens',
        displayOptions: {
          show: {
            resource: ['transaction', 'token', 'defi'],
            operation: [
              'sendAvax',
              'transferToken',
              'approveToken',
              'wrapAvax',
              'unwrapWavax',
              'getSwapQuote',
            ],
          },
        },
      },
      {
        displayName: 'Block Number or Hash',
        name: 'blockIdentifier',
        type: 'string',
        default: '',
        placeholder: '12345 or 0x...',
        displayOptions: {
          show: {
            resource: ['block'],
            operation: ['getBlock'],
          },
        },
      },
      {
        displayName: 'Token ID',
        name: 'tokenId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['nft'],
            operation: ['getNftOwner', 'getNftMetadata', 'getNftTokenUri'],
          },
        },
      },
      {
        displayName: 'Function Name',
        name: 'functionName',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'balanceOf',
        displayOptions: {
          show: {
            resource: ['contract'],
            operation: ['readContract', 'writeContract'],
          },
        },
      },
      {
        displayName: 'Function Arguments',
        name: 'functionArgs',
        type: 'string',
        default: '',
        placeholder: '["0x123...", 100]',
        description: 'JSON array of function arguments',
        displayOptions: {
          show: {
            resource: ['contract'],
            operation: ['readContract', 'writeContract'],
          },
        },
      },
      {
        displayName: 'ABI',
        name: 'abi',
        type: 'json',
        default: '[]',
        displayOptions: {
          show: {
            resource: ['contract'],
            operation: ['readContract', 'writeContract'],
          },
        },
      },
      {
        displayName: 'Spender Address',
        name: 'spenderAddress',
        type: 'string',
        default: '',
        required: true,
        placeholder: '0x...',
        displayOptions: {
          show: {
            resource: ['token'],
            operation: ['getAllowance', 'approveToken'],
          },
        },
      },
      {
        displayName: 'From Unit',
        name: 'fromUnit',
        type: 'options',
        options: [
          { name: 'AVAX', value: 'ether' },
          { name: 'nAVAX (Gwei)', value: 'gwei' },
          { name: 'Wei', value: 'wei' },
        ],
        default: 'ether',
        displayOptions: {
          show: {
            resource: ['utility'],
            operation: ['convertUnits'],
          },
        },
      },
      {
        displayName: 'To Unit',
        name: 'toUnit',
        type: 'options',
        options: [
          { name: 'AVAX', value: 'ether' },
          { name: 'nAVAX (Gwei)', value: 'gwei' },
          { name: 'Wei', value: 'wei' },
        ],
        default: 'wei',
        displayOptions: {
          show: {
            resource: ['utility'],
            operation: ['convertUnits'],
          },
        },
      },
      {
        displayName: 'Value',
        name: 'value',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['utility'],
            operation: ['convertUnits', 'validateAddress'],
          },
        },
      },
      {
        displayName: 'Source Chain',
        name: 'sourceChain',
        type: 'options',
        options: [
          { name: 'X-Chain', value: 'X' },
          { name: 'P-Chain', value: 'P' },
        ],
        default: 'X',
        displayOptions: {
          show: {
            resource: ['crosschain'],
            operation: ['getAtomicUTXOs'],
          },
        },
      },
      {
        displayName: 'Token In',
        name: 'tokenIn',
        type: 'string',
        default: '',
        required: true,
        placeholder: '0x...',
        displayOptions: {
          show: {
            resource: ['defi'],
            operation: ['getSwapQuote'],
          },
        },
      },
      {
        displayName: 'Token Out',
        name: 'tokenOut',
        type: 'string',
        default: '',
        required: true,
        placeholder: '0x...',
        displayOptions: {
          show: {
            resource: ['defi'],
            operation: ['getSwapQuote'],
          },
        },
      },
      {
        displayName: 'X-Chain Address',
        name: 'xChainAddress',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'X-avax1...',
        displayOptions: {
          show: {
            resource: ['xchain'],
            operation: ['getXBalance', 'getUtxos'],
          },
        },
      },
      {
        displayName: 'Asset ID',
        name: 'assetId',
        type: 'string',
        default: 'AVAX',
        displayOptions: {
          show: {
            resource: ['xchain'],
            operation: ['getXBalance', 'getAssetInfo'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Show licensing notice once per node load
    showLicensingNotice();

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = (await this.getCredentials(
      'avalancheRpc',
    )) as ICredentialDataDecryptedObject;

    const rpcUrl = getRpcUrl(credentials);
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;
        let result: IDataObject = {};

        // Account Operations
        if (resource === 'account') {
          if (operation === 'getBalance') {
            const address = this.getNodeParameter('address', i) as string;
            const balance = await provider.getBalance(address);
            result = {
              address,
              balanceWei: balance.toString(),
              balanceAvax: ethers.formatEther(balance),
            };
          } else if (operation === 'getTransactionCount') {
            const address = this.getNodeParameter('address', i) as string;
            const count = await provider.getTransactionCount(address);
            result = { address, transactionCount: count };
          } else if (operation === 'getTransactionHistory') {
            const address = this.getNodeParameter('address', i) as string;
            const snowtraceCredentials = await this.getCredentials('snowtrace').catch(() => null);
            if (snowtraceCredentials) {
              const apiKey = snowtraceCredentials.apiKey as string;
              const network = snowtraceCredentials.network as string;
              const baseUrl =
                network === 'mainnet'
                  ? 'https://api.snowtrace.io'
                  : 'https://api-testnet.snowtrace.io';
              const response = await axios.get(`${baseUrl}/api`, {
                params: {
                  module: 'account',
                  action: 'txlist',
                  address,
                  sort: 'desc',
                  apikey: apiKey,
                },
              });
              result = { address, transactions: response.data.result };
            } else {
              throw new Error('Snowtrace credentials required for transaction history');
            }
          }
        }
        // Block Operations
        else if (resource === 'block') {
          if (operation === 'getLatestBlock') {
            const block = await provider.getBlock('latest');
            result = block as unknown as IDataObject;
          } else if (operation === 'getBlockNumber') {
            const blockNumber = await provider.getBlockNumber();
            result = { blockNumber };
          } else if (operation === 'getBlock') {
            const blockIdentifier = this.getNodeParameter('blockIdentifier', i) as string;
            const blockId = blockIdentifier.startsWith('0x')
              ? blockIdentifier
              : parseInt(blockIdentifier, 10);
            const block = await provider.getBlock(blockId);
            result = block as unknown as IDataObject;
          }
        }
        // Network Operations
        else if (resource === 'network') {
          if (operation === 'getNetworkInfo') {
            const network = await provider.getNetwork();
            const blockNumber = await provider.getBlockNumber();
            result = {
              chainId: network.chainId.toString(),
              name: network.name,
              blockNumber,
            };
          } else if (operation === 'getGasPrice') {
            const feeData = await provider.getFeeData();
            result = {
              gasPrice: feeData.gasPrice?.toString(),
              gasPriceGwei: feeData.gasPrice
                ? ethers.formatUnits(feeData.gasPrice, 'gwei')
                : null,
              maxFeePerGas: feeData.maxFeePerGas?.toString(),
              maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
            };
          } else if (operation === 'getChainId') {
            const network = await provider.getNetwork();
            result = { chainId: network.chainId.toString() };
          } else if (operation === 'getAvaxPrice') {
            const snowtraceCredentials = await this.getCredentials('snowtrace').catch(() => null);
            if (snowtraceCredentials) {
              const apiKey = snowtraceCredentials.apiKey as string;
              const response = await axios.get('https://api.snowtrace.io/api', {
                params: {
                  module: 'stats',
                  action: 'avaxprice',
                  apikey: apiKey,
                },
              });
              result = response.data.result;
            } else {
              throw new Error('Snowtrace credentials required for AVAX price');
            }
          }
        }
        // Transaction Operations
        else if (resource === 'transaction') {
          if (operation === 'getTransaction') {
            const txHash = this.getNodeParameter('transactionHash', i) as string;
            const tx = await provider.getTransaction(txHash);
            result = tx as unknown as IDataObject;
          } else if (operation === 'getTransactionReceipt') {
            const txHash = this.getNodeParameter('transactionHash', i) as string;
            const receipt = await provider.getTransactionReceipt(txHash);
            result = receipt as unknown as IDataObject;
          } else if (operation === 'waitForTransaction') {
            const txHash = this.getNodeParameter('transactionHash', i) as string;
            const receipt = await provider.waitForTransaction(txHash);
            result = receipt as unknown as IDataObject;
          } else if (operation === 'sendAvax') {
            const privateKey = credentials.privateKey as string;
            if (!privateKey) throw new Error('Private key required for sending transactions');
            const wallet = new ethers.Wallet(privateKey, provider);
            const toAddress = this.getNodeParameter('toAddress', i) as string;
            const amount = this.getNodeParameter('amount', i) as string;
            const tx = await wallet.sendTransaction({
              to: toAddress,
              value: ethers.parseEther(amount),
            });
            const receipt = await tx.wait();
            result = {
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: ethers.formatEther(tx.value),
              receipt: receipt as unknown as IDataObject,
            };
          }
        }
        // Token Operations
        else if (resource === 'token') {
          const ERC20_ABI = [
            'function balanceOf(address) view returns (uint256)',
            'function decimals() view returns (uint8)',
            'function symbol() view returns (string)',
            'function name() view returns (string)',
            'function totalSupply() view returns (uint256)',
            'function allowance(address owner, address spender) view returns (uint256)',
            'function approve(address spender, uint256 amount) returns (bool)',
            'function transfer(address to, uint256 amount) returns (bool)',
          ];

          if (operation === 'getTokenBalance') {
            const address = this.getNodeParameter('address', i) as string;
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
            const [balance, decimals, symbol] = await Promise.all([
              contract.balanceOf(address),
              contract.decimals(),
              contract.symbol(),
            ]);
            result = {
              address,
              contractAddress,
              balance: balance.toString(),
              balanceFormatted: ethers.formatUnits(balance, decimals),
              decimals: Number(decimals),
              symbol,
            };
          } else if (operation === 'getTokenInfo') {
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
            const [name, symbol, decimals, totalSupply] = await Promise.all([
              contract.name(),
              contract.symbol(),
              contract.decimals(),
              contract.totalSupply(),
            ]);
            result = {
              contractAddress,
              name,
              symbol,
              decimals: Number(decimals),
              totalSupply: totalSupply.toString(),
              totalSupplyFormatted: ethers.formatUnits(totalSupply, decimals),
            };
          } else if (operation === 'getAllowance') {
            const address = this.getNodeParameter('address', i) as string;
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const spenderAddress = this.getNodeParameter('spenderAddress', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
            const [allowance, decimals] = await Promise.all([
              contract.allowance(address, spenderAddress),
              contract.decimals(),
            ]);
            result = {
              owner: address,
              spender: spenderAddress,
              allowance: allowance.toString(),
              allowanceFormatted: ethers.formatUnits(allowance, decimals),
            };
          } else if (operation === 'approveToken') {
            const privateKey = credentials.privateKey as string;
            if (!privateKey) throw new Error('Private key required');
            const wallet = new ethers.Wallet(privateKey, provider);
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const spenderAddress = this.getNodeParameter('spenderAddress', i) as string;
            const amount = this.getNodeParameter('amount', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC20_ABI, wallet);
            const decimals = await contract.decimals();
            const tx = await contract.approve(spenderAddress, ethers.parseUnits(amount, decimals));
            const receipt = await tx.wait();
            result = { hash: tx.hash, receipt: receipt as unknown as IDataObject };
          } else if (operation === 'transferToken') {
            const privateKey = credentials.privateKey as string;
            if (!privateKey) throw new Error('Private key required');
            const wallet = new ethers.Wallet(privateKey, provider);
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const toAddress = this.getNodeParameter('toAddress', i) as string;
            const amount = this.getNodeParameter('amount', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC20_ABI, wallet);
            const decimals = await contract.decimals();
            const tx = await contract.transfer(toAddress, ethers.parseUnits(amount, decimals));
            const receipt = await tx.wait();
            result = { hash: tx.hash, receipt: receipt as unknown as IDataObject };
          }
        }
        // NFT Operations
        else if (resource === 'nft') {
          const ERC721_ABI = [
            'function balanceOf(address) view returns (uint256)',
            'function ownerOf(uint256) view returns (address)',
            'function tokenURI(uint256) view returns (string)',
            'function name() view returns (string)',
            'function symbol() view returns (string)',
          ];

          if (operation === 'getNftBalance') {
            const address = this.getNodeParameter('address', i) as string;
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
            const balance = await contract.balanceOf(address);
            result = { address, contractAddress, balance: balance.toString() };
          } else if (operation === 'getNftOwner') {
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const tokenId = this.getNodeParameter('tokenId', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
            const owner = await contract.ownerOf(tokenId);
            result = { contractAddress, tokenId, owner };
          } else if (operation === 'getNftTokenUri') {
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const tokenId = this.getNodeParameter('tokenId', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
            const tokenUri = await contract.tokenURI(tokenId);
            result = { contractAddress, tokenId, tokenUri };
          } else if (operation === 'getNftMetadata') {
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const tokenId = this.getNodeParameter('tokenId', i) as string;
            const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
            const [tokenUri, name, symbol] = await Promise.all([
              contract.tokenURI(tokenId),
              contract.name(),
              contract.symbol(),
            ]);
            let metadata = {};
            if (tokenUri.startsWith('http')) {
              try {
                const response = await axios.get(tokenUri);
                metadata = response.data;
              } catch {
                metadata = { error: 'Failed to fetch metadata' };
              }
            }
            result = { contractAddress, tokenId, name, symbol, tokenUri, metadata };
          }
        }
        // Contract Operations
        else if (resource === 'contract') {
          if (operation === 'readContract') {
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const functionName = this.getNodeParameter('functionName', i) as string;
            const functionArgs = this.getNodeParameter('functionArgs', i) as string;
            const abi = this.getNodeParameter('abi', i) as string;
            const contract = new ethers.Contract(contractAddress, JSON.parse(abi), provider);
            const args = functionArgs ? JSON.parse(functionArgs) : [];
            const response = await contract[functionName](...args);
            result = { result: response?.toString?.() ?? response };
          } else if (operation === 'writeContract') {
            const privateKey = credentials.privateKey as string;
            if (!privateKey) throw new Error('Private key required');
            const wallet = new ethers.Wallet(privateKey, provider);
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const functionName = this.getNodeParameter('functionName', i) as string;
            const functionArgs = this.getNodeParameter('functionArgs', i) as string;
            const abi = this.getNodeParameter('abi', i) as string;
            const contract = new ethers.Contract(contractAddress, JSON.parse(abi), wallet);
            const args = functionArgs ? JSON.parse(functionArgs) : [];
            const tx = await contract[functionName](...args);
            const receipt = await tx.wait();
            result = { hash: tx.hash, receipt: receipt as unknown as IDataObject };
          } else if (operation === 'getAbi') {
            const contractAddress = this.getNodeParameter('contractAddress', i) as string;
            const snowtraceCredentials = await this.getCredentials('snowtrace').catch(() => null);
            if (snowtraceCredentials) {
              const apiKey = snowtraceCredentials.apiKey as string;
              const response = await axios.get('https://api.snowtrace.io/api', {
                params: {
                  module: 'contract',
                  action: 'getabi',
                  address: contractAddress,
                  apikey: apiKey,
                },
              });
              result = { contractAddress, abi: JSON.parse(response.data.result) };
            } else {
              throw new Error('Snowtrace credentials required');
            }
          }
        }
        // DeFi Operations
        else if (resource === 'defi') {
          const WAVAX_ADDRESS = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';
          const WAVAX_ABI = [
            'function deposit() payable',
            'function withdraw(uint256)',
            'function balanceOf(address) view returns (uint256)',
          ];

          if (operation === 'wrapAvax') {
            const privateKey = credentials.privateKey as string;
            if (!privateKey) throw new Error('Private key required');
            const wallet = new ethers.Wallet(privateKey, provider);
            const amount = this.getNodeParameter('amount', i) as string;
            const wavax = new ethers.Contract(WAVAX_ADDRESS, WAVAX_ABI, wallet);
            const tx = await wavax.deposit({ value: ethers.parseEther(amount) });
            const receipt = await tx.wait();
            result = { hash: tx.hash, amount, receipt: receipt as unknown as IDataObject };
          } else if (operation === 'unwrapWavax') {
            const privateKey = credentials.privateKey as string;
            if (!privateKey) throw new Error('Private key required');
            const wallet = new ethers.Wallet(privateKey, provider);
            const amount = this.getNodeParameter('amount', i) as string;
            const wavax = new ethers.Contract(WAVAX_ADDRESS, WAVAX_ABI, wallet);
            const tx = await wavax.withdraw(ethers.parseEther(amount));
            const receipt = await tx.wait();
            result = { hash: tx.hash, amount, receipt: receipt as unknown as IDataObject };
          } else if (operation === 'getTokenPrice' || operation === 'getSwapQuote') {
            result = { message: 'Use external DEX aggregator APIs for price quotes' };
          }
        }
        // P-Chain Operations
        else if (resource === 'pchain') {
          const pchainUrl = rpcUrl.replace('/ext/bc/C/rpc', '/ext/bc/P');

          if (operation === 'getValidators') {
            const response = await axios.post(pchainUrl, {
              jsonrpc: '2.0',
              id: 1,
              method: 'platform.getCurrentValidators',
              params: { subnetID: '' },
            });
            result = response.data.result;
          } else if (operation === 'getPendingValidators') {
            const response = await axios.post(pchainUrl, {
              jsonrpc: '2.0',
              id: 1,
              method: 'platform.getPendingValidators',
              params: { subnetID: '' },
            });
            result = response.data.result;
          } else if (operation === 'getStakingInfo') {
            const response = await axios.post(pchainUrl, {
              jsonrpc: '2.0',
              id: 1,
              method: 'platform.getMinStake',
              params: {},
            });
            result = response.data.result;
          } else if (operation === 'getSubnets') {
            const response = await axios.post(pchainUrl, {
              jsonrpc: '2.0',
              id: 1,
              method: 'platform.getSubnets',
              params: {},
            });
            result = response.data.result;
          }
        }
        // X-Chain Operations
        else if (resource === 'xchain') {
          const xchainUrl = rpcUrl.replace('/ext/bc/C/rpc', '/ext/bc/X');

          if (operation === 'getXBalance') {
            const xChainAddress = this.getNodeParameter('xChainAddress', i) as string;
            const assetId = this.getNodeParameter('assetId', i) as string;
            const response = await axios.post(xchainUrl, {
              jsonrpc: '2.0',
              id: 1,
              method: 'avm.getBalance',
              params: { address: xChainAddress, assetID: assetId },
            });
            result = response.data.result;
          } else if (operation === 'getAssetInfo') {
            const assetId = this.getNodeParameter('assetId', i) as string;
            const response = await axios.post(xchainUrl, {
              jsonrpc: '2.0',
              id: 1,
              method: 'avm.getAssetDescription',
              params: { assetID: assetId },
            });
            result = response.data.result;
          } else if (operation === 'getUtxos') {
            const xChainAddress = this.getNodeParameter('xChainAddress', i) as string;
            const response = await axios.post(xchainUrl, {
              jsonrpc: '2.0',
              id: 1,
              method: 'avm.getUTXOs',
              params: { addresses: [xChainAddress] },
            });
            result = response.data.result;
          }
        }
        // Cross-Chain Operations
        else if (resource === 'crosschain') {
          if (operation === 'getAtomicUTXOs') {
            const address = this.getNodeParameter('address', i) as string;
            const sourceChain = this.getNodeParameter('sourceChain', i) as string;
            const response = await axios.post(rpcUrl.replace('/rpc', ''), {
              jsonrpc: '2.0',
              id: 1,
              method: 'avax.getAtomicTx',
              params: { address, sourceChain },
            });
            result = response.data.result || { message: 'No atomic UTXOs found' };
          } else if (operation === 'getXChainBalance' || operation === 'getPChainBalance') {
            result = { message: 'Use X-Chain or P-Chain resource for balance queries' };
          }
        }
        // Utility Operations
        else if (resource === 'utility') {
          if (operation === 'convertUnits') {
            const value = this.getNodeParameter('value', i) as string;
            const fromUnit = this.getNodeParameter('fromUnit', i) as string;
            const toUnit = this.getNodeParameter('toUnit', i) as string;
            const wei = ethers.parseUnits(value, fromUnit);
            const converted = ethers.formatUnits(wei, toUnit);
            result = { original: value, fromUnit, toUnit, converted, wei: wei.toString() };
          } else if (operation === 'validateAddress') {
            const value = this.getNodeParameter('value', i) as string;
            const isValid = ethers.isAddress(value);
            result = {
              address: value,
              isValid,
              checksumAddress: isValid ? ethers.getAddress(value) : null,
            };
          } else if (operation === 'encodeFunction' || operation === 'decodeFunction') {
            result = { message: 'Use ethers.js Interface for encoding/decoding' };
          }
        }

        returnData.push({ json: result });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

function getRpcUrl(credentials: ICredentialDataDecryptedObject): string {
  const network = credentials.network as string;
  const rpcProvider = credentials.rpcProvider as string;

  if (network === 'custom') {
    return credentials.customNetworkUrl as string;
  }

  const isMainnet = network === 'mainnet';
  const baseMainnet = 'https://api.avax.network';
  const baseFuji = 'https://api.avax-test.network';
  const baseUrl = isMainnet ? baseMainnet : baseFuji;

  switch (rpcProvider) {
    case 'public':
      return `${baseUrl}/ext/bc/C/rpc`;
    case 'infura': {
      const infuraId = credentials.infuraProjectId as string;
      return isMainnet
        ? `https://avalanche-mainnet.infura.io/v3/${infuraId}`
        : `https://avalanche-fuji.infura.io/v3/${infuraId}`;
    }
    case 'alchemy': {
      const alchemyKey = credentials.alchemyApiKey as string;
      return isMainnet
        ? `https://avax-mainnet.g.alchemy.com/v2/${alchemyKey}`
        : `https://avax-fuji.g.alchemy.com/v2/${alchemyKey}`;
    }
    case 'quicknode':
      return credentials.quicknodeUrl as string;
    case 'custom':
      return credentials.customRpcUrl as string;
    default:
      return `${baseUrl}/ext/bc/C/rpc`;
  }
}
