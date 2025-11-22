// Let's test with multiple requests to see if there's any pattern
const runMultipleTests = async () => {
    console.log('Running 3 consecutive API tests...\n');

    for (let i = 1; i <= 3; i++) {
        console.log(`\n=== TEST ${i} ===`);
        try {
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: `function test${i}() { return ${i}; }`,
                    complexity: 'beginner'
                })
            });

            console.log(`Status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ SUCCESS');
                console.log('Has analyzedCode:', !!data.analyzedCode);
                console.log('Has feedback:', !!data.feedback);
            } else {
                const error = await response.json();
                console.log('❌ FAILED');
                console.log('Error:', JSON.stringify(error, null, 2));
            }
        } catch (error) {
            console.log('❌ EXCEPTION:', error.message);
        }

        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n=== SUMMARY ===');
    console.log('If all 3 tests passed: API is stable and working');
    console.log('If some failed: API is unstable or Gemini has issues');
    console.log('If all failed: Server not running or major issue');
};

runMultipleTests();
