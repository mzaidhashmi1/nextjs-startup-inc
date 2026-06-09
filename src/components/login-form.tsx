"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon } from "lucide-react"
import { Inter } from 'next/font/google'
import Link from "next/link"
import { login } from "@/lib/api"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { setTokens } from "@/lib/token"

const inter = Inter({
  subsets: ["latin"],
})

export function LoginForm({
  
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()

    try{
      const data = await login(email,password)

      console.log("Full login response:", data)
      console.log("access:", data.tokens.access)
      console.log("refresh:", data.tokens.refresh)

      if (!data.tokens.access || !data.tokens.refresh) {
        console.error("Tokens missing from response!", data)
        return
      }

      setTokens(data.tokens.access, data.tokens.refresh)
      console.log("Tokens set in localStorage ✅");   
      router.push("/organizations") 
    } catch (error) {
      console.error("login failed", error)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", inter.className, className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6 text-blue-900" />
              </div>
              <span className="sr-only">StartUp.</span>
            </a>
            <h1 className="text-xl font-bold text-blue-900">Welcome to StartUp Inc.</h1>
            <FieldDescription>
              Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-900 hover:underline">
                  Sign up
                </Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email" className="text-blue-900">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password" className="text-blue-900">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Button type="submit" className="bg-blue-900">Login</Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
