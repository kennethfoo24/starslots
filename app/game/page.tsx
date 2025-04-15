"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SlotMachine from "@/components/slot-machine"
import Header from "@/components/header"

export default function GamePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("slotsUser")
    if (!user) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-900 to-black text-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <SlotMachine />
      </main>
    </div>
  )
}
