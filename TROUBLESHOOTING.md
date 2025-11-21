# CodeCoach Troubleshooting Guide

## 500 Error: "Failed to analyze"

This error typically occurs when there's an issue with the API configuration or the OpenRouter API key.

### Common Causes and Solutions

#### 1. Missing or Invalid API Key

**Symptoms:**
- Browser console shows: "Failed to load resource: the server responded with a status of 500 ()"
- Server logs show: "OPENROUTER_API_KEY is not configured"

**Solution:**
1. Check if `.env.local` file exists in the project root
2. Verify it contains the `OPENROUTER_API_KEY` variable
3. Ensure the API key is valid and starts with `sk-`

```bash
# Run the environment checker
node check-env.js
```

#### 2. API Key Format Issues

**Symptoms:**
- API returns 401 or 403 errors
- Error message: "Failed to analyze code"

**Solution:**
1. Verify your OpenRouter API key format
2. The key should look like: `sk-or-v1-xxxxxxxxxxxxx`
3. Get a new key from: https://openrouter.ai/keys

#### 3. Rate Limiting

**Symptoms:**
- Intermittent 429 errors
- Error: "Rate limit hit"

**Solution:**
1. Add multiple API keys separated by commas in `.env.local`:
   ```
   OPENROUTER_API_KEY=key1,key2,key3
   ```
2. The app will automatically rotate between keys

#### 4. Environment Variables Not Loading

**Symptoms:**
- API key is in `.env.local` but still getting "not configured" error

**Solution:**
1. Restart the development server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
2. Ensure `.env.local` is in the project root (same directory as `package.json`)
3. Check that the file is not named `.env.local.txt` or similar

### Debugging Steps

1. **Check Environment Configuration:**
   ```bash
   node check-env.js
   ```

2. **Check Server Logs:**
   - Look at the terminal where `npm run dev` is running
   - Check for error messages starting with "Error analyzing code:"

3. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for error messages
   - Go to Network tab and check the failed request details

4. **Test API Key Manually:**
   ```bash
   # On Windows PowerShell
   $headers = @{
       "Authorization" = "Bearer YOUR_API_KEY"
       "Content-Type" = "application/json"
   }
   $body = @{
       model = "deepseek/deepseek-chat-v3.1:free"
       messages = @(
           @{
               role = "user"
               content = "Hello"
           }
       )
   } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/chat/completions" -Method Post -Headers $headers -Body $body
   ```

### Configuration Checklist

- [ ] `.env.local` file exists in project root
- [ ] `OPENROUTER_API_KEY` is set and valid
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Development server is running (`npm run dev`)
- [ ] No other process is using port 3000
- [ ] Browser is accessing `http://localhost:3000`

### Getting Help

If you're still experiencing issues:

1. Run the environment checker and save the output:
   ```bash
   node check-env.js > env-check-output.txt
   ```

2. Check the server logs for detailed error messages

3. Verify your OpenRouter account status at https://openrouter.ai/

### Quick Fix Commands

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Check environment configuration
node check-env.js

# 3. Start development server
npm run dev

# 4. If port 3000 is in use, find and kill the process
# Windows:
netstat -ano | findstr :3000
# Then kill the process using Task Manager or:
taskkill /PID <PID> /F
```

## Other Common Issues

### Issue: "Code is required" (400 Error)

**Cause:** Empty code input
**Solution:** Ensure you've entered code in the editor before clicking "Analyze"

### Issue: Monaco Editor Not Loading

**Cause:** Missing dependencies or build issues
**Solution:**
```bash
npm install @monaco-editor/react
npm run dev
```

### Issue: Supabase Authentication Errors

**Cause:** Invalid Supabase credentials
**Solution:**
1. Verify your Supabase project URL and anon key
2. Check that your Supabase project is active
3. Ensure you're using the correct environment (development/production)
