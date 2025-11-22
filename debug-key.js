// Debug script to check the exact API key value including whitespace
require('dotenv').config({ path: '.env.local' });

const key = process.env.OPENROUTER_API_KEY;

console.log('=== API KEY DEBUG ===\n');
console.log('Key exists:', !!key);
console.log('Key type:', typeof key);
console.log('Key length:', key ? key.length : 0);
console.log('Key (first 30 chars):', key ? key.substring(0, 30) : 'N/A');
console.log('Key has newlines:', key ? (key.includes('\n') || key.includes('\r')) : false);
console.log('Key has spaces:', key ? (key.trim() !== key) : false);
console.log('Trimmed length:', key ? key.trim().length : 0);
console.log('\nKey starts with:', key ? key.substring(0, 10) : 'N/A');
console.log('Key ends with:', key ? '...' + key.substring(key.length - 10) : 'N/A');

if (key) {
    const cleaned = key.trim();
    console.log('\n=== TESTING WITH CLEANED KEY ===\n');

    const testKey = async () => {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cleaned}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'mistralai/mistral-7b-instruct:free',
                    messages: [{ role: 'user', content: 'test' }],
                    max_tokens: 5
                })
            });

            console.log('Status:', response.status);
            if (response.ok) {
                console.log('✅ API KEY WORKS!');
            } else {
                const error = await response.text();
                console.log('❌ API KEY FAILED');
                console.log('Error:', error.substring(0, 200));
            }
        } catch (error) {
            console.log('❌ Request failed:', error.message);
        }
    };

    testKey();
}
