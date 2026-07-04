import Link from "next/link"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About — Blue Ox Group",
  description: "Learn about Blue Ox Group and our software companies.",
}

const COMPANIES = [
  {
    name: "Blue Ox Software",
    focus: "Enterprise resource planning",
    description:
      "Custom ERP solutions designed for fast-growing businesses in emerging markets. From inventory to payroll, built to scale.",
  },
  {
    name: "Ox Digital",
    focus: "Digital marketing tools",
    description:
      "Marketing automation and analytics platforms that help businesses understand and grow their customer base.",
  },
  {
    name: "FieldForce",
    focus: "Field sales management",
    description:
      "Mobile-first tools for managing distributed sales teams — route planning, reporting, and real-time tracking.",
  },
]

const VALUES = [
  {
    title: "Proximity",
    description:
      "We believe the best sales happen when the rep knows the district, speaks the language, and understands the customer's world.",
  },
  {
    title: "Clarity",
    description:
      "No ambiguous targets. Reps know what they're selling, who the customer is, and how to reach us when a lead comes in.",
  },
  {
    title: "Trust",
    description:
      "We work with people, not anonymous leads. Every rep in our network is a real person with a real profile.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-16">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            About Blue Ox Group
          </p>
          <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Software companies,
            <br />
            <span className="text-muted-foreground">human distribution.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Blue Ox Group is a holding company building and growing software products for
            businesses across East Africa. We operate a network of active sales representatives
            who connect our products with the customers who need them.
          </p>
        </div>
      </section>

      <Separator />

      {/* Values */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-xl font-semibold tracking-tight">How we work</h2>
        <dl className="grid gap-8 sm:grid-cols-3">
          {VALUES.map(({ title, description }) => (
            <div key={title}>
              <dt className="mb-2 font-medium">{title}</dt>
              <dd className="text-sm text-muted-foreground">{description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Separator />

      {/* Companies */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-xl font-semibold tracking-tight">Our companies</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {COMPANIES.map(({ name, focus, description }) => (
            <div
              key={name}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-sm"
            >
              <p className="mb-1 font-medium">{name}</p>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {focus}
              </p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Join CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Represent Blue Ox Group products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Based in a region we operate in? Join our network as a sales representative.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/sign-up" />} className="shrink-0">
            Join the network
          </Button>
        </div>
      </section>
    </>
  )
}
