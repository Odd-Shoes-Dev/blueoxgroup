import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RepActions } from "./rep-actions"
import type { RepRow } from "../queries"

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?"
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase()
}

interface RepCardProps {
  rep: RepRow
  isSelf?: boolean
}

export function RepCard({ rep, isSelf = false }: RepCardProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-card p-5 gap-4 hover:shadow-sm transition-shadow">
      {/* Header: avatar + name + status */}
      <div className="flex items-start gap-3">
        <Avatar size="lg" className="size-12 shrink-0">
          {rep.avatarUrl && <AvatarImage src={rep.avatarUrl} alt={rep.fullName} />}
          <AvatarFallback>{getInitials(rep.fullName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-tight truncate">{rep.fullName}</p>
          <p className="text-sm text-muted-foreground truncate">{rep.location}</p>
          <div className="mt-1.5">
            {rep.isActive ? (
              <Badge className="text-xs bg-brand-orange-light text-brand-orange-dark border-brand-orange/20">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Languages */}
      {rep.languages.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {rep.languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>
      )}

      {/* Contact */}
      <div className="flex flex-col gap-0.5 text-sm">
        <span className="text-foreground">{rep.phoneNumber}</span>
        <span className="text-muted-foreground text-xs truncate">{rep.email}</span>
      </div>

      {/* Actions */}
      {!isSelf && (
        <div className="pt-1 border-t">
          <RepActions
            profileId={rep.profileId}
            isActive={rep.isActive}
            fullName={rep.fullName}
          />
        </div>
      )}
    </div>
  )
}
