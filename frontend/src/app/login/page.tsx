"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, Shield, User } from "lucide-react"

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Ako je korisnik već prijavljen (token postoji), preusmjeri ga na odgovarajuću stranicu
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")
    if (token) {
      if (role === "admin") {
        router.replace("/admin/dashboard")
      } else {
        router.replace("/home")
      }
    }
  }, [router])

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Greška pri prijavi")
      }

      // Spremanje podataka u localStorage
      localStorage.setItem("token", result.token)
      localStorage.setItem("userRole", result.user.role)
      localStorage.setItem("userId", String(result.user.id))
      localStorage.setItem("userEmail", result.user.email)
      localStorage.setItem("userName", `${result.user.firstName} ${result.user.lastName}`)

      // Emit custom event za ažuriranje NavBar-a
      window.dispatchEvent(new Event("authStateChanged"))

      // Preusmjeravanje zavisno od uloge
      if (result.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/home")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Došlo je do greške prilikom prijave")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F7374F]/20 to-[#88304E]/20 p-8 border-b border-[#522546]/30">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent mb-2">
                Dobrodošli nazad
              </h1>
              <p className="text-gray-300 text-lg">Prijavite se na vaš račun</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                  <Mail className="w-5 h-5 text-[#F7374F]" />
                  Email adresa
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email je obavezan",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Neispravna email adresa",
                      },
                    })}
                    className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                    placeholder="unesite@email.com"
                  />
                  {errors.email && (
                    <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors.email.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="flex items-center gap-2 mb-3 font-semibold text-white text-lg">
                  <Lock className="w-5 h-5 text-[#F7374F]" />
                  Lozinka
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Lozinka je obavezna",
                      minLength: {
                        value: 6,
                        message: "Lozinka mora imati najmanje 6 karaktera",
                      },
                    })}
                    className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-2xl px-6 py-4 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 text-lg group-hover:border-[#522546]/80"
                    placeholder="Unesite lozinku"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors.password.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-[#F7374F]/10 border border-[#F7374F]/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-[#F7374F] flex-shrink-0" />
                    <p className="text-[#F7374F] font-medium">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#F7374F] to-[#88304E] text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-[#88304E] hover:to-[#F7374F] transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-[#F7374F]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      Prijavljivanje...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6" />
                      Prijavi se
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-[#522546]/50"></div>
              <span className="px-4 text-gray-400 text-sm">ili</span>
              <div className="flex-1 border-t border-[#522546]/50"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-300 mb-4">Nemate račun?</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#522546]/50 hover:bg-[#522546]/70 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <User className="w-5 h-5" />
                Registrujte se
              </Link>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-4 border border-[#522546]/30 text-center">
            <div className="w-10 h-10 bg-[#F7374F]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <User className="w-5 h-5 text-[#F7374F]" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">Korisnici</h3>
            <p className="text-gray-400 text-xs">Kupovina i prodaja</p>
          </div>

          <div className="bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-4 border border-[#522546]/30 text-center">
            <div className="w-10 h-10 bg-[#88304E]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-[#88304E]" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">Administratori</h3>
            <p className="text-gray-400 text-xs">Upravljanje sistemom</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Prijavom se slažete sa našim{" "}
            <span className="text-[#F7374F] hover:text-[#88304E] cursor-pointer transition-colors">
              uslovima korišćenja
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
