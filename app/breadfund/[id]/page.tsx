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
} from "lucide-react"
import type { WithdrawalRequest } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"

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

  useEffect(() => {
    setFund(breadfunds.find((f) => f.id === fundId))
  }, [breadfunds, fundId])

  if (!fund) {
    return <p className="text-center py-10">Breadfund not found.</p>
  }
  if (!user) {
    return <p className="text-center py-10">Please connect your wallet to view fund details.</p>
  }

  const isMember = fund.members.includes(user.address)
  const userPersonalSaving = fund.memberPersonalSavings[user.address] || 0
  const userFixedMonthlyDeposit = fund.fixedMonthlyDeposit
  const totalMonthlyContribution = userPersonalSaving + userFixedMonthlyDeposit

  const handleDeposit = () => {
    const amount = Number.parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Error", description: "Invalid deposit amount.", variant: "destructive" })
      return
    }
    if (amount < totalMonthlyContribution) {
      toast({
        title: "Info",
        description: `Minimum deposit is ${totalMonthlyContribution} ${fund.token} (Fixed: ${userFixedMonthlyDeposit} + Personal: ${userPersonalSaving})`,
        variant: "default",
      })
      return
    }
    addDeposit(fund.id, user.address, amount)
    toast({ title: "Success", description: `Deposited ${amount} ${fund.token}.` })
    setDepositAmount("")
  }

  const handleRequestWithdrawal = () => {
    const amount = Number.parseFloat(requestAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Error", description: "Invalid request amount.", variant: "destructive" })
      return
    }
    if (!requestReason.trim()) {
      toast({ title: "Error", description: "Please provide a reason for your request.", variant: "destructive" })
      return
    }
    createWithdrawalRequest(fund.id, user.address, amount, requestReason)
    toast({ title: "Success", description: `Withdrawal request for ${amount} ${fund.token} submitted.` })
    setRequestAmount("")
    setRequestReason("")
  }

  const handleVote = (requestId: string, vote: "yes" | "no") => {
    voteOnRequest(fund.id, requestId, user.address, vote)
    toast({ title: "Success", description: `Voted ${vote} on request ${requestId}.` })
  }

  const handleProcessWithdrawal = (requestId: string) => {
    processWithdrawal(fund.id, requestId)
    toast({ title: "Success", description: `Withdrawal for request ${requestId} processed.` })
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
            ID: {fund.id} - Owned by: {fund.owner.substring(0, 6)}...{fund.owner.substring(fund.owner.length - 4)}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Fund Details</h3>
            <p className="flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Token: {fund.token}
            </p>
            <p className="flex items-center">
              <Coins className="mr-2 h-5 w-5 text-primary" /> Total Balance: {fund.totalBalance.toLocaleString()}{" "}
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
              <Coins className="mr-2 h-5 w-5 text-primary" /> Fixed Monthly Deposit: {fund.fixedMonthlyDeposit}{" "}
              {fund.token}
            </p>
            <p className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Deposit Interval: {fund.depositInterval} days
            </p>
            <p className="flex items-center">
              <MessageSquareWarning className="mr-2 h-5 w-5 text-primary" /> Max Withdrawals/Member:{" "}
              {fund.maxWithdrawalsPerMember}
            </p>
          </div>
          {isMember && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Your Status</h3>
              <p>
                Your Personal Monthly Saving: {userPersonalSaving} {fund.token}
              </p>
              <p>
                Your Total Monthly Contribution: {totalMonthlyContribution} {fund.token}
              </p>
              <p>
                Last Contribution:{" "}
                {fund.memberContributionStatus[user.address]
                  ? new Date(fund.memberContributionStatus[user.address].lastDepositDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                Total Contributed: {fund.memberContributionStatus[user.address]?.totalContributed || 0} {fund.token}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {!isMember && (
        <Card>
          <CardHeader>
            <CardTitle>Join this Fund</CardTitle>
            <CardDescription>
              To participate, you need to make an initial deposit and set your personal monthly saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: Implement Join Fund Logic:
                1. User specifies their personal monthly saving amount.
                2. User pays initialDeposit + first (fixedMonthlyDeposit + personalSaving).
                3. User is added to fund.members and fund.memberPersonalSavings.
            */}
            <Button disabled>Join Fund (Not Implemented)</Button>
            <p className="text-xs text-muted-foreground mt-2">
              Joining requires an initial deposit of {fund.initialDeposit} {fund.token} plus your first monthly
              contribution.
            </p>
          </CardContent>
        </Card>
      )}

      {isMember && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Make a Deposit</CardTitle>
              <CardDescription>
                Contribute your monthly amount (Fixed: {userFixedMonthlyDeposit} + Personal: {userPersonalSaving} ={" "}
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
              <Button onClick={handleDeposit}>Deposit</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>If you need assistance, you can request a withdrawal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="requestAmount">Amount ({fund.token})</Label>
                <Input
                  id="requestAmount"
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="e.g., 200"
                />
              </div>
              <div>
                <Label htmlFor="requestReason">Reason for Request</Label>
                <Textarea
                  id="requestReason"
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Briefly explain your need"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRequestWithdrawal}>Submit Request</Button>
            </CardFooter>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>Review and vote on pending requests, or manage your approved requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {fund.withdrawalRequests.length === 0 ? (
            <p className="text-muted-foreground">No active withdrawal requests.</p>
          ) : (
            <ul className="space-y-4">
              {fund.withdrawalRequests.map((req) => (
                <li key={req.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Request ID: {req.id.substring(0, 8)}...</p>
                      <p>
                        Requester: {req.requester === user?.address ? "You" : `${req.requester.substring(0, 6)}...`}
                      </p>
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
                      Withdraw Approved Amount
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
                  Personal Saving: {fund.memberPersonalSavings[memberAddress] || "N/A"} {fund.token}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
