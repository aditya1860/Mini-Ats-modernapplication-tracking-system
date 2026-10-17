"use client"

import * as React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Briefcase, Lock, Mail, Loader2, AlertCircle, Sparkles, Copy, Check, ShieldCheck, Cpu } from "lucide-react"

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
        email: email.trim(),
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password. Please check your credentials.")
        setIsLoading(false)
        return
      }

      window.location.href = callbackUrl || "/"
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
    <div className="relative flex min-h-screen items-center justify-center p-4 cyber-grid overflow-hidden bg-background">
      {/* Futuristic Background Ambient Glow Orbs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-indigo-500/15 blur-[140px] pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl glass-panel border-border/80 relative z-10">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <Cpu className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">
                Mini ATS
              </CardTitle>
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-400">
                v2.4
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Neural Candidate Tracking & Recruitment Intelligence Portal
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground/90">
                Authorized Recruiter Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="recruiter@miniats.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9 text-xs bg-background/80 focus:border-cyan-500/50"
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground/90">
                  Access Key / Password
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
                  className="pl-9 h-9 text-xs bg-background/80 focus:border-cyan-500/50"
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold h-10 mt-3 text-xs bg-linear-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-md border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating Core...
                </>
              ) : (
                "Authorize & Enter Portal"
              )}
            </Button>
          </form>

          {/* Holographic Demo Credentials Box */}
          <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 text-xs backdrop-blur-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px] uppercase tracking-wider">Demo Credentials</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={fillDemoCredentials}
                className="text-xs h-6 px-2 gap-1 bg-background border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span>Auto-Filled</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>One-Click Fill</span>
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-sans text-foreground/80">Email:</span>
                <span className="text-foreground font-semibold">recruiter@miniats.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-foreground/80">Password:</span>
                <span className="text-foreground font-semibold">Demo@1234</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-2 border-t border-border/50 pt-4 text-[11px] font-mono text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>AES-256 JWT ENCRYPTED RECRUITMENT SUITE</span>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background p-4 cyber-grid">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
