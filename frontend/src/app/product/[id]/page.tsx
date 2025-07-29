"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Package,
  ShoppingCart,
  Edit,
  Star,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  Share2,
  DollarSign,
  Hash,
  Eye,
  HelpCircle,
} from "lucide-react"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  image_url?: string
  quantity: number
  status: string
  seller_id: number
  date_posted: string
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addMessage, setAddMessage] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    // Dohvati user info iz localStorage
    const userId = localStorage.getItem('userId')
    const userRole = localStorage.getItem('userRole')
    
    setCurrentUserId(userId)
    setIsAdmin(userRole === 'admin')
    
    if (product) {
      setCanEdit(Boolean(userRole === 'admin' || (userId && product.seller_id === Number(userId))))
    }
  }, [product])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`)
        
        if (!res.ok) {
          throw new Error('Proizvod nije pronađen')
        }

        const data: Product = await res.json()
        setProduct(data)

        setImageLoaded(false)
        setImageError(false)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    if (product) {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          router.push('/login')
          return
        }

        const response = await fetch(`/api/cart/${userId}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product.id, quantity: quantity })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Greška pri dodavanju u korpu')
        }

        setAddMessage('Proizvod je dodan u korpu!')
        setTimeout(() => setAddMessage(null), 3000)
      } catch (err: any) {
        setAddMessage(err.message)
        setTimeout(() => setAddMessage(null), 3000)
      }
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(quantity + change, product?.quantity || 1))
    setQuantity(newQuantity)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'rejected':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return <HelpCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Odobreno'
      case 'pending':
        return 'Na čekanju'
      case 'rejected':
        return 'Odbijeno'
      default:
        return status
    }
  }

  const isNewProduct = (datePosted: string) => {
    const productDate = new Date(datePosted)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return productDate > weekAgo
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center px-4">
        <div className="text-center bg-[#2C2C2C]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#F7374F]/20 max-w-md w-full">
          <AlertTriangle className="w-16 h-16 text-[#F7374F] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Greška</h2>
          <p className="text-gray-300 mb-6">{error || "Proizvod nije pronađen."}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Nazad na proizvode</span>
        </button>

        {/* Main Product Card */}
        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative group">
              {product.image_url && !imageError ? (
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={`w-full h-96 lg:h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-[#522546]/30 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F7374F] border-t-transparent"></div>
                    </div>
                  )}
                  {imageError && (
                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                      <AlertTriangle className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-full h-96 lg:h-full bg-gradient-to-br from-[#522546] to-[#88304E] flex items-center justify-center">
                  <Package className="w-24 h-24 text-white/50" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isNewProduct(product.date_posted) && (
                  <div className="bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3" />
                    NOVO
                  </div>
                )}
                {product.quantity <= 5 && product.quantity > 0 && (
                  <div className="bg-yellow-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Malo zaliha
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-[#2C2C2C]/80 backdrop-blur-sm border border-[#522546]/50 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#F7374F] hover:bg-[#F7374F]/10 transition-all duration-300">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-[#2C2C2C]/80 backdrop-blur-sm border border-[#522546]/50 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#F7374F] hover:bg-[#F7374F]/10 transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-medium border ${getStatusColor(
                      product.status,
                    )}`}
                  >
                    {getStatusIcon(product.status)}
                    {getStatusText(product.status)}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{product.name}</h1>

                <div className="flex items-center gap-6 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(product.date_posted).toLocaleDateString("hr-HR")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>ID: #{product.id}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#F7374F]" />
                  Opis proizvoda
                </h3>
                <div className="bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {product.description || "Nema dostupnog opisa za ovaj proizvod."}
                  </p>
                </div>
              </div>

              {/* Price and Stock */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-[#F7374F]/10 to-[#88304E]/10 rounded-2xl p-6 border border-[#F7374F]/20">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-[#F7374F]" />
                      <div>
                        <p className="text-gray-400 text-sm">Cijena</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                          {product.price.toFixed(2)} KM
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Hash className="w-6 h-6 text-[#88304E]" />
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Dostupno</p>
                        <p className="text-2xl font-bold text-white">{product.quantity} kom</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.status === "approved" && product.quantity > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Količina</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-12 h-12 bg-[#522546]/50 hover:bg-[#F7374F] text-white rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="w-20 h-12 bg-[#2C2C2C]/60 border border-[#522546]/30 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{quantity}</span>
                    </div>

                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.quantity}
                      className="w-12 h-12 bg-[#522546]/50 hover:bg-[#F7374F] text-white rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    <span className="text-gray-400 text-sm">Maksimalno {product.quantity} kom</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.status !== "approved" || product.quantity === 0}
                  className="w-full bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-[#F7374F]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {product.status !== "approved" ? (
                    <>
                      <XCircle className="w-6 h-6" />
                      Proizvod nije odobren
                    </>
                  ) : product.quantity === 0 ? (
                    <>
                      <AlertTriangle className="w-6 h-6" />
                      Nema na stanju
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      Dodaj u korpu ({quantity} kom)
                    </>
                  )}
                </button>

                {canEdit && (
                  <Link
                    href={`/edit-product/${product.id}`}
                    className="block w-full text-center bg-[#522546]/50 hover:bg-[#522546]/70 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3"
                  >
                    <Edit className="w-5 h-5" />
                    Uredi proizvod
                  </Link>
                )}
              </div>

              {/* Success/Error Message */}
              {addMessage && (
                <div
                  className={`mt-6 p-6 rounded-2xl backdrop-blur-sm ${
                    addMessage.includes("uspješno")
                      ? "bg-green-500/10 border border-green-500/30"
                      : "bg-[#F7374F]/10 border border-[#F7374F]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {addMessage.includes("uspješno") ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-[#F7374F] flex-shrink-0" />
                    )}
                    <p
                      className={`font-medium ${addMessage.includes("uspješno") ? "text-green-400" : "text-[#F7374F]"}`}
                    >
                      {addMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#88304E]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-[#88304E]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Informacije o proizvodu</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Svi proizvodi prolaze kroz proces odobrenja</li>
                <li>• Kontaktirajte prodavca za dodatne informacije</li>
                <li>• Provjera dostupnosti u realnom vremenu</li>
                <li>• Sigurna kupovina kroz našu platformu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
