"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import type { Breadfund, WithdrawalRequest, User } from "@/lib/types"

const MOCK_USER: User = {
  address: "0x1234567890AbCdEf1234567890AbCdEf12345678",
  name: "Alice",
}

const MOCK_BREADFUNDS: Breadfund[] = [
  {
    id: "bf-001",
    owner: "0xOwner1",
    name: "Devs Tech Insurance",
    token: "DAI",
    tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    members: [MOCK_USER.address, "0xMember2", "0xMember3"],
    initialDeposit: 50,
    fixedMonthlyDeposit: 10,
    memberPersonalSavings: {
      [MOCK_USER.address]: 100,
      "0xMember2": 150,
      "0xMember3": 120,
    },
    depositInterval: 30,
    maxWithdrawalsPerMember: 24,
    breadfundStart: new Date("2024-01-01").getTime(),
    minMembers: 3,
    maxMembers: 50,
    totalBalance: 5500,
    memberContributionStatus: {
      [MOCK_USER.address]: { lastDepositDate: new Date("2025-05-15").getTime(), totalContributed: 350 },
      "0xMember2": { lastDepositDate: new Date("2025-05-10").getTime(), totalContributed: 400 },
    },
    withdrawalRequests: [
      {
        id: "wr-001",
        breadfundId: "bf-001",
        requester: "0xMember2",
        amountRequested: 1200,
        reason: "Laptop replacement",
        timestamp: new Date("2025-06-01").getTime(),
        status: "pending",
        votes: {},
        votedYes: 0,
        votedNo: 0,
        requiredVotes: 2,
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
  ) => string
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

  const connectWallet = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      try {
        setUser(MOCK_USER)
        setIsLoading(false)
        console.log("Wallet connected:", MOCK_USER.address)
      } catch (error) {
        console.error("Error in connectWallet setTimeout callback:", error)
        setIsLoading(false)
      }
    }, 500)
  }, [])

  const disconnectWallet = useCallback(() => {
    setUser(null)
    console.log("Wallet disconnected")
  }, [])

  const addBreadfund = useCallback(
    (
      fundData: Omit<
        Breadfund,
        | "id"
        | "owner"
        | "breadfundStart"
        | "members"
        | "totalBalance"
        | "memberContributionStatus"
        | "withdrawalRequests"
      > & { personalSaving: number },
    ) => {
      if (!user) {
        alert("Please connect your wallet first.")
        return ""
      }
      const poolId = `bf-${Date.now()}`
      const newBreadfund: Breadfund = {
        ...fundData,
        id: poolId,
        owner: user.address,
        breadfundStart: Date.now(),
        members: [user.address],
        totalBalance: fundData.initialDeposit,
        memberPersonalSavings: {
          [user.address]: fundData.personalSaving,
        },
        memberContributionStatus: {
          [user.address]: { lastDepositDate: Date.now(), totalContributed: fundData.initialDeposit },
        },
        withdrawalRequests: [],
      }
      setBreadfunds((prev) => [...prev, newBreadfund])
      console.log("New insurance pool created:", newBreadfund)
      return poolId
    },
    [user],
  )

  const addDeposit = useCallback((breadfundId: string, memberAddress: string, amount: number) => {
    setBreadfunds((prevFunds) =>
      prevFunds.map((fund) => {
        if (fund.id === breadfundId && fund.members.includes(memberAddress)) {
          const personalSaving = fund.memberPersonalSavings[memberAddress] || 0
          const totalDepositAmount = fund.fixedMonthlyDeposit + personalSaving
          if (amount < totalDepositAmount) {
            alert(
              `Minimum premium is ${totalDepositAmount} ${fund.token} (fixed: ${fund.fixedMonthlyDeposit} + personal: ${personalSaving})`,
            )
            return fund
          }
          console.log(`Simulating premium payment of ${amount} ${fund.token} to ${breadfundId} by ${memberAddress}`)
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
  }, [])

  const createWithdrawalRequest = useCallback(
    (breadfundId: string, requesterAddress: string, amount: number, reason: string) => {
      setBreadfunds((prevFunds) =>
        prevFunds.map((fund) => {
          if (fund.id === breadfundId && fund.members.includes(requesterAddress)) {
            const personalSaving = fund.memberPersonalSavings[requesterAddress]
            if (!personalSaving || amount > personalSaving * 10) {
              alert("Claimed amount seems too high based on your personal premium contribution.")
              return fund
            }
            if (fund.totalBalance < amount) {
              alert("Insurance pool has insufficient liquidity for this claim.")
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
              requiredVotes: Math.ceil((fund.members.length - 1) * 0.66),
            }
            console.log("Creating claim request:", newRequest)
            return {
              ...fund,
              withdrawalRequests: [...fund.withdrawalRequests, newRequest],
            }
          }
          return fund
        }),
      )
    },
    [],
  )

  const voteOnRequest = useCallback(
    (breadfundId: string, requestId: string, voterAddress: string, vote: "yes" | "no") => {
      setBreadfunds((prevFunds) =>
        prevFunds.map((fund) => {
          if (fund.id === breadfundId) {
            return {
              ...fund,
              withdrawalRequests: fund.withdrawalRequests.map((req) => {
                if (
                  req.id === requestId &&
                  req.requester !== voterAddress &&
                  !req.votes[voterAddress] &&
                  req.status === "pending"
                ) {
                  const updatedVotes = { ...req.votes, [voterAddress]: vote }
                  const votedYes = Object.values(updatedVotes).filter((v) => v === "yes").length
                  const votedNo = Object.values(updatedVotes).filter((v) => v === "no").length
                  let newStatus = req.status

                  const totalPotentialVoters = fund.members.length - 1
                  if (Object.keys(updatedVotes).length === totalPotentialVoters) {
                    if (votedYes >= req.requiredVotes) {
                      newStatus = "approved"
                      console.log(`Claim ${requestId} approved.`)
                    } else {
                      newStatus = "rejected"
                      console.log(`Claim ${requestId} rejected.`)
                    }
                  }
                  console.log(`Vote cast by ${voterAddress} on claim ${requestId}: ${vote}`)
                  return { ...req, votes: updatedVotes, votedYes, votedNo, status: newStatus }
                }
                return req
              }),
            }
          }
          return fund
        }),
      )
    },
    [],
  )

  const processWithdrawal = useCallback((breadfundId: string, requestId: string) => {
    setBreadfunds((prevFunds) =>
      prevFunds.map((fund) => {
        if (fund.id === breadfundId) {
          const requestIndex = fund.withdrawalRequests.findIndex(
            (req) => req.id === requestId && req.status === "approved",
          )
          if (requestIndex > -1) {
            const request = fund.withdrawalRequests[requestIndex]
            if (fund.totalBalance >= request.amountRequested) {
              console.log(`Processing payout of ${request.amountRequested} ${fund.token} for claim ${requestId}`)
              const updatedRequests = [...fund.withdrawalRequests]
              updatedRequests[requestIndex] = { ...request, status: "withdrawn" }
              return {
                ...fund,
                totalBalance: fund.totalBalance - request.amountRequested,
                withdrawalRequests: updatedRequests,
              }
            } else {
              alert("Insufficient pool liquidity to process payout.")
              const updatedRequests = [...fund.withdrawalRequests]
              updatedRequests[requestIndex] = { ...request, status: "rejected" }
              return { ...fund, withdrawalRequests: updatedRequests }
            }
          }
        }
        return fund
      }),
    )
  }, [])

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
