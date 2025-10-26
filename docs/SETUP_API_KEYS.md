# Setting Up Multiple API Keys

## Quick Start

### 1. Update Your `.env.local` File

Open your `.env.local` file and update the `OPENROUTER_API_KEY` variable:

```env
# Before (single key)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# After (multiple keys)
OPENROUTER_API_KEY=sk-or-v1-key1,sk-or-v1-key2,sk-or-v1-key3
```

**Important**: 
- Separate keys with commas (`,`)
- No spaces between keys
- You can use 1 to unlimited keys

### 2. Restart Your Development Server

```bash
npm run dev
```

That's it! The rotation system is now active.

## How to Get Multiple API Keys

### Option 1: Multiple OpenRouter Accounts
1. Create multiple OpenRouter accounts (use different emails)
2. Get an API key from each account
3. Add all keys to your `.env.local` file

### Option 2: Team/Organization Keys
1. If you have a team account, generate multiple API keys
2. Each team member can have their own key
3. Combine them for rotation

### Option 3: Different Tiers
1. Mix free and paid tier keys
2. Use paid keys as primary, free as backup
3. Or vice versa for cost optimization

## Testing the Setup

### Manual Test

1. Add multiple keys to `.env.local`:
```env
OPENROUTER_API_KEY=key1,key2,key3
```

2. Temporarily invalidate the first key (change a character):
```env
OPENROUTER_API_KEY=invalid-key,key2,key3
```

3. Try analyzing code in the app
4. Check the console - you should see:
```
API key inva...l-key marked as failed
Rotated to API key: key2
```

5. The app should work normally using key2

### Verify in Console

Check your browser's developer console or server logs for rotation messages:

```
✓ Using API key: sk-o...key1
✗ API key sk-o...key1 marked as failed
→ Rotated to API key: sk-o...key2
✓ Request successful with key2
```

## Configuration Examples

### Development Setup
```env
# Single key is fine for development
OPENROUTER_API_KEY=sk-or-v1-dev-key
```

### Production Setup (Recommended)
```env
# Multiple keys for high availability
OPENROUTER_API_KEY=sk-or-v1-primary,sk-or-v1-backup1,sk-or-v1-backup2,sk-or-v1-backup3
```

### Mixed Tier Setup
```env
# Paid key first, free keys as backup
OPENROUTER_API_KEY=sk-or-v1-paid-key,sk-or-v1-free-key1,sk-or-v1-free-key2
```

## Monitoring

### Check Key Status

The system logs key rotation events. Monitor your logs for:

- **Normal operation**: No rotation messages
- **Occasional failures**: Some keys failing, others working
- **All keys failing**: All keys invalid or rate limited

### What to Watch For

**Good Signs**:
```
✓ Request successful
✓ Code analyzed successfully
```

**Warning Signs**:
```
⚠ API key marked as failed
→ Rotated to next key
```

**Critical Issues**:
```
✗ All API keys have failed
✗ No available API keys
```

## Troubleshooting

### Problem: Keys Not Rotating

**Solution**:
1. Check `.env.local` format (commas, no spaces)
2. Restart the dev server
3. Verify keys are valid on OpenRouter dashboard

### Problem: All Keys Failing

**Solution**:
1. Check each key on OpenRouter dashboard
2. Verify keys haven't expired
3. Check if you've hit rate limits
4. Wait a few minutes and try again

### Problem: Slow Performance

**Solution**:
1. Remove invalid keys from rotation
2. Use fewer keys (3-5 is optimal)
3. Check network connectivity

## Best Practices

### ✅ Do's

- **Use 2-5 keys** for optimal balance
- **Test rotation** before deploying to production
- **Monitor logs** regularly
- **Rotate keys** periodically for security
- **Keep keys secure** (never commit to git)

### ❌ Don'ts

- **Don't use too many keys** (>10 can slow down failover)
- **Don't mix invalid keys** (remove them from rotation)
- **Don't share keys** across different projects
- **Don't commit `.env.local`** to version control
- **Don't ignore rotation logs** (they indicate issues)

## Security Notes

### Key Protection

1. **Never commit** `.env.local` to git
2. **Use different keys** for dev/staging/production
3. **Rotate keys** every 3-6 months
4. **Monitor usage** on OpenRouter dashboard
5. **Revoke compromised keys** immediately

### Logging

Keys are automatically masked in logs:
```
sk-or-v1-1234567890abcdef → sk-o...cdef
```

Only the first 4 and last 4 characters are shown.

## Advanced Configuration

### Environment-Specific Keys

**Development** (`.env.local`):
```env
OPENROUTER_API_KEY=sk-or-v1-dev-key
```

**Staging** (Vercel environment variables):
```env
OPENROUTER_API_KEY=sk-or-v1-staging-key1,sk-or-v1-staging-key2
```

**Production** (Vercel environment variables):
```env
OPENROUTER_API_KEY=sk-or-v1-prod-key1,sk-or-v1-prod-key2,sk-or-v1-prod-key3
```

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add `OPENROUTER_API_KEY` with multiple keys
4. Deploy

## FAQ

**Q: How many keys should I use?**  
A: 2-3 keys for production, 1 for development.

**Q: What happens if all keys fail?**  
A: The system resets and retries all keys once more.

**Q: Can I mix free and paid keys?**  
A: Yes! Put paid keys first for better performance.

**Q: How do I know which key is being used?**  
A: Check the console logs (keys are masked for security).

**Q: Will this increase my costs?**  
A: No, you're just distributing requests across multiple keys.

**Q: Can I add/remove keys without restarting?**  
A: No, you need to restart the server after changing `.env.local`.

## Support

If you encounter issues:

1. Check this guide
2. Review the [API_KEY_ROTATION.md](./API_KEY_ROTATION.md) documentation
3. Check OpenRouter dashboard for key status
4. Review server logs for error messages

---

**Last Updated**: October 26, 2025
