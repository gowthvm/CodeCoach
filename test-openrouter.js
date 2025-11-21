#!/usr/bin/env node

/**
 * OpenRouter API Direct Tester
 * Tests the OpenRouter API directly to verify API keys
 */

require('dotenv').config({ path: '.env.local' });

const https = require('https');

const apiKeys = (process.env.OPENROUTER_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);

if (apiKeys.length === 0) {
  console.error('❌ No API keys found in OPENROUTER_API_KEY');
  process.exit(1);
}

console.log(`🔑 Found ${apiKeys.length} API key(s) to test\n`);

async function testApiKey(apiKey, index) {
  return new Promise((resolve) => {
    const masked = apiKey.length > 8 
      ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
      : '****';
    
    console.log(`Testing Key ${index + 1}: ${masked}`);

    const postData = JSON.stringify({
      model: 'deepseek/deepseek-chat-v3.1:free',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello"'
        }
      ]
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
        
        if (res.statusCode === 200) {
          console.log('   ✅ Key is valid and working!\n');
          resolve({ success: true, key: masked });
        } else {
          console.log('   ❌ Key failed');
          try {
            const parsed = JSON.parse(data);
            console.log('   Error:', JSON.stringify(parsed, null, 2));
          } catch (e) {
            console.log('   Response:', data.substring(0, 200));
          }
          console.log('');
          resolve({ success: false, key: masked, status: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Network error:', error.message);
      console.log('');
      resolve({ success: false, key: masked, error: error.message });
    });

    req.setTimeout(30000, () => {
      console.log('   ❌ Request timeout (30s)');
      console.log('');
      req.destroy();
      resolve({ success: false, key: masked, error: 'timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function testAllKeys() {
  console.log('🧪 Testing OpenRouter API Keys...\n');
  
  const results = [];
  for (let i = 0; i < apiKeys.length; i++) {
    const result = await testApiKey(apiKeys[i], i);
    results.push(result);
  }

  console.log('📊 Summary:');
  const working = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`   Working keys: ${working}/${apiKeys.length}`);
  console.log(`   Failed keys: ${failed}/${apiKeys.length}`);
  
  if (working === 0) {
    console.log('\n❌ All API keys failed!');
    console.log('\nPossible causes:');
    console.log('   1. Invalid API keys - verify at https://openrouter.ai/keys');
    console.log('   2. API keys have been revoked or expired');
    console.log('   3. Network/firewall blocking requests to openrouter.ai');
    console.log('   4. OpenRouter service is down (check https://status.openrouter.ai)');
    console.log('\nNext steps:');
    console.log('   1. Visit https://openrouter.ai/keys');
    console.log('   2. Generate a new API key');
    console.log('   3. Update your .env.local file with the new key');
    console.log('   4. Restart the development server');
  } else if (working < apiKeys.length) {
    console.log('\n⚠️  Some API keys are not working');
    console.log('   Consider removing the failed keys from .env.local');
  } else {
    console.log('\n✅ All API keys are working!');
    console.log('   The 500 error might be caused by something else.');
  }
}

testAllKeys();
