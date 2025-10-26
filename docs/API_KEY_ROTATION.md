# API Key Rotation Feature

## Overview

CodeCoach now supports **automatic API key rotation** for OpenRouter API calls. This feature provides resilience and high availability by automatically switching to backup API keys when one fails.

## How It Works

### Key Features

1. **Multiple API Keys**: Support for multiple OpenRouter API keys
2. **Automatic Rotation**: Automatically switches to the next key on failure
3. **Failure Detection**: Detects authentication errors (401, 403) and rate limits (429)
4. **Smart Recovery**: Resets failed keys after all keys have been tried
5. **Logging**: Detailed logging of key rotation events (keys are masked for security)

### Failure Scenarios Handled

- **401/403 Errors**: Authentication failures (invalid or expired keys)
- **429 Errors**: Rate limiting
- **Network Errors**: Connection timeouts or network issues
- **API Errors**: Other OpenRouter API errors

## Configuration

### Environment Variable Setup

You can provide multiple API keys in your `.env.local` file using comma separation:

```env
# Single API key (existing format - still supported)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# Multiple API keys (new format - recommended)
OPENROUTER_API_KEY=sk-or-v1-key1,sk-or-v1-key2,sk-or-v1-key3
```

### Example Configurations

**Development (Single Key)**:
```env
OPENROUTER_API_KEY=sk-or-v1-dev-key
```

**Production (Multiple Keys for High Availability)**:
```env
OPENROUTER_API_KEY=sk-or-v1-primary,sk-or-v1-backup1,sk-or-v1-backup2
```

## Usage

The API key rotation is **completely transparent** to your application code. All API routes automatically use the rotation system.

### Automatic Usage

No code changes needed! The system automatically:

1. Starts with the first API key
2. Makes the API request
3. If it fails (401, 403, 429), rotates to the next key
4. Retries the request with the new key
5. Continues until success or all keys are exhausted

### Manual Control (Advanced)

If you need manual control over the API key manager:

```typescript
import { getApiKeyManager } from '@/lib/api-key-manager';

const manager = getApiKeyManager();

// Get current status
const status = manager.getStatus();
console.log(status);
// Output: {
//   totalKeys: 3,
//   availableKeys: 2,
//   failedKeys: 1,
//   currentKey: 'sk-o...key1'
// }

// Reset failed keys (useful for periodic retry)
manager.resetFailedKeys();

// Check if keys are available
if (manager.hasAvailableKeys()) {
  // Make API call
}
```

## Implementation Details

### API Key Manager (`lib/api-key-manager.ts`)

The `ApiKeyManager` class handles:

- **Key Storage**: Stores all API keys from environment variable
- **Rotation Logic**: Implements round-robin rotation with failure tracking
- **Key Masking**: Masks keys in logs for security (shows only first/last 4 chars)
- **Status Tracking**: Tracks which keys have failed

### Fetch Wrapper (`fetchWithKeyRotation`)

The `fetchWithKeyRotation` function:

- Wraps the native `fetch` API
- Automatically adds the current API key to Authorization header
- Detects failures and triggers rotation
- Retries with new keys automatically
- Returns the successful response or throws after all retries

### Integration Points

The rotation system is integrated into:

1. **`/api/analyze`**: Code analysis endpoint
2. **`/api/convert`**: Code conversion endpoint

All OpenRouter API calls in these routes use `fetchWithKeyRotation` instead of direct `fetch`.

## Benefits

### High Availability
- **No Single Point of Failure**: If one key fails, others take over
- **Automatic Recovery**: System continues working without manual intervention
- **Zero Downtime**: Seamless failover between keys

### Rate Limit Management
- **Distribute Load**: Spread requests across multiple keys
- **Avoid Throttling**: Automatically switch when rate limits are hit
- **Extended Capacity**: Multiply your effective rate limit

### Development & Testing
- **Separate Keys**: Use different keys for dev, staging, and production
- **Easy Rotation**: Rotate keys without downtime
- **Fallback Options**: Always have backup keys ready

## Monitoring

### Console Logs

The system logs important events:

```
API key sk-o...key1 marked as failed
Rotated to API key: sk-o...key2
All API keys have failed. Resetting failed keys list and retrying...
Reset all failed API keys
```

### Status Checking

Check the status programmatically:

```typescript
const manager = getApiKeyManager();
const status = manager.getStatus();

if (status.failedKeys > 0) {
  console.warn(`${status.failedKeys} API keys have failed`);
}

if (status.availableKeys === 0) {
  console.error('No available API keys!');
  // Send alert, notification, etc.
}
```

## Best Practices

### 1. Use Multiple Keys in Production
Always configure at least 2-3 API keys for production environments.

### 2. Monitor Key Health
Regularly check which keys are failing and investigate why.

### 3. Rotate Keys Periodically
For security, rotate your API keys every few months.

### 4. Keep Keys Secure
Never commit `.env.local` to version control. Use environment variables in deployment.

### 5. Test Failover
Periodically test that failover works by temporarily invalidating a key.

## Troubleshooting

### All Keys Failing

If all keys fail:

1. **Check Key Validity**: Ensure all keys are valid and not expired
2. **Check Rate Limits**: You may have hit rate limits on all keys
3. **Check Network**: Verify network connectivity to OpenRouter
4. **Check Logs**: Review console logs for specific error messages

### Keys Not Rotating

If rotation isn't working:

1. **Check Format**: Ensure keys are comma-separated with no spaces
2. **Check Environment**: Verify `.env.local` is loaded correctly
3. **Restart Server**: Restart the development server to reload env vars

### Performance Issues

If you notice slowdowns:

1. **Reduce Retries**: The default max retries equals the number of keys
2. **Check Key Quality**: Some keys may be slower than others
3. **Monitor Logs**: Look for excessive rotation events

## Security Considerations

### Key Masking
All API keys are masked in logs, showing only the first and last 4 characters:
```
sk-or...key1
```

### Environment Variables
Keys are stored in environment variables, never in code or version control.

### No Client Exposure
API keys are only used server-side in API routes, never exposed to the client.

## Future Enhancements

Potential improvements for the rotation system:

- **Health Checks**: Periodic health checks for all keys
- **Metrics Dashboard**: Visual dashboard showing key health and usage
- **Smart Rotation**: Prefer faster/more reliable keys
- **Rate Limit Awareness**: Track and respect rate limits per key
- **Key Prioritization**: Set priority levels for different keys
- **Webhook Alerts**: Send alerts when keys fail

## Support

For issues or questions about API key rotation:

1. Check the logs for error messages
2. Verify your `.env.local` configuration
3. Review this documentation
4. Check OpenRouter dashboard for key status

---

**Last Updated**: October 26, 2025
