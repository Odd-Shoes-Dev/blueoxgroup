import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getCurrentUser, signOut } from "@/lib/providers/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const isAdmin = user.role === "admin"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href={isAdmin ? "/admin" : "/dashboard"}
            className="text-sm font-semibold tracking-tight"
          >
            Blue Ox Group
          </Link>

          <nav className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/dashboard" />}>
                My profile
              </Button>
            )}
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </div>
  )
}
