"use client"

import * as React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Briefcase, Lock, Mail, Loader2, AlertCircle, Sparkles, Copy, Check } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }

    try {
      setIsLoading(true)
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password. Please check your credentials.")
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("An unexpected error occurred during sign in. Please try again.")
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("recruiter@miniats.com")
    setPassword("Demo@1234")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Briefcase className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Mini ATS</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your recruitment portal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="recruiter@miniats.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-medium h-10 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo credentials callout */}
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Demo Credentials</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={fillDemoCredentials}
                className="text-xs h-7 gap-1 bg-background hover:bg-primary/10"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Filled!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Auto Fill</span>
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-sans font-medium text-foreground">Email:</span>
                <span>recruiter@miniats.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans font-medium text-foreground">Password:</span>
                <span>Demo@1234</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
          Mini ATS — Production Ready Applicant Tracking
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
