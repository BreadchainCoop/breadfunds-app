"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Breadfund, WithdrawalRequest, User } from "@/lib/types" // We'll define these types next

// Define initial mock data directly or import from a mock-data file
const MOCK_USER: User = {
  address: "0x1234567890AbCdEf1234567890AbCdEf12345678",
  name: "Alice",
}

const MOCK_BREADFUNDS: Breadfund[] = [
  {
    id: "bf-001",
    owner: "0xOwner1",
    name: "Devs Mutual Aid",
    token: "DAI",
    tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    members: [MOCK_USER.address, "0xMember2", "0xMember3"],
    initialDeposit: 50,
    fixedMonthlyDeposit: 10, // Base monthly for admin/etc.
    memberPersonalSavings: {
      [MOCK_USER.address]: 100,
      "0xMember2": 150,
      "0xMember3": 120,
    },
    depositInterval: 30, // days
    maxWithdrawalsPerMember: 24, // e.g., for 2 years
    breadfundStart: new Date("2024-01-01").getTime(),
    minMembers: 3,
    maxMembers: 50,
    totalBalance: 1500, // Sum of all deposits
    memberContributionStatus: {
      [MOCK_USER.address]: { lastDepositDate: new Date("2025-05-15").getTime(), totalContributed: 350 },
      "0xMember2": { lastDepositDate: new Date("2025-05-10").getTime(), totalContributed: 400 },
    },
    withdrawalRequests: [
      {
        id: "wr-001",
        breadfundId: "bf-001",
        requester: "0xMember2",
        amountRequested: 300, // Based on their personal saving and withdrawal ratio
        reason: "Medical emergency",
        timestamp: new Date("2025-06-01").getTime(),
        status: "pending",
        votes: {},
        votedYes: 0,
        votedNo: 0,
        requiredVotes: 2, // (members.length - 1)
      },
    ],
  },
]

