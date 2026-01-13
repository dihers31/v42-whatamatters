"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { initGA } from "@/lib/analytics"
import { motion, AnimatePresence } from "framer-motion"

export default function ConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("ga-consent")
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShow(true), 1000)
    } else if (consent === "accepted") {
      // Initialize GA4 if consent was previously given
      initGA()
    }
  }, [])

  const accept = () => {
    localStorage.setItem("ga-consent", "accepted")
    initGA()
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem("ga-consent", "declined")
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#333333] p-4 z-[300] shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#999999] leading-relaxed">
              We use cookies to improve your experience and analyze site traffic. By clicking "Accept", you consent to
              our use of cookies.
            </p>
            <div className="flex gap-3 shrink-0">
              <Button
                onClick={decline}
                variant="outline"
                className="border-[#333333] text-white hover:bg-[#333333] transition-colors bg-transparent"
              >
                Decline
              </Button>
              <Button onClick={accept} className="bg-[#0066FF] hover:bg-[#4D94FF] text-white transition-colors">
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
