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
import { HelpCircle } from "lucide-react"
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

  if (!user) {
    return <p className="text-center py-10">Please connect your wallet to create an insurance pool.</p>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenAddress) {
      toast({ title: "Error", description: "Please select a token.", variant: "destructive" })
      return
    }
    const selectedToken = ALLOWED_TOKENS_LIST.find((t) => t.address === tokenAddress)
    if (!selectedToken) {
      toast({ title: "Error", description: "Invalid token selected.", variant: "destructive" })
      return
    }

    addBreadfund({
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
    toast({ title: "Success", description: `Insurance pool "${name}" created!` })
    router.push("/dashboard")
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
                    <Label htmlFor="token">Token for Premiums & Payouts</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The cryptocurrency token used for all payments and claims in this pool</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select onValueChange={setTokenAddress} value={tokenAddress} required>
                    <SelectTrigger id="token">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALLOWED_TOKENS_LIST.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <div className="space-y-2">
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
                  <Input
                    id="depositInterval"
                    type="number"
                    value={depositInterval}
                    onChange={(e) => setDepositInterval(e.target.value)}
                    placeholder="e.g., 30"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="maxWithdrawals">Max Claims per Member (total)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum number of times a member can make claims over the pool's lifetime</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="maxWithdrawals"
                    type="number"
                    value={maxWithdrawalsPerMember}
                    onChange={(e) => setMaxWithdrawalsPerMember(e.target.value)}
                    placeholder="e.g., 24"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="minMembers">Min Members to Activate Pool</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Minimum number of members needed before the pool becomes active and functional</p>
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
              <Button type="submit" className="w-full">
                Create Pool
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </TooltipProvider>
  )
}
