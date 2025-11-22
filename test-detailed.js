// Detailed test to see the actual error
const testDetailed = async () => {
    console.log('Testing /api/analyze with detailed error logging...\n');

    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: 'def hello():\n    print("Hello World")',
                complexity: 'beginner'
            })
        });

        console.log(`HTTP Status: ${response.status}\n`);

        const text = await response.text();
        console.log('Raw Response:');
        console.log(text);
        console.log('\n---\n');

        if (response.status === 500) {
            try {
                const error = JSON.parse(text);
                console.log('\n❌ 500 ERROR DETAILS:');
                console.log(JSON.stringify(error, null, 2));
            } catch (e) {
                console.log('Could not parse error as JSON');
            }
        } else if (response.ok) {
            console.log('\n✅ Response is OK');
        }

    } catch (error) {
        console.log('\n❌ Request failed:');
        console.log(error.message);
        console.log(error.stack);
    }
};

testDetailed();
