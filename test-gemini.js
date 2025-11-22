require('dotenv').config({ path: '.env.local' });

async function testGemini() {
    const key = process.env.OPENROUTER_API_KEY?.split(',')[0];
    console.log('Testing Gemini with key ending in:', key?.slice(-4));

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
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

testGemini();
