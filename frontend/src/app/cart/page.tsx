"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  ArrowLeft,
  CreditCard,
  AlertCircle,
  ShoppingBag,
} from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  description: string | null
  image_url?: string
  quantity: number
  status: string
  seller_id: number
  date_posted: string
}

interface CartItem {
  id: number
  product: Product
  quantity: number
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingItem, setUpdatingItem] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login")
      return
    }

    // Dohvati korpu iz baze podataka
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          router.replace("/login")
          return
        }

        const response = await fetch(`/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Greška pri dohvatanju korpe")
        }

        const cartData = await response.json()
        setCartItems(cartData.items || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [router])

  // Handler za promjenu količine stavke
  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return

    // Pronađi proizvod u korpi da proveri dostupnu količinu
    const cartItem = cartItems.find((item) => item.product.id === id)
    if (!cartItem) return

    // Proveri da li je nova količina veća od dostupne
    if (newQty > cartItem.product.quantity) {
      setError(`Nema dovoljno količine. Dostupno: ${cartItem.product.quantity} kom`)
      setTimeout(() => setError(null), 3000)
      return
    }

    setUpdatingItem(id)

    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      const response = await fetch(`/api/cart/${userId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: newQty,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Greška pri ažuriranju količine")
      }

      // Ažuriraj lokalno stanje
      const updatedCart = cartItems.map((item) => (item.product.id === id ? { ...item, quantity: newQty } : item))
      setCartItems(updatedCart)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(null), 3000)
    } finally {
      setUpdatingItem(null)
    }
  }

  // Handler za uklanjanje stavke iz korpe
  const removeItem = async (id: number) => {
    setUpdatingItem(id)

    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      const response = await fetch(`/api/cart/${userId}/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      })

      if (!response.ok) {
        throw new Error("Greška pri uklanjanju stavke")
      }

      // Ažuriraj lokalno stanje
      const filtered = cartItems.filter((item) => item.product.id !== id)
      setCartItems(filtered)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUpdatingItem(null)
    }
  }

  // Handler za brisanje cijele korpe
  const clearCart = async () => {
    if (!window.confirm("Jeste li sigurni da želite obrisati cijelu korpu?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      const response = await fetch(`/api/cart/${userId}/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Greška pri brisanju korpe")
      }

      setCartItems([])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#F7374F] border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl text-white font-medium">Učitavanje korpe...</div>
        </div>
      </div>
    )
  }

  if (error && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center px-4">
        <div className="text-center bg-[#2C2C2C]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#F7374F]/20 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-[#F7374F] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Greška</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Nazad na početnu
          </Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
            <div className="text-center p-12">
              <div className="w-24 h-24 bg-[#522546]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent mb-4">
                Vaša korpa je prazna
              </h1>
              <p className="text-gray-300 mb-8 text-lg">Dodajte proizvode u korpu da biste nastavili sa kupovinom</p>
              <Link
                href="/home"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white px-8 py-4 rounded-2xl font-semibold hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Nastavi kupovinu
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Nazad</span>
        </button>

        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F7374F]/20 to-[#88304E]/20 p-8 border-b border-[#522546]/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                    Vaša korpa
                  </h1>
                  <p className="text-gray-300 mt-2">
                    {totalItems} {totalItems === 1 ? "proizvod" : totalItems < 5 ? "proizvoda" : "proizvoda"}
                  </p>
                </div>
              </div>

              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 px-4 py-2 rounded-xl transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                Obriši korpu
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error message */}
            {error && (
              <div className="mb-6 bg-[#F7374F]/10 border border-[#F7374F]/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#F7374F] flex-shrink-0" />
                  <p className="text-[#F7374F] font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl border border-[#522546]/30 shadow-lg transition-all duration-300 overflow-hidden ${
                    updatingItem === item.product.id ? "opacity-50" : "hover:shadow-xl"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover border border-[#522546]/30"
                          />
                        ) : (
                          <div className="w-24 h-24 lg:w-32 lg:h-32 bg-[#522546]/30 rounded-2xl flex items-center justify-center">
                            <Package className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-xl mb-2 line-clamp-2">{item.product.name}</h3>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.product.description}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                                {item.product.price.toFixed(2)} KM
                              </span>
                              <span className="text-sm text-gray-400 bg-[#522546]/30 px-3 py-1 rounded-full">
                                Dostupno: {item.product.quantity} kom
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col lg:items-end gap-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={updatingItem === item.product.id || item.quantity <= 1}
                                className="w-10 h-10 bg-[#522546]/50 hover:bg-[#F7374F] text-white rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4" />
                              </button>

                              <div className="w-16 h-10 bg-[#2C2C2C]/60 border border-[#522546]/30 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">{item.quantity}</span>
                              </div>

                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={updatingItem === item.product.id || item.quantity >= item.product.quantity}
                                className="w-10 h-10 bg-[#522546]/50 hover:bg-[#F7374F] text-white rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-gray-400 text-sm">Ukupno</p>
                                <p className="text-xl font-bold text-white">
                                  {(item.product.price * item.quantity).toFixed(2)} KM
                                </p>
                              </div>

                              <button
                                onClick={() => removeItem(item.product.id)}
                                disabled={updatingItem === item.product.id}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-300 disabled:opacity-50"
                                title="Ukloni iz korpe"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-[#F7374F]/10 to-[#88304E]/10 rounded-2xl p-8 border border-[#F7374F]/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <p className="text-gray-300 text-lg mb-2">Ukupna vrijednost:</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                    {totalPrice.toFixed(2)} KM
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link
                    href="/home"
                    className="flex items-center justify-center gap-2 bg-[#522546]/50 hover:bg-[#522546]/70 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Nastavi kupovinu
                  </Link>

                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7374F] to-[#88304E] hover:from-[#88304E] hover:to-[#F7374F] text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <CreditCard className="w-5 h-5" />
                    Nastavi na checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
