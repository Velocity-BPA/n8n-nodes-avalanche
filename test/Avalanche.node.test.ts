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
describe('CChainOperations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        network: 'mainnet',
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
    it('should get account balance successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x1b1ae4d6e2ef500000'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBalance';
          case 'address': return '0x742d35Cc6634C0532925a3b8D4C13b0F6eBfDc52';
          case 'blockTag': return 'latest';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeCChainOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.balance).toBe('0x1b1ae4d6e2ef500000');
      expect(result[0].json.address).toBe('0x742d35Cc6634C0532925a3b8D4C13b0F6eBfDc52');
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32602, message: 'Invalid params' }
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBalance';
          case 'address': return 'invalid-address';
          case 'blockTag': return 'latest';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      const items = [{ json: {} }];
      
      await expect(
        executeCChainOperationsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow();
    });
  });

  describe('sendRawTransaction operation', () => {
    it('should send raw transaction successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x1234567890abcdef'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'sendRawTransaction';
          case 'signedTransactionData': return '0xf86c098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a028ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa636276a067cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d83';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeCChainOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.transactionHash).toBe('0x1234567890abcdef');
    });
  });

  describe('getTransactionByHash operation', () => {
    it('should get transaction by hash successfully', async () => {
      const mockTransaction = {
        blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
        blockNumber: '0x5daf3b',
        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
        gas: '0xc350',
        gasPrice: '0x4a817c800',
        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
        input: '0x68656c6c6f21',
        nonce: '0x15',
        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
        transactionIndex: '0x41',
        value: '0xf3dbb76162000',
        v: '0x25',
        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c'
      };

      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: mockTransaction
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getTransactionByHash';
          case 'transactionHash': return '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeCChainOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.hash).toBe('0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b');
      expect(result[0].json.from).toBe('0xa7d9ddbe1f17865597fbd27ec712455208b6b76d');
    });
  });

  describe('callContract operation', () => {
    it('should execute contract call successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x0000000000000000000000000000000000000000000000000000000000000020'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'callContract';
          case 'toAddress': return '0x742d35Cc6634C0532925a3b8D4C13b0F6eBfDc52';
          case 'data': return '0x70a08231000000000000000000000000742d35cc6634c0532925a3b8d4c13b0f6ebfdc52';
          case 'value': return '0x0';
          case 'callBlockTag': return 'latest';
          case 'fromAddress': return '';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeCChainOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('0x0000000000000000000000000000000000000000000000000000000000000020');
      expect(result[0].json.transaction.to).toBe('0x742d35Cc6634C0532925a3b8D4C13b0F6eBfDc52');
    });
  });

  describe('estimateGas operation', () => {
    it('should estimate gas successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x5208'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'estimateGas';
          case 'toAddress': return '0x742d35Cc6634C0532925a3b8D4C13b0F6eBfDc52';
          case 'data': return '';
          case 'value': return '0x0';
          case 'fromAddress': return '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d';
          case 'gas': return '';
          case 'gasPrice': return '';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeCChainOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.gasEstimate).toBe('0x5208');
      expect(result[0].json.transaction.to).toBe('0x742d35Cc6634C0532925a3b8D4C13b0F6eBfDc52');
    });
  });

  describe('getBlockByNumber operation', () => {
    it('should get block by number successfully', async () => {
      const mockBlock = {
        difficulty: '0x4ea3f27bc',
        extraData: '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
        gasLimit: '0x1388',
        gasUsed: '0x0',
        hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
        logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
        mixHash: '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
        nonce: '0x689056015818adbe',
        number: '0x1b4',
        parentHash: '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
        receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        sha3Uncles: '0x1dcc4

describe('XChainAssets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        network: 'testnet',
        apiKey: 'test-api-key',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  test('should get balance successfully', async () => {
    const mockResponse = {
      result: {
        balance: '1000000000',
        utxoIDs: [
          {
            txID: 'test-tx-id',
            outputIndex: 0,
          },
        ],
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getBalance';
        case 'address': return 'X-avax1test...';
        case 'assetID': return 'AVAX';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeXChainAssetsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should send assets successfully', async () => {
    const mockResponse = {
      result: {
        txID: 'test-tx-id-123',
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'send';
        case 'to': return 'X-avax1recipient...';
        case 'amount': return 1000000;
        case 'assetID': return 'AVAX';
        case 'from': return 'X-avax1sender...';
        case 'changeAddr': return '';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeXChainAssetsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should create asset successfully', async () => {
    const mockResponse = {
      result: {
        assetID: 'new-asset-id',
        changeAddr: 'X-avax1change...',
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'createAsset';
        case 'name': return 'Test Token';
        case 'symbol': return 'TEST';
        case 'denomination': return 8;
        case 'initialHolders': return '[{"address": "X-avax1holder...", "amount": "1000"}]';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeXChainAssetsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should handle API errors', async () => {
    const mockError = new Error('API request failed');

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getBalance';
        case 'address': return 'invalid-address';
        case 'assetID': return 'AVAX';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(
      executeXChainAssetsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow();
  });

  test('should continue on fail when enabled', async () => {
    const mockError = new Error('API request failed');

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getBalance';
        case 'address': return 'invalid-address';
        case 'assetID': return 'AVAX';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const result = await executeXChainAssetsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API request failed');
  });
});

describe('PChainStaking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  describe('getValidators', () => {
    it('should get validators successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          validators: [
            {
              txID: 'test-tx-id',
              startTime: '1234567890',
              endTime: '1234567900',
              stakeAmount: '2000000000000',
              nodeID: 'test-node-id',
            },
          ],
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidators';
          case 'subnetID': return 'test-subnet-id';
          case 'nodeIDs': return 'node1,node2';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePChainStakingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse.result);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.avax.network/ext/P',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          jsonrpc: '2.0',
          method: 'platform.getValidators',
          params: {
            subnetID: 'test-subnet-id',
            nodeIDs: ['node1', 'node2'],
          },
          id: 1,
        },
      });
    });
  });

  describe('addValidator', () => {
    it('should add validator successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          txID: 'test-tx-id',
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'addValidator';
          case 'nodeID': return 'test-node-id';
          case 'startTime': return 1234567890;
          case 'endTime': return 1234567900;
          case 'stakeAmount': return '2000000000000';
          case 'rewardAddress': return 'test-reward-address';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePChainStakingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse.result);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.avax.network/ext/P',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          jsonrpc: '2.0',
          method: 'platform.addValidator',
          params: {
            nodeID: 'test-node-id',
            startTime: 1234567890,
            endTime: 1234567900,
            stakeAmount: '2000000000000',
            rewardAddress: 'test-reward-address',
          },
          id: 1,
        },
      });
    });
  });

  describe('getStake', () => {
    it('should get stake successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          staked: '1000000000000',
          stakedOutputs: [],
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getStake';
          case 'addresses': return 'addr1,addr2';
          case 'validatorsOnly': return true;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePChainStakingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse.result);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.avax.network/ext/P',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          jsonrpc: '2.0',
          method: 'platform.getStake',
          params: {
            addresses: ['addr1', 'addr2'],
            validatorsOnly: true,
          },
          id: 1,
        },
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const mockError = {
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Invalid node ID',
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidators';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockError);

      const items = [{ json: {} }];
      
      await expect(
        executePChainStakingOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow();
    });

    it('should handle network errors gracefully with continueOnFail', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidators';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executePChainStakingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'Network error' });
    });
  });
});

