"use client"

import { useAppContext } from "@/context/AppContext"
import BreadfundCard from "@/components/breadfund-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function MyMembershipsPage() {
  const { user, breadfunds } = useAppContext()

  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-semibold mb-4">My Memberships</h1>
        <p className="text-muted-foreground">Please connect your wallet to see your Breadfund memberships.</p>
      </div>
    )
  }

  const myFunds = breadfunds.filter((fund) => fund.members.includes(user.address))

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">My Memberships</h1>
      {myFunds.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Memberships Found</AlertTitle>
          <AlertDescription>
            You are not currently a member of any Breadfund. You can explore available funds on the dashboard or create
            a new one.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myFunds.map((fund) => (
            <BreadfundCard key={fund.id} fund={fund} />
          ))}
        </div>
      )}
    </div>
  )
}
