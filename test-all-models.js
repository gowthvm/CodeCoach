// Comprehensive test of all known free models on OpenRouter
const OPENROUTER_API_KEY = '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';

const FREE_MODELS = [
    // Google Models
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-flash-1.5:free',
    'google/gemini-flash-1.5-8b:free',

    // Meta Llama Models
    'meta-llama/llama-3.2-1b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',

    // Qwen Models
    'qwen/qwen-2-7b-instruct:free',
    'qwen/qwen-2.5-7b-instruct:free',

    // Mistral Models
    'mistralai/mistral-7b-instruct:free',
    'mistralai/mistral-nemo:free',

    // Microsoft Models
    'microsoft/phi-3-mini-128k-instruct:free',
    'microsoft/phi-3-medium-128k-instruct:free',

    // Other Models
    'huggingfaceh4/zephyr-7b-beta:free',
    'openchat/openchat-7b:free',
    'nousresearch/hermes-3-llama-3.1-405b:free',
];

async function testModel(model, testNumber = 1) {
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
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: 'Write a Python function that adds two numbers'
                    }
                ],
                max_tokens: 100
            })
        });

        const status = response.status;

        if (response.ok) {
            const data = await response.json();
            const hasResponse = data.choices?.[0]?.message?.content;
            return {
                model,
                status,
                working: true,
                responseLength: hasResponse ? hasResponse.length : 0,
                test: testNumber
            };
        } else {
            const error = await response.text();
            let errorMsg = 'Unknown error';
            try {
                const errorData = JSON.parse(error);
                errorMsg = errorData.error?.message || JSON.stringify(errorData);
            } catch (e) {
                errorMsg = error.substring(0, 100);
            }

            return {
                model,
                status,
                working: false,
                error: errorMsg,
                test: testNumber
            };
        }
    } catch (error) {
        return {
            model,
            status: 0,
            working: false,
            error: error.message,
            test: testNumber
        };
    }
}

async function testAllModels() {
    console.log('='.repeat(80));
    console.log('TESTING ALL FREE MODELS ON OPENROUTER');
    console.log('='.repeat(80));
    console.log(`\nTesting ${FREE_MODELS.length} models...\n`);

    const results = [];

    for (let i = 0; i < FREE_MODELS.length; i++) {
        const model = FREE_MODELS[i];
        process.stdout.write(`[${i + 1}/${FREE_MODELS.length}] Testing ${model}... `);

        const result = await testModel(model);
        results.push(result);

        if (result.working) {
            console.log(`✅ WORKING (${result.status})`);
        } else {
            console.log(`❌ FAILED (${result.status}): ${result.error.substring(0, 50)}`);
        }

        // Small delay to avoid hitting rate limits during testing
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));

    const working = results.filter(r => r.working);
    const failed = results.filter(r => !r.working);

    console.log(`\n✅ WORKING MODELS (${working.length}):`);
    working.forEach(r => {
        console.log(`   - ${r.model}`);
    });

    console.log(`\n❌ FAILED MODELS (${failed.length}):`);
    failed.forEach(r => {
        console.log(`   - ${r.model} (${r.status}: ${r.error.substring(0, 40)})`);
    });

    // Test rate limits on working models
    if (working.length > 0) {
        console.log('\n' + '='.repeat(80));
        console.log('RATE LIMIT TESTING (3 consecutive requests)');
        console.log('='.repeat(80));

        for (const result of working.slice(0, 3)) { // Test first 3 working models
            console.log(`\nTesting ${result.model}:`);

            for (let i = 1; i <= 3; i++) {
                const testResult = await testModel(result.model, i);
                if (testResult.working) {
                    console.log(`  Test ${i}: ✅ ${testResult.status}`);
                } else {
                    console.log(`  Test ${i}: ❌ ${testResult.status} - ${testResult.error.substring(0, 40)}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Save results to file
    const fs = require('fs');
    fs.writeFileSync(
        'model-test-results.json',
        JSON.stringify({ tested: new Date().toISOString(), results, working: working.map(r => r.model) }, null, 2)
    );
    console.log('\n✅ Results saved to model-test-results.json');

    return working.map(r => r.model);
}

testAllModels().then(workingModels => {
    console.log(`\n🎉 Found ${workingModels.length} working models for fallback system!`);
});
