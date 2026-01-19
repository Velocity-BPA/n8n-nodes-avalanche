/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers } from 'ethers';

describe('Avalanche Node Unit Tests', () => {
  describe('Address Validation', () => {
    it('should validate correct Ethereum addresses', () => {
      const validAddress = '0x742D35cc6634c0532925A3B844BC9e7595f9eb3D';
      expect(ethers.isAddress(validAddress)).toBe(true);
    });

    it('should reject invalid Ethereum addresses', () => {
      const invalidAddress = '0xinvalid';
      expect(ethers.isAddress(invalidAddress)).toBe(false);
    });

    it('should convert to checksum address', () => {
      const address = '0x742d35cc6634c0532925a3b844bc9e7595f9eb3d';
      const checksummed = ethers.getAddress(address);
      expect(checksummed).toBe('0x742D35cc6634c0532925A3B844BC9e7595f9eb3D');
    });
  });

  describe('Unit Conversion', () => {
    it('should convert AVAX to Wei', () => {
      const avax = '1.5';
      const wei = ethers.parseEther(avax);
      expect(wei.toString()).toBe('1500000000000000000');
    });

    it('should convert Wei to AVAX', () => {
      const wei = BigInt('1500000000000000000');
      const avax = ethers.formatEther(wei);
      expect(avax).toBe('1.5');
    });

    it('should convert Gwei to Wei', () => {
      const gwei = '25';
      const wei = ethers.parseUnits(gwei, 'gwei');
      expect(wei.toString()).toBe('25000000000');
    });

    it('should convert Wei to Gwei', () => {
      const wei = BigInt('25000000000');
      const gwei = ethers.formatUnits(wei, 'gwei');
      expect(gwei).toBe('25.0');
    });
  });

  describe('RPC URL Generation', () => {
    const getRpcUrl = (credentials: Record<string, string>): string => {
      const network = credentials.network;
      const rpcProvider = credentials.rpcProvider;

      if (network === 'custom') {
        return credentials.customNetworkUrl;
      }

      const isMainnet = network === 'mainnet';
      const baseMainnet = 'https://api.avax.network';
      const baseFuji = 'https://api.avax-test.network';
      const baseUrl = isMainnet ? baseMainnet : baseFuji;

      switch (rpcProvider) {
        case 'public':
          return `${baseUrl}/ext/bc/C/rpc`;
        case 'infura':
          return isMainnet
            ? `https://avalanche-mainnet.infura.io/v3/${credentials.infuraProjectId}`
            : `https://avalanche-fuji.infura.io/v3/${credentials.infuraProjectId}`;
        case 'alchemy':
          return isMainnet
            ? `https://avax-mainnet.g.alchemy.com/v2/${credentials.alchemyApiKey}`
            : `https://avax-fuji.g.alchemy.com/v2/${credentials.alchemyApiKey}`;
        default:
          return `${baseUrl}/ext/bc/C/rpc`;
      }
    };

    it('should generate mainnet public RPC URL', () => {
      const credentials = { network: 'mainnet', rpcProvider: 'public' };
      const url = getRpcUrl(credentials);
      expect(url).toBe('https://api.avax.network/ext/bc/C/rpc');
    });

    it('should generate fuji public RPC URL', () => {
      const credentials = { network: 'fuji', rpcProvider: 'public' };
      const url = getRpcUrl(credentials);
      expect(url).toBe('https://api.avax-test.network/ext/bc/C/rpc');
    });

    it('should generate Infura mainnet RPC URL', () => {
      const credentials = {
        network: 'mainnet',
        rpcProvider: 'infura',
        infuraProjectId: 'test-project-id',
      };
      const url = getRpcUrl(credentials);
      expect(url).toBe('https://avalanche-mainnet.infura.io/v3/test-project-id');
    });

    it('should generate Alchemy fuji RPC URL', () => {
      const credentials = {
        network: 'fuji',
        rpcProvider: 'alchemy',
        alchemyApiKey: 'test-api-key',
      };
      const url = getRpcUrl(credentials);
      expect(url).toBe('https://avax-fuji.g.alchemy.com/v2/test-api-key');
    });

    it('should use custom URL when network is custom', () => {
      const credentials = {
        network: 'custom',
        customNetworkUrl: 'https://custom-rpc.example.com',
      };
      const url = getRpcUrl(credentials);
      expect(url).toBe('https://custom-rpc.example.com');
    });
  });

  describe('ERC20 ABI', () => {
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

    it('should create interface from ABI', () => {
      const iface = new ethers.Interface(ERC20_ABI);
      expect(iface).toBeDefined();
    });

    it('should encode balanceOf function call', () => {
      const iface = new ethers.Interface(ERC20_ABI);
      const address = '0x742D35cc6634c0532925A3B844BC9e7595f9eb3D';
      const encoded = iface.encodeFunctionData('balanceOf', [address]);
      expect(encoded).toMatch(/^0x70a08231/);
    });
  });

  describe('Event Signature Hashing', () => {
    it('should hash Transfer event signature', () => {
      const transferSignature = 'Transfer(address,address,uint256)';
      const hash = ethers.id(transferSignature);
      expect(hash).toBe('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef');
    });

    it('should hash Approval event signature', () => {
      const approvalSignature = 'Approval(address,address,uint256)';
      const hash = ethers.id(approvalSignature);
      expect(hash).toBe('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925');
    });
  });

  describe('BigInt Operations', () => {
    it('should compare BigInt values correctly', () => {
      const threshold = ethers.parseEther('10000');
      const largeAmount = ethers.parseEther('15000');
      const smallAmount = ethers.parseEther('5000');

      expect(largeAmount >= threshold).toBe(true);
      expect(smallAmount >= threshold).toBe(false);
    });

    it('should calculate balance change correctly', () => {
      const previous = ethers.parseEther('100');
      const current = ethers.parseEther('150');
      const change = current - previous;

      expect(ethers.formatEther(change)).toBe('50.0');
    });
  });
});
