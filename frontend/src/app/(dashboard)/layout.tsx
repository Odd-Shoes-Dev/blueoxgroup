import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getCurrentUser, signOut } from "@/lib/providers/auth"
import { AdminNavLink } from "./admin-nav-link"

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
            className="flex items-center gap-2.5"
          >
            <Image src="/logo.png" alt="Blue Ox Group" width={40} height={40} className="shrink-0" />
            <span className="font-display text-base uppercase tracking-[0.08em]">
              <span style={{ color: "var(--brand-blue)" }}>Blue Ox</span>{" "}
              <span style={{ color: "var(--brand-orange)" }}>Group</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {isAdmin && <AdminNavLink />}
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
