import { z } from "zod"

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().trim().min(7, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Enter your location or district"),
  educationLevel: z.string().optional(),
  languages: z.array(z.string().trim().min(1)).min(1, "Add at least one language"),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
