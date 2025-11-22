// Test the deepseek/deepseek-r1:free model
const OPENROUTER_API_KEY = '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';

async function testDeepSeekR1() {
  console.log('Testing deepseek/deepseek-r1:free model...\n');

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
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello World" in Python'
          }
        ],
        max_tokens: 100
      })
    });

    console.log(`Response Status: ${response.status}\n`);

    if (response.ok) {
      const data = await response.json();
      console.log('✓ SUCCESS! Model is working!');
      console.log('\nResponse:');
      console.log(data.choices[0].message.content);
      console.log('\n✓ You can now use the application - the API should work!');
    } else {
      const errorText = await response.text();
      console.log('✗ Error Response:');
      console.log(errorText);
      console.log('\n✗ Model still unavailable on OpenRouter');
    }
  } catch (error) {
    console.log('✗ Request failed:');
    console.log(error.message);
  }
}

testDeepSeekR1();
