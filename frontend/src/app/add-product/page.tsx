"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Plus, Package, DollarSign, Hash, ImageIcon, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

interface ProductFormData {
  name: string
  description: string
  price: number
  image_url?: string
  quantity: number
}

export default function AddProductPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Zaštita rute: ako nije prijavljen, preusmjeri na /login
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login")
    }
  }, [router])

  const onSubmit = async (data: ProductFormData) => {
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.replace("/login")
        return
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Greška pri dodavanju proizvoda")
      }

      setSuccess("Proizvod uspješno dodan!")

      // Preusmjeri na detalje novog proizvoda nakon 2 sekunde
      setTimeout(() => {
        router.push(`/product/${result.id}`)
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Nazad</span>
        </button>

        {/* Main Card */}
        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F7374F]/20 to-[#88304E]/20 p-8 border-b border-[#522546]/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent">
                  Dodaj novi proizvod
                </h1>
                <p className="text-gray-300 mt-2">Popunite formu da biste dodali svoj proizvod</p>
              </div>
            </div>
          </div>

          {/* Form */}
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
                      min="1"
                      {...register("quantity", {
                        required: "Količina je obavezna",
                        min: { value: 1, message: "Količina mora biti najmanje 1" },
                      })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                      placeholder="1"
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

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-[#F7374F]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      Dodavanje proizvoda...
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Dodaj proizvod
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#88304E]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-[#88304E]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Napomene o dodavanju proizvoda</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Svi proizvodi prolaze kroz proces odobrenja prije objavljivanja</li>
                <li>• Molimo unesite tačne informacije o proizvodu</li>
                <li>• Slika proizvoda pomaže u bržoj prodaji</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
