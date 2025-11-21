"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, ArrowLeft, Users, Target, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen mesh-gradient-light dark:mesh-gradient flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CodeCoach</h1>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-40">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-hero leading-tight mb-6">
              About <span className="bg-clip-text text-transparent gradient-primary">CodeCoach</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering developers worldwide with AI-driven code analysis and translation tools.
            </p>
          </div>

          {/* Mission Section */}
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  CodeCoach was founded with a simple mission: to make code analysis and translation accessible to every developer, regardless of their experience level.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that understanding code should be intuitive, and learning from code should be personalized. Our AI-powered tools help developers write better code, faster.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-teal-500/10 rounded-2xl p-8 border border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Fast & Accurate</h3>
                      <p className="text-sm text-muted-foreground">Real-time analysis powered by advanced AI models</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Community Driven</h3>
                      <p className="text-sm text-muted-foreground">Built by developers, for developers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div>
              <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Accessibility",
                    description: "Making advanced code analysis tools available to developers at all levels."
                  },
                  {
                    title: "Quality",
                    description: "Delivering accurate, reliable, and actionable insights for every code analysis."
                  },
                  {
                    title: "Innovation",
                    description: "Continuously improving our AI models and tools to stay ahead of the curve."
                  }
                ].map((value) => (
                  <div key={value.title} className="p-6 rounded-xl bg-muted/30 border border-border/50">
                    <h3 className="font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-8 py-12 border-t border-b border-border/50">
              {[
                { number: "10k+", label: "Active Users" },
                { number: "50M+", label: "Lines Analyzed" },
                { number: "4.9/5", label: "Average Rating" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Ready to Join Us?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start using CodeCoach today and experience the power of AI-driven code analysis.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="glow-primary hover:glow-primary-lg">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CodeCoach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
