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
            Accelerate your learning with intelligent inline comments and seamless code conversion between programming languages
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
              <CardTitle>Intelligent Analysis</CardTitle>
              <CardDescription>
                Get contextual inline comments that explain your code at beginner, intermediate, or advanced levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <RefreshCw className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Code Conversion</CardTitle>
              <CardDescription>
                Convert code between multiple programming languages while maintaining logic and best practices
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Copy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Easy Export</CardTitle>
              <CardDescription>
                Copy analyzed or converted code to clipboard with a single click, ready to use in your projects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Powered by AI</CardTitle>
              <CardDescription>
                Leverages DeepSeek AI models for accurate code understanding and intelligent transformations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Code2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multi-Language Support</CardTitle>
              <CardDescription>
                Supports JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-2xl">🎨</span>
              </div>
              <CardTitle>Beautiful Interface</CardTitle>
              <CardDescription>
                Modern, responsive design with dark mode support and smooth animations for the best user experience
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
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your free account to access all CodeCoach features
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
                Input the code you want to analyze or convert in the editor
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Options</h3>
              <p className="text-muted-foreground">
                Select complexity level for analysis or target language for conversion
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-muted-foreground">
                Receive your analyzed or converted code with helpful comments instantly
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
              Ready to Level Up Your Coding?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join CodeCoach today and start understanding code faster than ever before
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
