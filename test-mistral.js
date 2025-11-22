require('dotenv').config({ path: '.env.local' });

async function testModel() {
    const key = process.env.OPENROUTER_API_KEY?.split(',')[0];
    console.log('Testing Mistral with key ending in:', key?.slice(-4));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [{ role: 'user', content: 'hi' }]
        })
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response:', text);
}

testModel();
