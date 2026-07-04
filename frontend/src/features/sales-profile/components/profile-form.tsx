"use client"

import { useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { XIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { updateProfileSchema, type UpdateProfileInput } from "../schemas"
import { updateProfileAction } from "../actions"
import type { SalesProfile } from "../queries"
import { AvatarUpload } from "./avatar-upload"

const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Other",
]

interface ProfileFormProps {
  profile: SalesProfile
  onSaved?: (values: UpdateProfileInput & { avatarUrl: string | null }) => void
}

export function ProfileForm({ profile, onSaved }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [languageInput, setLanguageInput] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl)

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      location: profile.location,
      educationLevel: profile.educationLevel ?? "",
      languages: profile.languages,
    },
  })

  const languages = useWatch({ control: form.control, name: "languages" })

  function addLanguage() {
    const value = languageInput.trim()
    if (!value) return
    const current = form.getValues("languages")
    if (!current.includes(value)) {
      form.setValue("languages", [...current, value], { shouldValidate: true })
    }
    setLanguageInput("")
  }

  function removeLanguage(language: string) {
    form.setValue(
      "languages",
      form.getValues("languages").filter((l) => l !== language),
      { shouldValidate: true }
    )
  }

  function onSubmit(values: UpdateProfileInput) {
    startTransition(async () => {
      const result = await updateProfileAction(values)
      if (!result.ok) {
        toast.error(result.message)
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof UpdateProfileInput, { message: messages[0] })
          }
        }
        return
      }
      toast.success("Profile updated.")
      onSaved?.({ ...values, avatarUrl })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <div className="flex justify-center pb-2">
          <AvatarUpload
            name={profile.fullName}
            currentUrl={profile.avatarUrl}
            onUploadSuccess={(url) => setAvatarUrl(url)}
          />
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location / district</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Kampala, Central Region" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="educationLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education level</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languages"
          render={() => (
            <FormItem>
              <FormLabel>Languages spoken</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addLanguage()
                    }
                  }}
                  placeholder="e.g. English"
                />
                <Button type="button" variant="outline" onClick={addLanguage}>
                  Add
                </Button>
              </div>
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((language) => (
                    <Badge key={language} variant="secondary" className="gap-1">
                      {language}
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        aria-label={`Remove ${language}`}
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  )
}
