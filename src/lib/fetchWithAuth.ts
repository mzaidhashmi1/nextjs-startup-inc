import { getAccessToken, setTokens, clearTokens } from "@/lib/token"
import { refreshAccessToken } from "@/lib/api"

export async function fetchWithAuth(url: string, options: any = {}) {
  let token = getAccessToken()

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.status === 401) {
    try {
      const newTokens = await refreshAccessToken()

      setTokens(newTokens.access, newTokens.refresh)

      token = newTokens.access

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (err) {
      clearTokens()
      window.location.href = "/login"
    }
  }

  return res
}