import Link from "next/link"
import type { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { SignUpForm, GoogleSignInButton } from "@/features/auth"

export const metadata: Metadata = {
  title: "Sign up — Blue Ox Group",
}

export default function SignUpPage() {
  return (
    <div className="grid gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Join the Blue Ox Group network</h1>
        <p className="text-sm text-muted-foreground">
          Create your representative profile.
        </p>
      </div>

      <GoogleSignInButton />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <SignUpForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
