// Test to see if environment variables are being loaded
console.log('Environment Variable Check:\n');
console.log('OPENROUTER_API_KEY present:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_API_KEY length:', process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.length : 0);
console.log('First 20 chars:', process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 20) + '...' : 'N/A');

// Test API key manager
console.log('\n--- Testing API Key Manager ---\n');

const { getApiKeyManager } = require('./lib/api-key-manager.ts');

try {
    const manager = getApiKeyManager();
    const status = manager.getStatus();
    console.log('Manager Status:', status);
} catch (error) {
    console.log('Manager Error:', error.message);
}
