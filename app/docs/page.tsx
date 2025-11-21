"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import { BookOpen, Zap, Code } from "lucide-react"

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      icon: Zap,
      items: [
        { name: "Introduction", description: "Learn what CodeCoach can do for you" },
        { name: "Installation", description: "Get up and running in minutes" },
        { name: "Quick Start", description: "Your first analysis in 5 minutes" }
      ]
    },
    {
      title: "Features",
      icon: Code,
      items: [
        { name: "Code Analysis", description: "Understand code complexity and quality" },
        { name: "Language Translation", description: "Convert code between languages" },
        { name: "Real-time Insights", description: "Get instant feedback as you code" }
      ]
    },
    {
      title: "API Reference",
      icon: BookOpen,
      items: [
        { name: "Authentication", description: "Secure your API calls" },
        { name: "Endpoints", description: "Complete API documentation" },
        { name: "Examples", description: "Code examples for common tasks" }
      ]
    }
  ]

  return (
    <div className="min-h-screen mesh-gradient-light dark:mesh-gradient flex flex-col">
      <PageTransition>
        <main className="flex-grow">
        <section className="container mx-auto px-4 py-24 md:py-40">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-hero leading-tight mb-6">
              Documentation & <span className="bg-clip-text text-transparent gradient-primary">Guides</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know to get the most out of CodeCoach.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <div key={section.title}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        href="#"
                        className="p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all duration-300 group"
                      >
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="max-w-2xl mx-auto text-center mt-20 py-12 border-t">
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-6">
              Check out our community forum or contact support for help.
            </p>
            <Link href="/contact">
              <Button size="lg" className="glow-primary hover:glow-primary-lg">
                Get Help
              </Button>
            </Link>
          </div>
        </section>
        </main>
      </PageTransition>

      <footer className="border-t bg-muted/20 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <Link href="/">
              <Button variant="outline" className="hover:border-primary/50 hover:bg-primary/5 transition-all">
                ← Back to Home
              </Button>
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CodeCoach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
