"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Star, RotateCw, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Slot symbols with their respective values
const symbols = [
  { id: "cherry", value: 10, emoji: "🍒" },
  { id: "lemon", value: 20, emoji: "🍋" },
  { id: "orange", value: 30, emoji: "🍊" },
  { id: "watermelon", value: 40, emoji: "🍉" },
  { id: "grape", value: 50, emoji: "🍇" },
  { id: "seven", value: 100, emoji: "7️⃣" },
  { id: "star", value: 200, emoji: "⭐" },
  { id: "diamond", value: 300, emoji: "💎" },
]

// Winning combinations and multipliers
const winningCombinations = [
  { pattern: ["cherry", "cherry", "cherry"], multiplier: 2 },
  { pattern: ["lemon", "lemon", "lemon"], multiplier: 3 },
  { pattern: ["orange", "orange", "orange"], multiplier: 4 },
  { pattern: ["watermelon", "watermelon", "watermelon"], multiplier: 5 },
  { pattern: ["grape", "grape", "grape"], multiplier: 6 },
  { pattern: ["seven", "seven", "seven"], multiplier: 10 },
  { pattern: ["star", "star", "star"], multiplier: 20 },
  { pattern: ["diamond", "diamond", "diamond"], multiplier: 50 },
  // Any three same symbols
  { pattern: "any-three-same", multiplier: 2 },
]

