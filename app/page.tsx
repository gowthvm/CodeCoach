"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Sparkles, RefreshCw, Copy, Zap, LogOut, ChevronRight, Star, Github, Twitter, Linkedin, Users } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteHeader } from "@/components/site-header"
import { PageTransition } from "@/components/page-transition"
import { supabase } from "@/lib/supabase"
import { motion, Variants } from "framer-motion"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeNav, setActiveNav] = useState("features")
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageTransition>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-40 relative overflow-visible">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center overflow-visible">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 hover:bg-primary/20 transition-colors">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Code Assistant
              </div>
              <h1 className="text-hero leading-tight">
                Master Any Codebase <br />
                <span className="bg-clip-text text-transparent gradient-primary animate-gradient">
                  In Seconds
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Your intelligent pair programmer. Translate languages, analyze complexity, and get instant explanations for any code snippet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 h-14 glow-primary hover:glow-primary-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                    Start Coding Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 w-full sm:w-auto bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:-translate-y-1 transition-all duration-300">
                    View Demo
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground">
                <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer group">
                  <Star className="h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer group">
                  <Zap className="h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">10k+ Users</span>
                </div>
              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block w-full overflow-visible"
            >
              {/* Background decoration */}
              <div className="absolute -inset-12 bg-gradient-to-r from-primary/20 to-teal-500/20 rounded-2xl blur-3xl -z-10" />
              
              <div className="code-block transform rotate-2 hover:rotate-0 transition-transform duration-500 hover:scale-[1.02] glow-primary-lg relative z-10">
                <div className="code-header">
                  <div className="flex gap-1.5">
                    <div className="code-dot bg-red-500" />
                    <div className="code-dot bg-yellow-500" />
                    <div className="code-dot bg-green-500" />
                  </div>
                  <div className="text-xs text-gray-400 font-mono ml-2">algorithm.ts</div>
                </div>
                <pre className="text-sm font-mono text-gray-300 overflow-hidden p-4 max-h-64">
                  <code>
                    <span className="text-purple-400">function</span> <span className="text-blue-400">analyzeComplexity</span>(code) {'{'}
                    {'\n'}  <span className="text-purple-400">const</span> metrics = <span className="text-yellow-400">calculateMetrics</span>(code);
                    {'\n'}  <span className="text-gray-500">// AI Analysis in progress...</span>
                    {'\n'}  <span className="text-purple-400">return</span> {'{'}
                    {'\n'}    score: <span className="text-green-400">98</span>,
                    {'\n'}    complexity: <span className="text-green-400">"O(n log n)"</span>,
                    {'\n'}    suggestions: [<span className="text-green-400">"Optimized"</span>]
                    {'\n'}  {'}'}
                    {'\n'}{'}'}
                  </code>
                </pre>
              </div>

              {/* Floating Badge 1 */}
              <motion.div
                className="absolute -top-8 -right-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 p-3 rounded-lg shadow-lg border border-green-200 dark:border-green-800 flex items-center gap-2 animate-float glow-primary-lg z-50 backdrop-blur-sm"
              >
                <div className="bg-green-500/20 p-2 rounded-full flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs font-medium text-green-700 dark:text-green-300">Optimization</div>
                  <div className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded">✓ Success</div>
                </div>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                className="absolute -bottom-8 -left-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 p-3 rounded-lg shadow-lg border border-blue-200 dark:border-blue-800 flex items-center gap-2 animate-float-delayed glow-primary-lg z-50 backdrop-blur-sm"
              >
                <div className="bg-blue-500/20 p-2 rounded-full flex-shrink-0">
                  <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Converted to</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">→ Python</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Bento Grid */}
        <section id="features" className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 opacity-50" />
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              7 Powerful Features
            </div>
            <h2 className="text-section-title mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help you understand, debug, and optimize your code faster than ever before.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Large Card 1 */}
            <motion.div variants={item} className="md:col-span-2">
              <Card className="h-full glass-card hover-lift hover-glow overflow-hidden group border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Comprehensive Code Analysis</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Get deep insights into your code's performance, security, and maintainability. Our AI scans for potential bugs and suggests optimizations in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-40 bg-muted/30 rounded-xl border border-border/50 p-4 font-mono text-xs text-muted-foreground relative overflow-hidden group-hover:border-primary/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center gap-2"><span className="text-red-400">⚠</span> Potential memory leak detected on line 42</div>
                      <div className="flex items-center gap-2"><span className="text-yellow-400">⚠</span> Complexity is O(n²), consider optimizing</div>
                      <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Variable naming follows best practices</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tall Card */}
            <motion.div variants={item} className="md:row-span-2">
              <Card className="h-full glass-card hover-lift hover-glow flex flex-col group border-purple-500/10 hover:border-purple-500/30 transition-colors">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <RefreshCw className="h-7 w-7 text-purple-500" />
                  </div>
                  <CardTitle className="text-xl font-bold">Multi-Language Translation</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Instantly convert code between 10+ popular languages while preserving logic and comments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col gap-3 pt-0">
                  {['JavaScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'TypeScript'].map((lang, i) => (
                    <div key={lang} className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm flex items-center justify-between group-hover:border-purple-500/30 transition-colors hover:bg-muted/70">
                      <span className="font-medium">{lang}</span>
                      {i === 0 && <span className="text-xs bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium">Source</span>}
                      {i === 1 && <span className="text-xs bg-purple-500/20 text-purple-500 px-2.5 py-1 rounded-full font-medium">Target</span>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div variants={item}>
              <Card className="h-full glass-card hover-lift hover-glow group border-blue-500/10 hover:border-blue-500/30 transition-colors">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-7 w-7 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg font-bold">Adaptive Learning</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Explanations tailored to your skill level, from beginner to expert.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div variants={item}>
              <Card className="h-full glass-card hover-lift hover-glow group border-orange-500/10 hover:border-orange-500/30 transition-colors">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Copy className="h-7 w-7 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg font-bold">One-Click Export</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Copy formatted code or download files ready for your IDE.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* New Card 1 - Real-time Collaboration */}
            <motion.div variants={item}>
              <Card className="h-full glass-card hover-lift hover-glow group border-pink-500/10 hover:border-pink-500/30 transition-colors">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-pink-500" />
                  </div>
                  <CardTitle className="text-lg font-bold">Real-time Insights</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Get instant feedback as you code with real-time analysis and suggestions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* New Card 2 - Version Control */}
            <motion.div variants={item}>
              <Card className="h-full glass-card hover-lift hover-glow group border-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <RefreshCw className="h-7 w-7 text-cyan-500" />
                  </div>
                  <CardTitle className="text-lg font-bold">Code History</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Track your analysis history and compare improvements over time.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-teal-500/10 border border-primary/20 shadow-2xl hover-lift">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />

            <div className="relative z-10 px-6 py-16 md:py-24 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <Sparkles className="h-4 w-4 mr-2" />
                Limited Time Offer
              </div>
              <h2 className="text-section-title mb-6">
                Ready to Level Up Your Coding?
              </h2>
              <p className="text-xl text-foreground/70 mb-4">
                Join thousands of developers who are writing better code, faster.
              </p>
              <p className="text-sm text-muted-foreground mb-10">
                Start your free trial today. No credit card required.
              </p>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center gap-4 mb-10 pb-10 border-b border-primary/20">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-teal-500 border-2 border-background flex items-center justify-center text-xs font-bold text-white">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> developers trust CodeCoach
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="text-lg px-8 h-14 glow-primary hover:glow-primary-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-primary/20 hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                    Try Live Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        </main>
      </PageTransition>

      {/* Newsletter Section */}
      <section className="border-t border-b bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get coding tips, feature updates, and exclusive content delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-background border border-primary/20 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              <Button className="px-6 hover:glow-primary transition-all duration-300">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold">CodeCoach</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering developers with AI-driven insights and tools for better code quality.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors relative group">Features<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors relative group">Pricing<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors relative group">Changelog<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors relative group">Docs<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors relative group">About<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors relative group">Blog<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors relative group">Careers<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors relative group">Contact<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors relative group">Privacy Policy<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors relative group">Terms of Service<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
                <li><Link href="/cookies" className="hover:text-primary transition-colors relative group">Cookie Policy<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" /></Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CodeCoach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
