"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogInIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      if (error) {
        setError(error.message)
        return
      }
      // Se il login è riuscito, reindirizza alla dashboard
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminLoginTime", new Date().toISOString())
      void router.push("/admin/dashboard")
    } catch (err) {
      console.error("Errore durante il login:", err)
      setError("Errore durante il login. Riprova.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-950 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="relative w-50 h-24 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="AldebaranDrive Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">AldebaranDrive</h1>
          <p className="text-neutral-400 text-lg">Pannello Amministratore</p>
        </div>
        {/* Form di Login */}
        <Card className="bg-neutral-900 text-white shadow-2xl border border-neutral-800 rounded-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl text-white flex items-center justify-center gap-3 font-bold">
              <LogInIcon className="w-7 h-7 text-white" />
              Accesso Admin
            </CardTitle>
            <CardDescription className="text-neutral-400 text-base mt-2">
              Inserisci le tue credenziali per accedere al pannello di controllo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert className="bg-red-900/20 border-red-700 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300 text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="Inserisci email"
                  className="border border-neutral-700 bg-neutral-800 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full text-white placeholder:text-neutral-500 transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-300 text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Inserisci password"
                    className="border border-neutral-700 bg-neutral-800 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full text-white placeholder:text-neutral-500 pr-10 transition-all duration-200"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-green-400 transition-colors duration-200"
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Accesso in corso...
                  </span>
                ) : (
                  <>
                    <LogInIcon className="w-5 h-5" />
                    Accedi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Link per tornare al sito */}
        <div className="text-center mt-8">
          <Button
            onClick={() => void router.push("/")}
            variant="outline"
            className="bg-transparent border border-neutral-700 text-neutral-300 hover:bg-neutral-800 px-6 py-3 rounded-lg transition-all duration-200 text-base"
          >
            ← Torna al Sito
          </Button>
        </div>
      </motion.div>
    </div>
  )
}