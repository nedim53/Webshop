"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Link from "next/link"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Globe,
  UserPlus,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  LogIn,
  Shield,
} from "lucide-react"

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  first_name: string
  last_name: string
  city: string
  country: string
  phone: string
}

export default function RegisterPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const password = watch("password")

  useEffect(() => {
    // Ako je već prijavljen, nema potrebe za registracijom -> redirect na home ili dashboard
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")
    if (token) {
      router.replace(role === "admin" ? "/admin/dashboard" : "/home")
    }
  }, [router])

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          city: data.city,
          country: data.country,
          phone: data.phone,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Greška pri registraciji")
      }

      setSuccessMessage("Registracija uspješna! Preusmjeravamo vas na prijavu...")

      // Preusmjeri na login nakon 2 sekunde
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setErrorMessage(err.message || "Greška prilikom registracije")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "", color: "" }

    let strength = 0
    if (password.length >= 6) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++

    const levels = [
      { strength: 0, text: "", color: "" },
      { strength: 1, text: "Vrlo slaba", color: "text-red-400" },
      { strength: 2, text: "Slaba", color: "text-orange-400" },
      { strength: 3, text: "Srednja", color: "text-yellow-400" },
      { strength: 4, text: "Jaka", color: "text-green-400" },
      { strength: 5, text: "Vrlo jaka", color: "text-green-500" },
    ]

    return levels[strength]
  }

  const passwordStrength = getPasswordStrength(password || "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E] flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-[#2C2C2C]/60 backdrop-blur-sm rounded-3xl border border-[#522546]/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F7374F]/20 to-[#88304E]/20 p-8 border-b border-[#522546]/30">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F7374F] to-[#88304E] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] bg-clip-text text-transparent mb-2">
                Pridružite se nama
              </h1>
              <p className="text-gray-300 text-lg">Kreirajte vaš račun i počnite kupovinu</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#F7374F]/20 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-[#F7374F]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Lični podaci</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <User className="w-4 h-4 text-[#F7374F]" />
                      Korisničko ime
                    </label>
                    <input
                      type="text"
                      {...register("username", { required: "Korisničko ime je obavezno" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                      placeholder="Unesite korisničko ime"
                    />
                    {errors.username && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.username.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <Mail className="w-4 h-4 text-[#F7374F]" />
                      Email adresa
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email je obavezan",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Neispravna email adresa",
                        },
                      })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                      placeholder="unesite@email.com"
                    />
                    {errors.email && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.email.message}</span>
                      </div>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <User className="w-4 h-4 text-[#F7374F]" />
                      Ime
                    </label>
                    <input
                      type="text"
                      {...register("first_name", { required: "Ime je obavezno" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                      placeholder="Vaše ime"
                    />
                    {errors.first_name && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.first_name.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <User className="w-4 h-4 text-[#F7374F]" />
                      Prezime
                    </label>
                    <input
                      type="text"
                      {...register("last_name", { required: "Prezime je obavezno" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                      placeholder="Vaše prezime"
                    />
                    {errors.last_name && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.last_name.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#88304E]/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#88304E]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Kontakt informacije</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Phone */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <Phone className="w-4 h-4 text-[#F7374F]" />
                      Telefon
                    </label>
                    <input
                      type="text"
                      {...register("phone", { required: "Telefon je obavezan" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                      placeholder="+387 xx xxx xxx"
                    />
                    {errors.phone && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.phone.message}</span>
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <MapPin className="w-4 h-4 text-[#F7374F]" />
                      Grad
                    </label>
                    <input
                      type="text"
                      {...register("city", { required: "Grad je obavezan" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                      placeholder="Vaš grad"
                    />
                    {errors.city && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.city.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <Globe className="w-4 h-4 text-[#F7374F]" />
                      Država
                    </label>
                    <input
                      type="text"
                      {...register("country", { required: "Država je obavezna" })}
                      className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                      placeholder="Vaša država"
                    />
                    {errors.country && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.country.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#522546]/50 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-[#F7374F]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Sigurnost</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <Lock className="w-4 h-4 text-[#F7374F]" />
                      Lozinka
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Lozinka je obavezna",
                          minLength: { value: 6, message: "Lozinka treba imati minimalno 6 karaktera" },
                        })}
                        className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                        placeholder="Unesite lozinku"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#522546]/30 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.strength <= 2
                                  ? "bg-red-400"
                                  : passwordStrength.strength <= 3
                                    ? "bg-yellow-400"
                                    : "bg-green-400"
                              }`}
                              style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs ${passwordStrength.color}`}>{passwordStrength.text}</span>
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.password.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-white">
                      <Lock className="w-4 h-4 text-[#F7374F]" />
                      Potvrda lozinke
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Potvrda lozinke je obavezna",
                          validate: (value) => value === password || "Lozinke se ne poklapaju",
                        })}
                        className="w-full bg-[#2C2C2C]/80 border border-[#522546] rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7374F] focus:border-transparent transition-all duration-300 group-hover:border-[#522546]/80"
                        placeholder="Potvrdite lozinku"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center gap-2 mt-2 text-[#F7374F]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.confirmPassword.message}</span>
                      </div>
                    )}
                  </div>
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

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <p className="text-green-400 font-medium">{successMessage}</p>
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
                      Registracija u toku...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6" />
                      Kreiraj račun
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-300 mb-4">Već imate račun?</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#522546]/50 hover:bg-[#522546]/70 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                Prijavite se
              </Link>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-[#2C2C2C]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#522546]/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#88304E]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[#88304E]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Sigurnost i privatnost</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Vaši podaci su sigurno šifrovani i zaštićeni</li>
                <li>• Koristimo najnovije sigurnosne protokole</li>
                <li>• Vaša privatnost je naš prioritet</li>
                <li>• Možete obrisati račun u bilo kojem trenutku</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Registracijom se slažete sa našim{" "}
            <span className="text-[#F7374F] hover:text-[#88304E] cursor-pointer transition-colors">
              uslovima korišćenja
            </span>{" "}
            i{" "}
            <span className="text-[#F7374F] hover:text-[#88304E] cursor-pointer transition-colors">
              politikom privatnosti
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
