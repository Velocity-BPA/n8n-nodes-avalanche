/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Avalanche } from '../nodes/Avalanche/Avalanche.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Avalanche Node', () => {
  let node: Avalanche;

  beforeAll(() => {
    node = new Avalanche();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Avalanche');
      expect(node.description.name).toBe('avalanche');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('CChain Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.avax.network' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });
  
  it('should get balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('0x1234567890abcdef')
      .mockReturnValueOnce('latest')
      .mockReturnValueOnce('');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x1bc16d674ec80000',
    });
    
    const result = await executeCChainOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x1bc16d674ec80000');
  });
  
  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBalance');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    
    const result = await executeCChainOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
  
  it('should get transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('0xabcdef1234567890');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: { hash: '0xabcdef1234567890', blockNumber: '0x1b4' },
    });
    
    const result = await executeCChainOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result.hash).toBe('0xabcdef1234567890');
  });
  
  it('should send transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('sendTransaction')
      .mockReturnValueOnce('0xf86c808504a817c800825208941234567890abcdef');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0xabcdef1234567890',
    });
    
    const result = await executeCChainOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0xabcdef1234567890');
  });
});

describe('XChain Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.avax.network' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('getBalance operation should execute successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('X-avax1test')
      .mockReturnValueOnce('AVAX');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      result: { balance: '1000000000' },
      id: 1
    });

    const result = await executeXChainOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result.balance).toBe('1000000000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.avax.network/ext/bc/X'
      })
    );
  });

  test('getTx operation should execute successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTx')
      .mockReturnValueOnce('txid123')
      .mockReturnValueOnce('json');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      result: { tx: { id: 'txid123' } },
      id: 1
    });

    const result = await executeXChainOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result.tx.id).toBe('txid123');
  });

  test('error handling should work correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBalance');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeXChainOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('PChain Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.avax.network',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getBalance operation', () => {
    it('should get balance successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('P-avax1test');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        result: { balance: '1000000000' },
        id: 1,
      });

      const result = await executePChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.balance).toBe('1000000000');
    });

    it('should handle getBalance error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('invalid-address');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid address');
    });
  });

  describe('getCurrentValidators operation', () => {
    it('should get current validators successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCurrentValidators')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        result: { validators: [] },
        id: 1,
      });

      const result = await executePChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.validators).toEqual([]);
    });
  });

  describe('addValidator operation', () => {
    it('should add validator successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('addValidator')
        .mockReturnValueOnce('NodeID-test')
        .mockReturnValueOnce(1640995200)
        .mockReturnValueOnce(1672531200)
        .mockReturnValueOnce('2000000000000');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        result: { txID: 'tx123' },
        id: 1,
      });

      const result = await executePChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.txID).toBe('tx123');
    });
  });
});

describe('Subnet Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.avax.network',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get subnets successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getSubnets';
			if (param === 'ids') return 'subnet1,subnet2';
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			result: {
				subnets: [{ id: 'subnet1' }, { id: 'subnet2' }],
			},
		});

		const items = [{ json: {} }];
		const result = await executeSubnetOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			subnets: [{ id: 'subnet1' }, { id: 'subnet2' }],
		});
	});

	it('should create subnet successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'createSubnet';
			if (param === 'controlKeys') return 'key1,key2';
			if (param === 'threshold') return 2;
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			result: {
				subnetID: 'new-subnet-id',
			},
		});

		const items = [{ json: {} }];
		const result = await executeSubnetOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			subnetID: 'new-subnet-id',
		});
	});

	it('should validate subnet successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'validateSubnet';
			if (param === 'nodeID') return 'node-123';
			if (param === 'subnetID') return 'subnet-456';
			if (param === 'startTime') return '2024-01-01T00:00:00Z';
			if (param === 'endTime') return '2024-12-31T23:59:59Z';
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			result: {
				txID: 'validator-tx-id',
			},
		});

		const items = [{ json: {} }];
		const result = await executeSubnetOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			txID: 'validator-tx-id',
		});
	});

	it('should get blockchains successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getBlockchains';
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			result: {
				blockchains: [{ id: 'blockchain1' }, { id: 'blockchain2' }],
			},
		});

		const items = [{ json: {} }];
		const result = await executeSubnetOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			blockchains: [{ id: 'blockchain1' }, { id: 'blockchain2' }],
		});
	});

	it('should create blockchain successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'createBlockchain';
			if (param === 'subnetID') return 'subnet-123';
			if (param === 'vmID') return 'vm-456';
			if (param === 'name') return 'MyBlockchain';
			if (param === 'genesisData') return '{"test": "data"}';
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			result: {
				blockchainID: 'new-blockchain-id',
			},
		});

		const items = [{ json: {} }];
		const result = await executeSubnetOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			blockchainID: 'new-blockchain-id',
		});
	});

	it('should get network ID successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getNetworkID';
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			result: {
				networkID: 1,
			},
		});

		const items = [{ json: {} }];
		const result = await executeSubnetOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			networkID: 1,
		});
	});

	it('should get network name successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getNetworkName';
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			result: {
				networkName: 'mainnet',
			},
		});

		const items = [{ json: {} }];
		const result = await executeSubnetOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			networkName: 'mainnet',
		});
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getSubnets';
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			error: {
				code: -32000,
				message: 'Invalid subnet ID',
			},
		});

		const items = [{ json: {} }];

		await expect(executeSubnetOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
	});

	it('should handle errors with continueOnFail', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getSubnets';
			return undefined;
		});

		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

		const items = [{ json: {} }];
		const result = await executeSubnetOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('Network error');
	});
});

describe('Asset Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.avax.network' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get asset description successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAssetDescription')
      .mockReturnValueOnce('2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
      JSON.stringify({
        jsonrpc: '2.0',
        result: {
          name: 'Test Asset',
          symbol: 'TEST',
          denomination: 8
        },
        id: 1
      })
    );

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result.name).toBe('Test Asset');
  });

  it('should create asset successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createAsset')
      .mockReturnValueOnce('Test Asset')
      .mockReturnValueOnce('TEST')
      .mockReturnValueOnce(8)
      .mockReturnValueOnce('[]');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
      JSON.stringify({
        jsonrpc: '2.0',
        result: {
          assetID: '2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe'
        },
        id: 1
      })
    );

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result.assetID).toBe('2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe');
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAssetDescription');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAssetDescription');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});

describe('Wallet Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://api.avax.network',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createUser operation', () => {
		it('should create a wallet user successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createUser')
				.mockReturnValueOnce('testuser')
				.mockReturnValueOnce('testpass');

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: { success: true },
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle errors when creating a wallet user', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createUser')
				.mockReturnValueOnce('testuser')
				.mockReturnValueOnce('testpass');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('listUsers operation', () => {
		it('should list wallet users successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listUsers');

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: { users: ['user1', 'user2'] },
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('createXAddress operation', () => {
		it('should create X-Chain address successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createXAddress')
				.mockReturnValueOnce('testuser')
				.mockReturnValueOnce('testpass');

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: { address: 'X-avax1...' },
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('createPAddress operation', () => {
		it('should create P-Chain address successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createPAddress')
				.mockReturnValueOnce('testuser')
				.mockReturnValueOnce('testpass');

			const mockResponse = {
				jsonrpc: '2.0',
				id: 1,
				result: { address: 'P-avax1...' },
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});
});
});
