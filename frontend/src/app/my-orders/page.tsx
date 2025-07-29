"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShoppingBag,
  Calendar,
  User,
  Phone,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  DollarSign,
  ArrowLeft,
  Filter,
  Mail,
  Receipt,
} from "lucide-react"

interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price_at_order_time: number
  product: {
    name: string
  }
}

interface Order {
  id: number
  status: string
  customer_name: string
  phone: string
  address: string
  email?: string
  items: OrderItem[]
  date_created: string
  total_price?: number
}

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login")
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          throw new Error("Greška pri dohvatanju narudžbi")
        }
        const data = await res.json()
        setOrders(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true
    return order.status === statusFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30"
      case "accepted":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30"
      case "completed":
        return "text-green-400 bg-green-400/20 border-green-400/30"
      case "rejected":
        return "text-red-400 bg-red-400/20 border-red-400/30"
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <Eye className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Na čekanju"
      case "accepted":
        return "Prihvaćeno"
      case "completed":
        return "Završeno"
      case "rejected":
        return "Odbijeno"
      default:
        return status
    }
  }

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    completed: orders.filter((o) => o.status === "completed").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#F7374F] border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl text-white font-medium">Učitavanje narudžbi...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center px-4">
        <div className="text-center bg-[#2C2C2C]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#F7374F]/20 max-w-md w-full">
          <AlertTriangle className="w-16 h-16 text-[#F7374F] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Greška</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Nazad
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
            <div className="text-center p-12">
              <div className="w-24 h-24 bg-[#522546]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent mb-4">
                Nemate narudžbi
              </h1>
              <p className="text-gray-300 mb-8 text-lg">Još uvijek niste napravili nijednu narudžbu</p>
              <Link
                href="/home"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white px-8 py-4 rounded-2xl font-semibold hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Počni kupovinu
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Nazad</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                Moje narudžbe
              </h1>
              <p className="text-gray-300 mt-2">Pregled svih vaših narudžbi</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-4 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F7374F]/20 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-[#F7374F]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ukupno</p>
                  <p className="text-xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-4 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Na čekanju</p>
                  <p className="text-xl font-bold text-white">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-4 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-400/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Prihvaćeno</p>
                  <p className="text-xl font-bold text-white">{stats.accepted}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-4 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-400/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Završeno</p>
                  <p className="text-xl font-bold text-white">{stats.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-4 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-400/20 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Odbijeno</p>
                  <p className="text-xl font-bold text-white">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#F7374F]/10 to-[#88304E]/10 p-6 border-b border-[#522546]/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-[#F7374F]" />
                <h2 className="text-xl font-semibold text-white">Filtriraj narudžbe</h2>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-white font-medium">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Sve narudžbe</option>
                  <option value="pending">Na čekanju</option>
                  <option value="accepted">Prihvaćeno</option>
                  <option value="completed">Završeno</option>
                  <option value="rejected">Odbijeno</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">Nema narudžbi za prikaz.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl border border-[#522546]/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-[#522546]/20 to-[#88304E]/20 p-6 border-b border-[#522546]/30">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#F7374F]/20 rounded-xl flex items-center justify-center">
                            <span className="text-[#F7374F] font-bold">#{order.id}</span>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">Narudžba #{order.id}</h2>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(order.date_created).toLocaleDateString("hr-HR")}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6">
                      <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        {/* Customer Info */}
                        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#F7374F]/20 rounded-xl flex items-center justify-center">
                              <User className="w-5 h-5 text-[#F7374F]" />
                            </div>
                            <h3 className="font-bold text-white text-lg">Podaci za dostavu</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-300">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Ime:</span>
                              <span>{order.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Telefon:</span>
                              <span>{order.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Adresa:</span>
                              <span>{order.address}</span>
                            </div>
                            {order.email && (
                              <div className="flex items-center gap-3 text-gray-300">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">Email:</span>
                                <span>{order.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#88304E]/20 rounded-xl flex items-center justify-center">
                              <Package className="w-5 h-5 text-[#88304E]" />
                            </div>
                            <h3 className="font-bold text-white text-lg">Stavke narudžbe</h3>
                          </div>
                          <div className="space-y-3 max-h-40 overflow-y-auto">
                            {order.items?.length > 0 ? (
                              order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center p-3 bg-[#522546]/20 rounded-xl"
                                >
                                  <div>
                                    <p className="text-white font-medium">
                                      {item.product?.name || `Proizvod ${item.product_id}`}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                      {item.quantity} x {item.price_at_order_time.toFixed(2)} KM
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-white font-semibold">
                                      {(item.quantity * item.price_at_order_time).toFixed(2)} KM
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm text-center py-4">Nema stavki</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Total */}
                      <div className="bg-gradient-to-r from-[#F7374F]/10 to-[#88304E]/10 rounded-2xl p-6 border border-[#F7374F]/20">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-[#F7374F]" />
                            <span className="text-white font-semibold text-lg">Ukupna vrijednost:</span>
                          </div>
                          <span className="text-2xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                            {order.total_price?.toFixed(2) ||
                              (
                                order.items?.reduce((sum, item) => sum + item.price_at_order_time * item.quantity, 0) ||
                                0
                              ).toFixed(2)}{" "}
                            KM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
