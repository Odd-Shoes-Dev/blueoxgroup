import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Blue Ox Group
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Button size="sm" nativeButton={false} render={<Link href="/sign-in" />}>
              Sign in
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
            <div className="max-w-xs">
              <p className="font-semibold tracking-tight">Blue Ox Group</p>
              <p className="mt-2 text-sm text-muted-foreground">
                A holding group connecting software companies with active sales professionals
                across regions.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="flex flex-col gap-2">
                <p className="font-medium">Network</p>
                <Link href="/sign-up" className="text-muted-foreground hover:text-foreground">
                  Join as a rep
                </Link>
                <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
                  Sign in
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-medium">Company</p>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-12 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Blue Ox Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
