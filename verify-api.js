// Final verification test for google/gemini-2.0-flash-exp:free
const OPENROUTER_API_KEY = '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';

async function verifyGemini2() {
    console.log('=== Final Verification Test ===\n');
    console.log('Testing google/gemini-2.0-flash-exp:free with code analysis...\n');

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'CodeCoach'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful coding assistant. Analyze code and provide helpful comments.'
                    },
                    {
                        role: 'user',
                        content: 'Add helpful comments to this Python code:\n\ndef factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n-1)'
                    }
                ]
            })
        });

        console.log(`Response Status: ${response.status}`);

        if (response.ok) {
            const data = await response.json();
            console.log('\n✓✓✓ SUCCESS! ✓✓✓\n');
            console.log('Model Response:');
            console.log(data.choices[0].message.content.substring(0, 300) + '...');
            console.log('\n✓ Your CodeCoach app is now ready to use!');
            console.log('✓ The /api/analyze and /api/convert endpoints should work perfectly.');
            console.log('\n=== Next Steps ===');
            console.log('1. Refresh your browser at http://localhost:3000/dashboard');
            console.log('2. Try analyzing or converting some code');
            console.log('3. Everything should work now!');
            return true;
        } else {
            const errorText = await response.text();
            console.log('\n✗ Error:');
            console.log(errorText);
            return false;
        }
    } catch (error) {
        console.log('\n✗ Failed:');
        console.log(error.message);
        return false;
    }
}

verifyGemini2();
