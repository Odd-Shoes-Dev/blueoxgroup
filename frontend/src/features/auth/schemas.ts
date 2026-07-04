import { z } from "zod"

const MIN_AGE_YEARS = 18

function isAtLeastAge(dob: Date, minAge: number): boolean {
  const today = new Date()
  const age = today.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
  return (hasHadBirthdayThisYear ? age : age - 1) >= minAge
}

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().trim().min(6, "Enter a valid phone number"),
  dateOfBirth: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date")
    .refine((val) => isAtLeastAge(new Date(val), MIN_AGE_YEARS), {
      message: "You must be at least 18 years old to sign up",
    }),
  location: z.string().trim().min(2, "Location is required"),
  educationLevel: z.string().trim().min(1, "Education level is required"),
  languages: z.array(z.string().trim().min(1)).min(1, "Add at least one language"),
})

export type SignUpInput = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type SignInInput = z.infer<typeof signInSchema>

export const completeProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  phoneNumber: z.string().trim().min(6, "Enter a valid phone number"),
  dateOfBirth: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date")
    .refine((val) => isAtLeastAge(new Date(val), MIN_AGE_YEARS), {
      message: "You must be at least 18 years old to sign up",
    }),
  location: z.string().trim().min(2, "Location is required"),
  educationLevel: z.string().trim().optional(),
  languages: z.array(z.string().trim().min(1)).min(1, "Add at least one language"),
})

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>
