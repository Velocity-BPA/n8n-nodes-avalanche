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

export class Snowtrace implements ICredentialType {
  name = 'snowtrace';
  displayName = 'Snowtrace API';
  documentationUrl = 'https://docs.snowtrace.io/';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      options: [
        { name: 'Mainnet', value: 'mainnet' },
        { name: 'Fuji Testnet', value: 'fuji' },
      ],
      default: 'mainnet',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      qs: {
        apikey: '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.network === "mainnet" ? "https://api.snowtrace.io" : "https://api-testnet.snowtrace.io"}}',
      url: '/api',
      qs: {
        module: 'stats',
        action: 'ethsupply',
      },
    },
  };
}
