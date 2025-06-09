"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { LogIn, LogOut, PlusCircle, Users, HandCoins } from "lucide-react"

export default function Header() {
  const { user, connectWallet, disconnectWallet, isLoading } = useAppContext()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Breadfunds
        </Link>
        <nav className="flex items-center space-x-4">
          {user && (
            <>
              <Link href="/create" passHref>
                <Button variant="ghost" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Fund
                </Button>
              </Link>
              <Link href="/my-memberships" passHref>
                <Button variant="ghost" size="sm">
                  <Users className="mr-2 h-4 w-4" /> My Memberships
                </Button>
              </Link>
              <Link href="/pending-actions" passHref>
                <Button variant="ghost" size="sm">
                  <HandCoins className="mr-2 h-4 w-4" /> Pending Actions
                </Button>
              </Link>
            </>
          )}
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
              </span>
              <Button onClick={disconnectWallet} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" /> Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} disabled={isLoading} size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
