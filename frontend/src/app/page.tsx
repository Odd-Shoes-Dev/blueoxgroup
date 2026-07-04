import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <span className="text-lg font-semibold tracking-tight">Blue Ox Group</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" render={<Link href="/sign-in" />}>
              Sign in
            </Button>
            <Button render={<Link href="/sign-up" />}>
              Join network
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Blue Ox Group
        </p>
        <h1 className="mb-6 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          A network of software sales professionals
        </h1>
        <p className="mb-10 max-w-xl text-lg text-muted-foreground">
          Blue Ox Group connects software companies with active sales and marketing
          representatives across regions. Join the network or sign in to manage your profile.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/sign-up" />}>
            Join the network
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/sign-in" />}>
            Sign in
          </Button>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Blue Ox Group. All rights reserved.
      </footer>
    </div>
  )
}