describe('CrossChainTransfers Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.avax-test.network',
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

  test('should export AVAX from X-Chain successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        txID: 'test-transaction-id',
        changeAddr: 'X-test-change-address',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'exportFromXChain';
        case 'to': return 'P-test-address';
        case 'amount': return '1000000000';
        case 'destinationChain': return 'P';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeCrossChainTransfersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.avax-test.network/ext/bc/X',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        jsonrpc: '2.0',
        method: 'avm.exportAVAX',
        params: {
          to: 'P-test-address',
          amount: '1000000000',
          destinationChain: 'P',
        },
        id: 1,
      },
      json: true,
    });
  });

  test('should export AVAX from C-Chain successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        txID: 'test-transaction-id',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'exportFromCChain';
        case 'to': return 'X-test-address';
        case 'amount': return '500000000';
        case 'destinationChain': return 'X';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeCrossChainTransfersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        jsonrpc: '2.0',
        method: 'avax.export',
        params: {
          to: 'X-test-address',
          amount: '500000000',
          destinationChain: 'X',
        },
        id: 1,
      },
      json: true,
    });
  });

  test('should import AVAX to P-Chain successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        txID: 'test-import-transaction-id',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'importToPChain';
        case 'to': return 'P-test-import-address';
        case 'sourceChain': return 'X';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeCrossChainTransfersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.avax-test.network/ext/P',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        jsonrpc: '2.0',
        method: 'platform.importAVAX',
        params: {
          to: 'P-test-import-address',
          sourceChain: 'X',
        },
        id: 1,
      },
      json: true,
    });
  });

  test('should handle API error response', async () => {
    const mockErrorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32602,
        message: 'Invalid parameters',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'exportFromXChain';
        case 'to': return 'invalid-address';
        case 'amount': return 'invalid-amount';
        case 'destinationChain': return 'P';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    const items = [{ json: {} }];

    await expect(
      executeCrossChainTransfersOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow();
  });

  test('should handle unknown operation error', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'unknownOperation';
      return undefined;
    });

    const items = [{ json: {} }];

    await expect(
      executeCrossChainTransfersOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'unknownOperation';
      return undefined;
    });

    const items = [{ json: {} }];
    const result = await executeCrossChainTransfersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveProperty('error');
    expect(result[0].json.error).toContain('Unknown operation');
  });
});

