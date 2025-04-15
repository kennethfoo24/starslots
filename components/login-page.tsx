"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("slotsUser")
    if (user) {
      router.push("/game")
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setIsLoading(true)
      // Store user in localStorage
      localStorage.setItem("slotsUser", username)
      // Give initial stars
      localStorage.setItem("stars", "1000")

      // Simulate loading
      setTimeout(() => {
        router.push("/game")
      }, 800)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="border-2 border-purple-500 bg-black/80 text-white">
        <CardHeader className="text-center">
          <motion.div
            className="flex justify-center mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Star className="h-12 w-12 text-yellow-400" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-purple-300">STAR SLOTS</CardTitle>
          <CardDescription className="text-gray-400">Enter your username to start playing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-purple-950 border-purple-500 text-white placeholder:text-gray-500"
                required
              />
              <Button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isLoading ? "Logging in..." : "Play Now"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-400">
          Play responsibly. This is a demo game.
        </CardFooter>
      </Card>
    </motion.div>
  )
}
