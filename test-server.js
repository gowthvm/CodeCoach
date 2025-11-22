// Quick test to verify the server is using the new model
const testServerAPI = async () => {
    console.log('Testing if server is using the new Gemini model...\n');

    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: 'console.log("test")',
                complexity: 'beginner'
            })
        });

        console.log(`Status: ${response.status}`);

        if (response.status === 500) {
            const error = await response.json();
            console.log('\n❌ Still getting 500 error');
            console.log('Error details:', JSON.stringify(error, null, 2));
            console.log('\nThis means either:');
            console.log('1. Server was not restarted');
            console.log('2. .next cache was not cleared');
            console.log('3. There is a different issue');
        } else if (response.ok) {
            console.log('\n✅ SUCCESS! Server is working!');
            const data = await response.json();
            console.log('API returned valid response');
        } else {
            console.log(`\n⚠️ Got status ${response.status}`);
            const text = await response.text();
            console.log('Response:', text.substring(0, 200));
        }
    } catch (error) {
        console.log('\n❌ Cannot connect to server');
        console.log('Error:', error.message);
        console.log('\nIs npm run dev actually running?');
    }
};

testServerAPI();
