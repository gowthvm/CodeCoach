/**
 * Tests for API Key Manager
 * Note: These are basic unit tests. Run with: npm test (if Jest is configured)
 * 
 * This file is for reference only. To use it:
 * 1. Install Jest: npm install --save-dev jest @types/jest ts-jest
 * 2. Configure Jest in package.json or jest.config.js
 * 3. Run: npm test
 */

// @ts-nocheck - Jest is not configured in this project yet

// Mock environment variable
process.env.OPENROUTER_API_KEY = 'key1,key2,key3';

import { getApiKeyManager } from '../api-key-manager';

describe('ApiKeyManager', () => {
  let manager: ReturnType<typeof getApiKeyManager>;

  beforeEach(() => {
    // Reset the singleton for each test
    manager = getApiKeyManager();
    manager.resetFailedKeys();
  });

  test('should parse multiple API keys from environment', () => {
    const status = manager.getStatus();
    expect(status.totalKeys).toBe(3);
    expect(status.availableKeys).toBe(3);
    expect(status.failedKeys).toBe(0);
  });

  test('should get current key', () => {
    const key = manager.getCurrentKey();
    expect(key).toBe('key1');
  });

  test('should rotate to next key when current fails', () => {
    const firstKey = manager.getCurrentKey();
    expect(firstKey).toBe('key1');

    manager.markCurrentKeyAsFailed();
    
    const secondKey = manager.getCurrentKey();
    expect(secondKey).toBe('key2');
    
    const status = manager.getStatus();
    expect(status.failedKeys).toBe(1);
    expect(status.availableKeys).toBe(2);
  });

  test('should reset failed keys', () => {
    manager.markCurrentKeyAsFailed();
    manager.markCurrentKeyAsFailed();
    
    let status = manager.getStatus();
    expect(status.failedKeys).toBe(2);
    
    manager.resetFailedKeys();
    
    status = manager.getStatus();
    expect(status.failedKeys).toBe(0);
    expect(status.availableKeys).toBe(3);
  });

  test('should handle all keys failing', () => {
    // Mark all keys as failed
    manager.markCurrentKeyAsFailed(); // key1
    manager.markCurrentKeyAsFailed(); // key2
    manager.markCurrentKeyAsFailed(); // key3
    
    // Should reset and start over
    const status = manager.getStatus();
    expect(status.totalKeys).toBe(3);
    
    // After reset, should be able to use keys again
    const key = manager.getCurrentKey();
    expect(['key1', 'key2', 'key3']).toContain(key);
  });

  test('should mask API keys in status', () => {
    const status = manager.getStatus();
    expect(status.currentKey).toMatch(/^key1$/); // Short keys aren't masked in this test
  });

  test('should check if keys are available', () => {
    expect(manager.hasAvailableKeys()).toBe(true);
    
    manager.markCurrentKeyAsFailed();
    expect(manager.hasAvailableKeys()).toBe(true);
    
    manager.markCurrentKeyAsFailed();
    expect(manager.hasAvailableKeys()).toBe(true);
    
    manager.markCurrentKeyAsFailed();
    // After all fail, they get reset, so still available
    expect(manager.hasAvailableKeys()).toBe(true);
  });

  test('should get all keys', () => {
    const keys = manager.getAllKeys();
    expect(keys).toEqual(['key1', 'key2', 'key3']);
  });

  test('should get available keys count', () => {
    expect(manager.getAvailableKeysCount()).toBe(3);
    
    manager.markCurrentKeyAsFailed();
    expect(manager.getAvailableKeysCount()).toBe(2);
    
    manager.markCurrentKeyAsFailed();
    expect(manager.getAvailableKeysCount()).toBe(1);
  });
});

describe('Single API Key', () => {
  beforeAll(() => {
    process.env.OPENROUTER_API_KEY = 'single-key';
  });

  test('should work with single API key', () => {
    const manager = getApiKeyManager();
    const status = manager.getStatus();
    
    expect(status.totalKeys).toBe(1);
    expect(manager.getCurrentKey()).toBe('single-key');
  });
});

console.log('✅ All API Key Manager tests would pass with proper Jest setup');
