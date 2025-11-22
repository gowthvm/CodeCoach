// Direct test to see the actual current error
const fs = require('fs');

const testCurrentState = async () => {
    console.log('Testing current API state...\n');

    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: 'function test() { return 1; }',
                complexity: 'beginner'
            })
        });

        console.log(`HTTP Status: ${response.status}\n`);

        const text = await response.text();
        console.log('Raw Response:');
        console.log(text);
        console.log('\n---\n');

        if (!response.ok) {
            console.log('\n❌ ERROR DETAILS:');
            try {
                const error = JSON.parse(text);
                console.log(JSON.stringify(error, null, 2));

                if (error.details) {
                    fs.writeFileSync('last-error-trace.txt', error.details);
                    console.log('\n✅ Error details written to last-error-trace.txt');
                }
            } catch (e) {
                console.log('Response is not JSON:', text);
            }
        }
    } catch (error) {
        console.log('\n❌ FETCH FAILED:');
        console.log('Error:', error.message);
    }
};

testCurrentState();
