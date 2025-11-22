// Direct test of the API key from .env.local
require('dotenv').config({ path: '.env.local' });

async function testAPIKey() {
    const apiKey = process.env.OPENROUTER_API_KEY;

    console.log('Testing OpenRouter API Key...\n');
    console.log('Key present:', !!apiKey);
    console.log('Key length:', apiKey ? apiKey.length : 0);
    console.log('Key starts with:', apiKey ? apiKey.substring(0, 15) + '...' : 'N/A');
    console.log('Key contains newlines:', apiKey ? apiKey.includes('\n') || apiKey.includes('\r') : false);
    console.log('Key has whitespace:', apiKey ? apiKey.trim() !== apiKey : false);

    if (!apiKey) {
        console.log('\n❌ OPENROUTER_API_KEY not found in .env.local!');
        return;
    }

    // Clean the key
    const cleanKey = apiKey.trim();

    console.log('\n--- Testing key with OpenRouter ---\n');

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cleanKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'CodeCoach'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [{ role: 'user', content: 'Say "test"' }],
                max_tokens: 10
            })
        });

        console.log(`Status: ${response.status}\n`);

        if (response.ok) {
            console.log('✅ API KEY IS VALID AND WORKING!');
            const data = await response.json();
            console.log('Response received successfully');
        } else {
            const error = await response.text();
            console.log('❌ API KEY REJECTED');
            console.log('Error:', error.substring(0, 300));

            if (response.status === 401) {
                console.log('\n🔑 Status 401 = Invalid or expired API key');
                console.log('Solution: Generate a new key at https://openrouter.ai/settings/keys');
            } else if (response.status === 402) {
                console.log('\n💳 Status 402 = Payment required / No credits');
                console.log('Solution: Add credits to your OpenRouter account');
            } else if (response.status === 429) {
                console.log('\n⏱️  Status 429 = Rate limited or provider issue');
            }
        }
    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }
}

testAPIKey();
