// Test multiple free models to find one that works
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
                messages: [{ role: 'user', content: 'Say hi' }],
                max_tokens: 50
            })
        });

        const status = response.status;
        console.log(`Status: ${status}`);

        if (response.ok) {
            const data = await response.json();
            console.log('✓ SUCCESS!');
            return { model: modelName, works: true };
        } else {
            const error = await response.text();
            const errorMsg = error.substring(0, 100);
            console.log(`✗ Failed: ${errorMsg}`);
            return { model: modelName, works: false, error: errorMsg };
        }
    } catch (error) {
        console.log(`✗ Exception: ${error.message}`);
        return { model: modelName, works: false, error: error.message };
    }
}

async function findWorkingModel() {
    console.log('=== Testing Free Models on OpenRouter ===\n');

    const modelsToTest = [
        // Google
        'google/gemini-flash-1.5:free',
        'google/gemini-2.0-flash-exp:free',
        // Meta
        'meta-llama/llama-3.2-3b-instruct:free',
        'meta-llama/llama-3.1-8b-instruct:free',
        // Qwen
        'qwen/qwen-2-7b-instruct:free',
        'qwen/qwen-2.5-7b-instruct:free',
        // Mistral
        'mistralai/mistral-7b-instruct:free',
        // Phi
        'microsoft/phi-3-mini-128k-instruct:free',
    ];

    const results = [];

    for (const model of modelsToTest) {
        const result = await testModel(model);
        results.push(result);
        if (result.works) {
            console.log(`\n✓✓✓ FOUND WORKING MODEL: ${model} ✓✓✓\n`);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
    }

    const workingModel = results.find(r => r.works);

    if (workingModel) {
        console.log(`\n=== RECOMMENDATION ===`);
        console.log(`Use this model: ${workingModel.model}`);
    } else {
        console.log(`\n=== NO WORKING FREE MODELS FOUND ===`);
        console.log('This might indicate:');
        console.log('1. OpenRouter free tier has been restricted');
        console.log('2. API key needs credits');
        console.log('3. Temporary service issues');
    }
}

findWorkingModel();
