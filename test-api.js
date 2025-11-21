#!/usr/bin/env node

/**
 * API Endpoint Tester
 * Tests the /api/analyze endpoint to diagnose issues
 */

const http = require('http');

const testCode = `function hello() {
  console.log("Hello, World!");
}`;

const postData = JSON.stringify({
  code: testCode,
  complexity: 'beginner'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing CodeCoach API Endpoint...\n');
console.log('Endpoint: http://localhost:3000/api/analyze');
console.log('Method: POST');
console.log('Payload:', postData);
console.log('\n⏳ Sending request...\n');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  console.log('\nResponse Headers:');
  console.log(JSON.stringify(res.headers, null, 2));
  console.log('\nResponse Body:');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ API endpoint is working correctly!');
        if (parsed.analyzedCode) {
          console.log('\n📝 Analyzed Code Preview:');
          console.log(parsed.analyzedCode.substring(0, 200) + '...');
        }
        if (parsed.feedback) {
          console.log('\n💬 Feedback Preview:');
          console.log(parsed.feedback.substring(0, 200) + '...');
        }
      } else {
        console.log('\n❌ API returned an error');
        if (parsed.details) {
          console.log('Error details:', parsed.details);
        }
      }
    } catch (e) {
      console.log(data);
      console.log('\n❌ Failed to parse response as JSON');
      console.log('Parse error:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('\nPossible causes:');
  console.log('- Development server is not running (run: npm run dev)');
  console.log('- Server is running on a different port');
  console.log('- Network/firewall issues');
});

req.write(postData);
req.end();
