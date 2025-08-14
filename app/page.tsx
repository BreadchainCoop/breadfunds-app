"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, ShieldCheck, Zap, Globe, BarChart, Coins, Laptop, Smartphone } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export default function LandingPage() {
  const { user } = useAppContext()

  const features = [
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Community-Powered Insurance",
      description:
        "Bread Insurance pools are collective insurance pools where members cover each other for specific, predefined risks.",
    },
    {
      icon: (
        <div className="flex -space-x-2">
          <Laptop className="h-12 w-12 text-primary" />
          <Smartphone className="h-12 w-12 text-primary" />
        </div>
      ),
      title: "Flexible & Configurable",
      description:
        "From income loss for freelancers to coverage for phone or laptop damage, create a fund for almost any need.",
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "Crypto-Enhanced",
      description:
        "Leveraging blockchain for transparency, automation, and global accessibility, making insurance more efficient and fair.",
    },
  ]

  const cryptoAdvantages = [
    {
      icon: <BarChart className="h-8 w-8 mb-2 text-green-500" />,
      title: "Full Transparency",
      description: "All transactions and rules are publicly visible on the blockchain.",
    },
    {
      icon: <Globe className="h-8 w-8 mb-2 text-blue-500" />,
      title: "Global Access",
      description: "Join from anywhere in the world with just a crypto wallet.",
    },
    {
      icon: <Zap className="h-8 w-8 mb-2 text-purple-500" />,
      title: "Automated Payouts",
      description: "Smart contracts handle claims and payments automatically.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 mb-2 text-red-500" />,
      title: "Lower Costs",
      description: "No middlemen means lower fees and better value for members.",
    },
    {
      icon: <Users className="h-8 w-8 mb-2 text-yellow-500" />,
      title: "Member Control",
      description: "Vote on rules, claims, and important decisions together.",
    },
    {
      icon: <Coins className="h-8 w-8 mb-2 text-indigo-500" />,
      title: "Custom Rules",
      description: "Tailor coverage and requirements to your community's needs.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background lg:py-14">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl/none">
                  Insurance for everything, defined by you.
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl lg:text-lg xl:text-xl">
                  Mutual insurance pools onchain for everything from income loss to gadget repair.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/create" passHref>
                  <Button size="lg" className="w-full min-[400px]:w-auto text-base px-8 py-3">
                    Create insurance pool
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={user ? "/dashboard" : "#learn-more"} passHref>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full min-[400px]:w-auto bg-transparent text-base px-8 py-3"
                  >
                    {user ? "Go to Dashboard" : "Learn More"}
                  </Button>
                </Link>
              </div>
            </div>
            <img
              src="/placeholder.svg?width=600&height=600"
              width="600"
              height="600"
              alt="Hero"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* What is a Breadfund Section */}
      <section id="learn-more" className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium">
                The Model
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">A New Model for Insurance</h2>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                Bread Insurance creates peer-to-peer insurance pools where members contribute premiums and receive
                payouts for valid claims. Inspired by the Dutch{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Broodfonds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary transition-colors"
                >
                  "Broodfonds,"
                </a>{" "}
                it covers everything from income loss to device damage through community-based mutual support.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Crypto Enhances Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium">
                The Benefits
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">The Crypto Supercharge</h2>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                Cryptocurrency and blockchain technology elevate this model, offering enhanced transparency, efficiency,
                security, and global reach. Smart contracts automate processes, ensuring rules are enforced fairly and
                funds are managed securely.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl items-start gap-6 py-16 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {cryptoAdvantages.map((advantage, index) => (
              <div
                key={index}
                className="flex flex-col items-start p-8 rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="mb-4">{advantage.icon}</div>
                <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 border-t bg-background">
        <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Ready to Explore the Future of Insurance?
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
              Join or create an insurance pool today. Experience the power of community coverage, amplified by
              blockchain.
            </p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap mt-8">
            <Link href="/dashboard" passHref>
              <Button size="lg" className="text-base px-8 py-3">
                Explore Insurance Pools
              </Button>
            </Link>
            <Link href="/create" passHref>
              <Button size="lg" variant="outline" className="text-base px-8 py-3 bg-transparent">
                Create Your Own Pool
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
