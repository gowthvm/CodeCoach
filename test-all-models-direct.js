require('dotenv').config({ path: '.env.local' });

const MODELS = [
    'mistralai/mistral-7b-instruct:free',
    'nousresearch/hermes-3-llama-3.1-405b:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'google/gemini-2.0-flash-exp:free',
    'microsoft/phi-3-mini-128k-instruct:free',
];

async function testAllModels() {
    const key = process.env.OPENROUTER_API_KEY?.split(',')[0];
    console.log('Testing all models with key ending in:', key?.slice(-4));

    for (const model of MODELS) {
        console.log(`\nTesting ${model}...`);
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'hi' }]
                })
            });

            console.log(`Status: ${response.status}`);
            if (response.ok) {
                console.log('✅ Working');
            } else {
                console.log('❌ Failed');
                const text = await response.text();
                console.log('Error:', text.slice(0, 100));
            }
        } catch (e) {
            console.log('Exception:', e.message);
        }
    }
}

testAllModels();
