import type { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/providers/auth"

export const metadata: Metadata = {
  title: "Account suspended — Blue Ox Group",
}

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Image src="/logo.png" alt="Blue Ox Group" width={56} height={56} className="mb-6" />

      <h1
        className="font-display text-4xl uppercase tracking-[0.08em]"
        style={{ color: "var(--brand-blue)" }}
      >
        Account suspended
      </h1>

      <p className="mt-4 max-w-sm text-muted-foreground">
        Your account has been suspended by a Blue Ox Group administrator. If you believe this is a
        mistake, please reach out directly to the admin team.
      </p>

      <form
        className="mt-8"
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  )
}
