"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Plus,
  ShoppingCart,
  Shield,
  Package,
  User,
  LogOut,
  Menu,
  X,
  UserCheck,
  ClipboardList,
} from "lucide-react"

export default function NavBar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (token) {
      setIsLoggedIn(true)
      if (role === "admin") {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
      if (name) {
        setUserName(name)
      }
      // Update cart count
      updateCartCount()
    } else {
      setIsLoggedIn(false)
      setIsAdmin(false)
      setUserName("")
      setCartItemCount(0)
    }
  }

  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")
      if (!token || !userId) return

      const response = await fetch(`/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const cartData = await response.json()
        const count = cartData.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        setCartItemCount(count)
      }
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  useEffect(() => {
    // Provjera tokena i uloge iz localStorage prilikom mount-a
    checkAuthStatus()

    // Dodaj event listener za promjene u localStorage
    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener("storage", handleStorageChange)

    // Dodaj custom event listener za promjene u localStorage
    window.addEventListener("authStateChanged", checkAuthStatus)
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("authStateChanged", checkAuthStatus)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const handleLogout = () => {
    // Brisanje tokena i uloge iz localStorage te preusmjeravanje na login
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    localStorage.removeItem("cart")

    setIsLoggedIn(false)
    setIsAdmin(false)
    setUserName("")
    setCartItemCount(0)

    // Emit custom event za ažuriranje NavBar-a
    window.dispatchEvent(new Event("authStateChanged"))

    router.push("/login")
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const NavLink = ({ href, children, icon: Icon, onClick }: any) => (
    <Link
      href={href}
      onClick={onClick || closeMobileMenu}
      className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#522546]/30 px-3 py-2 rounded-xl transition-all duration-300 group"
    >
      {Icon && <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />}
      <span>{children}</span>
    </Link>
  )

  const CartLink = () => (
    <Link
      href="/cart"
      onClick={closeMobileMenu}
      className="relative flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#522546]/30 px-3 py-2 rounded-xl transition-all duration-300 group"
    >
      <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
      <span>Korpa</span>
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}
    </Link>
  )

  return (
    <nav className="bg-[#2C2C2C]/90 backdrop-blur-md border-b border-[#522546]/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent group-hover:from-[#88304E] group-hover:to-[#F7374F] transition-all duration-300">
              MiniWebshop
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {!isLoggedIn ? (
              <>
                <NavLink href="/home" icon={Home}>
                  Home
                </NavLink>
                <NavLink href="/login" icon={User}>
                  Prijava
                </NavLink>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white px-6 py-2 rounded-xl font-semibold hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Registracija
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <NavLink href="/home" icon={Home}>
                  Home
                </NavLink>
                <NavLink href="/add-product" icon={Plus}>
                  Dodaj proizvod
                </NavLink>
                <CartLink />
                <NavLink href="/admin/dashboard" icon={Shield}>
                  Dashboard
                </NavLink>
                <NavLink href="/admin/orders" icon={ClipboardList}>
                  Narudžbe
                </NavLink>
                <div className="flex items-center gap-3 bg-[#522546]/30 px-4 py-2 rounded-xl border border-[#522546]/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#F7374F] font-semibold text-sm">Admin</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-xl transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Odjava</span>
                </button>
              </>
            ) : (
              <>
                <NavLink href="/home" icon={Home}>
                  Home
                </NavLink>
                <NavLink href="/add-product" icon={Plus}>
                  Dodaj proizvod
                </NavLink>
                <CartLink />
                <NavLink href="/my-orders" icon={ClipboardList}>
                  Moje narudžbe
                </NavLink>
                {userName && (
                  <div className="flex items-center gap-3 bg-[#522546]/30 px-4 py-2 rounded-xl border border-[#522546]/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-lg flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#F7374F] font-semibold text-sm">{userName}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-xl transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Odjava</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-[#522546]/30 rounded-xl transition-all duration-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#2C2C2C]/95 backdrop-blur-sm border-t border-[#522546]/50 py-4 space-y-2">
            {!isLoggedIn ? (
              <>
                <NavLink href="/home" icon={Home}>
                  Home
                </NavLink>
                <NavLink href="/login" icon={User}>
                  Prijava
                </NavLink>
                <div className="px-3 py-2">
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="block w-full text-center bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300"
                  >
                    Registracija
                  </Link>
                </div>
              </>
            ) : isAdmin ? (
              <>
                <NavLink href="/home" icon={Home}>
                  Home
                </NavLink>
                <NavLink href="/add-product" icon={Plus}>
                  Dodaj proizvod
                </NavLink>
                <div className="px-3 py-2">
                  <Link
                    href="/cart"
                    onClick={closeMobileMenu}
                    className="relative flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#522546]/30 px-3 py-2 rounded-xl transition-all duration-300 group w-full"
                  >
                    <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Korpa</span>
                    {cartItemCount > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>
                <NavLink href="/admin/dashboard" icon={Shield}>
                  Admin Dashboard
                </NavLink>
                <NavLink href="/admin/orders" icon={ClipboardList}>
                  Narudžbe
                </NavLink>
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3 bg-[#522546]/30 px-4 py-3 rounded-xl border border-[#522546]/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#F7374F] font-semibold">Admin</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-xl transition-all duration-300 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Odjava</span>
                </button>
              </>
            ) : (
              <>
                <NavLink href="/home" icon={Home}>
                  Home
                </NavLink>
                <NavLink href="/add-product" icon={Plus}>
                  Dodaj proizvod
                </NavLink>
                <div className="px-3 py-2">
                  <Link
                    href="/cart"
                    onClick={closeMobileMenu}
                    className="relative flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#522546]/30 px-3 py-2 rounded-xl transition-all duration-300 group w-full"
                  >
                    <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Korpa</span>
                    {cartItemCount > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>
                <NavLink href="/my-orders" icon={ClipboardList}>
                  Moje narudžbe
                </NavLink>
                {userName && (
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3 bg-[#522546]/30 px-4 py-3 rounded-xl border border-[#522546]/50">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-lg flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[#F7374F] font-semibold">{userName}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-xl transition-all duration-300 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Odjava</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
