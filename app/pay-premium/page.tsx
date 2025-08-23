"use client"

import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { CreditCard, Clock, CheckCircle, AlertTriangle, Coins, Calendar } from "lucide-react"
import Link from "next/link"

export default function PayPremiumPage() {
  const { user, breadfunds, addDeposit } = useAppContext()
  const { toast } = useToast()
  const [paymentAmounts, setPaymentAmounts] = useState<{ [poolId: string]: string }>({})
  const [isProcessing, setIsProcessing] = useState<{ [poolId: string]: boolean }>({})

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Please sign in to view your premium payments.</p>
        <Button onClick={() => (window.location.href = "/")}>Go to Homepage</Button>
      </div>
    )
  }

  const userMemberships = breadfunds.filter((fund) => fund.members.includes(user.address))

  const calculatePremiumStatus = (fund: any) => {
    const memberStatus = fund.memberContributionStatus[user.address]
    const personalPremium = fund.memberPersonalSavings[user.address] || 0
    const totalRequired = fund.fixedMonthlyDeposit + personalPremium

    if (!memberStatus) {
      return {
        status: "overdue",
        daysSince: Number.POSITIVE_INFINITY,
        amount: totalRequired,
        lastPayment: null,
      }
    }

    const lastPaymentDate = new Date(memberStatus.lastDepositDate)
    const currentDate = new Date()
    const daysSince = Math.floor((currentDate.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24))
    const isOverdue = daysSince > fund.depositInterval

    return {
      status: isOverdue ? "overdue" : "current",
      daysSince,
      amount: totalRequired,
      lastPayment: lastPaymentDate,
      totalContributed: memberStatus.totalContributed,
    }
  }

  const handlePayment = async (poolId: string) => {
    const amount = Number.parseFloat(paymentAmounts[poolId] || "0")
    const fund = breadfunds.find((f) => f.id === poolId)

    if (!fund) return

    const premiumStatus = calculatePremiumStatus(fund)

    if (amount < premiumStatus.amount) {
      toast({
        title: "Insufficient Amount",
        description: `Minimum premium is ${premiumStatus.amount} ${fund.token}`,
        variant: "destructive",
      })
      return
    }

    setIsProcessing((prev) => ({ ...prev, [poolId]: true }))

    try {
      addDeposit(poolId, user.address, amount)
      toast({
        title: "Payment Successful",
        description: `Paid ${amount} ${fund.token} premium for ${fund.name}`,
      })
      setPaymentAmounts((prev) => ({ ...prev, [poolId]: "" }))
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsProcessing((prev) => ({ ...prev, [poolId]: false }))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "current":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "overdue":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  if (userMemberships.length === 0) {
    return (
      <div className="text-center py-10">
        <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Active Memberships</h2>
        <p className="text-muted-foreground mb-6">You're not a member of any insurance pools yet.</p>
        <Link href="/dashboard">
          <Button>Browse Available Pools</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Premium Payments</h1>
        <p className="text-muted-foreground">Manage your insurance pool premium payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {userMemberships.filter((fund) => calculatePremiumStatus(fund).status === "current").length}
              </div>
              <div className="text-sm text-muted-foreground">Current Payments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {userMemberships.filter((fund) => calculatePremiumStatus(fund).status === "overdue").length}
              </div>
              <div className="text-sm text-muted-foreground">Overdue Payments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {userMemberships
                  .reduce((total, fund) => {
                    const status = calculatePremiumStatus(fund)
                    return total + (status.totalContributed || 0)
                  }, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Contributed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {userMemberships.map((fund) => {
          const premiumStatus = calculatePremiumStatus(fund)
          const currentAmount = paymentAmounts[fund.id] || premiumStatus.amount.toString()

          return (
            <Card
              key={fund.id}
              className={`${premiumStatus.status === "overdue" ? "border-red-200 bg-red-50/50" : "border-green-200 bg-green-50/50"}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(premiumStatus.status)}
                      {fund.name}
                    </CardTitle>
                    <CardDescription>
                      Pool ID: {fund.id} • Token: {fund.token}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${premiumStatus.status === "overdue" ? "text-red-600" : "text-green-600"}`}
                    >
                      {premiumStatus.status === "overdue" ? "Payment Overdue" : "Premium Current"}
                    </div>
                    {premiumStatus.lastPayment && (
                      <div className="text-xs text-muted-foreground">
                        Last paid: {premiumStatus.lastPayment.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Required Premium</div>
                      <div className="text-muted-foreground">
                        {premiumStatus.amount} {fund.token}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Payment Interval</div>
                      <div className="text-muted-foreground">Every {fund.depositInterval} days</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Total Contributed</div>
                      <div className="text-muted-foreground">
                        {premiumStatus.totalContributed || 0} {fund.token}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`amount-${fund.id}`}>Payment Amount ({fund.token})</Label>
                      <Input
                        id={`amount-${fund.id}`}
                        type="number"
                        value={currentAmount}
                        onChange={(e) => setPaymentAmounts((prev) => ({ ...prev, [fund.id]: e.target.value }))}
                        placeholder={premiumStatus.amount.toString()}
                        min={premiumStatus.amount}
                        step="0.01"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Minimum: {premiumStatus.amount} {fund.token} (Fixed: {fund.fixedMonthlyDeposit} + Personal:{" "}
                        {fund.memberPersonalSavings[user.address] || 0})
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePayment(fund.id)}
                      disabled={
                        isProcessing[fund.id] ||
                        !currentAmount ||
                        Number.parseFloat(currentAmount) < premiumStatus.amount
                      }
                      className="min-w-[120px]"
                    >
                      {isProcessing[fund.id] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Premium
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {premiumStatus.status === "overdue" && (
                  <div className="bg-red-100 border border-red-200 rounded-md p-3">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Payment Required</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      Your premium is {premiumStatus.daysSince} days overdue. Pay now to maintain your coverage and
                      avoid penalties.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <Link href={`/breadfund/${fund.id}`}>
                    <Button variant="outline" size="sm">
                      View Pool Details
                    </Button>
                  </Link>

                  <div className="text-muted-foreground">
                    Next payment due:{" "}
                    {premiumStatus.lastPayment
                      ? new Date(
                          premiumStatus.lastPayment.getTime() + fund.depositInterval * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString()
                      : "Immediately"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
