import { NextRequest, NextResponse } from "next/server"

const BACKEND = "https://bobby-suppositional-unplacidly.ngrok-free.dev"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const url = `${BACKEND}/${path.join("/")}/`

  const authHeader = req.headers.get("Authorization")

  const response = await fetch(url, {
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const url = `${BACKEND}/${path.join("/")}/`

  const authHeader = req.headers.get("Authorization")
  const body = await req.text()

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    },
    body,
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const url = `${BACKEND}/${path.join("/")}/`

  const authHeader = req.headers.get("Authorization")
  const body = await req.text()

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    },
    body,
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const url = `${BACKEND}/${path.join("/")}/`

  const authHeader = req.headers.get("Authorization")

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    },
  })

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}