describe('NodeInfo Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  it('should get node version successfully', async () => {
    const mockResponse = {
      result: {
        version: 'avalanche/1.10.0',
        databaseVersion: '1.4.5',
        gitCommit: 'abc123',
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNodeVersion')
      .mockReturnValueOnce('getNodeVersion');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeNodeInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([
      {
        json: mockResponse.result,
        pairedItem: { item: 0 },
      },
    ]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.avax.network/ext/info',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        jsonrpc: '2.0',
        method: 'info.getNodeVersion',
        params: {},
        id: 1,
      },
    });
  });

  it('should get blockchain ID successfully', async () => {
    const mockResponse = {
      result: {
        blockchainID: '2oYMqpcFgW77WryAmhGZhXS5qLKUTbB9Tc6qxKiDqGVRvBkvKn',
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockchainID')
      .mockReturnValueOnce('X');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeNodeInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([
      {
        json: mockResponse.result,
        pairedItem: { item: 0 },
      },
    ]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.avax.network/ext/info',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        jsonrpc: '2.0',
        method: 'info.getBlockchainID',
        params: {
          alias: 'X',
        },
        id: 1,
      },
    });
  });

  it('should check bootstrap status successfully', async () => {
    const mockResponse = {
      result: {
        isBootstrapped: true,
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('isBootstrapped')
      .mockReturnValueOnce('X');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeNodeInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([
      {
        json: mockResponse.result,
        pairedItem: { item: 0 },
      },
    ]);
  });

  it('should handle API errors properly', async () => {
    const mockError = new Error('API Error');
    mockError.response = {
      body: {
        error: {
          code: -32601,
          message: 'Method not found',
        },
      },
    };

    mockExecuteFunctions.getNodeParameter.mockReturnValue('getNodeVersion');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const items = [{ json: {} }];

    await expect(
      executeNodeInfoOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow();
  });

  it('should continue on fail when configured', async () => {
    const mockError = new Error('Network error');
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getNodeVersion');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeNodeInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([
      {
        json: { error: 'Network error' },
        pairedItem: { item: 0 },
      },
    ]);
  });
});

describe('HealthMonitoring Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  describe('getLiveness', () => {
    it('should get node liveness status successfully', async () => {
      const mockResponse = {
        checks: {
          network: {
            message: {
              consensus: 'running'
            },
            timestamp: '2023-01-01T00:00:00Z',
            duration: 1000000
          }
        },
        healthy: true
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getLiveness';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeHealthMonitoringOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.avax.network/ext/health',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getLiveness errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getLiveness';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeHealthMonitoringOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'Network error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getReadiness', () => {
    it('should get node readiness status successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          healthy: true,
          checks: {}
        },
        id: 1
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getReadiness';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeHealthMonitoringOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.avax.network/ext/health',
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
      });
    });
  });

  describe('getHealth', () => {
    it('should get overall health status with tags', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          healthy: true,
          checks: {
            network: { healthy: true }
          }
        },
        id: 1
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getHealth';
        if (paramName === 'tags') return 'network,bootstrap';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeHealthMonitoringOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.avax.network/ext/health',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          jsonrpc: '2.0',
          method: 'health.health',
          params: {
            tags: ['network', 'bootstrap']
          },
          id: 1,
        },
        json: true,
      });
    });
  });

  describe('issueAvmTx', () => {
    it('should issue AVM transaction successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          txID: '2QouvFWUbjuySRxeX5xMbNCuAaKWfbk5FeEa2JmoF85RKLk2dD'
        },
        id: 1
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'issueAvmTx';
        if (paramName === 'tx') return '0x1234567890abcdef';
        if (paramName === 'encoding') return 'hex';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeHealthMonitoringOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.avax.network/ext/bc/X',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          jsonrpc: '2.0',
          method: 'avm.issueTx',
          params: {
            tx: '0x1234567890abcdef',
            encoding: 'hex',
          },
          id: 1,
        },
        json: true,
      });
    });
  });

  describe('getLatestBlockNumber', () => {
    it('should get latest block number successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: '0x1b4',
        id: 1
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getLatestBlockNumber';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeHealthMonitoringOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.avax.network/ext/bc/C/rpc',
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
      });
    });
  });
});
});
