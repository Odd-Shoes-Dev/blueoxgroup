import { signIn } from "@/lib/providers/auth"
import { Button } from "@/components/ui/button"

export function GoogleSignInButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/auth-redirect" })
      }}
    >
      <Button type="submit" variant="outline" className="w-full">
        Continue with Google
      </Button>
    </form>
  )
}
