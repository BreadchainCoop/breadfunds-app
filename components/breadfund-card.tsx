import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ShieldCheck, Coins, CalendarDays } from "lucide-react"
import type { Breadfund } from "@/lib/types"
import { useAppContext } from "@/context/AppContext"

interface BreadfundCardProps {
  fund: Breadfund
}

export default function BreadfundCard({ fund }: BreadfundCardProps) {
  const { user } = useAppContext()
  const isMember = user && fund.members.includes(user.address)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="truncate">{fund.name}</CardTitle>
        <CardDescription>ID: {fund.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            {fund.members.length} / {fund.maxMembers} Members
          </span>
        </div>
        <div className="flex items-center text-sm">
          <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Token: {fund.token}</span>
        </div>
        <div className="flex items-center text-sm">
          <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            Total Balance: {fund.totalBalance.toLocaleString()} {fund.token}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Created: {new Date(fund.breadfundStart).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/breadfund/${fund.id}`} passHref className="w-full">
          <Button className="w-full" variant={isMember ? "default" : "outline"}>
            {isMember ? "Manage Fund" : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
