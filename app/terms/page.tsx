"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using CodeCoach, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials (information or software) on CodeCoach for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Modifying or copying the materials</li>
                  <li>Using the materials for any commercial purpose or for any public display</li>
                  <li>Attempting to decompile or reverse engineer any software contained on CodeCoach</li>
                  <li>Removing any copyright or other proprietary notations from the materials</li>
                  <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials on CodeCoach are provided on an 'as is' basis. CodeCoach makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall CodeCoach or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CodeCoach.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials appearing on CodeCoach could include technical, typographical, or photographic errors. CodeCoach does not warrant that any of the materials on its website are accurate, complete, or current. CodeCoach may make changes to the materials contained on its website at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Links</h2>
                <p className="text-muted-foreground leading-relaxed">
                  CodeCoach has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CodeCoach of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>
                <p className="text-muted-foreground leading-relaxed">
                  CodeCoach may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at legal@codecoach.dev
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
