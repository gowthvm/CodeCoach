// Test with a known working free model
const OPENROUTER_API_KEY = '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';

async function testModel(modelName) {
    console.log(`\nTesting: ${modelName}`);
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
                model: modelName,
                messages: [{ role: 'user', content: 'Say hi in 3 words' }],
                max_tokens: 50
            })
        });

        console.log(`Status: ${response.status}`);

        if (response.ok) {
            const data = await response.json();
            console.log('✓ SUCCESS!');
            console.log('Response:', data.choices[0].message.content);
            return true;
        } else {
            const error = await response.text();
            console.log(`✗ Error: ${error.substring(0, 150)}`);
            return false;
        }
    } catch (error) {
        console.log(`✗ Failed: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('Testing free models on OpenRouter...\n');

    // Test with models that should work
    const models = [
        'meta-llama/llama-3.2-3b-instruct:free',
        'google/gemini-flash-1.5:free',
        'qwen/qwen-2-7b-instruct:free',
    ];

    let workingModel = null;

    for (const model of models) {
        const works = await testModel(model);
        if (works && !workingModel) {
            workingModel = model;
            console.log(`\n✓ Found working model: ${model}`);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (workingModel) {
        console.log('\n✓ OpenRouter API is working, issue is with DeepSeek models specifically');
    } else {
        console.log('\n✗ No working models found - API key or OpenRouter might have issues');
    }
}

main();
