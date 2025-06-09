"use client"

import { useAppContext } from "@/context/AppContext"
import BreadfundCard from "@/components/breadfund-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function HomePage() {
  const { breadfunds, user } = useAppContext()

  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-semibold mb-4">Welcome to Breadfunds</h1>
        <p className="text-muted-foreground mb-6">Please connect your wallet to manage and join mutual aid funds.</p>
        {/* Connect wallet button is in header, or could be duplicated here */}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Available Breadfunds</h1>
        <Link href="/create" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Fund
          </Button>
        </Link>
      </div>
      {breadfunds.length === 0 ? (
        <p className="text-muted-foreground">No Breadfunds available yet. Why not create one?</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breadfunds.map((fund) => (
            <BreadfundCard key={fund.id} fund={fund} />
          ))}
        </div>
      )}
    </div>
  )
}
