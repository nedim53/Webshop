"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Package, ShoppingCart, Star, TrendingUp, Filter } from "lucide-react"

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "name">("newest")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        if (!res.ok) {
          throw new Error("Greška pri dohvatanju proizvoda")
        }
        const data = await res.json()

        // Filtriraj samo odobrene proizvode
        const approvedProducts = data.filter((product: Product) => product.status === "approved")
        setProducts(approvedProducts)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filtrirani i sortirani proizvodi
  const filteredAndSortedProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime()
      }
    })

  const isNewProduct = (datePosted: string) => {
    const productDate = new Date(datePosted)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return productDate > weekAgo
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#F7374F] border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl text-white font-medium">Učitavanje proizvoda...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex justify-center items-center">
        <div className="text-center bg-[#2C2C2C]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#F7374F]/20">
          <div className="w-16 h-16 bg-[#F7374F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-[#F7374F]" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Greška</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-2xl mb-6 shadow-2xl">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent mb-4">
            Ponuda proizvoda
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Otkrijte našu ekskluzivnu kolekciju kvalitetnih proizvoda po pristupačnim cijenama
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Pretraga proizvoda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-[#2C2C2C]/80 backdrop-blur-sm border border-[#522546] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-12 pr-8 py-4 bg-[#2C2C2C]/80 backdrop-blur-sm border border-[#522546] rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="newest">Najnoviji</option>
                <option value="price-low">Cijena: Niska → Visoka</option>
                <option value="price-high">Cijena: Visoka → Niska</option>
                <option value="name">Naziv A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#522546]/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-300 font-medium">
              {searchTerm ? "Nema proizvoda koji odgovaraju pretrazi." : "Nema dostupnih proizvoda."}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 text-[#F7374F] hover:text-[#88304E] transition-colors underline"
              >
                Obriši pretragu
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-[#2C2C2C]/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#522546]/50 hover:border-[#F7374F]/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#F7374F]/20 relative"
              >
                {/* New Badge */}
                {isNewProduct(product.date_posted) && (
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3" />
                    NOVO
                  </div>
                )}

                {/* Low Stock Badge */}
                {product.quantity <= 5 && product.quantity > 0 && (
                  <div className="absolute top-3 right-3 z-10 bg-yellow-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Malo zaliha
                  </div>
                )}

                {/* Product Image */}
                <div className="relative overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {

                        e.currentTarget.style.display = 'none'
                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                        if (placeholder) {
                          placeholder.style.display = 'flex'
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-56 bg-gradient-to-br from-[#522546] to-[#88304E] flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}
                    style={{ display: product.image_url ? 'none' : 'flex' }}
                  >
                    <Package className="w-16 h-16 text-white/50" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h2 className="font-bold text-xl mb-3 text-white group-hover:text-[#F7374F] transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h2>

                  <p className="mb-4 text-gray-300 text-sm line-clamp-3 leading-relaxed">
                    {product.description || "Nema opisa"}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                      <span className="font-bold text-2xl">{product.price.toFixed(2)} KM</span>
                    </div>
                    <div className="text-sm text-gray-400 bg-[#522546]/30 px-3 py-1 rounded-full">
                      {product.quantity} kom
                    </div>
                  </div>

                  <Link
                    href={`/product/${product.id}`}
                    className="block w-full text-center bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Pogledaj detalje
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-16 pt-8 border-t border-[#522546]/30">
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>
              Prikazano {filteredAndSortedProducts.length} od {products.length} proizvoda
            </span>
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-500">
              Rezultati pretrage za: "<span className="text-[#F7374F]">{searchTerm}</span>"
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
