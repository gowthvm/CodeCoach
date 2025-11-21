"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  CodeCoach ("we", "our", or "us") operates the CodeCoach website and application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Information Collection and Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect several different types of information for various purposes to provide and improve our Service to you.
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-2">Personal Data:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Email address</li>
                      <li>First name and last name</li>
                      <li>Cookies and usage data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Use of Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  CodeCoach uses the collected data for various purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To allow you to participate in interactive features of our Service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our Service</li>
                  <li>To monitor the usage of our Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Security of Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at privacy@codecoach.dev
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
