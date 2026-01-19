/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers } from 'ethers';

// Integration tests require network connection
// Skip these in CI environments without network access
const SKIP_NETWORK_TESTS = process.env.SKIP_NETWORK_TESTS === 'true';

describe('Avalanche Integration Tests', () => {
  const FUJI_RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc';
  const MAINNET_RPC_URL = 'https://api.avax.network/ext/bc/C/rpc';

  // Known addresses for testing (don't use for transactions)
  const TEST_ADDRESS = '0x0000000000000000000000000000000000000000';
  const WAVAX_MAINNET = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';

  describe('Fuji Testnet Connection', () => {
    let provider: ethers.JsonRpcProvider;

    beforeAll(() => {
      provider = new ethers.JsonRpcProvider(FUJI_RPC_URL);
    });

    it(
      'should connect to Fuji testnet',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const network = await provider.getNetwork();
        expect(network.chainId.toString()).toBe('43113');
      },
      30000,
    );

    it(
      'should get current block number',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const blockNumber = await provider.getBlockNumber();
        expect(blockNumber).toBeGreaterThan(0);
      },
      30000,
    );

    it(
      'should get gas price',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const feeData = await provider.getFeeData();
        expect(feeData.gasPrice).not.toBeNull();
        if (feeData.gasPrice) {
          expect(feeData.gasPrice > 0n).toBe(true);
        }
      },
      30000,
    );

    it(
      'should get balance for address',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const balance = await provider.getBalance(TEST_ADDRESS);
        expect(balance >= 0n).toBe(true);
      },
      30000,
    );
  });

  describe('Mainnet Connection', () => {
    let provider: ethers.JsonRpcProvider;

    beforeAll(() => {
      provider = new ethers.JsonRpcProvider(MAINNET_RPC_URL);
    });

    it(
      'should connect to Avalanche mainnet',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const network = await provider.getNetwork();
        expect(network.chainId.toString()).toBe('43114');
      },
      30000,
    );

    it(
      'should get latest block',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const block = await provider.getBlock('latest');
        expect(block).not.toBeNull();
        if (block) {
          expect(block.number).toBeGreaterThan(0);
          expect(block.hash).toBeTruthy();
        }
      },
      30000,
    );

    it(
      'should read WAVAX contract info',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const ERC20_ABI = [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function decimals() view returns (uint8)',
        ];

        const wavax = new ethers.Contract(WAVAX_MAINNET, ERC20_ABI, provider);

        const [name, symbol, decimals] = await Promise.all([
          wavax.name(),
          wavax.symbol(),
          wavax.decimals(),
        ]);

        expect(name).toBe('Wrapped AVAX');
        expect(symbol).toBe('WAVAX');
        expect(Number(decimals)).toBe(18);
      },
      30000,
    );
  });

  describe('P-Chain API', () => {
    it(
      'should get current validators',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const response = await fetch('https://api.avax.network/ext/bc/P', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'platform.getCurrentValidators',
            params: { subnetID: '' },
          }),
        });

        const data = (await response.json()) as { result?: { validators?: unknown[] } };
        expect(data.result).toBeDefined();
        expect(data.result?.validators).toBeDefined();
        expect(Array.isArray(data.result?.validators)).toBe(true);
      },
      30000,
    );

    it(
      'should get staking info',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const response = await fetch('https://api.avax.network/ext/bc/P', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'platform.getMinStake',
            params: {},
          }),
        });

        const data = (await response.json()) as { result?: unknown };
        expect(data.result).toBeDefined();
      },
      30000,
    );
  });

  describe('Event Logs', () => {
    let provider: ethers.JsonRpcProvider;

    beforeAll(() => {
      provider = new ethers.JsonRpcProvider(MAINNET_RPC_URL);
    });

    it(
      'should query Transfer events from WAVAX',
      async () => {
        if (SKIP_NETWORK_TESTS) {
          return;
        }

        const latestBlock = await provider.getBlockNumber();
        const transferTopic = ethers.id('Transfer(address,address,uint256)');

        const logs = await provider.getLogs({
          address: WAVAX_MAINNET,
          topics: [transferTopic],
          fromBlock: latestBlock - 10,
          toBlock: latestBlock,
        });

        expect(Array.isArray(logs)).toBe(true);
        // There might not be transfers in the last 10 blocks, so we just check it's an array
      },
      30000,
    );
  });
});
