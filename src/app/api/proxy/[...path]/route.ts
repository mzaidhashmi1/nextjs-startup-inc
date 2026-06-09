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