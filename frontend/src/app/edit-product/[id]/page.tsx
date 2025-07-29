"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  Edit,
  Package,
  DollarSign,
  Hash,
  ImageIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  X,
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

interface ProductFormData {
  name: string
  description: string
  price: number
  image_url?: string
  quantity: number
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const watchedImageUrl = watch("image_url")

  useEffect(() => {
    if (watchedImageUrl) {
      setImagePreview(watchedImageUrl)
    } else {
      setImagePreview(null)
    }
  }, [watchedImageUrl])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login")
      return
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Nemate pristup ovom resursu")
        }

        const data: Product = await res.json()

        // Provjeri da li korisnik ima prava da uređuje (vlasnik ili admin)
        const currentUserId = localStorage.getItem("userId")
        const userRole = localStorage.getItem("userRole")
        const isAdmin = userRole === "admin"
        const isOwner = currentUserId && data.seller_id === Number(currentUserId)

        if (!isAdmin && !isOwner) {
          router.replace("/home")
          return
        }

        // Popuni formu postojećim vrijednostima proizvoda
        reset({
          name: data.name,
          description: data.description,
          price: data.price,
          image_url: data.image_url,
          quantity: data.quantity,
        })

        if (data.image_url) {
          setImagePreview(data.image_url)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router, reset])

  const onSubmit = async (formData: ProductFormData) => {
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.replace("/login")
        return
      }

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Greška pri ažuriranju proizvoda")
      }

      setSuccess("Proizvod uspješno ažuriran!")

      // Preusmjeri na detalje proizvoda nakon 2 sekunde
      setTimeout(() => {
        router.push(`/product/${productId}`)
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    }
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

  if (error && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center px-4">
        <div className="text-center bg-[#2C2C2C]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#F7374F]/20 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-[#F7374F] mx-auto mb-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Nazad</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Image Preview */}
          <div className="lg:col-span-1">
            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-[#F7374F]/20 to-[#88304E]/20 p-6 border-b border-[#522546]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#88304E]/20 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#88304E]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Pregled slike</h3>
                </div>
              </div>

              <div className="p-6">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Product preview"
                      className="w-full h-64 object-cover rounded-2xl border border-[#522546]/30"
                      onError={() => setImagePreview(null)}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                      <p className="text-white text-sm">Pregled proizvoda</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-[#522546]/30 rounded-2xl flex items-center justify-center border-2 border-dashed border-[#522546]/50">
                    <div className="text-center">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Nema slike</p>
                      <p className="text-gray-500 text-sm">Dodajte URL slike</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#F7374F]/20 to-[#88304E]/20 p-8 border-b border-[#522546]/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-2xl flex items-center justify-center shadow-lg">
                    <Edit className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                      Uredi proizvod
                    </h1>
                    <p className="text-gray-300 mt-2">Ažurirajte informacije o vašem proizvodu</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Product Name */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                      <Package className="w-5 h-5 text-[#F7374F]" />
                      Naziv proizvoda
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("name", { required: "Naziv je obavezan" })}
                        className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                        placeholder="Unesite naziv proizvoda"
                      />
                      {errors.name && (
                        <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{errors.name.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                      <FileText className="w-5 h-5 text-[#F7374F]" />
                      Opis proizvoda
                    </label>
                    <div className="relative">
                      <textarea
                        {...register("description", { required: "Opis je obavezan" })}
                        rows={5}
                        className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg resize-none group-hover:border-[#522546]/80"
                        placeholder="Detaljno opišite vaš proizvod..."
                      />
                      {errors.description && (
                        <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{errors.description.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Quantity Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div className="group">
                      <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                        <DollarSign className="w-5 h-5 text-[#F7374F]" />
                        Cijena (KM)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register("price", {
                            required: "Cijena je obavezna",
                            min: { value: 0, message: "Cijena mora biti pozitivan broj" },
                          })}
                          className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                          placeholder="0.00"
                        />
                        {errors.price && (
                          <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{errors.price.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="group">
                      <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                        <Hash className="w-5 h-5 text-[#F7374F]" />
                        Količina
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          {...register("quantity", {
                            required: "Količina je obavezna",
                            min: { value: 0, message: "Količina mora biti pozitivan broj" },
                          })}
                          className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                          placeholder="0"
                        />
                        {errors.quantity && (
                          <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{errors.quantity.message}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                      <ImageIcon className="w-5 h-5 text-[#F7374F]" />
                      URL slike
                      <span className="text-sm text-gray-400 font-normal">(opcionalno)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        {...register("image_url")}
                        className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                        placeholder="https://example.com/image.jpg"
                      />
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

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex items-center justify-center gap-2 bg-[#522546]/50 hover:bg-[#522546]/70 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      Otkaži
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white py-4 px-8 rounded-2xl font-bold hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-[#F7374F]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Ažuriranje...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Ažuriraj proizvod
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
