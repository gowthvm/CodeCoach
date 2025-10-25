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
            Transform confusing code into clear, understandable lessons. Get intelligent explanations, quality insights, and seamless language translation to accelerate your learning journey.
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
              <CardTitle>Personalized Learning</CardTitle>
              <CardDescription>
                Choose your skill level and receive explanations that match your understanding. From beginner-friendly basics to advanced architectural insights, learn at your own pace
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <RefreshCw className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Instant Translation</CardTitle>
              <CardDescription>
                Switch between programming languages effortlessly. Perfect for learning a new language by seeing how familiar concepts translate, or migrating legacy code to modern stacks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Copy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Ready to Use</CardTitle>
              <CardDescription>
                Copy your enhanced code instantly with perfect formatting. No manual cleanup needed - paste directly into your project and keep coding
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Intelligent Feedback</CardTitle>
              <CardDescription>
                Receive detailed quality scores, spot potential issues before they become bugs, and get practical suggestions to write better, more maintainable code
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Code2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multi-Language Support</CardTitle>
              <CardDescription>
                Work with JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, and more. One tool for all your coding languages
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-2xl">🎨</span>
              </div>
              <CardTitle>Beautiful Experience</CardTitle>
              <CardDescription>
                Enjoy a clean, intuitive interface with syntax highlighting, dark mode, and smooth animations. Focus on learning without distractions
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
              <h3 className="text-xl font-semibold mb-2">Start Immediately</h3>
              <p className="text-muted-foreground">
                No credit card required. Try it instantly or create an account to save your work and build your learning history
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
                Drop in any code snippet you're struggling to understand - from a single function to entire files
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Path</h3>
              <p className="text-muted-foreground">
                Want explanations? Pick your skill level. Need translation? Select your target language. Simple choices, powerful results
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Learn and Improve</h3>
              <p className="text-muted-foreground">
                Get clear explanations, quality insights, and improvement tips. Save your work to track progress and revisit lessons anytime
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
              Stop Struggling, Start Learning
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join developers who are mastering new languages, understanding complex code, and building better software with confidence
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
