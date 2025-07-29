"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  User,
  Phone,
  MapPin,
  Mail,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  AlertTriangle,
  Eye,
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

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState<"all" | "my">("all")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token || role !== "admin") {
      router.replace("/home")
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
        setFilteredOrders(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch("/api/orders/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          throw new Error("Greška pri dohvatanju mojih narudžbi")
        }
        const data = await res.json()
        setOrders(data)
        setFilteredOrders(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === "all") {
      fetchOrders()
    } else {
      fetchMyOrders()
    }
  }, [router, activeTab])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter))
    }
    setCurrentPage(1) 
  }, [statusFilter, orders])

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.replace("/login")
        return
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Neuspješna izmjena statusa")
      }

      // Ažuriraj status u lokalnom state-u
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )
    } catch (err: any) {
      alert(err.message)
    }
  }

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

  // Calculate statistike
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    completed: orders.filter((o) => o.status === "completed").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    totalRevenue: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + (o.total_price || 0), 0),
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
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center">
        <div className="text-center bg-[#2C2C2C]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#F7374F]/20">
          <AlertTriangle className="w-16 h-16 text-[#F7374F] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Greška</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                Upravljanje narudžbama
              </h1>
              <p className="text-gray-300 mt-2">
                {activeTab === "all" 
                  ? "Pregled i upravljanje svim narudžbama" 
                  : "Pregled i upravljanje vašim narudžbama"
                }
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F7374F]/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-[#F7374F]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ukupno</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Na čekanju</p>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Prihvaćeno</p>
                  <p className="text-2xl font-bold text-white">{stats.accepted}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Završeno</p>
                  <p className="text-2xl font-bold text-white">{stats.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-400/20 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Odbijeno</p>
                  <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#88304E]/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#88304E]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Prihod</p>
                  <p className="text-2xl font-bold text-white">{stats.totalRevenue.toFixed(0)} KM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
          {/* Filter Header */}
          <div className="bg-gradient-to-r from-[#F7374F]/10 to-[#88304E]/10 p-6 border-b border-[#522546]/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-[#F7374F]" />
                <h2 className="text-xl font-semibold text-white">Pregled narudžbi</h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Tabovi */}
                <div className="flex bg-[#2C2C2C]/80 rounded-xl p-1 border border-[#522546]">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === "all"
                        ? "bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Sve narudžbe
                  </button>
                  <button
                    onClick={() => setActiveTab("my")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === "my"
                        ? "bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Moje narudžbe
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-white font-medium">Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300"
                  >
                    <option value="all">Svi statusi</option>
                    <option value="pending">Na čekanju</option>
                    <option value="accepted">Prihvaćeno</option>
                    <option value="completed">Završeno</option>
                    <option value="rejected">Odbijeno</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Content */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">Nema narudžbi za prikaz.</p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {currentOrders.map((order) => (
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

                          <div className="flex items-center gap-4">
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${getStatusColor(
                                order.status,
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {getStatusText(order.status)}
                            </span>

                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300"
                            >
                              <option value="pending">Na čekanju</option>
                              <option value="accepted">Prihvaćeno</option>
                              <option value="rejected">Odbijeno</option>
                              <option value="completed">Završeno</option>
                            </select>
                          </div>
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
                              <h3 className="font-bold text-white text-lg">Podaci kupca</h3>
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
                                  order.items?.reduce(
                                    (sum, item) => sum + item.price_at_order_time * item.quantity,
                                    0,
                                  ) || 0
                                ).toFixed(2)}{" "}
                              KM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-[#522546]/30">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-6 py-3 bg-[#522546]/50 hover:bg-[#522546]/70 text-white rounded-xl font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prethodna
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white"
                              : "bg-[#522546]/30 text-gray-300 hover:bg-[#522546]/50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-6 py-3 bg-[#522546]/50 hover:bg-[#522546]/70 text-white rounded-xl font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 disabled:opacity-50"
                    >
                      Sljedeća
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
