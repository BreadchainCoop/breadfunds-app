import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Wallet } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export default function UserStatusCard() {
  const { user, breadInsurances } = useAppContext()

  if (!user) {
    return null
  }

  const myFunds = breadInsurances?.filter((fund) => fund.members.includes(user.address)) || []
  const totalBalance = myFunds.reduce((sum, fund) => {
    const memberContribution = fund.memberContributionStatus[user.address]?.totalContributed || 0
    return sum + memberContribution
  }, 0)

  const displayName = user.name || `User ${user.address.slice(0, 6)}...${user.address.slice(-4)}`

  return (
    <Card className="w-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <User className="mr-3 h-5 w-5 text-primary" />
          Your Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Username:</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {displayName}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wallet:</span>
            <div className="flex items-center text-xs text-muted-foreground">
              <Wallet className="mr-1 h-3 w-3" />
              {user.address.slice(0, 6)}...{user.address.slice(-4)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Memberships:</span>
            <Badge variant="outline" className="text-primary">
              {myFunds.length}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Contributed:</span>
            <div className="flex items-center text-sm font-semibold text-green-600">
              <Shield className="mr-1 h-3 w-3" />
              {totalBalance.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
