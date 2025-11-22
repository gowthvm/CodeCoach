/**
 * API Key Manager with rotation and fallback support
 * Handles multiple OpenRouter API keys with automatic rotation on failure
 */

interface ApiKeyConfig {
  keys: string[];
  currentIndex: number;
  failedKeys: Set<string>;
}

class ApiKeyManager {
  private config: ApiKeyConfig;

  constructor() {
    // Parse API keys from environment variable
    // Format: KEY1,KEY2,KEY3 or just a single key
    const apiKeyEnv = process.env.OPENROUTER_API_KEY || '';
    const keys = apiKeyEnv.split(',').map(key => key.trim()).filter(key => key.length > 0);

    if (keys.length === 0) {
      console.warn('⚠️ Warning: No OPENROUTER_API_KEY environment variable found. API calls will fail.');
    }

    this.config = {
      keys: keys.length > 0 ? keys : [],
      currentIndex: 0,
      failedKeys: new Set(),
    };
  }

  /**
   * Get the current API key
   */
  getCurrentKey(): string {
    if (this.config.keys.length === 0) {
      throw new Error('No API keys configured');
    }
    return this.config.keys[this.config.currentIndex];
  }

  /**
   * Get all available API keys
   */
  getAllKeys(): string[] {
    return [...this.config.keys];
  }

  /**
   * Mark current key as failed and rotate to next available key
   */
  markCurrentKeyAsFailed(): void {
    const currentKey = this.getCurrentKey();
    this.config.failedKeys.add(currentKey);
    console.warn(`API key ${this.maskKey(currentKey)} marked as failed`);
    this.rotateToNextKey();
  }

  /**
   * Rotate to the next available key
   */
  private rotateToNextKey(): void {
    const totalKeys = this.config.keys.length;
    let attempts = 0;

    // Try to find a non-failed key
    while (attempts < totalKeys) {
      this.config.currentIndex = (this.config.currentIndex + 1) % totalKeys;
      const nextKey = this.getCurrentKey();

      if (!this.config.failedKeys.has(nextKey)) {
        console.log(`Rotated to API key: ${this.maskKey(nextKey)}`);
        return;
      }

      attempts++;
    }

    // All keys have failed, reset failed keys and try again
    console.warn('All API keys have failed. Resetting failed keys list and retrying...');
    this.config.failedKeys.clear();
  }

  /**
   * Reset all failed keys (useful for periodic retry)
   */
  resetFailedKeys(): void {
    this.config.failedKeys.clear();
    console.log('Reset all failed API keys');
  }

  /**
   * Get number of available (non-failed) keys
   */
  getAvailableKeysCount(): number {
    return this.config.keys.length - this.config.failedKeys.size;
  }

  /**
   * Check if there are any available keys
   */
  hasAvailableKeys(): boolean {
    return this.getAvailableKeysCount() > 0;
  }

  /**
   * Mask API key for logging (show only first and last 4 characters)
   */
  private maskKey(key: string): string {
    if (!key) return 'undefined';
    if (key.length <= 8) return '****';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  }

  /**
   * Get status information
   */
  getStatus(): {
    totalKeys: number;
    availableKeys: number;
    failedKeys: number;
    currentKey: string;
  } {
    return {
      totalKeys: this.config.keys.length,
      availableKeys: this.getAvailableKeysCount(),
      failedKeys: this.config.failedKeys.size,
      currentKey: this.maskKey(this.config.keys[this.config.currentIndex]),
    };
  }
}

// Singleton instance
let apiKeyManager: ApiKeyManager | null = null;

export function getApiKeyManager(): ApiKeyManager {
  if (!apiKeyManager) {
    apiKeyManager = new ApiKeyManager();
  }
  return apiKeyManager;
}

/**
 * Make a fetch request with automatic API key rotation on failure
 */
export async function fetchWithKeyRotation(
  url: string,
  options: RequestInit & { maxRetries?: number } = {}
): Promise<Response> {
  const manager = getApiKeyManager();
  const maxRetries = options.maxRetries || Math.max(1, manager.getAllKeys().length);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const apiKey = manager.getCurrentKey();

      // Add authorization header with current API key
      const headers = {
        ...options.headers,
        'Authorization': `Bearer ${apiKey}`,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Check for API key specific errors
      if (response.status === 401 || response.status === 403) {
        console.warn(`API key authentication failed (${response.status}). Rotating to next key...`);
        manager.markCurrentKeyAsFailed();

        // If we still have available keys AND we have retries left, continue
        if (manager.hasAvailableKeys() && attempt < maxRetries - 1) {
          continue;
        } else {
          throw new Error('All API keys have failed authentication');
        }
      }

      // Check for rate limiting
      if (response.status === 429) {
        console.warn('Rate limit hit. Rotating to next key...');
        manager.markCurrentKeyAsFailed();

        // If we still have available keys AND we have retries left, continue
        if (manager.hasAvailableKeys() && attempt < maxRetries - 1) {
          continue;
        } else {
          throw new Error('All API keys have hit rate limits');
        }
      }

      // If response is ok or a different error, return it
      return response;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Attempt ${attempt + 1} failed:`, lastError.message);

      // On network errors, try next key
      if (attempt < maxRetries - 1) {
        manager.markCurrentKeyAsFailed();
        if (!manager.hasAvailableKeys()) {
          break;
        }
      }
    }
  }

  // All retries exhausted
  throw lastError || new Error('All API key attempts failed');
}

export default getApiKeyManager;
