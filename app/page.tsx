import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Sparkles, RefreshCw, Copy, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-950 dark:to-green-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <Code2 className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
            CodeCoach
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            AI-Powered Code Analysis & Conversion
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master unfamiliar code with AI-powered inline comments, detailed feedback, and instant language conversion. Perfect for learning new languages or understanding complex codebases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
                Launch App
              </Button>
            </Link>
            <div className="flex gap-4">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Smart Code Analysis</CardTitle>
              <CardDescription>
                Get inline comments tailored to your skill level plus detailed feedback including code quality scores, line-by-line analysis, and actionable improvement suggestions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <RefreshCw className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Language Conversion</CardTitle>
              <CardDescription>
                Translate code between 10+ languages with intelligent validation, automatic error fixing, and idiomatic patterns for each target language
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Copy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Instant Export</CardTitle>
              <CardDescription>
                One-click copy to clipboard for analyzed or converted code. All formatting, comments, and indentation preserved and ready to paste into your IDE
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>DeepSeek AI Engine</CardTitle>
              <CardDescription>
                Powered by DeepSeek's advanced language models via OpenRouter for accurate code analysis, intelligent commenting, and reliable cross-language conversion
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Code2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>10+ Languages Supported</CardTitle>
              <CardDescription>
                Full support for JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, and Ruby with proper syntax highlighting and language-specific validation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-2xl">🎨</span>
              </div>
              <CardTitle>Professional Code Editor</CardTitle>
              <CardDescription>
                Monaco Editor integration (VS Code's engine) with syntax highlighting, dark/light themes, line numbers, and code folding for a premium editing experience
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Sign Up or Try Free</h3>
              <p className="text-muted-foreground">
                Create an account to save your history, or jump straight to the dashboard to try it without signing in
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Paste Your Code</h3>
              <p className="text-muted-foreground">
                Use the professional Monaco Editor to input your code with full syntax highlighting and auto-formatting support
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Configure Settings</h3>
              <p className="text-muted-foreground">
                For analysis: choose beginner, intermediate, or advanced complexity. For conversion: select source and target languages from 10+ options
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Get Instant Results</h3>
              <p className="text-muted-foreground">
                View commented code with quality scores and feedback, or converted code with proper imports and error handling. Copy with one click or review your history anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 border-0">
          <CardContent className="text-center py-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Master Any Codebase?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers using CodeCoach to understand unfamiliar code, learn new languages, and accelerate their development workflow
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 CodeCoach. Powered by DeepSeek AI.</p>
        </div>
      </footer>
    </div>
  )
}
