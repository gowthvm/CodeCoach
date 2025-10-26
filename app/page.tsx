import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Sparkles, RefreshCw, Copy, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Plasma from "@/components/Plasma"

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Animated Plasma Background */}
      <div className="fixed inset-0 z-0">
        <Plasma
          color="#10b981"
          speed={0.5}
          direction="forward"
          scale={1.2}
          opacity={1.2}
          mouseInteractive={true}
        />
      </div>
      
      {/* Content overlay with gradient */}
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-green-50/40 to-emerald-100/40 dark:from-gray-950/60 dark:to-green-950/60">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">CodeCoach</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/signin">
              <Button variant="default">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

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
            Your AI Pair Programmer for Learning Code
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform unfamiliar code into clear, understandable insights. Get intelligent explanations tailored to your skill level, comprehensive quality feedback, and seamless language translation.
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
          Everything You Need to Decode Any Code
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-card/95">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Adaptive Learning Experience</CardTitle>
              <CardDescription>
                Choose from beginner, intermediate, or advanced complexity levels. Receive explanations tailored to your expertise—from fundamental concepts to architectural patterns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-card/95">
            <CardHeader>
              <RefreshCw className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Cross-Language Translation</CardTitle>
              <CardDescription>
                Convert code between 10+ programming languages instantly. Perfect for learning new languages or migrating projects—see exactly how concepts translate across different syntaxes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-card/95">
            <CardHeader>
              <Copy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Copy, Paste, Done</CardTitle>
              <CardDescription>
                One click copies everything - comments, formatting, the works. Ready to drop straight into your editor. No cleanup, no fuss
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-card/95">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Comprehensive Code Analysis</CardTitle>
              <CardDescription>
                Receive detailed quality scores and line-by-line feedback. Identify potential issues early and get actionable suggestions for improvement—like having an expert code reviewer
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-card/95">
            <CardHeader>
              <Code2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>10+ Languages, One Tool</CardTitle>
              <CardDescription>
                JavaScript, Python, Java, C++, Go, Rust, TypeScript, C#, PHP, Ruby. Whatever you're working with, we've got you covered
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-card/95">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-2xl">🎨</span>
              </div>
              <CardTitle>Polished Developer Experience</CardTitle>
              <CardDescription>
                Enjoy a clean, intuitive interface with professional syntax highlighting and dark mode support. Designed with attention to detail for developers who value quality tools
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
              <h3 className="text-xl font-semibold mb-2">Get Started Instantly</h3>
              <p className="text-muted-foreground">
                No registration required to try the app. Explore all features immediately, then create an account to save your work and access history
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Input Your Code</h3>
              <p className="text-muted-foreground">
                Paste any code snippet or complete file you need help understanding. Works with everything from single functions to complex modules
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Configure Your Preferences</h3>
              <p className="text-muted-foreground">
                Select your desired complexity level for analysis, or choose source and target languages for conversion. Simple, straightforward options
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Review and Learn</h3>
              <p className="text-muted-foreground">
                Examine the annotated code with inline comments, review quality metrics and feedback, and save your work for future reference
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
              Accelerate Your Development Journey
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are mastering new languages, understanding complex codebases, and building better software with confidence
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
          <p>&copy; 2025 CodeCoach.</p>
        </div>
      </footer>
      </div>
    </div>
  )
}
