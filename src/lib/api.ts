import { getRefreshToken } from "@/lib/token"
import { getAccessToken } from "@/lib/token"
import { clearTokens } from "@/lib/token"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://bobby-suppositional-unplacidly.ngrok-free.dev"

export async function login(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  const response = await fetch(`${API_BASE_URL}/api/proxy/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      remember_me: rememberMe,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error("Login error response:", data)
    throw new Error(data.message || "Login failed")
  }

  return data
}

export async function signup(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API_BASE_URL}/api/proxy/api/auth/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Signup failed")
  }

  return data
}

export async function refreshAccessToken() {
  const refresh = getRefreshToken()

  const response = await fetch(`${API_BASE_URL}/api/proxy/api/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error("Token refresh failed")
  }

  return data
}

export async function getMe() {
  const token = getAccessToken()

  const response = await fetch(`${API_BASE_URL}/api/proxy/api/users/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user")
  }

  return data
}

export function logout() {
  clearTokens()
  window.location.href = "/login"
}

export async function getOrganizations() {
  const token = getAccessToken()

  const response = await fetch(`${API_BASE_URL}/api/proxy/api/admin/organizations/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch organizations")
  }

  return data
}

export async function getUsers() {
  const token = getAccessToken()

  const response = await fetch(`${API_BASE_URL}/api/proxy/api/users/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users")
  }

  return data
}