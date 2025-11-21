# Quick Fix for 500 Error

## The Problem
Your app is getting a **429 Rate Limit** error from the DeepSeek free model.

## The Solution (2 minutes)

### Step 1: Open `.env.local`
Located at: `c:\Users\Gowtham\Desktop\CodeCoach\.env.local`

### Step 2: Add this line at the end
```env
OPENROUTER_MODEL=google/gemini-flash-1.5:free
```

Your `.env.local` should now have these variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` ← NEW

### Step 3: Restart the server
In your terminal where `npm run dev` is running:
1. Press `Ctrl+C` to stop
2. Run `npm run dev` again

### Step 4: Test
Go to http://localhost:3000 and try analyzing code again.

## Done! ✅

The app will now use Google Gemini instead of DeepSeek, which has higher rate limits.

---

## Alternative Models (if Gemini also gets rate-limited)

Try these in order:

1. `google/gemini-flash-1.5:free` (Recommended)
2. `meta-llama/llama-3.2-3b-instruct:free`
3. `qwen/qwen-2-7b-instruct:free`

Just change the `OPENROUTER_MODEL` value in `.env.local` and restart.

---

## Need Help?

Run these diagnostic commands:

```bash
# Check if everything is configured
node check-env.js

# Test if the API is working
node test-api.js

# Test your API keys
node test-openrouter.js
```

See `RATE_LIMIT_FIX.md` for detailed information.
