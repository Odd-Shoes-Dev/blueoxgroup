import { Badge } from "@/components/ui/badge"
import { RepActions } from "./rep-actions"
import type { RepRow } from "../queries"

interface RepsTableProps {
  reps: RepRow[]
}

export function RepsTable({ reps }: RepsTableProps) {
  if (reps.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No representatives match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Languages</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reps.map((rep) => (
            <tr key={rep.profileId} className="bg-background hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium">{rep.fullName}</td>
              <td className="px-4 py-3 text-muted-foreground">{rep.location}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {rep.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground">{rep.phoneNumber}</span>
                  <span className="text-xs text-muted-foreground">{rep.email}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={rep.isActive ? "default" : "secondary"}>
                  {rep.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <RepActions
                  profileId={rep.profileId}
                  isActive={rep.isActive}
                  fullName={rep.fullName}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
