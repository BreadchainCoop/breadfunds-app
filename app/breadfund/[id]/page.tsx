"use client"

import { useParams, useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import {
  Users,
  ShieldCheck,
  Coins,
  CalendarDays,
  Handshake,
  MessageSquareWarning,
  CheckCircle,
  XCircle,
  Hourglass,
  Send,
  LogOut,
  AlertTriangle,
} from "lucide-react"
import type { WithdrawalRequest } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BreadfundDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, breadfunds, addDeposit, createWithdrawalRequest, voteOnRequest, processWithdrawal } = useAppContext()
  const fundId = params.id as string

  const [fund, setFund] = useState(breadfunds.find((f) => f.id === fundId))
  const [depositAmount, setDepositAmount] = useState("")
  const [requestAmount, setRequestAmount] = useState("")
  const [requestReason, setRequestReason] = useState("")
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  useEffect(() => {
    setFund(breadfunds.find((f) => f.id === fundId))
  }, [breadfunds, fundId])

  if (!fund) {
    return <p className="text-center py-10">Insurance pool not found.</p>
  }
  if (!user) {
    return <p className="text-center py-10">Please connect your wallet to view pool details.</p>
  }

  const isMember = fund.members.includes(user.address)
  const userPersonalSaving = fund.memberPersonalSavings[user.address] || 0
  const userFixedMonthlyDeposit = fund.fixedMonthlyDeposit
  const totalMonthlyContribution = userPersonalSaving + userFixedMonthlyDeposit

  const checkPremiumStatus = () => {
    const memberStatus = fund.memberContributionStatus[user.address]
    if (!memberStatus) return { hasPaid: false, daysSinceLastPayment: Number.POSITIVE_INFINITY }

    const lastPaymentDate = new Date(memberStatus.lastDepositDate)
    const currentDate = new Date()
    const daysSinceLastPayment = Math.floor((currentDate.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24))

    const hasPaid = daysSinceLastPayment <= fund.depositInterval

    return { hasPaid, daysSinceLastPayment }
  }

  const { hasPaid, daysSinceLastPayment } = checkPremiumStatus()

  const handleDeposit = () => {
    const amount = Number.parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Error", description: "Invalid premium amount.", variant: "destructive" })
      return
    }
    if (amount < totalMonthlyContribution) {
      toast({
        title: "Info",
        description: `Minimum premium is ${totalMonthlyContribution} ${fund.token} (Fixed: ${userFixedMonthlyDeposit} + Personal: ${userPersonalSaving})`,
        variant: "default",
      })
      return
    }
    addDeposit(fund.id, user.address, amount)
    toast({ title: "Success", description: `Paid premium of ${amount} ${fund.token}.` })
    setDepositAmount("")
  }

  const handleLeavePool = () => {
    if (!hasPaid) {
      addDeposit(fund.id, user.address, totalMonthlyContribution)
      toast({
        title: "Premium Paid",
        description: `Paid outstanding premium of ${totalMonthlyContribution} ${fund.token}. You can now leave the pool.`,
      })
    } else {
      toast({
        title: "Left Pool",
        description: "You have successfully left the insurance pool.",
      })
      router.push("/my-account")
    }
    setShowLeaveDialog(false)
  }

  const handleRequestWithdrawal = () => {
    const amount = Number.parseFloat(requestAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Error", description: "Invalid claim amount.", variant: "destructive" })
      return
    }
    if (!requestReason.trim()) {
      toast({ title: "Error", description: "Please provide a reason for your claim.", variant: "destructive" })
      return
    }
    createWithdrawalRequest(fund.id, user.address, amount, requestReason)
    toast({ title: "Success", description: `Claim for ${amount} ${fund.token} submitted.` })
    setRequestAmount("")
    setRequestReason("")
  }

  const handleVote = (requestId: string, vote: "yes" | "no") => {
    voteOnRequest(fund.id, requestId, user.address, vote)
    toast({ title: "Success", description: `Voted ${vote} on claim ${requestId}.` })
  }

  const handleProcessWithdrawal = (requestId: string) => {
    processWithdrawal(fund.id, requestId)
    toast({ title: "Success", description: `Claim ${requestId} paid out.` })
  }

  const canVote = (request: WithdrawalRequest) => {
    return (
      isMember && request.requester !== user.address && !request.votes[user.address] && request.status === "pending"
    )
  }

  const canWithdraw = (request: WithdrawalRequest) => {
    return request.requester === user.address && request.status === "approved"
  }

  const getStatusIcon = (status: WithdrawalRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Hourglass className="h-4 w-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "withdrawn":
        return <Send className="h-4 w-4 text-blue-500" />
      default:
        return <MessageSquareWarning className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{fund.name}</CardTitle>
          <CardDescription>
            Pool ID: {fund.id} - Created by: {fund.owner.substring(0, 6)}...
            {fund.owner.substring(fund.owner.length - 4)}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Pool Details</h3>
            <p className="flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Token: {fund.token}
            </p>
            <p className="flex items-center">
              <Coins className="mr-2 h-5 w-5 text-primary" /> Total Liquidity: {fund.totalBalance.toLocaleString()}{" "}
              {fund.token}
            </p>
            <p className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" /> Members: {fund.members.length} / {fund.maxMembers} (Min:{" "}
              {fund.minMembers})
            </p>
            <p className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Created:{" "}
              {new Date(fund.breadfundStart).toLocaleDateString()}
            </p>
            <p className="flex items-center">
              <Handshake className="mr-2 h-5 w-5 text-primary" /> Initial Deposit: {fund.initialDeposit} {fund.token}
            </p>
            <p className="flex items-center">
              <Coins className="mr-2 h-5 w-5 text-primary" /> Fixed Monthly Premium: {fund.fixedMonthlyDeposit}{" "}
              {fund.token}
            </p>
            <p className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Premium Interval: {fund.depositInterval} days
            </p>
            <p className="flex items-center">
              <MessageSquareWarning className="mr-2 h-5 w-5 text-primary" /> Max Claims/Member:{" "}
              {fund.maxWithdrawalsPerMember}
            </p>
          </div>
          {isMember && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Your Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Your Personal Monthly Premium: {userPersonalSaving} {fund.token}
                </p>
                <p>
                  Your Total Monthly Premium: {totalMonthlyContribution} {fund.token}
                </p>
                <p>
                  Last Premium Paid:{" "}
                  {fund.memberContributionStatus[user.address]
                    ? new Date(fund.memberContributionStatus[user.address].lastDepositDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  Total Premiums Paid: {fund.memberContributionStatus[user.address]?.totalContributed || 0} {fund.token}
                </p>
                <div className="pt-2 border-t">
                  <p className={`text-sm font-medium ${hasPaid ? "text-green-600" : "text-red-600"}`}>
                    Premium Status: {hasPaid ? "✓ Current" : "⚠ Outstanding"}
                  </p>
                  {!hasPaid && (
                    <p className="text-xs text-muted-foreground">{daysSinceLastPayment} days since last payment</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <LogOut className="mr-2 h-4 w-4" />
                      Leave Pool
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                        Leave Insurance Pool
                      </DialogTitle>
                      <DialogDescription>
                        You are about to leave this insurance pool. Please review the conditions below.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {hasPaid ? (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>You can leave at no cost.</strong> Your premium is current and you have fulfilled
                            your obligations for this interval.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Outstanding premium required.</strong> You must pay your premium of{" "}
                            {totalMonthlyContribution} {fund.token} before leaving the pool.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          <strong>Leaving conditions:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Members can only leave after paying their last premium for the current interval</li>
                          <li>If premium is current: Leave immediately at no cost</li>
                          <li>If premium is outstanding: Must pay premium first, then leave</li>
                          <li>Once you leave, you will lose coverage and cannot rejoin without approval</li>
                        </ul>
                      </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleLeavePool} variant={hasPaid ? "destructive" : "default"}>
                        {hasPaid ? "Leave Pool" : `Pay Premium & Leave (${totalMonthlyContribution} ${fund.token})`}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>

      {!isMember && (
        <Card>
          <CardHeader>
            <CardTitle>Join this Pool</CardTitle>
            <CardDescription>
              To get coverage, you need to make an initial deposit and set your personal monthly premium.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Join Pool (Not Implemented)</Button>
            <p className="text-xs text-muted-foreground mt-2">
              Joining requires an initial deposit of {fund.initialDeposit} {fund.token} plus your first monthly premium.
            </p>
          </CardContent>
        </Card>
      )}

      {isMember && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Pay Premium</CardTitle>
              <CardDescription>
                Pay your monthly premium (Fixed: {userFixedMonthlyDeposit} + Personal: {userPersonalSaving} ={" "}
                {totalMonthlyContribution} {fund.token}).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="depositAmount">Amount ({fund.token})</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder={String(totalMonthlyContribution)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDeposit}>Pay Premium</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>File a Claim</CardTitle>
              <CardDescription>If you need to make a claim, you can request a withdrawal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="requestAmount">Claim Amount ({fund.token})</Label>
                <Input
                  id="requestAmount"
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="e.g., 200"
                />
              </div>
              <div>
                <Label htmlFor="requestReason">Reason for Claim</Label>
                <Textarea
                  id="requestReason"
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Briefly explain your claim (e.g., 'Cracked phone screen')"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRequestWithdrawal}>Submit Claim</Button>
            </CardFooter>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
          <CardDescription>Review and vote on pending claims, or manage your approved claims.</CardDescription>
        </CardHeader>
        <CardContent>
          {fund.withdrawalRequests.length === 0 ? (
            <p className="text-muted-foreground">No active claims.</p>
          ) : (
            <ul className="space-y-4">
              {fund.withdrawalRequests.map((req) => (
                <li key={req.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Claim ID: {req.id.substring(0, 8)}...</p>
                      <p>Claimant: {req.requester === user?.address ? "You" : `${req.requester.substring(0, 6)}...`}</p>
                      <p>
                        Amount: {req.amountRequested} {fund.token}
                      </p>
                      <p>Reason: {req.reason}</p>
                      <p className="text-sm text-muted-foreground">Date: {new Date(req.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(req.status)}
                      <span className="capitalize text-sm font-medium">{req.status}</span>
                    </div>
                  </div>
                  <p className="text-sm mt-1">
                    Votes: {req.votedYes} Yes / {req.votedNo} No (Requires {req.requiredVotes} Yes votes)
                  </p>

                  {canVote(req) && (
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleVote(req.id, "yes")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Vote Yes
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleVote(req.id, "no")}>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" /> Vote No
                      </Button>
                    </div>
                  )}
                  {req.votes[user.address] && req.status === "pending" && (
                    <p className="text-xs text-green-600 mt-2">You voted: {req.votes[user.address]}</p>
                  )}
                  {canWithdraw(req) && (
                    <Button className="mt-4" size="sm" onClick={() => handleProcessWithdrawal(req.id)}>
                      Withdraw Payout
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {fund.members.map((memberAddress) => (
              <li key={memberAddress} className="flex justify-between items-center">
                <span>
                  {memberAddress === user?.address
                    ? `You (${memberAddress.substring(0, 6)}...)`
                    : `${memberAddress.substring(0, 10)}...`}
                </span>
                <span className="text-muted-foreground">
                  Personal Premium: {fund.memberPersonalSavings[memberAddress] || "N/A"} {fund.token}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
