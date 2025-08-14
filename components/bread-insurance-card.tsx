import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ShieldCheck, Coins, CalendarDays, Clock, DollarSign } from "lucide-react"
import type { BreadInsurance } from "@/lib/types"
import { useAppContext } from "@/context/AppContext"

interface BreadInsuranceCardProps {
  fund: BreadInsurance
}

export default function BreadInsuranceCard({ fund }: BreadInsuranceCardProps) {
  const { user } = useAppContext()
  const isMember = user && fund.members.includes(user.address)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="truncate text-xl">{fund.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">ID: {fund.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 pb-3 border-b">
          <h4 className="font-semibold text-sm text-primary">Pool Details</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Coins className="mr-2 h-4 w-4 text-green-600" />
              <span className="font-medium">Total Funds:</span>
            </div>
            <span className="font-bold text-lg text-green-600">
              {fund.totalBalance.toLocaleString()} {fund.token}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>
              {fund.members.length} / {fund.maxMembers} Members
            </span>
          </div>
        </div>

        <div className="space-y-3 pb-3 border-b">
          <h4 className="font-semibold text-sm text-primary">Financial Terms</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
              <span>
                Monthly: {fund.fixedMonthlyDeposit} {fund.token}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
              <span>Every {fund.depositInterval} days</span>
            </div>
            <div className="flex items-center col-span-2">
              <Coins className="mr-1 h-3 w-3 text-muted-foreground" />
              <span>
                Initial Deposit: {fund.initialDeposit} {fund.token}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <ShieldCheck className="mr-2 h-3 w-3" />
            <span>Token: {fund.token}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="mr-2 h-3 w-3" />
            <span>Created: {new Date(fund.breadInsuranceStart).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/bread-insurance/${fund.id}`} passHref className="w-full">
          <Button className="w-full" variant={isMember ? "default" : "outline"}>
            {isMember ? "Manage Fund" : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
