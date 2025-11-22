// Test the analyze route with model fallback
const testAnalyzeWithFallback = async () => {
    console.log('Testing /api/analyze with model fallback...\n');

    try {
        // Make 3 consecutive requests to test fallback
        for (let i = 1; i <= 3; i++) {
            console.log(`\nRequest ${i}:`);

            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: `function test${i}() {\n  console.log("Test ${i}");\n}`,
                    complexity: 'beginner'
                })
            });

            console.log(`Status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ SUCCESS!');
                console.log('Response has analyzedCode:', !!data.analyzedCode);
                console.log('Response has feedback:', !!data.feedback);
            } else {
                const error = await response.json();
                console.log('❌ FAILED');
                console.log('Error:', error);
            }

            // Wait before next request
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n✅ Test complete! Check server logs for which models were used.');
    } catch (error) {
        console.log('\n❌ Test failed:', error.message);
    }
};

testAnalyzeWithFallback();
