"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import { Calendar, User } from "lucide-react"

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Getting Started with CodeCoach",
      excerpt: "Learn how to use CodeCoach to analyze and improve your code quality.",
      date: "Nov 15, 2024",
      author: "CodeCoach Team",
      category: "Tutorial"
    },
    {
      id: 2,
      title: "Best Practices for Code Analysis",
      excerpt: "Discover best practices for analyzing code and identifying potential issues.",
      date: "Nov 10, 2024",
      author: "John Doe",
      category: "Guide"
    },
    {
      id: 3,
      title: "Introducing Multi-Language Support",
      excerpt: "CodeCoach now supports code analysis and translation for 10+ programming languages.",
      date: "Nov 5, 2024",
      author: "CodeCoach Team",
      category: "Feature"
    }
  ]

  return (
    <div className="min-h-screen mesh-gradient-light dark:mesh-gradient flex flex-col">
      <PageTransition>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-40">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-hero leading-tight mb-6">
              CodeCoach <span className="bg-clip-text text-transparent gradient-primary">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Tips, tutorials, and insights for better code quality.
            </p>
          </div>

          {/* Blog Posts */}
          <div className="max-w-4xl mx-auto space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center mt-20 py-12 border-t">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">Get the latest tips and updates delivered to your inbox.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-background border border-primary/20 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              <Button className="hover:glow-primary transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
        </main>
      </PageTransition>

      {/* Footer */}
      <footer className="border-t bg-muted/20 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CodeCoach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
