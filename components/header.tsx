"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Star, LogOut } from "lucide-react"
import { motion } from "framer-motion"

export default function Header() {
  const [username, setUsername] = useState("")
  const [stars, setStars] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("slotsUser")
    const userStars = localStorage.getItem("stars")

    if (user) {
      setUsername(user)
    }

    if (userStars) {
      setStars(Number.parseInt(userStars))
    }

    // Listen for stars updates
    const handleStorageChange = () => {
      const updatedStars = localStorage.getItem("stars")
      if (updatedStars) {
        setStars(Number.parseInt(updatedStars))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for same-tab updates
    window.addEventListener("starsUpdated", () => {
      const updatedStars = localStorage.getItem("stars")
      if (updatedStars) {
        setStars(Number.parseInt(updatedStars))
      }
    })

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("starsUpdated", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("slotsUser")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-black/50 border-b border-purple-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Star className="h-6 w-6 text-yellow-400" />
          </motion.div>
          <h1 className="text-xl font-bold text-purple-300">STAR SLOTS</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-purple-900/50 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400" />
            <motion.span
              key={stars}
              initial={{ scale: 1.5, color: "#f0b90b" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.3 }}
              className="font-mono font-bold"
            >
              {stars.toLocaleString()}
            </motion.span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm hidden sm:inline">Welcome,</span>
            <span className="font-semibold text-purple-300">{username}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-400 hover:text-white hover:bg-red-900/30"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
