"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, ArrowLeft } from "lucide-react"

export default function CookiesPage() {
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
        <section className="container mx-auto px-4 py-24 md:py-40">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small files that are stored on your browser or the hard drive of your computer. They allow websites to recognize you and store some information about your preferences or past actions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  CodeCoach uses cookies for the following purposes:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Essential Cookies:</h3>
                    <p className="text-muted-foreground">These cookies are necessary for the website to function properly and cannot be disabled.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance Cookies:</h3>
                    <p className="text-muted-foreground">These cookies help us understand how visitors interact with our website and improve performance.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Functional Cookies:</h3>
                    <p className="text-muted-foreground">These cookies remember your preferences and allow us to provide personalized features.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Marketing Cookies:</h3>
                    <p className="text-muted-foreground">These cookies track your activity to show you relevant advertisements.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h3 className="font-semibold mb-2">Session Cookies:</h3>
                    <p className="text-sm text-muted-foreground">These cookies expire when you close your browser.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h3 className="font-semibold mb-2">Persistent Cookies:</h3>
                    <p className="text-sm text-muted-foreground">These cookies remain on your device for a specified period.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h3 className="font-semibold mb-2">Third-Party Cookies:</h3>
                    <p className="text-sm text-muted-foreground">These cookies are set by third-party services we use.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Managing Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use third-party services such as Google Analytics to analyze website traffic and user behavior. These services may use their own cookies to collect information about your visit to our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Changes to This Cookie Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Cookie Policy, please contact us at cookies@codecoach.dev
                </p>
              </section>
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
