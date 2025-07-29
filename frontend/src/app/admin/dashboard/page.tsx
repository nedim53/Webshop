"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Shield,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Filter,
  Eye,
  AlertTriangle,
  DollarSign,
} from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url?: string
  quantity: number
  status: string
  seller_id: number
  date_posted: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token || role !== "admin") {
      router.replace("/home")
      return
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          throw new Error("Greška pri dohvatanju proizvoda")
        }
        const data = await res.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.status === statusFilter))
    }
  }, [statusFilter, products])

  const confirmDelete = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const deleteProduct = async () => {
    if (!productToDelete) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.replace("/login")
        return
      }

      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Brisanje nije uspjelo")
      }

      // Ukloni obrisani proizvod iz state-a
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      setShowDeleteModal(false)
      setProductToDelete(null)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const updateProductStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.replace("/login")
        return
      }

      const res = await fetch(`/api/products/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Ažuriranje statusa nije uspjelo")
      }

      // Ažuriraj status u lokalnom state-u
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30"
      case "approved":
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
      case "approved":
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
      case "approved":
        return "Odobreno"
      case "rejected":
        return "Odbijeno"
      default:
        return status
    }
  }

  const stats = {
    total: products.length,
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    rejected: products.filter((p) => p.status === "rejected").length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#F7374F] border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl text-white font-medium">Učitavanje proizvoda...</div>
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-300 mt-2">Upravljanje proizvodima i korisnicima</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F7374F]/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#F7374F]" />
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
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Odobreno</p>
                  <p className="text-2xl font-bold text-white">{stats.approved}</p>
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
                  <p className="text-gray-400 text-sm">Ukupna vrijednost</p>
                  <p className="text-2xl font-bold text-white">{stats.totalValue.toFixed(0)} KM</p>
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
                <h2 className="text-xl font-semibold text-white">Upravljanje proizvodima</h2>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-white font-medium">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Svi proizvodi</option>
                  <option value="pending">Na čekanju</option>
                  <option value="approved">Odobreno</option>
                  <option value="rejected">Odbijeno</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">Nema proizvoda za prikaz.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[#522546]/50">
                      <th className="text-left p-4 font-semibold text-white">ID</th>
                      <th className="text-left p-4 font-semibold text-white">Proizvod</th>
                      <th className="text-left p-4 font-semibold text-white">Opis</th>
                      <th className="text-right p-4 font-semibold text-white">Cijena</th>
                      <th className="text-center p-4 font-semibold text-white">Količina</th>
                      <th className="text-center p-4 font-semibold text-white">Status</th>
                      <th className="text-center p-4 font-semibold text-white">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#522546]/20 hover:bg-[#2C2C2C]/40 transition-all duration-300 group"
                      >
                        <td className="p-4">
                          <span className="text-white font-mono text-sm bg-[#522546]/30 px-2 py-1 rounded">
                            #{product.id}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#522546]/30"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-[#522546]/30 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-white group-hover:text-[#F7374F] transition-colors">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(product.date_posted).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-300 max-w-xs truncate">{product.description}</p>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-white font-semibold">{product.price.toFixed(2)} KM</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-[#522546]/30 text-white px-3 py-1 rounded-full text-sm">
                            {product.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              product.status,
                            )}`}
                          >
                            {getStatusIcon(product.status)}
                            {getStatusText(product.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center items-center gap-2">
                            {product.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateProductStatus(product.id, "approved")}
                                  className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all duration-300"
                                  title="Odobri"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateProductStatus(product.id, "rejected")}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                                  title="Odbij"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <Link
                              href={`/product/${product.id}`}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-300"
                              title="Pogledaj"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/edit-product/${product.id}`}
                              className="p-2 text-[#88304E] hover:text-[#F7374F] hover:bg-[#88304E]/10 rounded-lg transition-all duration-300"
                              title="Uredi"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(product)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                              title="Obriši"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C2C2C]/90 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-400/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Potvrda brisanja</h3>
                  <p className="text-gray-400 text-sm">Ova akcija se ne može poništiti</p>
                </div>
              </div>

              <div className="bg-[#522546]/20 rounded-2xl p-4 mb-6">
                <p className="text-gray-300">
                  Jeste li sigurni da želite obrisati proizvod{" "}
                  <span className="text-[#F7374F] font-semibold">"{productToDelete.name}"</span>?
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-[#522546]/50 hover:bg-[#522546]/70 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                >
                  Otkaži
                </button>
                <button
                  onClick={deleteProduct}
                  className="flex-1 bg-gradient-to-r from-[#F7374F] to-red-500 hover:from-red-500 hover:to-[#F7374F] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
