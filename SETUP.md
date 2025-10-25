# CodeCoach Setup Guide

This guide will walk you through setting up CodeCoach on your local machine.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- npm or yarn package manager
- A Supabase account (free tier is fine)
- An OpenRouter account (free tier available)

## Step 1: Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new organization (if you don't have one)
   - Create a new project
   - Wait for the project to be set up (takes ~2 minutes)

2. **Get Your Credentials**
   - In your Supabase project dashboard, go to Settings > API
   - Copy the "Project URL" (looks like: `https://xxxxx.supabase.co`)
   - Copy the "anon public" key (under "Project API keys")

3. **Enable Email Authentication**
   - Go to Authentication > Providers
   - Ensure "Email" is enabled
   - Configure email templates if desired (optional)

## Step 3: Get OpenRouter API Key

1. **Create an OpenRouter Account**
   - Go to [openrouter.ai](https://openrouter.ai)
   - Sign up for a free account
   - Verify your email

2. **Generate API Key**
   - Go to your account settings
   - Navigate to "API Keys"
   - Click "Create Key"
   - Copy the generated API key

3. **Add Credits (Optional)**
   - The free tier of DeepSeek model is available
   - You can add credits if you want to use other models
   - For CodeCoach, the free tier is sufficient

## Step 4: Configure Environment Variables

1. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in Your Credentials**
   Open `.env.local` and add your credentials:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

   # OpenRouter API Key
   OPENROUTER_API_KEY=your-openrouter-api-key-here
   ```

   **Important**: 
   - Replace `your-project.supabase.co` with your actual Supabase URL
   - Replace `your-anon-key-here` with your Supabase anon key
   - Replace `your-openrouter-api-key-here` with your OpenRouter API key

## Step 5: Run the Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Application

1. **Visit the Landing Page**
   - Open [http://localhost:3000](http://localhost:3000)
   - You should see the CodeCoach landing page

2. **Create an Account**
   - Click "Get Started" or "Sign Up"
   - Enter your email and password
   - Check your email for verification (if enabled)
   - Sign in with your credentials

3. **Test Code Analysis**
   - Paste some code in the input editor
   - Select a complexity level
   - Click "Analyze"
   - View the analyzed code with comments

4. **Test Code Conversion**
   - Switch to "Convert Code" mode
   - Paste code in the input editor
   - Select source and target languages
   - Click "Convert"
   - View the converted code

## Troubleshooting

### Issue: "Failed to analyze/convert code"
- **Solution**: Check that your OpenRouter API key is correct in `.env.local`
- Verify you have credits/free tier access on OpenRouter
- Check the browser console for detailed error messages

### Issue: "Authentication error"
- **Solution**: Verify your Supabase credentials in `.env.local`
- Ensure email authentication is enabled in Supabase dashboard
- Check that your Supabase project is active

### Issue: "Module not found" errors
- **Solution**: Run `npm install` again
- Delete `node_modules` and `.next` folders, then run `npm install`

### Issue: Port 3000 already in use
- **Solution**: Either stop the process using port 3000, or run on a different port:
  ```bash
  npm run dev -- -p 3001
  ```

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Deploying to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Configure Environment Variables in Vercel**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all variables from `.env.local`
   - Redeploy if necessary

## Next Steps

- Customize the UI to match your brand
- Add more programming languages
- Implement user preferences storage
- Add code history/favorites feature
- Integrate analytics

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the README.md for additional information

## Security Notes

- Never commit `.env.local` to version control
- Keep your API keys secure
- Use environment variables for all sensitive data
- Enable row-level security in Supabase for production
