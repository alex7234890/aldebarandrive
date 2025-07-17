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
import { supabase } from "@/lib/supabaseClient" // Importa il client Supabase

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
      router.push("/admin/dashboard")

    } catch (err) {
      console.error("Errore durante il login:", err);
      setError("Errore durante il login. Riprova.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="AldebaranDrive Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">AldebaranDrive</h1>
          <p className="text-gray-600">Pannello Amministratore</p>
        </div>

        {/* Form di Login */}
        <Card className="bg-white text-black shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-black flex items-center justify-center gap-2">
              <LogInIcon className="w-6 h-6" />
              Accesso Admin
            </CardTitle>
            <CardDescription className="text-gray-700">
              Inserisci le tue credenziali per accedere al pannello di controllo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert className="bg-red-100 border-red-500 text-red-700">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="Inserisci email"
                  className="border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-black focus:outline-none w-full text-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black">
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
                    className="border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-black focus:outline-none w-full text-black pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-3"
              >
                {loading ? (
                  <span>Accesso in corso...</span>
                ) : (
                  <>
                    <span className="flex items-center justify-center gap-2">
                      <LogInIcon className="w-4 h-4" />
                      Accedi
                    </span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Link per tornare al sito */}
        <div className="text-center mt-6">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="bg-transparent border border-black text-black hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            ← Torna al Sito
          </Button>
        </div>
      </div>
    </div>
  )
}