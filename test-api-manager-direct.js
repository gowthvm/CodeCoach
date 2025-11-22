// Test api-key-manager directly to see logs
require('dotenv').config({ path: '.env.local' });
const { fetchWithKeyRotation, getApiKeyManager } = require('./lib/api-key-manager.ts');

async function testDirect() {
    console.log('--- Testing ApiKeyManager Direct ---\n');

    try {
        const manager = getApiKeyManager();
        console.log('Initial Status:', manager.getStatus());

        console.log('\nMaking request...');
        const response = await fetchWithKeyRotation('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [{ role: 'user', content: 'test' }],
                max_tokens: 5
            })
        });

        console.log('\nResponse Status:', response.status);
        if (response.ok) {
            console.log('✅ Success!');
        } else {
            console.log('❌ Request failed with status:', response.status);
        }

    } catch (error) {
        console.log('\n❌ EXCEPTION CAUGHT:');
        console.log(error.message);
    }
}

testDirect();
