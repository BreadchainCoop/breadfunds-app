"use client"

import { useAppContext } from "@/context/AppContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Vote, Send, Info, CheckCircle, XCircle } from "lucide-react"
import type { WithdrawalRequest } from "@/lib/types"

export default function PendingActionsPage() {
  const { user, breadInsurances, voteOnRequest, processWithdrawal } = useAppContext()

  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-semibold mb-4">Pending Actions</h1>
        <p className="text-muted-foreground">Please connect your wallet to see actions requiring your attention.</p>
      </div>
    )
  }

  const actions: { type: "vote" | "withdraw"; fundId: string; fundName: string; request: WithdrawalRequest }[] = []

  breadInsurances.forEach((fund) => {
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
    <div>
      <h1 className="text-3xl font-semibold mb-8">Pending Actions</h1>
      {actions.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Pending Actions</AlertTitle>
          <AlertDescription>
            You have no pending votes or withdrawals requiring your attention at this time.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {actions.map((action, index) => (
            <Card key={`${action.fundId}-${action.request.id}-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {action.type === "vote" ? (
                    <Vote className="mr-2 h-5 w-5 text-blue-500" />
                  ) : (
                    <Send className="mr-2 h-5 w-5 text-green-500" />
                  )}
                  {action.type === "vote" ? "Vote Required" : "Withdrawal Approved"}
                </CardTitle>
                <CardDescription>
                  In Bread Insurance:{" "}
                  <Link href={`/bread-insurance/${action.fundId}`} className="underline hover:text-primary">
                    {action.fundName}
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Request ID: {action.request.id.substring(0, 8)}...</p>
                <p>
                  Requester:{" "}
                  {action.request.requester === user.address ? "You" : `${action.request.requester.substring(0, 6)}...`}
                </p>
                <p>
                  Amount: {action.request.amountRequested} {breadInsurances.find((f) => f.id === action.fundId)?.token}
                </p>
                <p>Reason: {action.request.reason}</p>
                {action.type === "vote" && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => voteOnRequest(action.fundId, action.request.id, user.address, "yes")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Vote Yes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => voteOnRequest(action.fundId, action.request.id, user.address, "no")}
                    >
                      <XCircle className="mr-2 h-4 w-4 text-red-500" /> Vote No
                    </Button>
                  </div>
                )}
                {action.type === "withdraw" && (
                  <Button
                    className="mt-4"
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
    </div>
  )
}
