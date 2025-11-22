# Test Model Fallback - All Routes

## Test 1: Analyze Route (Multiple Rapid Requests)

This tests the automatic fallback when rate limits are hit.

```bash
node test-fallback.js
```

Expected: 
- First request might use Mistral
- If rate limited, automatically switches to Hermes or Llama
- No 500 errors visible to script

## Test 2: Manual Test in Browser

1. **Start server**: `npm run dev`
2. **Open**: http://localhost:3000/dashboard
3. **Test Analyze**:
   - Paste some code
   - Click "Analyze"
   - Repeat 3-5 times rapidly
   - Should work every time!

4. **Test Convert** (if available):
   - Try converting code between languages
   - Check for successful conversions

## Test 3: Check Server Logs

Look for these log messages:

```
[Model Manager] Attempting with model: mistralai/mistral-7b-instruct:free
[Model Manager] ✓ Success with model: mistralai/mistral-7b-instruct:free
[Analyze] Code commenting used model: mistralai/mistral-7b-instruct:free
```

If rate limited:
```
[Model Manager] ✗ Rate limited on model: mistralai/mistral-7b-instruct:free
[Model Manager] Attempting with model: nousresearch/hermes-3-llama-3.1-405b:free
[Model Manager] ✓ Success with model: nousresearch/hermes-3-llama-3.1-405b:free
```

## Success Criteria

✅ No 500 errors in browser  
✅ Code analysis works repeatedly  
✅ Server logs show model switching when rate limited  
✅ Application remains functional even with heavy use  

## If Issues Occur

1. Check that server was restarted after code changes
2. Verify `lib/model-manager.ts` exists
3. Check for TypeScript compilation errors
4. Look for detailed error messages in server console
