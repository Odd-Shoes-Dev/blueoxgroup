import Link from "next/link"
import { Suspense } from "react"
import type { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { SignInForm, GoogleSignInButton } from "@/features/auth"

export const metadata: Metadata = {
  title: "Sign in — Blue Ox Group",
}

export default function SignInPage() {
  return (
    <div className="grid gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your representative profile.</p>
      </div>

      <GoogleSignInButton />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <Suspense>
        <SignInForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-foreground underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  )
}
