import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AvalancheApi implements ICredentialType {
	name = 'avalancheApi';
	displayName = 'Avalanche API';
	documentationUrl = 'https://docs.avax.network/apis/avalanchego';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.avax.network',
			description: 'The base URL for the Avalanche API (mainnet: https://api.avax.network, testnet: https://api.avax-test.network)',
			required: true,
		},
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'Mainnet',
					value: 'mainnet',
				},
				{
					name: 'Fuji Testnet',
					value: 'testnet',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'mainnet',
			description: 'The Avalanche network to connect to',
			required: true,
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Private key for signing transactions (optional, only required for operations that create transactions)',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'Username for keystore operations (optional)',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Password for keystore operations (optional)',
		},
	];
}