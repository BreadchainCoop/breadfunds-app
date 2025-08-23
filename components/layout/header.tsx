"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { LogIn, LogOut, PlusCircle, User, LayoutDashboard, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { user, connectWallet, disconnectWallet, isLoading } = useAppContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Bread Insurance
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Link href="/dashboard" passHref>
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Link href="/create" passHref>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Fund
                  </Button>
                </Link>
                <Link href="/my-account" passHref>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" /> My Account
                  </Button>
                </Link>
              </>
            )}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                </span>
                <Button onClick={disconnectWallet} variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet} disabled={isLoading} size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <span className="text-xs text-muted-foreground">
                {user.address.substring(0, 4)}...{user.address.substring(user.address.length - 2)}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-2">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" passHref>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                  <Link href="/create" passHref>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Create Fund
                    </Button>
                  </Link>
                  <Link href="/my-account" passHref>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" /> My Account
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      disconnectWallet()
                      setIsMobileMenuOpen(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    connectWallet()
                    setIsMobileMenuOpen(false)
                  }}
                  disabled={isLoading}
                  size="sm"
                  className="justify-start w-full"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
