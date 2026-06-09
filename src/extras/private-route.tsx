"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAccessToken } from "@/lib/token"

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.replace("/login")
    }
  }, [router])

  const token = getAccessToken()
  if (!token) return null

  return <>{children}</>
}