export default function SlotMachine() {
  const [reels, setReels] = useState([
    symbols[Math.floor(Math.random() * symbols.length)].id,
    symbols[Math.floor(Math.random() * symbols.length)].id,
    symbols[Math.floor(Math.random() * symbols.length)].id,
  ])
  const [spinning, setSpinning] = useState(false)
  const [bet, setBet] = useState(10)
  const [stars, setStars] = useState(1000)
  const [win, setWin] = useState(0)
  const [message, setMessage] = useState("Place your bet and spin!")
  const [showWinMessage, setShowWinMessage] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const spinSound = useRef<HTMLAudioElement | null>(null)
  const winSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio
    spinSound.current = new Audio("/spin.mp3")
    winSound.current = new Audio("/win.mp3")

    // Get stars from localStorage
    const userStars = localStorage.getItem("stars")
    if (userStars) {
      setStars(Number.parseInt(userStars))
    }

    return () => {
      // Cleanup audio
      if (spinSound.current) {
        spinSound.current.pause()
        spinSound.current = null
      }
      if (winSound.current) {
        winSound.current.pause()
        winSound.current = null
      }
    }
  }, [])

  // Update localStorage when stars change
  useEffect(() => {
    localStorage.setItem("stars", stars.toString())
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("starsUpdated"))
  }, [stars])

  const playSound = (sound: HTMLAudioElement | null) => {
    if (sound && soundEnabled) {
      sound.currentTime = 0
      sound.play().catch((e) => console.log("Audio play error:", e))
    }
  }

  const spin = () => {
    if (spinning || stars < bet) return

    // Deduct bet amount
    setStars((prev) => prev - bet)
    setSpinning(true)
    setWin(0)
    setMessage("Spinning...")
    setShowWinMessage(false)

    playSound(spinSound.current)

    // Simulate spinning animation with multiple updates
    const spinDuration = 2000 // 2 seconds
    const updateInterval = 100 // Update every 100ms
    const updates = spinDuration / updateInterval
    let currentUpdate = 0

    const spinInterval = setInterval(() => {
      currentUpdate++

      // Update reels with random symbols
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)].id,
        symbols[Math.floor(Math.random() * symbols.length)].id,
        symbols[Math.floor(Math.random() * symbols.length)].id,
      ])

      // Final update - determine result
      if (currentUpdate >= updates) {
        clearInterval(spinInterval)

        // Generate final result
        const finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)].id,
          symbols[Math.floor(Math.random() * symbols.length)].id,
          symbols[Math.floor(Math.random() * symbols.length)].id,
        ]

        setReels(finalReels)

        // Check for wins
        const winAmount = checkWin(finalReels, bet)

        setTimeout(() => {
          if (winAmount > 0) {
            setWin(winAmount)
            setStars((prev) => prev + winAmount)
            setMessage(`You won ${winAmount} stars!`)
            setShowWinMessage(true)
            playSound(winSound.current)
          } else {
            setMessage("Try again!")
          }
          setSpinning(false)
        }, 500)
      }
    }, updateInterval)
  }

  const checkWin = (currentReels: string[], betAmount: number): number => {
    // Check if all symbols are the same
    const allSame = currentReels.every((symbol) => symbol === currentReels[0])

    if (allSame) {
      // Find the specific combination
      const combination = winningCombinations.find(
        (combo) => Array.isArray(combo.pattern) && combo.pattern[0] === currentReels[0],
      )

      if (combination) {
        return betAmount * combination.multiplier
      }

      // If not found in specific combinations, use the "any-three-same" rule
      const anyThreeSame = winningCombinations.find((combo) => combo.pattern === "any-three-same")
      if (anyThreeSame) {
        return betAmount * anyThreeSame.multiplier
      }
    }

    return 0
  }

  const getSymbolEmoji = (symbolId: string): string => {
    const symbol = symbols.find((s) => s.id === symbolId)
    return symbol ? symbol.emoji : "❓"
  }

  const handleBetChange = (value: number[]) => {
    setBet(value[0])
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black/80 border-2 border-purple-500 rounded-xl p-6 shadow-lg shadow-purple-900/30"
      >
        {/* Sound toggle */}
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={toggleSound} className="text-gray-400 hover:text-white">
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            <span className="sr-only">{soundEnabled ? "Mute Sound" : "Enable Sound"}</span>
          </Button>
        </div>

        {/* Slot machine display */}
        <div className="bg-purple-950 border border-purple-600 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-purple-300">
              BET: <span className="font-bold text-white">{bet}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="font-mono font-bold">{stars}</span>
            </div>
          </div>

          {/* Reels */}
          <div className="flex justify-center gap-2 mb-6">
            {reels.map((symbol, index) => (
              <motion.div
                key={`reel-${index}`}
                className={cn(
                  "w-20 h-20 flex items-center justify-center text-4xl bg-gradient-to-b from-purple-800 to-purple-950 rounded-lg border-2 border-purple-500",
                  spinning && "border-yellow-400",
                )}
                animate={
                  spinning
                    ? {
                        y: [0, -10, 0, -5, 0],
                        scale: [1, 1.05, 1, 1.02, 1],
                      }
                    : {}
                }
                transition={
                  spinning
                    ? {
                        duration: 0.3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: index * 0.1,
                      }
                    : {}
                }
              >
                {getSymbolEmoji(symbol)}
              </motion.div>
            ))}
          </div>

          {/* Win message */}
          <AnimatePresence>
            {showWinMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="text-center font-bold text-xl text-yellow-400 mb-4"
              >
                WIN! +{win} <Star className="inline-block h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center text-sm text-gray-300 h-5">{message}</div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Bet Amount</span>
              <span className="flex items-center gap-1">
                {bet} <Star className="h-3 w-3 text-yellow-400" />
              </span>
            </div>
            <Slider
              value={[bet]}
              min={10}
              max={Math.min(100, stars)}
              step={10}
              onValueChange={handleBetChange}
              disabled={spinning || stars < 10}
              className="py-2"
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setBet(Math.max(10, bet - 10))}
              disabled={spinning || bet <= 10}
              variant="outline"
              className="flex-1 border-purple-600 text-purple-300 hover:bg-purple-900/30"
            >
              - 10
            </Button>
            <Button
              onClick={() => setBet(Math.min(stars, bet + 10))}
              disabled={spinning || bet >= Math.min(100, stars)}
              variant="outline"
              className="flex-1 border-purple-600 text-purple-300 hover:bg-purple-900/30"
            >
              + 10
            </Button>
          </div>

          <Button
            onClick={spin}
            disabled={spinning || stars < bet}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg"
          >
            {spinning ? <RotateCw className="h-5 w-5 animate-spin" /> : "SPIN"}
          </Button>

          <Button
            onClick={() => setBet(Math.min(stars, 100))}
            disabled={spinning || stars < 10}
            variant="ghost"
            className="w-full text-sm text-gray-400 hover:text-white hover:bg-purple-900/30"
          >
            MAX BET
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
