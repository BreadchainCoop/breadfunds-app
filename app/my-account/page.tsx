"use client"

import { useAppContext } from "@/context/AppContext"
import BreadInsuranceCard from "@/components/bread-insurance-card"
import UserStatusCard from "@/components/user-status-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Vote, Send, Info, CheckCircle, XCircle, Users, HandCoins, User } from "lucide-react"
import type { WithdrawalRequest } from "@/lib/types"

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
    </div>
  )
}
