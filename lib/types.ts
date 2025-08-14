export interface User {
  address: string
  name?: string // Optional: if you want to display names
}

export interface BreadInsurance {
  id: string
  name: string
  owner: string // Address
  token: string // Token symbol e.g. "DAI"
  tokenAddress: string // Actual token contract address
  members: string[] // Array of member addresses
  initialDeposit: number // One-time service fee
  fixedMonthlyDeposit: number // For admin costs
  memberPersonalSavings: { [userAddress: string]: number } // Individual monthly personal saving amount
  depositInterval: number // In days, e.g., 30 for monthly
  maxWithdrawalsPerMember: number // Max number of withdrawals a member can make
  breadInsuranceStart: number // Timestamp of creation
  minMembers: number
  maxMembers: number
  totalBalance: number // Current total balance in the fund (in token units)
  memberContributionStatus: {
    [memberAddress: string]: {
      lastDepositDate: number // Timestamp
      totalContributed: number // Total amount this member has ever put in
    }
  }
  withdrawalRequests: WithdrawalRequest[]
}

export interface WithdrawalRequest {
  id: string
  breadInsuranceId: string
  requester: string // Member address
  amountRequested: number // Amount in token units
  reason: string
  timestamp: number // Timestamp of request creation
  status: "pending" | "approved" | "rejected" | "withdrawn" | "expired"
  votes: { [voterAddress: string]: "yes" | "no" } // voterAddress: vote
  votedYes: number
  votedNo: number
  requiredVotes: number // Number of 'yes' votes needed for approval
}

export interface AllowedToken {
  symbol: string
  address: string
  decimals: number
}
