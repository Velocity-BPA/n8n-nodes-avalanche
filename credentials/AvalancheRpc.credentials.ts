/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AvalancheRpc implements ICredentialType {
  name = 'avalancheRpc';
  displayName = 'Avalanche RPC';
  documentationUrl = 'https://docs.avax.network/apis/avalanchego/apis';
  properties: INodeProperties[] = [
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      options: [
        { name: 'Mainnet', value: 'mainnet' },
        { name: 'Fuji Testnet', value: 'fuji' },
        { name: 'Custom', value: 'custom' },
      ],
      default: 'mainnet',
    },
    {
      displayName: 'RPC Provider',
      name: 'rpcProvider',
      type: 'options',
      options: [
        { name: 'Public (Free)', value: 'public' },
        { name: 'Infura', value: 'infura' },
        { name: 'Alchemy', value: 'alchemy' },
        { name: 'QuickNode', value: 'quicknode' },
        { name: 'Custom URL', value: 'custom' },
      ],
      default: 'public',
      displayOptions: {
        show: {
          network: ['mainnet', 'fuji'],
        },
      },
    },
    {
      displayName: 'Infura Project ID',
      name: 'infuraProjectId',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      displayOptions: {
        show: {
          rpcProvider: ['infura'],
        },
      },
    },
    {
      displayName: 'Alchemy API Key',
      name: 'alchemyApiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      displayOptions: {
        show: {
          rpcProvider: ['alchemy'],
        },
      },
    },
    {
      displayName: 'QuickNode Endpoint URL',
      name: 'quicknodeUrl',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      placeholder: 'https://your-endpoint.quiknode.pro/your-key/',
      displayOptions: {
        show: {
          rpcProvider: ['quicknode'],
        },
      },
    },
    {
      displayName: 'Custom RPC URL',
      name: 'customRpcUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-rpc-endpoint.com',
      displayOptions: {
        show: {
          rpcProvider: ['custom'],
        },
      },
    },
    {
      displayName: 'Custom RPC URL',
      name: 'customNetworkUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-rpc-endpoint.com',
      displayOptions: {
        show: {
          network: ['custom'],
        },
      },
    },
    {
      displayName: 'Private Key (Optional)',
      name: 'privateKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Private key for signing transactions (hex format without 0x prefix)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$self.getRpcUrl()}}',
      url: '',
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_chainId',
        params: [],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
}

export function getRpcUrl(credentials: ICredentialDataDecryptedObject): string {
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
