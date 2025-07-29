"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  CreditCard,
  User,
  MapPin,
  Phone,
  Package,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Receipt,
  DollarSign,
} from "lucide-react"

interface CartItem {
  id: number
  product: {
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
  quantity: number
}

interface OrderFormData {
  customer_name: string
  address: string
  phone: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
        console.log("Cart data from API:", cartData) // Debug log

        if (!cartData.items || cartData.items.length === 0) {
          console.log("Cart is empty, redirecting to cart page")
          router.replace("/cart")
          return
        }

        setCartItems(cartData.items)
      } catch (err: any) {
        console.error("Error fetching cart:", err)
        router.replace("/cart")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [router])

  const onSubmit = async (data: OrderFormData) => {
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.replace("/login")
        return
      }

      // Proveri da li korpa ima stavke
      if (cartItems.length === 0) {
        setError("Korpa je prazna")
        return
      }

      // Dohvati email iz baze podataka
      const userResponse = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!userResponse.ok) {
        throw new Error("Greška pri dohvatanju podataka o korisniku")
      }

      const userData = await userResponse.json()
      const userEmail = userData.email

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: data.customer_name,
          address: data.address,
          phone: data.phone,
          email: userEmail, // Koristi email iz baze podataka
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Greška pri slanju narudžbe")
      }

      setSuccess("Narudžba uspješno poslana!")

      // Preusmjeri na moje narudžbe nakon 2 sekunde
      setTimeout(() => {
        router.push("/my-orders")
      }, 2000)
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
          <div className="text-xl text-white font-medium">Učitavanje checkout-a...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Nazad u korpu</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#F7374F]/20 to-[#88304E]/20 p-6 border-b border-[#522546]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F7374F]/20 rounded-xl flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-[#F7374F]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Pregled narudžbe</h2>
                  <p className="text-gray-300">
                    {totalItems} {totalItems === 1 ? "proizvod" : totalItems < 5 ? "proizvoda" : "proizvoda"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {cartItems.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-4 border border-[#522546]/30"
                      >
                        <div className="flex items-center gap-4">
                          {item.product.image_url ? (
                            <img
                              src={item.product.image_url || "/placeholder.svg"}
                              alt={item.product.name}
                              className="w-16 h-16 rounded-xl object-cover border border-[#522546]/30"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-[#522546]/30 rounded-xl flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-lg line-clamp-1">{item.product.name}</h3>
                            <p className="text-gray-300 text-sm">
                              {item.quantity} x {item.product.price.toFixed(2)} KM
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-white text-lg">
                              {(item.product.price * item.quantity).toFixed(2)} KM
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-[#F7374F]/10 to-[#88304E]/10 rounded-2xl p-6 border border-[#F7374F]/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-[#F7374F]" />
                        <span className="text-white font-semibold text-xl">Ukupno za naplatu:</span>
                      </div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                        {totalPrice.toFixed(2)} KM
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-[#F7374F] text-lg">Korpa je prazna</p>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#F7374F]/20 to-[#88304E]/20 p-6 border-b border-[#522546]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#88304E]/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#88304E]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Podaci za dostavu</h1>
                  <p className="text-gray-300">Unesite vaše podatke</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Name */}
                <div className="group">
                  <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                    <User className="w-5 h-5 text-[#F7374F]" />
                    Ime i prezime
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("customer_name", { required: "Ime i prezime su obavezni" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                      placeholder="Unesite ime i prezime"
                    />
                    {errors.customer_name && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.customer_name.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="group">
                  <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                    <MapPin className="w-5 h-5 text-[#F7374F]" />
                    Adresa za dostavu
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("address", { required: "Adresa je obavezna" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                      placeholder="Unesite adresu za dostavu"
                    />
                    {errors.address && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.address.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                    <Phone className="w-5 h-5 text-[#F7374F]" />
                    Broj telefona
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("phone", { required: "Telefon je obavezan" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                      placeholder="Unesite broj telefona"
                    />
                    {errors.phone && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.phone.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-[#F7374F]/10 border border-[#F7374F]/30 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-[#F7374F] flex-shrink-0" />
                      <p className="text-[#F7374F] font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                      <p className="text-green-400 font-medium">{success}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-[#F7374F]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        Slanje narudžbe...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Potvrdi narudžbu
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Info Card */}
              <div className="mt-8 bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#88304E]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-[#88304E]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Informacije o dostavi</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Dostava se vrši u roku od 2-5 radnih dana</li>
                      <li>• Kontaktirat ćemo vas za potvrdu narudžbe</li>
                      <li>• Plaćanje se vrši prilikom dostave</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
