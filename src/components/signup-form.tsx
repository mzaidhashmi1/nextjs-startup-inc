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
import { useState } from "react"
import { signup } from "@/lib/api"
import { useRouter } from "next/navigation"

const inter = Inter({
  subsets: ["latin"],
})

export function SignupForm({
  
  className,
  ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault()
  
      try{
        const data = await signup(name,email,password)
  
        console.log("signup successful");
        console.log(data);    
        router.push("/login")
      } catch (error) {
        console.error("signup failed", error)
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
            <h1 className="text-xl font-bold text-blue-900" >Welcome to StartUp Inc.</h1>
            <FieldDescription >
              Already have an account?{" "}
                <Link href="/login" className="text-blue-900 hover:underline">
                  Sign in
                </Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="name" className="text-blue-900">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="James Bond"
              value={name}
              onChange={(e)=> setName(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email" className="text-blue-900">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel className="text-blue-900" htmlFor="password">Password</FieldLabel>
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
            <Button type="submit" className="bg-blue-900">Create Account</Button>
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
