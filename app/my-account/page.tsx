"use client"

import { useAppContext } from "@/context/AppContext"
import BreadInsuranceCard from "@/components/bread-insurance-card"
import UserStatusCard from "@/components/user-status-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Vote,
  Send,
  Info,
  CheckCircle,
  XCircle,
  Users,
  HandCoins,
  User,
  CreditCard,
  AlertTriangle,
  Clock,
  Coins,
  Calendar,
  TagIcon as Label,
  FileInputIcon as Input,
} from "lucide-react"
import type { WithdrawalRequest } from "@/lib/types"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function MyAccountPage() {
  const { user, breadInsurances, voteOnRequest, processWithdrawal } = useAppContext()

  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-semibold mb-4">My Account</h1>
        <p className="text-muted-foreground">Please sign in to access your account information.</p>
      </div>
    )
  }

  const myFunds = breadInsurances?.filter((fund) => fund.members.includes(user.address)) || []

  // Get pending actions
  const actions: { type: "vote" | "withdraw"; fundId: string; fundName: string; request: WithdrawalRequest }[] = []

  breadInsurances?.forEach((fund) => {
    if (fund.members.includes(user.address)) {
      fund.withdrawalRequests.forEach((req) => {
        // Pending votes
        if (req.status === "pending" && req.requester !== user.address && !req.votes[user.address]) {
          actions.push({ type: "vote", fundId: fund.id, fundName: fund.name, request: req })
        }
        // Approved withdrawals for user
        if (req.status === "approved" && req.requester === user.address) {
          actions.push({ type: "withdraw", fundId: fund.id, fundName: fund.name, request: req })
        }
      })
    }
  })

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">My Account</h1>
        <p className="text-lg text-muted-foreground">Manage your memberships and pending actions</p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          <User className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Account Overview</h2>
            <p className="text-sm text-muted-foreground">Your current status and activity summary</p>
          </div>
        </div>
        <div className="max-w-md">
          <UserStatusCard />
        </div>
      </section>

      {/* My Memberships Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          <Users className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">My Memberships</h2>
            <p className="text-sm text-muted-foreground">Insurance pools you're currently a member of</p>
          </div>
        </div>
        {myFunds.length === 0 ? (
          <Alert className="border-l-4 border-l-primary">
            <Info className="h-5 w-5" />
            <AlertTitle className="text-lg">No Memberships Found</AlertTitle>
            <AlertDescription className="text-base mt-2">
              You are not currently a member of any Bread Insurance. You can explore available funds on the dashboard or
              create a new one.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFunds.map((fund) => (
              <BreadInsuranceCard key={fund.id} fund={fund} />
            ))}
          </div>
        )}
      </section>

      {/* Pending Actions Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          <HandCoins className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Pending Actions</h2>
            <p className="text-sm text-muted-foreground">Votes and withdrawals requiring your attention</p>
          </div>
        </div>
        {actions.length === 0 ? (
          <Alert className="border-l-4 border-l-primary">
            <Info className="h-5 w-5" />
            <AlertTitle className="text-lg">No Pending Actions</AlertTitle>
            <AlertDescription className="text-base mt-2">
              You have no pending votes or withdrawals requiring your attention at this time.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {actions.map((action, index) => (
              <Card
                key={`${action.fundId}-${action.request.id}-${index}`}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    {action.type === "vote" ? (
                      <Vote className="mr-3 h-6 w-6 text-blue-500" />
                    ) : (
                      <Send className="mr-3 h-6 w-6 text-green-500" />
                    )}
                    {action.type === "vote" ? "Vote Required" : "Withdrawal Approved"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    In Bread Insurance:{" "}
                    <Link
                      href={`/bread-insurance/${action.fundId}`}
                      className="underline hover:text-primary font-medium"
                    >
                      {action.fundName}
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <p>
                      <span className="font-medium">Request ID:</span> {action.request.id.substring(0, 8)}...
                    </p>
                    <p>
                      <span className="font-medium">Requester:</span>{" "}
                      {action.request.requester === user.address
                        ? "You"
                        : `${action.request.requester.substring(0, 6)}...`}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> {action.request.amountRequested}{" "}
                      {breadInsurances?.find((f) => f.id === action.fundId)?.token}
                    </p>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Reason:</span> {action.request.reason}
                  </p>
                  {action.type === "vote" && (
                    <div className="mt-6 flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => voteOnRequest(action.fundId, action.request.id, user.address, "yes")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Vote Yes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => voteOnRequest(action.fundId, action.request.id, user.address, "no")}
                      >
                        <XCircle className="mr-2 h-4 w-4 text-red-500" /> Vote No
                      </Button>
                    </div>
                  )}
                  {action.type === "withdraw" && (
                    <Button
                      className="mt-6 w-full"
                      size="sm"
                      onClick={() => processWithdrawal(action.fundId, action.request.id)}
                    >
                      Withdraw Approved Amount
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Premium Payments Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          <CreditCard className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Payments</h2>
            <p className="text-sm text-muted-foreground">Manage your insurance pool premium payments</p>
          </div>
        </div>

        {myFunds.length === 0 ? (
          <Alert className="border-l-4 border-l-primary">
            <Info className="h-5 w-5" />
            <AlertTitle className="text-lg">No Payments</AlertTitle>
            <AlertDescription className="text-base mt-2">
              You don't have any active memberships requiring premium payments.
            </AlertDescription>
          </Alert>
        ) : (
          <PremiumPaymentSection userMemberships={myFunds} />
        )}
      </section>
    </div>
  )
}

function PremiumPaymentSection({ userMemberships }: { userMemberships: any[] }) {
  const { user, addDeposit } = useAppContext()
  const { toast } = useToast()
  const [paymentAmounts, setPaymentAmounts] = useState<{ [poolId: string]: string }>({})
  const [isProcessing, setIsProcessing] = useState<{ [poolId: string]: boolean }>({})

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
    const fund = userMemberships.find((f) => f.id === poolId)

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

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4">
        {userMemberships.map((fund) => {
          const premiumStatus = calculatePremiumStatus(fund)
          const currentAmount = paymentAmounts[fund.id] || premiumStatus.amount.toString()

          return (
            <Card
              key={fund.id}
              className={`${premiumStatus.status === "overdue" ? "border-red-200 bg-red-50/50" : "border-green-200 bg-green-50/50"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
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

              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
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
                </div>

                <div className="border-t pt-3">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`amount-${fund.id}`} className="text-sm">
                        Payment Amount ({fund.token})
                      </Label>
                      <Input
                        id={`amount-${fund.id}`}
                        type="number"
                        value={currentAmount}
                        onChange={(e) => setPaymentAmounts((prev) => ({ ...prev, [fund.id]: e.target.value }))}
                        placeholder={premiumStatus.amount.toString()}
                        min={premiumStatus.amount}
                        step="0.01"
                        className="mt-1"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Minimum: {premiumStatus.amount} {fund.token}
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePayment(fund.id)}
                      disabled={
                        isProcessing[fund.id] ||
                        !currentAmount ||
                        Number.parseFloat(currentAmount) < premiumStatus.amount
                      }
                      size="sm"
                      className="min-w-[100px]"
                    >
                      {isProcessing[fund.id] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {premiumStatus.status === "overdue" && (
                  <div className="bg-red-100 border border-red-200 rounded-md p-3">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium text-sm">Payment Required</span>
                    </div>
                    <p className="text-red-700 text-xs mt-1">
                      Your premium is {premiumStatus.daysSince} days overdue. Pay now to maintain coverage.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
