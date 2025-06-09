"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/context/AppContext"
import { useToast } from "@/components/ui/use-toast"
import { ALLOWED_TOKENS_LIST } from "@/context/AppContext" // Using the list from context

export default function CreateBreadfundPage() {
  const { user, addBreadfund } = useAppContext()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")
  const [initialDeposit, setInitialDeposit] = useState("50")
  const [fixedMonthlyDeposit, setFixedMonthlyDeposit] = useState("10")
  const [personalSaving, setPersonalSaving] = useState("100") // Creator's personal saving
  const [depositInterval, setDepositInterval] = useState("30")
  const [maxWithdrawalsPerMember, setMaxWithdrawalsPerMember] = useState("24")
  const [minMembers, setMinMembers] = useState("3")
  const [maxMembers, setMaxMembers] = useState("50")

  if (!user) {
    // Or redirect, or show a message
    return <p className="text-center py-10">Please connect your wallet to create a Breadfund.</p>
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
      personalSaving: Number.parseFloat(personalSaving), // This is for the creator
      depositInterval: Number.parseInt(depositInterval),
      maxWithdrawalsPerMember: Number.parseInt(maxWithdrawalsPerMember),
      minMembers: Number.parseInt(minMembers),
      maxMembers: Number.parseInt(maxMembers),
    })
    toast({ title: "Success", description: `Breadfund "${name}" created!` })
    router.push("/")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create New Breadfund</CardTitle>
            <CardDescription>Fill in the details for your new mutual aid fund.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Fund Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Freelancers Support Group"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
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
                <Label htmlFor="initialDeposit">Initial Deposit (one-time fee)</Label>
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
                <Label htmlFor="fixedMonthlyDeposit">Fixed Monthly Deposit (admin fee)</Label>
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
                <Label htmlFor="personalSaving">Your Monthly Personal Saving</Label>
                <Input
                  id="personalSaving"
                  type="number"
                  value={personalSaving}
                  onChange={(e) => setPersonalSaving(e.target.value)}
                  placeholder="e.g., 100"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depositInterval">Deposit Interval (days)</Label>
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
                <Label htmlFor="maxWithdrawals">Max Withdrawals per Member</Label>
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
              <div className="space-y-2">
                <Label htmlFor="minMembers">Min Members</Label>
                <Input
                  id="minMembers"
                  type="number"
                  value={minMembers}
                  onChange={(e) => setMinMembers(e.target.value)}
                  placeholder="e.g., 3"
                  min="2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Max Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  placeholder="e.g., 50"
                  min={minMembers}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Fund
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
