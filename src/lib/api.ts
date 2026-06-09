import { getRefreshToken } from "@/lib/token"
import { getAccessToken } from "@/lib/token"
import { clearTokens } from "@/lib/token"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://bobby-suppositional-unplacidly.ngrok-free.dev"

export async function login(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Login failed")
  return data
}

export async function signup(name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Signup failed")
  return data
}

export async function refreshAccessToken() {
  const refresh = getRefreshToken()
  const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ refresh }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error("Token refresh failed")
  return data
}

export async function getMe() {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}/api/users/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to fetch user")
  return data
}

export function logout() {
  clearTokens()
  window.location.href = "/login"
}

export async function getOrganizations() {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}/api/admin/organizations/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to fetch organizations")
  return data
}

export async function getUsers() {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to fetch users")
  return data
}

export async function createUser(name: string, email: string, password: string, role: string) {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ name, email, password, role }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to create user")
  return data
}

export async function editUserRole(userId: number, role: string) {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ role }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to update role")
  return data
}

export async function deleteUser(userId: number) {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
  })
  if (response.status === 204) return
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to delete user")
  return data
}