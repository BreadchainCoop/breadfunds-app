"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Users, Shield, ArrowRight, X } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useToast } from "@/components/ui/use-toast"
import { ALLOWED_TOKENS_LIST } from "@/context/AppContext"

type FundTemplate = "custom" | "broodfonds"

const BROODFONDS_DEFAULTS = {
  name: "Sick Leave Support Fund",
  initialDeposit: "250",
  fixedMonthlyDeposit: "10",
  personalSaving: "75", // Mid-range of €33.75-€112.50, user can adjust
  depositInterval: "30",
  maxWithdrawalsPerMember: "24", // For 2 years
  minMembers: "25",
  maxMembers: "50",
}

export default function CreateBreadfundPage() {
  const { user, addBreadfund } = useAppContext()
  const router = useRouter()
  const { toast } = useToast()

  const [isCreating, setIsCreating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [showExplainer, setShowExplainer] = useState(true)
  const [currentExplainerStep, setCurrentExplainerStep] = useState(0)

  const [template, setTemplate] = useState<FundTemplate>("custom")
  const [name, setName] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")
  const [initialDeposit, setInitialDeposit] = useState("50")
  const [fixedMonthlyDeposit, setFixedMonthlyDeposit] = useState("10")
  const [personalSaving, setPersonalSaving] = useState("100")
  const [depositInterval, setDepositInterval] = useState("30")
  const [maxWithdrawalsPerMember, setMaxWithdrawalsPerMember] = useState("24")
  const [minMembers, setMinMembers] = useState("3")
  const [maxMembers, setMaxMembers] = useState("50")

  const explainerCards = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Mutual Insurance Pool",
      description:
        "A group of people pool money together to help each other during emergencies. No big insurance company needed.",
      details:
        "Think of it as a shared emergency fund where everyone contributes small amounts regularly, and members can request help when they face covered situations like illness or equipment damage.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "You're About to Create a New Pool",
      description: "You'll set up the rules, contribution amounts, and coverage terms that all members will follow.",
      details:
        "As the creator, you define how much members contribute monthly, what situations are covered, and how claims work. This becomes the foundation for your insurance community.",
    },
    {
      icon: <ArrowRight className="h-8 w-8 text-primary" />,
      title: "Set Your Rules",
      description:
        "Define monthly contributions, coverage amounts, member limits, and what situations qualify for claims.",
      details:
        "These rules ensure fairness and sustainability. You'll set contribution amounts, maximum payouts, and the minimum number of members needed before the pool becomes active.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Invite Members & Start Coverage",
      description: "Once you have enough members, everyone starts contributing and the pool becomes active for claims.",
      details:
        "Share your pool with friends, colleagues, or community members. When you reach the minimum member count, everyone begins making regular contributions and coverage starts.",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Claims Are Voted On",
      description:
        "All claims can be contested and decided by member votes, ensuring transparency and preventing fraud.",
      details:
        "When someone makes a claim, other members can review and vote on it. This democratic process keeps the system fair and builds trust within the community.",
    },
  ]

  const loadingSteps = [
    "Validating pool parameters...",
    "Setting up smart contract...",
    "Initializing member registry...",
    "Configuring payment system...",
    "Finalizing pool creation...",
  ]

  const handleNextExplainer = () => {
    if (currentExplainerStep < explainerCards.length - 1) {
      setCurrentExplainerStep(currentExplainerStep + 1)
    } else {
      setShowExplainer(false)
    }
  }

  const handleSkipExplainer = () => {
    setShowExplainer(false)
  }

  useEffect(() => {
    if (template === "broodfonds") {
      setName(BROODFONDS_DEFAULTS.name)
      setInitialDeposit(BROODFONDS_DEFAULTS.initialDeposit)
      setFixedMonthlyDeposit(BROODFONDS_DEFAULTS.fixedMonthlyDeposit)
      setPersonalSaving(BROODFONDS_DEFAULTS.personalSaving)
      setDepositInterval(BROODFONDS_DEFAULTS.depositInterval)
      setMaxWithdrawalsPerMember(BROODFONDS_DEFAULTS.maxWithdrawalsPerMember)
      setMinMembers(BROODFONDS_DEFAULTS.minMembers)
      setMaxMembers(BROODFONDS_DEFAULTS.maxMembers)
    } else {
      // Optionally reset to custom defaults or leave as is if user switches back
      setName("")
      setInitialDeposit("50")
      setFixedMonthlyDeposit("10")
      setPersonalSaving("100")
      setDepositInterval("30")
      setMaxWithdrawalsPerMember("24")
      setMinMembers("3")
      setMaxMembers("50")
    }
  }, [template])

  console.log("[v0] User authentication state:", { user: !!user, userAddress: user?.address })
  console.log("[v0] Available tokens:", ALLOWED_TOKENS_LIST)
  console.log("[v0] Selected token address:", tokenAddress)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submission started")
    setIsCreating(true)
    setLoadingStep(0)

    try {
      if (!user) {
        console.log("[v0] No user found, showing auth error")
        toast({
          title: "Authentication Required",
          description: "Please sign in to create an insurance pool.",
          variant: "destructive",
        })
        setIsCreating(false)
        return
      }

      if (!tokenAddress) {
        console.log("[v0] No token selected")
        toast({
          title: "Token Required",
          description: "Please select a token for premiums and payouts.",
          variant: "destructive",
        })
        setIsCreating(false)
        return
      }

      const selectedToken = ALLOWED_TOKENS_LIST.find((t) => t.address === tokenAddress)
      if (!selectedToken) {
        console.log("[v0] Invalid token selected")
        toast({ title: "Error", description: "Invalid token selected.", variant: "destructive" })
        setIsCreating(false)
        return
      }

      for (let i = 0; i < loadingSteps.length; i++) {
        setLoadingStep(i)
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      console.log("[v0] Creating pool with data:", {
        name,
        token: selectedToken.symbol,
        tokenAddress: selectedToken.address,
        initialDeposit: Number.parseFloat(initialDeposit),
        fixedMonthlyDeposit: Number.parseFloat(fixedMonthlyDeposit),
        personalSaving: Number.parseFloat(personalSaving),
        depositInterval: Number.parseInt(depositInterval),
        maxWithdrawalsPerMember: Number.parseInt(maxWithdrawalsPerMember),
        minMembers: Number.parseInt(minMembers),
        maxMembers: Number.parseInt(maxMembers),
      })

      const newPoolId = await addBreadfund({
        name,
        token: selectedToken.symbol,
        tokenAddress: selectedToken.address,
        initialDeposit: Number.parseFloat(initialDeposit),
        fixedMonthlyDeposit: Number.parseFloat(fixedMonthlyDeposit),
        personalSaving: Number.parseFloat(personalSaving),
        depositInterval: Number.parseInt(depositInterval),
        maxWithdrawalsPerMember: Number.parseInt(maxWithdrawalsPerMember),
        minMembers: Number.parseInt(minMembers),
        maxMembers: Number.parseInt(maxMembers),
      })

      console.log("[v0] Pool created with ID:", newPoolId)

      toast({ title: "Success", description: `Insurance pool "${name}" created successfully!` })

      if (newPoolId) {
        console.log("[v0] Navigating to pool page:", `/breadfund/${newPoolId}`)
        router.push(`/breadfund/${newPoolId}`)
      } else {
        console.log("[v0] No pool ID returned, navigating to dashboard")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("[v0] Error creating pool:", error)
      toast({
        title: "Error",
        description: "Failed to create insurance pool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
      setLoadingStep(0)
      console.log("[v0] Form submission completed")
    }
  }

  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Creating Your Insurance Pool</CardTitle>
            <CardDescription>Please wait while we set up your pool...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>

              <div className="w-full space-y-3">
                {loadingSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full flex-shrink-0 ${
                        index < loadingStep
                          ? "bg-green-500"
                          : index === loadingStep
                            ? "bg-primary animate-pulse"
                            : "bg-muted"
                      }`}
                    />
                    <span className={`text-sm ${index <= loadingStep ? "text-foreground" : "text-muted-foreground"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center space-y-2 pt-4">
                <p className="text-sm font-medium">Pool: {name}</p>
                <p className="text-xs text-muted-foreground">
                  Token: {ALLOWED_TOKENS_LIST.find((t) => t.address === tokenAddress)?.symbol}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showExplainer) {
    const currentCard = explainerCards[currentExplainerStep]
    return (
      <TooltipProvider>
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-center mb-4">{currentCard.icon}</div>
                  <CardTitle className="text-2xl mb-2">{currentCard.title}</CardTitle>
                  <CardDescription className="text-base">{currentCard.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkipExplainer}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-xs text-center">{currentCard.details}</p>

              {/* Progress indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {explainerCards.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      index === currentExplainerStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSkipExplainer}>
                Skip Tutorial
              </Button>
              <Button onClick={handleNextExplainer}>
                {currentExplainerStep < explainerCards.length - 1 ? "Next" : "Get Started"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Create New Insurance Pool</CardTitle>
              <CardDescription>Fill in the details for your new configurable insurance pool.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="template">Pool Template</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose a pre-configured template or start with custom settings</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={(value) => setTemplate(value as FundTemplate)} value={template}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Configuration</SelectItem>
                    <SelectItem value="broodfonds">Sick Leave Support (Broodfonds Style)</SelectItem>
                  </SelectContent>
                </Select>
                {template === "broodfonds" && (
                  <p className="text-xs text-muted-foreground">
                    This template pre-fills settings based on the traditional Broodfonds model for income support during
                    sickness. You can adjust any field.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="name">Pool Name</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>A descriptive name for your insurance pool that members will see</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Freelancer Laptop Insurance"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="token">Token for Premiums & Payouts *</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The cryptocurrency token used for all payments and claims in this pool</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select onValueChange={setTokenAddress} value={tokenAddress}>
                    <SelectTrigger id="token" className={!tokenAddress ? "border-red-300 focus:border-red-500" : ""}>
                      <SelectValue placeholder="Select a token (required)" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALLOWED_TOKENS_LIST.length > 0 ? (
                        ALLOWED_TOKENS_LIST.map((token) => (
                          <SelectItem key={token.address} value={token.address}>
                            {token.symbol} - {token.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No tokens available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {!tokenAddress && <p className="text-xs text-red-600">Please select a token to continue</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="initialDeposit">Start Deposit (one-time fee)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>One-time fee members pay when joining the pool to build initial reserves</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="initialDeposit"
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    placeholder="e.g., 50"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="fixedMonthlyDeposit">Monthly deposit (Monthly premium)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Regular amount all members contribute to maintain the pool</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="fixedMonthlyDeposit"
                    type="number"
                    value={fixedMonthlyDeposit}
                    onChange={(e) => setFixedMonthlyDeposit(e.target.value)}
                    placeholder="e.g., 10"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="personalSaving">Your Monthly Personal Premium</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Amount you can claim per month when making a valid insurance claim</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="personalSaving"
                    type="number"
                    value={personalSaving}
                    onChange={(e) => setPersonalSaving(e.target.value)}
                    placeholder="e.g., 100"
                    min="1"
                    required
                  />
                  {template === "broodfonds" && (
                    <p className="text-xs text-muted-foreground">Broodfonds range: 33.75 - 112.50. Adjust as needed.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="depositInterval">Premium Interval (days)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>How often members need to make their regular premium payments (30 = monthly)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={[Number.parseInt(minMembers)]}
                      onValueChange={(value) => setMinMembers(value[0].toString())}
                      max={100}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      id="minMembers"
                      type="number"
                      value={minMembers}
                      onChange={(e) => setMinMembers(e.target.value)}
                      placeholder="e.g., 3"
                      min="2"
                      max="100"
                      required
                      className="text-center"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="maxMembers">Max Members in Pool</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum number of members allowed in this pool to maintain sustainability</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={[Number.parseInt(maxMembers)]}
                      onValueChange={(value) => setMaxMembers(value[0].toString())}
                      max={200}
                      min={Number.parseInt(minMembers) || 2}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      id="maxMembers"
                      type="number"
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(e.target.value)}
                      placeholder="e.g., 50"
                      min={minMembers || "2"}
                      max="200"
                      required
                      className="text-center"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Pool...
                  </>
                ) : (
                  "Create Pool"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </TooltipProvider>
  )
}
