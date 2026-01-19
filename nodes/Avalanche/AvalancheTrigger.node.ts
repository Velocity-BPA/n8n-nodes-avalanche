/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IPollFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IDataObject,
  ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { ethers } from 'ethers';

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

export class AvalancheTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Avalanche Trigger',
    name: 'avalancheTrigger',
    icon: 'file:avalanche.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Triggers on Avalanche blockchain events',
    defaults: {
      name: 'Avalanche Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'avalancheRpc',
        required: true,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          { name: 'New Block', value: 'newBlock', description: 'Trigger on new blocks' },
          {
            name: 'Address Activity',
            value: 'addressActivity',
            description: 'Monitor address for transactions',
          },
          {
            name: 'Token Transfer',
            value: 'tokenTransfer',
            description: 'Monitor ERC-20 transfers',
          },
          {
            name: 'Contract Event',
            value: 'contractEvent',
            description: 'Listen for contract events',
          },
          {
            name: 'Balance Change',
            value: 'balanceChange',
            description: 'Monitor balance changes',
          },
          {
            name: 'Gas Price Alert',
            value: 'gasPriceAlert',
            description: 'Alert on gas price changes',
          },
          {
            name: 'Whale Alert',
            value: 'whaleAlert',
            description: 'Large transfer monitoring',
          },
        ],
        default: 'newBlock',
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        placeholder: '0x...',
        displayOptions: {
          show: {
            event: ['addressActivity', 'balanceChange'],
          },
        },
      },
      {
        displayName: 'Token Contract Address',
        name: 'tokenAddress',
        type: 'string',
        default: '',
        placeholder: '0x...',
        displayOptions: {
          show: {
            event: ['tokenTransfer'],
          },
        },
      },
      {
        displayName: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        default: '',
        placeholder: '0x...',
        displayOptions: {
          show: {
            event: ['contractEvent'],
          },
        },
      },
      {
        displayName: 'Event Signature',
        name: 'eventSignature',
        type: 'string',
        default: '',
        placeholder: 'Transfer(address,address,uint256)',
        displayOptions: {
          show: {
            event: ['contractEvent'],
          },
        },
      },
      {
        displayName: 'Gas Price Threshold (Gwei)',
        name: 'gasPriceThreshold',
        type: 'number',
        default: 30,
        displayOptions: {
          show: {
            event: ['gasPriceAlert'],
          },
        },
      },
      {
        displayName: 'Whale Threshold (AVAX)',
        name: 'whaleThreshold',
        type: 'number',
        default: 10000,
        displayOptions: {
          show: {
            event: ['whaleAlert'],
          },
        },
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    // Show licensing notice once per node load
    showLicensingNotice();

    const credentials = (await this.getCredentials(
      'avalancheRpc',
    )) as ICredentialDataDecryptedObject;
    const event = this.getNodeParameter('event') as string;

    const rpcUrl = getRpcUrl(credentials);
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const webhookData = this.getWorkflowStaticData('node');
    const returnData: IDataObject[] = [];

    try {
      if (event === 'newBlock') {
        const currentBlock = await provider.getBlockNumber();
        const lastBlock = (webhookData.lastBlock as number) || currentBlock - 1;

        if (currentBlock > lastBlock) {
          for (let blockNum = lastBlock + 1; blockNum <= currentBlock; blockNum++) {
            const block = await provider.getBlock(blockNum);
            if (block) {
              returnData.push({
                blockNumber: block.number,
                hash: block.hash,
                timestamp: block.timestamp,
                transactionCount: block.transactions.length,
                gasUsed: block.gasUsed.toString(),
                gasLimit: block.gasLimit.toString(),
              });
            }
          }
          webhookData.lastBlock = currentBlock;
        }
      } else if (event === 'addressActivity') {
        const address = this.getNodeParameter('address') as string;
        const currentBlock = await provider.getBlockNumber();
        const lastBlock = (webhookData.lastBlock as number) || currentBlock - 1;

        if (currentBlock > lastBlock) {
          for (let blockNum = lastBlock + 1; blockNum <= currentBlock; blockNum++) {
            const block = await provider.getBlock(blockNum, true);
            if (block && block.prefetchedTransactions) {
              for (const tx of block.prefetchedTransactions) {
                if (
                  tx.from?.toLowerCase() === address.toLowerCase() ||
                  tx.to?.toLowerCase() === address.toLowerCase()
                ) {
                  returnData.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: ethers.formatEther(tx.value),
                    blockNumber: tx.blockNumber,
                    type: tx.from?.toLowerCase() === address.toLowerCase() ? 'outgoing' : 'incoming',
                  });
                }
              }
            }
          }
          webhookData.lastBlock = currentBlock;
        }
      } else if (event === 'tokenTransfer') {
        const tokenAddress = this.getNodeParameter('tokenAddress') as string;
        const currentBlock = await provider.getBlockNumber();
        const lastBlock = (webhookData.lastBlock as number) || currentBlock - 1;

        if (currentBlock > lastBlock) {
          const transferTopic = ethers.id('Transfer(address,address,uint256)');
          const logs = await provider.getLogs({
            address: tokenAddress,
            topics: [transferTopic],
            fromBlock: lastBlock + 1,
            toBlock: currentBlock,
          });

          for (const log of logs) {
            const from = '0x' + log.topics[1].slice(26);
            const to = '0x' + log.topics[2].slice(26);
            const value = BigInt(log.data);
            returnData.push({
              contractAddress: log.address,
              from,
              to,
              value: value.toString(),
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash,
            });
          }
          webhookData.lastBlock = currentBlock;
        }
      } else if (event === 'contractEvent') {
        const contractAddress = this.getNodeParameter('contractAddress') as string;
        const eventSignature = this.getNodeParameter('eventSignature') as string;
        const currentBlock = await provider.getBlockNumber();
        const lastBlock = (webhookData.lastBlock as number) || currentBlock - 1;

        if (currentBlock > lastBlock) {
          const eventTopic = ethers.id(eventSignature);
          const logs = await provider.getLogs({
            address: contractAddress,
            topics: [eventTopic],
            fromBlock: lastBlock + 1,
            toBlock: currentBlock,
          });

          for (const log of logs) {
            returnData.push({
              address: log.address,
              topics: log.topics,
              data: log.data,
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash,
            });
          }
          webhookData.lastBlock = currentBlock;
        }
      } else if (event === 'balanceChange') {
        const address = this.getNodeParameter('address') as string;
        const currentBalance = await provider.getBalance(address);
        const lastBalance = webhookData.lastBalance as string;

        if (lastBalance && currentBalance.toString() !== lastBalance) {
          const previousBigInt = BigInt(lastBalance);
          const change = currentBalance - previousBigInt;
          returnData.push({
            address,
            previousBalance: ethers.formatEther(previousBigInt),
            currentBalance: ethers.formatEther(currentBalance),
            change: ethers.formatEther(change),
            changeType: change > 0n ? 'increase' : 'decrease',
          });
        }
        webhookData.lastBalance = currentBalance.toString();
      } else if (event === 'gasPriceAlert') {
        const threshold = this.getNodeParameter('gasPriceThreshold') as number;
        const feeData = await provider.getFeeData();
        const gasPriceGwei = feeData.gasPrice
          ? parseFloat(ethers.formatUnits(feeData.gasPrice, 'gwei'))
          : 0;
        const lastGasPrice = webhookData.lastGasPrice as number;

        if (gasPriceGwei >= threshold && (!lastGasPrice || lastGasPrice < threshold)) {
          returnData.push({
            alertType: 'high_gas',
            gasPrice: gasPriceGwei,
            threshold,
            timestamp: Date.now(),
          });
        } else if (gasPriceGwei < threshold && lastGasPrice && lastGasPrice >= threshold) {
          returnData.push({
            alertType: 'gas_normalized',
            gasPrice: gasPriceGwei,
            threshold,
            timestamp: Date.now(),
          });
        }
        webhookData.lastGasPrice = gasPriceGwei;
      } else if (event === 'whaleAlert') {
        const threshold = this.getNodeParameter('whaleThreshold') as number;
        const thresholdWei = ethers.parseEther(threshold.toString());
        const currentBlock = await provider.getBlockNumber();
        const lastBlock = (webhookData.lastBlock as number) || currentBlock - 1;

        if (currentBlock > lastBlock) {
          for (let blockNum = lastBlock + 1; blockNum <= currentBlock; blockNum++) {
            const block = await provider.getBlock(blockNum, true);
            if (block && block.prefetchedTransactions) {
              for (const tx of block.prefetchedTransactions) {
                if (tx.value >= thresholdWei) {
                  returnData.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: ethers.formatEther(tx.value),
                    valueUSD: null,
                    blockNumber: tx.blockNumber,
                    alert: 'whale_transfer',
                  });
                }
              }
            }
          }
          webhookData.lastBlock = currentBlock;
        }
      }
    } catch (error) {
      throw error;
    }

    if (returnData.length === 0) {
      return null;
    }

    return [this.helpers.returnJsonArray(returnData)];
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
