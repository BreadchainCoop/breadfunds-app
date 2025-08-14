"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { LogIn, LogOut, PlusCircle, User, LayoutDashboard } from "lucide-react" // replaced Users and HandCoins with User

export default function Header() {
  const { user, connectWallet, disconnectWallet, isLoading } = useAppContext()

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Bread Insurance
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
          {user && (
            <>
              <Link href="/dashboard" passHref>
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <Link href="/create" passHref>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Fund
                </Button>
              </Link>
              <Link href="/my-account" passHref>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  <User className="mr-2 h-4 w-4" /> My Account
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
                <LogOut className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Log out</span>
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} disabled={isLoading} size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
