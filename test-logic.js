// Replicating the exact logic structure to see if I'm crazy
async function testLogic() {
    const maxRetries = 1;
    let lastError = null;
    let trace = '';

    const log = (msg) => {
        console.log(msg);
        trace += msg + ' | ';
    };

    log(`Start MaxRetries:${maxRetries}`);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            log(`Attempt ${attempt + 1}`);

            // Simulate 429
            const status = 429;
            log(`Status:${status}`);

            if (status === 429) {
                log('Rate limit');
                // Simulate hasAvailableKeys = false
                const hasKeys = false;

                if (hasKeys) {
                    log('Has keys, continue');
                    continue;
                } else {
                    log('No keys, throw');
                    throw new Error('All API keys have hit rate limits');
                }
            }

            log('Return response');
            return 'response';

        } catch (error) {
            lastError = error;
            log(`Catch:${lastError.message}`);

            if (attempt < maxRetries - 1) {
                // break logic
            }
        }
    }

    log('End loop');

    if (lastError) {
        console.log('✅ lastError is set:', lastError.message);
    } else {
        console.log('❌ lastError is NULL');
    }

    throw lastError || new Error(`All API key attempts failed. Trace: ${trace}`);
}

testLogic().catch(e => console.log('Final Error:', e.message));
