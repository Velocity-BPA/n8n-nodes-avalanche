/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AvalancheSubnet implements ICredentialType {
  name = 'avalancheSubnet';
  displayName = 'Avalanche Subnet';
  documentationUrl = 'https://docs.avax.network/subnets';
  properties: INodeProperties[] = [
    {
      displayName: 'Subnet RPC URL',
      name: 'subnetRpcUrl',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'https://your-subnet-rpc.com/ext/bc/subnet-id/rpc',
    },
    {
      displayName: 'Subnet ID',
      name: 'subnetId',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Blockchain ID',
      name: 'blockchainId',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Chain ID',
      name: 'chainId',
      type: 'number',
      default: 0,
      required: true,
    },
    {
      displayName: 'Private Key (Optional)',
      name: 'privateKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.subnetRpcUrl}}',
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
