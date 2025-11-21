"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import { Check } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "5 analyses per day",
        "Basic code analysis",
        "Single language support",
        "Community support"
      ]
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For active developers",
      features: [
        "Unlimited analyses",
        "Advanced code analysis",
        "10+ language support",
        "Priority support",
        "Real-time insights",
        "Code history"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For teams and organizations",
      features: [
        "Everything in Professional",
        "Team collaboration",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Advanced analytics"
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
              Simple, <span className="bg-clip-text text-transparent gradient-primary">Transparent</span> Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your needs. Always flexible to scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary/10 to-teal-500/10 border-2 border-primary/30 shadow-xl scale-105"
                    : "bg-muted/30 border border-border/50 hover:border-primary/30"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <Button
                  className={`w-full mb-8 ${
                    plan.highlighted ? "glow-primary hover:glow-primary-lg" : ""
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  Get Started
                </Button>
                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto text-center mt-20 py-12 border-t">
            <h2 className="text-2xl font-bold mb-4">Questions about pricing?</h2>
            <p className="text-muted-foreground mb-6">
              Contact our sales team for custom pricing and enterprise solutions.
            </p>
            <Link href="/contact">
              <Button size="lg" className="glow-primary hover:glow-primary-lg">
                Contact Sales
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
