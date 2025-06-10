"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, ShieldCheck, Zap, Globe, BarChart, Coins, Laptop, Smartphone } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export default function LandingPage() {
  const { user } = useAppContext()

  const features = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community-Powered Insurance",
      description:
        "Breadfunds are collective insurance pools where members cover each other for specific, predefined risks.",
    },
    {
      icon: (
        <div className="flex -space-x-2">
          <Laptop className="h-10 w-10 text-primary" />
          <Smartphone className="h-10 w-10 text-primary" />
        </div>
      ),
      title: "Flexible & Configurable",
      description:
        "From income loss for freelancers to coverage for phone or laptop damage, create a fund for almost any need.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Crypto-Enhanced",
      description:
        "Leveraging blockchain for transparency, automation, and global accessibility, making insurance more efficient and fair.",
    },
  ]

  const cryptoAdvantages = [
    {
      icon: <BarChart className="h-8 w-8 mb-2 text-green-500" />,
      title: "Unprecedented Transparency",
      description:
        "All fund rules, premiums, and payouts are recorded on an immutable public ledger, auditable by any member at any time.",
    },
    {
      icon: <Globe className="h-8 w-8 mb-2 text-blue-500" />,
      title: "Global & Permissionless",
      description:
        "Break down geographical barriers. Anyone with a crypto wallet can create or join an insurance pool from anywhere in the world.",
    },
    {
      icon: <Zap className="h-8 w-8 mb-2 text-purple-500" />,
      title: "Automated Claims & Payouts",
      description:
        "Smart contracts handle premium collection, manage claims, facilitate voting on contested claims, and execute payouts automatically.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 mb-2 text-red-500" />,
      title: "Drastically Reduced Overhead",
      description:
        "By removing intermediaries, the cost of managing the insurance pool is minimized, leading to lower premiums for members.",
    },
    {
      icon: <Users className="h-8 w-8 mb-2 text-yellow-500" />,
      title: "True Peer-to-Peer Governance",
      description:
        "Members directly govern their fund, voting on rule changes, claim approvals, and other critical decisions.",
    },
    {
      icon: <Coins className="h-8 w-8 mb-2 text-indigo-500" />,
      title: "Programmable & Customizable",
      description:
        "Easily define and enforce custom rules for coverage, premiums, and claim processing, tailored to any community's specific needs.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Configurable Insurance, Powered by Community.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover Breadfunds: Peer-to-peer insurance pools on the blockchain for everything from income loss to
                  gadget repair.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href={user ? "/dashboard" : "#learn-more"} passHref>
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    {user ? "Go to Dashboard" : "Learn More"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {!user && (
                  <Link href="/dashboard" passHref>
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Explore Pools
                    </Button>
                  </Link>
                )}
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
      <section id="learn-more" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">The Model</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A New Model for Insurance</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A Breadfund is a highly flexible model for peer-to-peer insurance, inspired by the Dutch{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Broodfonds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  "Broodfonds,"
                </a>
                . Members make regular contributions (premiums) to a collective pool. When a member has a valid
                claim—whether for income loss like the original "Broodfonds," or for material loss like a broken laptop
                or phone—they receive a payout from this shared fund. It's a system built on aligned incentives and
                direct, community-based coverage.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                {feature.icon}
                <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Crypto Enhances Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm">
                Blockchain Advantage
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">The Crypto Supercharge</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Cryptocurrency and blockchain technology elevate this model, offering enhanced transparency, efficiency,
                security, and global reach. Smart contracts automate processes, ensuring rules are enforced fairly and
                funds are managed securely.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-none items-start gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {cryptoAdvantages.map((advantage, index) => (
              <div
                key={index}
                className="flex flex-col items-start p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                {advantage.icon}
                <h3 className="text-lg font-bold mb-1">{advantage.title}</h3>
                <p className="text-sm text-muted-foreground">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Explore the Future of Insurance?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join or create an insurance pool today. Experience the power of community coverage, amplified by
              blockchain.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <div className="flex gap-2 justify-center">
              <Link href="/dashboard" passHref>
                <Button size="lg">Explore Insurance Pools</Button>
              </Link>
              <Link href="/create" passHref>
                <Button size="lg" variant="outline">
                  Create Your Own Pool
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
