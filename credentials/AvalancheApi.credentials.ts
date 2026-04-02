import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class AvalancheApi implements ICredentialType {
	name = 'avalancheApi';
	displayName = 'Avalanche API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.avax.network',
			description: 'Base URL for the Avalanche API endpoint',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API Key for authenticated requests (if required by provider)',
		},
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'None (Public RPC)',
					value: 'none',
				},
				{
					name: 'API Key Header',
					value: 'apiKey',
				},
			],
			default: 'none',
			description: 'Method to use for authentication',
		},
	];
}