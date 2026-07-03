import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/40 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-lg font-semibold tracking-tight"
        >
          Blue Ox Group
        </Link>
        <div className="rounded-xl border bg-card p-8 shadow-sm">{children}</div>
      </div>
    </div>
  )
}