export const ALLOWED_TOKENS_LIST = [
  { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
  { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
  { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
]

interface AppContextType {
  user: User | null
  breadfunds: Breadfund[]
  isLoading: boolean
  connectWallet: () => void
  disconnectWallet: () => void
  addBreadfund: (
    fund: Omit<
      Breadfund,
      "id" | "owner" | "breadfundStart" | "members" | "totalBalance" | "memberContributionStatus" | "withdrawalRequests"
    > & { personalSaving: number },
  ) => void
  addDeposit: (breadfundId: string, memberAddress: string, amount: number) => void
  createWithdrawalRequest: (breadfundId: string, requesterAddress: string, amount: number, reason: string) => void
  voteOnRequest: (breadfundId: string, requestId: string, voterAddress: string, vote: "yes" | "no") => void
  processWithdrawal: (breadfundId: string, requestId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [breadfunds, setBreadfunds] = useState<Breadfund[]>(MOCK_BREADFUNDS)
  const [isLoading, setIsLoading] = useState(false)

  const connectWallet = () => {
    setIsLoading(true)
    // Simulate wallet connection
    setTimeout(() => {
      setUser(MOCK_USER)
      setIsLoading(false)
      console.log("Wallet connected:", MOCK_USER.address)
    }, 500)
  }

  const disconnectWallet = () => {
    setUser(null)
    console.log("Wallet disconnected")
  }

  const addBreadfund = (
    fundData: Omit<
      Breadfund,
      "id" | "owner" | "breadfundStart" | "members" | "totalBalance" | "memberContributionStatus" | "withdrawalRequests"
    > & { personalSaving: number },
  ) => {
    if (!user) {
      alert("Please connect your wallet first.")
      return
    }
    const newBreadfund: Breadfund = {
      ...fundData,
      id: `bf-${Date.now()}`,
      owner: user.address,
      breadfundStart: Date.now(),
      members: [user.address],
      totalBalance: fundData.initialDeposit, // Initial deposit from creator
      memberPersonalSavings: {
        [user.address]: fundData.personalSaving,
      },
      memberContributionStatus: {
        [user.address]: { lastDepositDate: Date.now(), totalContributed: fundData.initialDeposit },
      },
      withdrawalRequests: [],
    }
    setBreadfunds((prev) => [...prev, newBreadfund])
    console.log("New Breadfund created:", newBreadfund)
  }

  const addDeposit = (breadfundId: string, memberAddress: string, amount: number) => {
    setBreadfunds((prevFunds) =>
      prevFunds.map((fund) => {
        if (fund.id === breadfundId && fund.members.includes(memberAddress)) {
          const personalSaving = fund.memberPersonalSavings[memberAddress] || 0
          const totalDepositAmount = fund.fixedMonthlyDeposit + personalSaving
          if (amount < totalDepositAmount) {
            alert(
              `Minimum deposit is ${totalDepositAmount} ${fund.token} (fixed: ${fund.fixedMonthlyDeposit} + personal: ${personalSaving})`,
            )
            return fund
          }
          // In a real scenario, you'd check ERC20 approval and transfer
          console.log(`Simulating deposit of ${amount} ${fund.token} to ${breadfundId} by ${memberAddress}`)
          return {
            ...fund,
            totalBalance: fund.totalBalance + amount,
            memberContributionStatus: {
              ...fund.memberContributionStatus,
              [memberAddress]: {
                lastDepositDate: Date.now(),
                totalContributed: (fund.memberContributionStatus[memberAddress]?.totalContributed || 0) + amount,
              },
            },
          }
        }
        return fund
      }),
    )
  }

  const createWithdrawalRequest = (breadfundId: string, requesterAddress: string, amount: number, reason: string) => {
    setBreadfunds((prevFunds) =>
      prevFunds.map((fund) => {
        if (fund.id === breadfundId && fund.members.includes(requesterAddress)) {
          // Basic check: ensure user has enough "potential" claim based on their savings
          // This is a simplification; smart contract would have precise logic
          const personalSaving = fund.memberPersonalSavings[requesterAddress]
          if (!personalSaving || amount > personalSaving * 10) {
            // Arbitrary multiplier for demo
            alert("Requested amount seems too high based on your personal savings contribution.")
            return fund
          }
          if (fund.totalBalance < amount) {
            alert("Breadfund has insufficient balance for this request.")
            return fund
          }

          const newRequest: WithdrawalRequest = {
            id: `wr-${Date.now()}`,
            breadfundId,
            requester: requesterAddress,
            amountRequested: amount,
            reason,
            timestamp: Date.now(),
            status: "pending",
            votes: {},
            votedYes: 0,
            votedNo: 0,
            requiredVotes: Math.ceil((fund.members.length - 1) * 0.66), // 66% of other members
          }
          console.log("Creating withdrawal request:", newRequest)
          return {
            ...fund,
            withdrawalRequests: [...fund.withdrawalRequests, newRequest],
          }
        }
        return fund
      }),
    )
  }

  const voteOnRequest = (breadfundId: string, requestId: string, voterAddress: string, vote: "yes" | "no") => {
    setBreadfunds((prevFunds) =>
      prevFunds.map((fund) => {
        if (fund.id === breadfundId) {
          return {
            ...fund,
            withdrawalRequests: fund.withdrawalRequests.map((req) => {
              if (req.id === requestId && req.requester !== voterAddress && !req.votes[voterAddress]) {
                const updatedVotes = { ...req.votes, [voterAddress]: vote }
                const votedYes = Object.values(updatedVotes).filter((v) => v === "yes").length
                const votedNo = Object.values(updatedVotes).filter((v) => v === "no").length
                let newStatus = req.status

                // Check if voting period ended or all voted
                const totalPotentialVoters = fund.members.length - 1 // Exclude requester
                if (Object.keys(updatedVotes).length === totalPotentialVoters) {
                  if (votedYes >= req.requiredVotes) {
                    newStatus = "approved"
                    console.log(`Request ${requestId} approved.`)
                  } else {
                    newStatus = "rejected"
                    console.log(`Request ${requestId} rejected.`)
                  }
                }

                console.log(`Vote cast by ${voterAddress} on ${requestId}: ${vote}`)
                return { ...req, votes: updatedVotes, votedYes, votedNo, status: newStatus }
              }
              return req
            }),
          }
        }
        return fund
      }),
    )
  }

  const processWithdrawal = (breadfundId: string, requestId: string) => {
    setBreadfunds((prevFunds) =>
      prevFunds.map((fund) => {
        if (fund.id === breadfundId) {
          const requestIndex = fund.withdrawalRequests.findIndex(
            (req) => req.id === requestId && req.status === "approved",
          )
          if (requestIndex > -1) {
            const request = fund.withdrawalRequests[requestIndex]
            if (fund.totalBalance >= request.amountRequested) {
              console.log(`Processing withdrawal of ${request.amountRequested} ${fund.token} for request ${requestId}`)
              const updatedRequests = [...fund.withdrawalRequests]
              updatedRequests[requestIndex] = { ...request, status: "withdrawn" }
              return {
                ...fund,
                totalBalance: fund.totalBalance - request.amountRequested,
                withdrawalRequests: updatedRequests,
                // Potentially update member's maxWithdrawals count
              }
            } else {
              alert("Insufficient fund balance to process withdrawal.")
            }
          }
        }
        return fund
      }),
    )
  }

  return (
    <AppContext.Provider
      value={{
        user,
        breadfunds,
        isLoading,
        connectWallet,
        disconnectWallet,
        addBreadfund,
        addDeposit,
        createWithdrawalRequest,
        voteOnRequest,
        processWithdrawal,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
