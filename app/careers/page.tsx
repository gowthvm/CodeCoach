"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, ArrowLeft, Briefcase, MapPin, DollarSign } from "lucide-react"

export default function CareersPage() {
  const jobs = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k"
    },
    {
      id: 2,
      title: "AI/ML Engineer",
      department: "Research",
      location: "Remote",
      type: "Full-time",
      salary: "$130k - $180k"
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$110k - $150k"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $140k"
    }
  ]

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
              Join Our <span className="bg-clip-text text-transparent gradient-primary">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us build the future of code analysis and AI-powered development tools.
            </p>
          </div>

          {/* About Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="p-8 rounded-xl bg-muted/30 border border-border/50">
              <h2 className="text-2xl font-bold mb-4">Why Join CodeCoach?</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Work on cutting-edge AI and machine learning technologies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Competitive salary and comprehensive benefits package</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Flexible remote work options</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Collaborative and inclusive team environment</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Job Listings */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.department}</p>
                    </div>
                    <Button variant="outline" size="sm" className="hover:border-primary/50">
                      Apply Now
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center mt-20 py-12 border-t">
            <h2 className="text-2xl font-bold mb-4">Don't see a role that fits?</h2>
            <p className="text-muted-foreground mb-6">We're always looking for talented people. Send us your resume!</p>
            <Button size="lg" className="glow-primary hover:glow-primary-lg">
              Send Your Resume
            </Button>
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
