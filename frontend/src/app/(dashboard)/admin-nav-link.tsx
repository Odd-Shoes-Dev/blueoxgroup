"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AdminNavLink() {
  const pathname = usePathname()
  const onProfile = pathname === "/dashboard"

  return (
    <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={onProfile ? "/admin" : "/dashboard"} />}>
      {onProfile ? "Admin dashboard" : "My profile"}
    </Button>
  )
}
